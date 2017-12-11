export const ceiling = function () {
  //吸顶效果
  var winHeight = $(window).height()
  $(window).on('scroll', function () {
    var scrollHeight = $(window).scrollTop();
    if (scrollHeight >= 100) {
      $('#navHover').addClass("ceilingNav");
    } else {
      $('#navHover').removeClass('ceilingNav');
    }
  })
}
$.support.cors = true;
export const IMG_URL = 'http://decoration-79122.oss-cn-hangzhou.aliyuncs.com/'

import template from '../lib/template-web.js';
template.defaults.rules[1].test = /\{\(([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*\)}/;
template.defaults.minimize = true;
export const IMG = function (x, y) {
  return `?x-oss-process=image/resize,m_fixed,h_${y},w_${x}`
}
// export const URL = "http://192.168.1.192:9005/";

export const URL = "http://116.62.224.22:9005/";


// export const HTTP_URL = "http://116.62.224.22:9005/decoration/";


export const TMPURL = "decoration";

// export const COMPANYURL = "http://localhost:9527/index";
export const COMPANYURL = "http://116.62.224.22:9528/";

// export const IMGURL = "http://decoration-79122.oss-cn-hangzhou.aliyuncs.com/";

// export const imgSize = function (x, y) {
//   return `?x-oss-process=image/resize,m_fixed,h_${y},w_${x}`
// }


// export const navStyle = function(href){
//   var href = location.href;
//   $("#navHover .list a").each(function(idx,curr){
//     var link = $(this).attr("href");
//     // console.log(link);
//     if(href.indexOf(link) != -1 && link != "#"){
//       $(this).addClass("active").parent().siblings().find("a").removeClass("active");
//     }
//   })
// }

// 获取某个时间格式的时间戳
export const getTime = function (time, type) {
  var stringTime = time;
  var timestamp2 = Date.parse(new Date(stringTime));
  timestamp2 = timestamp2;
  //2014-07-10 10:21:12的时间戳为：1404958872 
  return timestamp2
};
export const getYear = function (time, type) {
  // 将当前时间换成时间格式字符串
  var timestamp3 = time;
  var newDate = new Date();
  newDate.setTime(timestamp3);
  Date.prototype.format = function (format) {
    var date = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
          date[k] : ("00" + date[k]).substr(("" + date[k]).length));
      }
    }
    return format;
  }
  if (type === 2) {
    return newDate.format('yyyy.MM.dd')
  }
  return newDate.format('yyyy年MM月dd')
}
