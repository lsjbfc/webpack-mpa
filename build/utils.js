var path = require('path')
var fs = require('fs')
var glob = require('glob')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var fnv = require('fnv-plus');
const hash16 = (astring) => {
  return fnv.hash(astring).hex();
}

exports.getAssetsPublicPath = function () {
  if (process.env.NODE_ENV === 'development') {
    return config.dev.assetsPublicPath
  }
  if (!!process.argv.find(a => a.indexOf('dxybuild') > -1)) {
    const projectName = process.cwd().split(path.sep).pop()
    return config.build.assetsDxyPath
  } else if (!!process.argv.find(a => a.indexOf('server') > -1)) {
    return config.build.serverassetsPublicPath
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
  function generateLoaders(loader, loaderOptions) {
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
          sourceMap: options.sourceMap,

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

  function template(loader, loaderOptions) {
    var loaders = [];
    loaders.push({
      loader: loader + '-loader',
      options: Object.assign({}, loaderOptions, {})
    })
    return loaders;
  }
  return {
    css: generateLoaders(),
    postcss: generateLoaders('postcss'),
    less: generateLoaders('less'),
    scss: generateLoaders('sass'),
    art: template('art-template')
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
      include: [path.resolve(__dirname, '../src/')],
      exclude: /node_modules/,
      use: loader
    });
  }
  return output;
}
exports.getPages = function () {
  var pageDir = path.resolve(__dirname, '../src/pages/');
  var pageFiles = glob.sync(pageDir + '/*.html');
  return pageFiles.map(p => [path.relative(pageDir, p).split(path.sep).slice(0, -1).join('/'), p])
}

exports.getEntries = function () {
  let jsDir = path.resolve(__dirname, '../test/pages/');
  let entryFiles = glob.sync(jsDir + '/**/*.js');
  let map = {};
  entryFiles.forEach(function (filePath) {
    var patharr = filePath.split("\/");
    var index = patharr.indexOf("pages");
    var cur = patharr.slice(index + 1);
    var cname = cur.join("");
    var name = cname.substring(0, cname.lastIndexOf('.'));
    let filename = filePath.substring(filePath.indexOf('\/test/') + 1, filePath.lastIndexOf('.'));
    map[name] = filePath;
  });
  return map;
}
exports.getHtmlPlugins = function () {
  var pageDir = path.resolve(__dirname, '../test/pages/');
  var pageFiles = glob.sync(pageDir + '/**/index.html');
  var array = [];
  pageFiles.forEach(function (filePath) {
    var patharr = filePath.split("\/");
    var index = patharr.indexOf("pages");
    var cur = patharr.slice(index + 1);
    if (cur[0] === "index") {
      cur = cur.slice(1);
    }
    var cname = cur.join("/");
    var aname = cur.join("/");
    var name = cname.substring(0, cname.lastIndexOf('.'));
    var aaname = aname.substring(0, aname.lastIndexOf("."));
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    array.push(new HtmlWebpackPlugin({
      template: filePath,
      filename: aaname + '.html',
      inject: "body",
      chunks: ['manifest', 'vendor', name],
      chunksSortMode: function (chunk1, chunk2) {
        var order = ['manifest', 'vendor', name]
        var order1 = order.indexOf(chunk1.names[0]);
        var order2 = order.indexOf(chunk2.names[0]);
        return order1 - order2;
      },
      minimize: 3,
      minify: {
        // removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      },
      // favicon: path.resolve(__dirname, '../src/img/shenjuzijia.ico')
    }));
  });
  return array;
}