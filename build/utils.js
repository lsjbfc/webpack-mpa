var path = require('path')
var fs = require('fs')
var glob = require('glob')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')


exports.getAssetsPublicPath = function () {
  if (!process.env.NODE_ENV === 'production') {
    return config.dev.assetsPublicPath
  }
  if (!!process.argv.find(a => a.indexOf('dxybuild') > -1)) {
    const projectName = process.cwd().split(path.sep).pop()
    return config.build.assetsDxyPath
  } else {
    return config.build.assetsPublicPath
  }
}

/**
 * @param { string } _path - filename and path of assets
 * @param { boolean } innerHtml - is the asset required in html file, for checking assetsVersionMode
 */
exports.assetsPath = function (_path, innerHtml) {
  var envConfig = process.env.NODE_ENV === 'production' ? config.build : config.dev
  var assetsSubDirectory = envConfig.assetsSubDirectory
  if (innerHtml && envConfig.assetsVersionMode !== 'hash') {
    _path = _path.split('.').filter(p => p.indexOf('[hash') === -1 && p.indexOf('hash]') === -1).join('.')
    _path += `?v=${envConfig.assetsVersionMode}`
  }
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      if (loader !== 'postcss') {
        loaders.push({
          loader: 'postcss-loader',
          options: Object.assign({}, loaderOptions, {
            sourceMap: options.sourceMap
          })
        })
      }
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }


    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader'
      })
    } else {
      return ['style-loader'].concat(loaders)
    }
  }

  
  function generateTemplate(loader,loaderOptions){
    var loaders=[];
    loaders.push({
      loader: loader + '-loader',
      options: Object.assign({}, loaderOptions, {
        
      })
    })
    return loaders;
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders('postcss'),
    less: generateLoaders('less'),
    scss:generateLoaders('sass'),
    art:generateTemplate('art-template')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// exports.getPages  = function () {
//   var pagesDir = path.resolve(__dirname, '../src/entries')
//   const pages = glob.sync(`${pagesDir}/**/index.html`)
//   return pages.map(p => [path.relative(pagesDir, p).split(path.sep).slice(0, -1).join('/'), p])
// }

// exports.getEntries = function () {
//   var entries = {}
//   exports.getPages().forEach(p => {
//     entries[p[0]] = p[1].replace('.html', '.js')
//   })
//   if (config.layout.entry) {
//     entries.layout = config.layout.entry
//   }
//   return entries
// }

// exports.getHtmlPlugins = function () {
//   var isProd = process.env.NODE_ENV === 'production'
//   return exports.getPages().map(p => {
//     const chunks = isProd ? ['manifest', 'vendor', p[0]] : [p[0]]
//     if (config.layout.entry) {
//       chunks.splice(chunks.length - 1, 0, 'layout')
//     }
//     return new HtmlWebpackPlugin({
//       template: p[1],
//       filename: isProd ? path.resolve(__dirname, `../dist/pages/${p[0]}.html`) : `${p[0]}.html`,
//       inject: true,
//       chunks: chunks,
//       chunksSortMode: 'manual'
//     })
//   })
// }

exports.getPages=function () {
  var pageDir = path.resolve(__dirname, '../src/pages');
  var pageFiles = glob.sync(pageDir + '/*.art');
  return pageFiles.map(p => [path.relative(pageDir, p).split(path.sep).slice(0, -1).join('/'), p])
}

exports.getEntries=function(){

    let jsDir = path.resolve(__dirname, '../src/js/');
    let entryFiles = glob.sync(jsDir + '/*.js');
    let map = {};
    
    entryFiles.forEach(function (filePath) {
      let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
      map[filename] = filePath;
    });
    return map;
}

exports.getHtmlPlugins = function () {
  var pageDir = path.resolve(__dirname, '../src/pages');
  var pageFiles = glob.sync(pageDir + '/*.art');
  var array = [];
  pageFiles.forEach(function (filePath) {
      var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
      // var chunks = ['vendor', 'template'].concat(utilname.name).concat(['main']).concat([filename])
      array.push(new HtmlWebpackPlugin({
          template: filePath, 
          filename: filename + '.html',
          inject: "body",
          chunks: ['manifest','vendor', filename], 
          chunksSortMode: function (chunk1, chunk2) {
              var order = ['manifest','vendor', filename]
              var order1 = order.indexOf(chunk1.names[0]);
              var order2 = order.indexOf(chunk2.names[0]);
              return order1 - order2;
          },
          minify: {
              removeComments: false,
              collapseWhitespace: false
          }
      }));
  });
  return array;
}
