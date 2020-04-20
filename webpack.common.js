const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProvidePlugin = require('webpack').ProvidePlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const _ = require('lodash')

function resolve (...dirs) {
  return path.join(__dirname, ...dirs)
}

var devMode = process.env.CLUB_ENV === 'dev'
var prodMode = process.env.CLUB_ENV === 'prod'
var preTestMode = process.env.CLUB_ENV === 'test' || process.env.CLUB_ENV === 'pre'

// polyfill提高兼容性
// core-js > 3 & preset-env(useBuiltins: 'usage'), babel/polyfill 不建议使用了
// NB: https://babeljs.io/docs/en/babel-polyfill
const polyfills = [
  'core-js/stable',
  'regenerator-runtime/runtime',
  '@/styles/common/index.less',
]
const EntryPages = {
  pcsite: {
    path: [...polyfills, '@/pages/pcsite/index.js'],
  },
  resume: {
    path: [...polyfills, '@/pages/resume/index.js'],
  },
}

const entry = {}
const PageEventIdMap = {}
Object.keys(EntryPages).forEach(key => {
  const item = EntryPages[key]
  if (!process.env.PAGE || (process.env.PAGE && process.env.PAGE === key)) {
    entry[key] = item.path
    PageEventIdMap[key] = item.eventId || 1
  }
})

let publicPath = '/'

if (prodMode) {
  publicPath = '//a.cfcdn.club/nsr/static/dist/'
}

if (preTestMode) {
  publicPath = '/nsr/static/dist/'
}

module.exports = {
  entry,

  output: {
    publicPath,
  },

  context: __dirname,

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': resolve('source'), // new
      'img': resolve('img'),
      'm': resolve('source/pages/msite'), // m站
      'pc': resolve('source/pages/pcsite'), // 新增pc站目录
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('source'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },

      { // NB: babel@7 直接支持ts
        test: /\.[t|j]sx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?cacheDirectory',
        include: [resolve('src'), resolve('source'), resolve('test')],
      },

      { // cf-ui-mobile, 不适用cssModules
        test: /\.(le|c)ss$/,
        use: getVwLoader(false),
        include: [
          resolve('node_modules/cf-ui-mobile'),
          resolve('../cf-ui-mobile'),
          resolve('node_modules/front-components'),
          resolve('../front-components'),
        ],
      },

      { // vw样式
        test: /\.vw\.(le|c)ss$/,
        use: getVwLoader(true),
        include: [resolve('source', 'pages')],
      },

      { // 局部样式
        test: /^((?!vw).)*\.(le|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: true,
              localIdentName: '[local]___[hash:base64:8]',
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
                require('postcss-momentum-scrolling')([
                  'scroll',
                  'auto',
                ]),
              ],
            },
          },
          'less-loader',
        ],
        include: [resolve('source', 'pages')],
      },

      { // 全局样式
        test: /\.(le|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: false,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
                require('postcss-momentum-scrolling')([
                  'scroll',
                  'auto',
                ]),
              ],
            },
          },
          'less-loader',
        ],
        include: [resolve('source', 'styles')],
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 2000,
          name: 'img/[path]/[name].[hash:7].[ext]',
        },
      },

      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 2000,
          name: 'media/[name].[hash:7].[ext]',
        },
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },

  plugins: _.compact([
    new ProvidePlugin({
      Cookies: 'imports-loader?define=>false!js-cookie',
      _: 'lodash',
      n: 'numeral',
      m: 'moment',
    }),

    ..._.keys(entry).map((page) => {
      return genHtml(page)
    }),

    process.env.ANALYSIS && new BundleAnalyzerPlugin(),
  ]),
}

function genHtml (page) {
  return new HtmlWebpackPlugin({
    filename: `${page}/index.html`,
    template: `source/pages/${page}/index.html`,
    templateParameters: {
      public_path: publicPath,
      disable_webpack_devtool_in_production: process.env.CLUB_ENV === '' // 'production'
        ? '<script>window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject=function(){}</script>' : '',
      dns_enable_prefetch: ['<meta name="format-detection" content="telephone=no,email=no,date=no,address=no" />', process.env.CLUB_ENV === 'prod'
        ? '<link rel="dns-prefetch" href="//img1.cfcdn.club"/><link rel="dns-prefetch" href="//m.cfcdn.club"/>' : ''].join(''),
      // 在html注入release，给 @setup/sentry 初始化init
      sentry_release_by_commit_id: '<script>window.__SENTRY_RELEASE__ = "' + (process.env.RELEASE_VERSION || '') + '"</script>',
      // 注入eventId in ga.html===>
      page_event_id: PageEventIdMap[page] ? ('<script>window.eventId=' + PageEventIdMap[page] + '</script>') : '',
    },
    inject: true,

    meta: {
      'cache-control': { 'http-equiv': 'cache-control', 'content': 'max-age=0, no-cache' },
      'content-type': { 'http-equiv': 'content-type', 'content': 'text/html; charset=utf-8' },
      'expires': { 'http-equiv': 'expires', 'content': 'Tue, 01 Jan 1980 1:00:00 GMT' },
      'pragma': { 'http-equiv': 'pragma', 'content': 'no-cache' },
      'x-dns-prefetch-control': { 'http-equiv': 'x-dns-prefetch-control', 'content': 'on' },
    },

    chunks: ['chunk-1', 'chunk-2', 'chunk-3', 'chunk-4', page],

    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false,
    },

    chunksSortMode: 'dependency',
  })
}

function getVwLoader (isModules) {
  return [
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: false,
        modules: isModules,
        localIdentName: '[local]___[hash:base64:8]',
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          require('autoprefixer'),
          require('postcss-momentum-scrolling')([
            'scroll',
            'auto',
          ]),
          // 'postcss-write-svg': { utf8: false }, // 用来处理移动端1px的解决方案,使用的是border-image和background来做1px。
          require('postcss-px-to-viewport')({
            viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
            viewportHeight: 667, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
            unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除)
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
            selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            mediaQuery: false, // 允许在媒体查询中转换`px`
          }),
        ],
      },
    },
    {
      loader: 'less-loader',
      options: {
        javascriptEnabled: true,
      },
    },
  ]
}

