let path = require('path');
let webpack = require('webpack');
let glob = require('glob');
let htmlWebpackPlugin=require("html-webpack-plugin");
let CleanPlugin = require('clean-webpack-plugin'); // 文件夹清除工具
let ExtractTextPlugin = require('extract-text-webpack-plugin');//将你的行内样式提取到单独的css文件里
let extractCSS = new ExtractTextPlugin('css/[name].[hash:6].css');
let extractLESS = new ExtractTextPlugin('css/[name].[hash:6].css');
let providePlugin = new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.$': 'jquery',
});


// let fs = require("fs")  
// let root = path.join(__dirname,'./src/page')
  
// readDirSync(root)  
// function readDirSync(path){  
//     var pa = fs.readdirSync(path);  
//     pa.forEach(function(ele,index){  
//         var info = fs.statSync(path+"/"+ele)      
//         if(info.isDirectory()){  
//             console.log("dir: "+ele)  
//             readDirSync(path+"/"+ele);  
//         }else{  
//             console.log("file: "+ele)  
//         }     
//     })  
// }  

const config = {
  entry:{
      index:'./src/js/index.js',
      login:"./src/js/login.js"
  },
  output: {
    filename: 'js/[name].js', //-[chunkhash]
    path: path.resolve(__dirname, './dist'),  //path.resolve(__dirname, 'dist')
    // publicPath: "127.0.0.1:9527/"
  },
  // postcss: function() {
  //   return [autoprefixer, precss, cssnano, cssnext]
  // },
  plugins:[
      new htmlWebpackPlugin({
          template:"./src/page/index.html",
          filename:"index.html",
          publicPath:"xxx",
          inject:"body",
          title:"首页",
          data:new Date(),
          minify:{
            // collapseWhitespace:true,
            // removeComments:true
          },
          chunks:["index"]  //   excludeChunks:["login"]
          //<!-- <script src=" <%compilation.assets[htmlWebpackPlugin.files.chunks.main.entry.substr(htmlWebpackPlugin.files.publicPath.length)].source() %>"></script> -->
      }),
      new htmlWebpackPlugin({
        template:"./src/page/login.html",
        filename:"login.html",
        publicPath:"xxx",
        inject:"body",
        title:"登录",
        data:new Date(),
        chunks:["login"]
      }),
      new CleanPlugin(['dist']),
     // new ExtractTextPlugin('css/[name].css'),
      extractLESS,
      extractCSS,
      new webpack.LoaderOptionsPlugin({ //浏览器加前缀
        options: {
            postcss: [require('autoprefixer')({browsers:['last 5 versions']})]
        }
      }),
  ],
  devtool: 'source-map',
  performance: {
    hints: false
  },
  module:{
    rules:[
          { test: /\.css$/,
            exclude: /(node_modules|bower_components)/,
            use: extractCSS.extract({
              fallback: 'style-loader',
              use: [
                { loader: 'css-loader', options: { importLoaders: 1 } },
                'postcss-loader'
              ]
             
            })
          },
          { test: /\.less$/,
            exclude: /(node_modules|bower_components)/,
            use: extractLESS.extract({
              fallback: 'style-loader',
              use: [
                { loader: 'css-loader', options: { importLoaders: 1 } },
                'postcss-loader',
                {loader:"less-loader"}
              ]
            })
          },
          {
            test:/\.(png|jpg|gif|svg)$/i,
            use:[
                { loader:"url-loader",
                  options:{
                    limit:200,
                    name:"images/[name]-[hash:5].[ext]"
                  }
                }
                // ,
                // 'image-webpack-loader'
            ],
          },
          {
            test:/\.js$/,
            exclude:/(node_modules|bower_components)/,
            use:[
                  {  
                    loader: 'babel-loader',
                    options: {
                      presets: ['env']
                    }
                  }
            ],
          },
          {
            test: require.resolve('jquery'),  // 此loader配置项的目标是NPM中的jquery
            use: 'expose?$!expose?jQuery', // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
          },
          // {
          //   test: /\.html$/,
          //   use: [{
          //     loader: 'html-loader',
          //     options: {
          //       attrs: [':data-src'],
          //       removeComments: false,
          //       collapseWhitespace: false
          //     }          
          //   }]
          // },
          {
            test: /\.ejs$/,
            use: {
              loader: 'ejs-loader'
            }
          }
      ]
  }
};





module.exports = config;
