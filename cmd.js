import {
  Promise
} from 'core-js/library/web/timers';

// import { RegExp } from 'core-js/library/web/timers';

// import { SFTPStream } from './C:/Users/yzt/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/ssh2-streams';

// var cmd=require('node-cmd');

//     cmd.get(
//         'node build/dev-server.js',
//         function(err, data, stderr){
//             console.log('',data)
//         }
//     );

//     cmd.run('node build/dev-server.js');

// cmd.get(
//     'ls',
//     function(err, data, stderr){
//         console.log('the current dir contains these files :\n\n',data)
//     }
// );

// cmd.get(
//     `
//         git clone https://github.com/RIAEvangelist/node-cmd.git
//         cd node-cmd
//         ls
//     `,
//     function(err, data, stderr){
//         if (!err) {
//            console.log('the node-cmd cloned dir contains these files :\n\n',data)
//         } else {
//            console.log('error', err)
//         }

//     }
// );
let Client = require('ssh2-sftp-client');
// let sftp = new Client();
// sftp.connect({
//     host: '116.62.224.22',
//     port: '22',
//     username: 'root',
//     password: 'admin911!@#Ffsh9admin'
// }).then(() => {
//     return sftp.list('/dist');
// }).then((data) => {
//     console.log(data, 'the data info');
// }).catch((err) => {
//     console.log(err, 'catch error');
// });
const fs = require('fs');
const path = require('path');

var sftpconfit = {
  host: '116.62.224.22',
  port: '22',
  username: 'root',
  password: 'admin911!@#Ffsh9admin'
};
// let list = new Client();
// list.connect(sftpconfit).then(data => {
//     return list.list('/root/test/');
// }).then(dirlist => {
//     console.log('dir', dirlist)
// }).catch(err => {
//     console.log('list err', err)
// });
// let writeStream = fs.createWriteStream('/dev/null');
// let uplode = new Client();
// uplode.connect(sftpconfit).then(files => {
//     // var dist = path.join(__dirname, './dist/');
//     let writeStream = fs.createWriteStream('./dist/');
//     return uplode.put(writeStream, "/root/test/")
// }).then(data => {
//     console.log('up ok');
// }).catch(err => {
//     console.log('up err', err)
// });

// .catch((err) => {
//     console.log('catch error', err);
// });
// .then(() => {
//     // console.log('开始上传.....')
//     // var dist = path.resolve(__dirname, './dist/');
//     // return sftp.put(dist, "/root/test/")

// }).then((data) => {
//     // console.log(data)
//     // console.log("上传完成");
// }).then(data => {
//     // var root=sftp.get('root');
//     // console.log('root',root)
//     //    return sftp.list('/root/test')
//     // var name = sftp.rename("/root/test/index.htm", "/root/test/index.html");
//     // console.log('Name',name)
//     return name;
// })
var sftpconfit = {
  host: '116.62.224.22',
  port: '22',
  username: 'root',
  password: 'admin911!@#Ffsh9admin'
};
class Upfile {
  constructor(params) {
    this.config = params.config
    this.local = params.local;
    this.remote = params.remote;
    // this.list()
  }
  up() {

  }
  list() {
    var that = this;
    var topfile = this.local;
    // new Promise()
    function dirlist(path) {
      var files = [];
      var lastpath;
      new Promise((resolve, reject) => {
            resolve()
            reject()
      })
      if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
          var curPath = path + "\\" + file;
          var list = curPath.toString()
          var lists = list.toString().split('\\');
          var index = lists.indexOf('static');
          var cur = lists.slice(index + 1).join('/');
          if (fs.statSync(curPath).isDirectory()) {
            // E:\nginx-1.13.5\html\11.2\decoration_company_web\static

            // 用正则去掉多余路径
            // var rex=new RegExp("E:\\nginx-1.13.5\\html\\11.2\\decoration_company_web\\static")
            // console.log('replace',list.replace(rex,''))
            // var a=curPath.replace("\\"+ topfile + "\\i","")
            // console.log('replace',a)
            that.mkdir(cur)
            dirlist(curPath);

          } else {
            that.upFile(curPath, cur)
            console.log('curfile', curPath)
          }
        });
      }
    };
    dirlist(this.local);
  }
  upFile(dir, file) {
    let uplode = new Client();
    var that = this;
    uplode.connect(that.config).then(files => {
      // var dist = path.join(__dirname, './dist/');
      // let writeStream = fs.createWriteStream('./dist/');
      var remote = '/' + that.remote + '/' + file;
      // console.log('re',remote)
      return uplode.put(dir, remote)
    }).then(data => {
      console.log('up ok');
    }).catch(err => {
      console.log('up err', dir)
    });
  }
  mkdir(dirlist) {
    var that = this;
    var remote = '/' + that.remote;
    let Mkdir = new Client();
    Mkdir.connect(that.config).then(dir => {
      return Mkdir.mkdir(remote + '/' + dirlist);
    }).then(data => {
      console.log('mkdir ok')
    }).catch(err => {
      console.log('mkdir err', remote + '/' + dirlist)
    })

  }
  rmdir() {

  }
}
var up = new Upfile({
  config: sftpconfit,
  local: path.join(__dirname, '/static'),
  remote: 'root/test'
});
up.list()
// up.mkdir()
