const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const MD5 = require('md5.js')
const _ = require('lodash')
const Workbox = require('workbox-webpack-plugin')

const { getManifestJSON } = require('./manifest/manifest_lite')


const devMode = process.env.CLUB_ENV !== 'prod'
// 给common提供release变量===
const gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim();
process.env.RELEASE_VERSION = gitSha
console.log(`devMode:${devMode}---env:${process.env.CLUB_ENV}---> RELEASE_VERSION:${gitSha}`);

function resolve (...dirs) {
  return path.join(__dirname, ...dirs)
}

const baseWebpackConfig = require('./webpack.common')

const chunkOptions = {
  chunks: 'all',
  minSize: 0,
  minChunks: 1,
  reuseExistingChunk: true,
  enforce: true,
}

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',

  performance: {
    hints: false,
  },

  optimization: {
    splitChunks: {
      chunks: 'async',
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        // react
        'react-vendor': {
          name: 'chunk-1',
          test: (module, chunks) => /[\\/]react/.test(module.context),
          priority: 10,
          ...chunkOptions,
        },

        // utils
        'utils-vendor': {
          name: 'chunk-2',
          test: (module, chunks) => {
            return _.some(
              [ 'numeral',
                'mobx',
                'mobx-react',
                'axios',
                'axios-retry',
                '@sentry/(?!webpack-plugin)',
              ].map(p => new RegExp(p).test(module.context))
            )
          },
          priority: 5,
          ...chunkOptions,
        },

        // other modules in node_modules other than lodash
        'vendor': {
          name: 'chunk-3',
          test: (module, chunks) => {
            return _.every([
              // lodash按函数引入，不宜放入chunk，哪里用到了单独引入
              !/lodash/.test(module.context),
              // cf-ui-mobile
              !/cf-ui-mobile/.test(module.context),
              !/front-components/.test(module.context),
              // aws-s3 按需加载
              !/aws-sdk/.test(module.context),
              !_.some([
                'aws-sdk',
                /* 以及依赖 */
                'buffer', 'events', 'ieee754', 'jmespath', 'querystring', 'sax', 'url', 'uuid', 'xml2js',
              ].map(aws => new RegExp(aws).test(module.context))),
              // lottie-web 处理[svg].json文件 按需加载
              !/lottie-web/.test(module.context),
              // webpack-plugin 会引入release到chunk使hash失效
              !/@sentry[\\/]webpack-plugin/.test(module.context),
              // 这些内容应该被引入此chunk
              _.some([
                /[\\/]node_modules[\\/]/.test(module.context),
                /[\\/]source[\\/]styles[\\/]/.test(module.context),
              ]),
            ])
          },
          priority: 3,
          ...chunkOptions,
        },
        // @pages/components 公共组件
        'components-vendor': {
          name: 'chunk-4',
          test: (module, chunks) => /[\\/]pages\/components/.test(module.context),
          priority: 2,
          ...chunkOptions,
        },
      },
    },

    moduleIds: 'hashed',

    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          compress: {
            drop_console: true,
          },
        },
      }),
      new OptimizeCSSPlugin({}),
    ],
  },
  devtool: 'source-map',

  output: {
    path: resolve('dist'),
    filename: 'js/[name]-[contenthash].js',
  },

  // _.compact,过滤数组里 false 元素
  plugins: _.compact([
    new webpack.HashedModuleIdsPlugin({
      hashDigest: 'hex',
    }),
    new webpack.NamedChunksPlugin(
      chunk => {
        return chunk.name || Array.from(chunk.modulesIterable, m => m.id)[0] || 'load'
      }
    ),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash].css',
      chunkFileName: 'css/[id].css',
    }),
    new Workbox.InjectManifest({
      swDest: 'service-worker.js',
      swSrc: path.resolve(__dirname, 'source', 'sw-prod.js'),
      include: [/chunk-/, /msite-/],
    }),
    new WebpackAssetsManifest({
      output: 'webpack-manifest.json',
      customize (entry, original, manifest, asset) {
        // 写入缓存文件到manifest.json
        const p = path.resolve(__dirname, 'dist', 'manifest.json')

        const helper = ent => _.flow([
          _.partial(fs.readFileSync),
          _.partial(JSON.parse),
          _.partial(_.get, _, ent),
        ])(p)

        let cdn, version, name, assets

        if (fs.existsSync(p)) {
          cdn = helper('cdn')
          version = helper('version')
          name = helper('name')
          assets = helper('assets')
        } else {
          cdn = 'https://a.cfcdn.club'
          name = 'app_manifest'
          assets = []
          version = '' // TODO: md5
        }

        // FIX: linux filesystem
        if (!fs.existsSync(path.resolve(__dirname, 'dist'))) {
          fs.mkdirSync(path.resolve(__dirname, 'dist'))
        }

        if (/(js|css)$/.test(entry.value)) {
          const entryValue = `/nsr/static/dist/${entry.value}`
          if (assets && !assets.includes(entryValue)) {
            fs.writeFileSync(p, JSON.stringify(
              { cdn, version, name, assets: [entryValue, ...assets] }
            ))
          }
        }

        return {
          key: `${entry.key}`,
          value: `/nsr/static/dist/${entry.value}`,
        }
      },
      done () {
        const p = path.resolve(__dirname, 'dist', 'manifest.json')
        const md5stream = new MD5();
        const content = fs.readFileSync(p)

        const helper = ent => _.flow([
          _.partial(fs.readFileSync),
          _.partial(JSON.parse),
          _.partial(_.get, _, ent),
        ])(p)

        md5stream.end(content)
        const version = md5stream.read().toString('hex')
        const cdn = helper('cdn')
        const name = helper('name')
        const assets = helper('assets')

        if (process.env.CLUB_ENV) {
          const manifest_from_indexer = path.resolve(__dirname, `manifest-${process.env.CLUB_ENV}.json`)
          if (fs.existsSync(manifest_from_indexer)) {
            const manifest_from_indexer_content = fs.readFileSync(manifest_from_indexer)
            const c = JSON.parse(manifest_from_indexer_content)
            fs.writeFileSync(p, JSON.stringify(
              { cdn,
                version,
                name,
                assets: [..._.sortBy(assets, function (asset) {
                  // 优先排chunk和product_list内容，即首页
                  return !(asset.includes('chunk') || asset.includes('product_list'))
                }), ..._.filter(c.assets, function (uri) {
                  // 过滤indexer的manifest
                  return uri.includes('common') || uri.includes('payment') || uri.includes('cart')
                })],
              }
            ))
          } else {
            fs.writeFileSync(p, JSON.stringify(
              { cdn,
                version,
                name,
                assets: _.sortBy(assets, function (asset) {
                  // 优先排chunk和product_list内容，即首页
                  return !(asset.includes('chunk') || asset.includes('product_list'))
                }),
              }
            ))
          }
        } else {
          fs.writeFileSync(p, JSON.stringify(
            { cdn,
              version,
              name,
              assets: _.sortBy(assets, function (asset) {
                // 优先排chunk和product_list内容，即首页
                return !(asset.includes('chunk') || asset.includes('product_list'))
              }),
            }
          ))
        }

        // 写入manifest lite for pwa
        const lite_p = path.resolve(__dirname, 'dist', 'manifest-lite.json')
        const { output } = baseWebpackConfig
        fs.writeFileSync(lite_p, JSON.stringify(getManifestJSON(output.publicPath)))
        fsExtra.copySync(path.resolve(__dirname, 'manifest'), path.resolve(__dirname, 'dist', 'manifest'))
        console.log('manifest md5: ', version)
      },
    }),


    // !process.env.ANALYSIS && !devMode && new SentryCliPlugin({
    //   release: process.env.RELEASE_VERSION,
    //   include: [path.resolve(__dirname, 'dist/js')],
    //   ignoreFile: '.sentrycliignore',
    //   urlPrefix: 'https://a.cfcdn.club/nsr/static/dist/js',
    //   ignore: ['node_modules', 'webpack.config.js', 'img', 'fonts'],
    //   configFile: 'sentry.properties',
    // }),
  ]),
})

module.exports = webpackConfig
