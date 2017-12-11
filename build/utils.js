var path = require('path')
var fs = require('fs')
var glob = require('glob')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

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
    // include: path.resolve(__dirname, '../src/'),
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
      // include: [path.resolve(__dirname, '../src/')],
      options: Object.assign({}, loaderOptions, {})
    })
    return loaders;
  }
  //rules: [{
  //     test: /<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/
  //   },
  //   {
  //     test: /{\(([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*\)}/
  //   }
  // ]
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
  var pagesDir = path.resolve(__dirname, '../src/entries/');
  const pages = glob.sync(`${pagesDir}/**/*.art`);
  return pages.map(p => {
    var dirarr = path.relative(pagesDir, p).split(path.sep);
    var dir = dirarr.join('/');
    var filenamestring = dir.substring(0, dir.lastIndexOf('.'));
    var filearr = [];
    var pagesarr = [];
    if (filenamestring.indexOf('/') !== -1) {
      filearr = filenamestring.split('/')
    } else {
      filearr = [filenamestring];
    }

    if (filearr.indexOf('index') == -1) {
      pagesarr = [filearr.join('/'), p]
    } else {
      pagesarr = [filearr.slice(0, -1).join('/'), p];
    }
    console.log('pagesarr', pagesarr)
    return pagesarr;
  });
}

exports.getEntries = function () {
  let jsDir = path.resolve(__dirname, '../src/entries/');
  let entryFiles = glob.sync(jsDir + '/**/*.js');
  let map = {};
  entryFiles.forEach(function (filePath) {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    map[filename] = filePath;
  });
  return map;
}

exports.getHtmlPlugins = function () {
  var isProd = process.env.NODE_ENV === 'production'
  return exports.getPages().map(p => {
    var chunks = ['manifest', 'vendor', p[0]];
    var filename = isProd ? path.resolve(__dirname, `../dist/${p[0]}/index.html`) : `${p[0]}.html`;
    console.log('filename', filename)
    return new HtmlWebpackPlugin({
      template: p[1],
      filename: filename,
      inject: true,
      chunks: chunks,
      chunksSortMode: 'manual',
      minify: {
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
      },
      favicon: path.resolve(__dirname, '../src/img/shenjuzijia.ico')
    })
  })
}
