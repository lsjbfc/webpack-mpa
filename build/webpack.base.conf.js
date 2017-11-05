var path = require('path')
var utils = require('./utils')
var config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: utils.getEntries(),
  output: {
    path: config.build.assetsRoot, //process.env.NODE_ENV === 'production' ? config.build.assetsRoot : config.dev.assetsRoot,
    filename:'[name].js',
    publicPath: utils.getAssetsPublicPath()
    // publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.html'],
    alias: {

      '@': resolve('src'),
    }
  },
  // devServer: {
  //   contentBase: resolve('./'),
  //   overlay: {
  //     errors: true,
  //     warnings: true
  //   }
  // },
  module: {
    rules: [
      // {
      //   test: /\.(html|htm)$/,
      //   exclude: /(node_modules|bower_components)/,
      //   use: [
      //     {
      //       loader: 'html-loader',
      //       options: {
      //         attrs: [':src'],
      //         minimize: true,
      //         removeComments: false,
      //         collapseWhitespace: false
      //       }
      //     }

      //   ]
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        options: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [{
          loader: "url-loader",
          options: {
            limit: 200,
            name: utils.assetsPath("images/[name]-[hash:5].[ext]")
          }
        }, 'image-webpack-loader'],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:5].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:5].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      JQuery: "jquery",
      "window.jQuery": "jquery"
    }),
  ]

}
