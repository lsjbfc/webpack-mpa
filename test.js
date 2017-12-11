// const fs = require('fs');
const path = require('path');
let Client = require('ssh2-sftp-client');
var sftpconfit = {
  host: '116.62.224.22',
  port: '22',
  username: 'root',
  password: 'admin911!@#Ffsh9admin'
};

function de(time) {
  return new Promise((resolve, reject) => {
    if (time > 4000) {
      reject('aaa')
    }
    setTimeout(() => {
      resolve('time over')
    }, time);
  })
}
let con = 1;

// function upFile(curPath, cur) {
//   return new Promise((resolve, reject) => {
//     let uplode = new Client();
//     var remote = '/' + 'root/test' + '/' + cur;
//     uplode.connect(sftpconfit).then(files => {
//       return uplode.put(curPath, remote)
//     }).then(data => {
//       console.log('up ok');
//       resolve('upfile ok', curPath, 'to', remote)
//     }).catch(err => {
//       console.log('upfile err', curPath, 'to', remote)
//       reject(err)
//     });
//   })

// }

// function mkdir(params, cur) {
//   return new Promise((resolve, reject) => {
//     var remote = '/' + 'root/test';
//     let Mkdir = new Client();
//     Mkdir.connect(sftpconfit).then(dir => {
//       return Mkdir.mkdir(remote + '/' + cur);
//     }).then(data => {
//       console.log('mkdir ok')
//       resolve('mkdir ok', params)
//     }).catch(err => {
//       console.log('mkdir err', remote + '/' + params)
//       reject('mkdir err', params)
//     })
//   })
// }

// function dirlist(path) {
//   return new Promise((resolve, reject) => {
//     var files = [];
//     var lastpath;
//     if (fs.existsSync(path)) {
//       files = fs.readdirSync(path);
//       files.forEach(function (file, index) {
//         var curPath = path + "\\" + file;
//         var list = curPath.toString()
//         var lists = list.toString().split('\\');
//         var index = lists.indexOf('static');
//         var cur = lists.slice(index + 1).join('/');
//         if (fs.statSync(curPath).isDirectory()) {
//           if (Boolean(curPath)) {
//             console.log('current dir', cur)
//             if (cur) {
//               mkdir(cur).then(data => {
//                 console.log('data', data)
//               }).catch(err => {
//                 console.log(err)
//               })
//             }
//             dirlist(curPath);
//           }
//         } else {
//           if (cur) {
//             console.log('cur file', cur)
//             upFile(curPath, cur).then(data => {
//               console.log('current file', curPath)
//               dirlist(curPath);
//             }).catch(err => {
//               console.log('up file', err)
//             })
//           }
//         }
//       });
//     }
//     resolve("file list ok")
//     reject("file list err")
//   })

// };
// dirlist(path.resolve(__dirname, "dist"))
//   .then(data => {
//     console.log('data', data)
//   })
//   .catch(err => {
//     console.log('lists err', err)
//   })
// G:\shenjuzi-web\dist\static\images\banner1-c7ba9.jpg
// upFile('G:\\shenjuzi-web\\dist\\static\\images\\banner1-c7ba9.jpg', 'banner1-c7ba9.jpg')
//   .then(data => {
//     console.log('data', data)
//   })
//   .catch(err => {
//     console.log('error', err)
//   })
let gaze = require('gaze');
var dir = path.resolve(__dirname, "dist/**/*./*")

function put(localPath, romotePath) {
  let sftp = new Client();
  sftp.connect(sftpconfit).then(() => {
    console.log('runxxx')
    return sftp.put(localPath, romotePath);
  }).then(() => {
    console.log("上传完成");
  }).catch((err) => {
    console.log(err, 'catch error');
  });
}
console.log('dir',dir)
gaze([dir], function (err, watcher) {
  console.log('run')
  let watched = this.watched();
  //监听文件的变化
  console.log('aaa', this)
  this.on('changed', (filepath) => {
    console.log('runxxxa')
    //romotePath是我文件的远程位置
    let romotePath = '/root/test/' + filepath.substr(15);
    //put为上传文件的函数，下面会讲 
    put(filepath, romotePath);
    console.log(filepath + ' was changed');
  });
  this.on('added', function (filepath) {
    console.log(filepath + ' was added');
  });
});
// 然后就开始写我们的上传文件的函数
// var sftp = require('node-sftp-deploy');
// var sftpconfit = {
//   host: '116.62.224.22',
//   port: '22',
//   username: 'root',
//   password: 'admin911!@#Ffsh9admin'
// };
// var dir=path.join(__dirname, "dist/index.html");
// console.log('dir',dir)
// sftp({
//   "host": "116.62.224.22",
//   "port": "22",
//   "user": "root",
//   "pass": "admin911!@#Ffsh9admin",
//   "remotePath": "/root/test",
//   "sourcePath": './dist'
// }, function () {
//   //Success Callback 
//   console.log('aa')
// });


