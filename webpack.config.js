const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const path = require('path')
const baseWebpackConfig = require('./webpack.common')
const ejs = require('ejs')
const _ = require('lodash')
const { SERVICES } = require('./source/constants/services')

// 监控编译内存使用情况===>
const memwatch = require('@airbnb/node-memwatch')
if (process.env.NODE_ENV === 'develop') {
  memwatch.on('stats', function (stats) {
    const used = stats.used_heap_size * 100 / stats.heap_size_limit
    let colorStr = '\x1b[42m'
    if (used > 70) {
      colorStr = '\x1b[45m'
    }
    if (used > 90) {
      colorStr = '\x1b[41m'
    }
    console.info('gc run.', colorStr, `mem used:${used.toFixed(2)}%`, '\x1b[0m')
  });
  memwatch.on('leak', function (info) {
    console.log('leak:', info)
  });
}


function resolve (...dirs) {
  return path.join(__dirname, ...dirs)
}

const entry = {};

for (let entity in baseWebpackConfig.entry) {
  entry[entity] = [
    'webpack-dev-server/client?http://127.0.0.1:8082',
    'webpack/hot/only-dev-server',
  ];
}

const _URL = process.env.URL || 'pc-test1.clubfactory.com'
const _PROJECTENV = process.env.PROJECTENV || ''

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {},
  devtool: 'eval',

  entry,

  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },

  devServer: {
    host: 'dev.clubfactory.com',
    disableHostCheck: true,
    port: 8082,
    hot: true,
    inline: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/pcsite/, to: '/pcsite/index.html' },
        { from: /^\/resume/, to: `/resume/index.html` },

        { from: /^\/$/, to: `/pcsite/index.html` },
        { from: /^\/home$/, to: `/pcsite/index.html` },
        // { from: /^\/product\//, to: `/pcsite/index.html` },
      ],
    },

    serverSideRender: true,

    before: (app, server) => {
      app.use((req, res, next) => {
        // const assets = server._stats.compilation.assets
        // const originalSend = res.send;
        // function send (body, options) {
        //   const body_parsed = body.toString('utf8')
        //   // 2. render html
        //   const body_injected = ejs.render(body_parsed, options)
        //   // 返回修改之后的内容（插入ssr内容）
        //   originalSend.call(res, body_injected)
        // }

        if (req.path === '/service-worker.js') {
          return res.sendFile(path.resolve(__dirname, 'service-worker.js'))
        }

        if (new RegExp('/product_list[/]$').test(req.path)) {
          // TODO: ssr
          // const { ssr } = require('./dist/ssr/product_list')
          // const content = ssr()
          // // 1. 获取ssr内容
          // const options = {
          //   ssr: !!content, // 内容后端渲染产出，React使用hydrate()
          //   content: content, // 模版内容
          // }
          // // 覆写原生的send函数
          // res.send = (body) => send(body, options)
        }
        return next()
      })
    },

    proxy: {
      '/mock': { // mock 数据 http://api-manage.yuceyi.com:3000
        target: `http://api-manage.yuceyi.com:3000`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/order': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/review/token': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/club-api': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/api': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/v1': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/v2': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/theme': {
        target: `http://${_URL}`,
        changeOrigin: true,
      },
      '/cf-search': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/cf-cart': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      '/gw/': {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
        // onProxyReq: function (proxy, req, res) {
        //   const cookie = req.headers.cookie
        //   proxy.setHeader('cookie', cookie + `; project-env=${_PROJECTENV}`)
        // },
      },
      [SERVICES.AuthLogin]: {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      [SERVICES.AuthLogin3]: {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
      [SERVICES.TenCroreCouponObtain]: {
        target: `http://${_URL}`,
        changeOrigin: true,
        headers: {
          'Accept': 'application/json',
        },
      },
    },
  },

  plugins: [
    new webpack.DefinePlugin({}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
  ],
})
