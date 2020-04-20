const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

process.env.SSR = true

function resolve (...dirs) {
  return path.join(__dirname, ...dirs)
}

const baseWebpackConfig = require('./webpack.common')

// use node specified module
delete baseWebpackConfig.module

// use ssr version
baseWebpackConfig.entry = {
  product_list: ['@/pages/product_list/server.js'],
}

const webpackConfig = merge(baseWebpackConfig, {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'node',

  performance: {
    hints: false,
  },

  output: {
    path: resolve('dist'),
    filename: 'ssr/[name].js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
        },
        include: [resolve('src'), resolve('source'), resolve('test')],
      },

      {
        test: /\.(le|c)ss$/,
        use: ['css-loader/locals', 'less-loader'],
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader?emitFile=false',
      },

      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader?emitFile=false',
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader?emitFile=false',
      },
    ],
  },

  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
})

module.exports = webpackConfig
