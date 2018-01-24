var path = require('path')
var utils = require('./utils')
var config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack')
let extractCSS = new ExtractTextPlugin('css/[name].[hash:6].css');
let extractLESS = new ExtractTextPlugin('css/[name].[hash:6].css');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  entry: utils.getEntries(),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: utils.getAssetsPublicPath()
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.html', "scss"],
    alias: {
      "jquery": 'jquery/dist/jquery.min.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(html|htm)$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'html-loader',
          options: {
            attrs: [':src'],
            minimize: true,
            removeComments: true,
            collapseWhitespace: true
          }
        }]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        options: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(png|jpg|gif|ico)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 512, //8192
            name: utils.assetsPath("images/[name]-[hash:5].[ext]")
          }
        }, 'image-webpack-loader']
      },
      {
        test: /\.(eot|woff|ttf|svg|woff2?|otf|tof)(\?.*)?$/i,
        loader: 'url-loader',
        include: [resolve('src')],
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:5].[ext]')
        }
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      JQuery: "jquery"
    }),
  ]

}
