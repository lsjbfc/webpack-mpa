import '../css/base.scss'
import '../css/header.scss'
import '../css/nav.scss'
import '../css/index.scss'
import '../css/slider.scss'
import '../css/footer.scss'
import '../util/nav/index.js'
import '../util/slider/index.js'
import '../util/footer/index.js'
import $ from 'jquery'
import template from '../lib/template-web.js'

import {
  URL,
  TMPURL,
  ceiling,
  IMG_URL,
  IMG,
  COMPANYURL
} from '../common/common.js'
import {
  footerData
} from '../util/footer/index.js'


$(function () {
  $("#navHover .list .listbox span").eq(0).find("a").addClass("active");

  function carousel() {
    //轮播图的原生写法
    var $imgs = $("#imgbox li"),
      len = $imgs.length,
      imgWidth = $imgs.first().outerWidth(),
      nextIndex = 1,
      currentIndex = 0,
      Carouselflag = false; //标记运动是否运动结束;
    $("#imgbox").hover(function () {
      clearInterval(timer);
    }, function () {
      timer = setInterval(move, 3000);
    });
    // //取消双击选取文本的默认行为
    // $("#container").on("selectstart", function () {
    //   return false;
    // });
    //动态添加小圆点
    var html = "";
    for (var i = 0; i < len; i++) {
      html += "<div></div>"
    }
    $(html).appendTo("#bannerCircle");
    $("#bannerCircle div:eq(0)").addClass("on");
    //给小圆点添加鼠标移入的效果
    $("#bannerCircle").delegate("div", "click", function () {
      var _index = $(this).index();
      currentIndex = _index;
      nextIndex = _index + 1;
      move();
    });
    //让图片和小圆点自己运动
    var timer = setInterval(move, 3000);
    //运动函数
    function move() {
      $("#imgbox li").eq(currentIndex).stop(true,true).animate({
        opacity: 1
      }, 1000).show().siblings().stop(true,true).animate({
        opacity: 0
      }, 1000).hide();
      $("#bannerCircle div").eq(currentIndex).addClass("on").siblings().removeClass("on");
      currentIndex = nextIndex;
      nextIndex++;
      if (nextIndex >= len) {
        nextIndex = 0;
      }
    }
  }



  //首页基本模式
  // $.ajax({
  //   url: URL + TMPURL + "/baseSettings/list",
  //   type: 'get',
  //   success: function(res){
  //     if(res.success){
  //       let data = res.data;
  //       $("#design .styles").prepend(template("designSty",{
  //         lists: data.style
  //       }));
  //       computedLine($("#designStyle"));
  //       $("#decoration .styles").append(template("designSty",{
  //         lists: data.mode
  //       }));
  //       computedLine($("#decorateStyle"));
  //       $("#material .styles").append(template("materSty",{
  //         lists: data.materials
  //       }));
  //       computedLine($("#materStyle"));
  //     }
  //   }
  // })
  footerData(lineAverge);
  //线条平均分配;
  function lineAverge(data) {
    data = data;
    $("#design .styles").prepend(template("designSty", {
      lists: data.style
    }));
    computedLine($("#designStyle"));
    $("#decoration .styles").append(template("decorationSty", {
      lists: data.mode
    }));
    computedLine($("#decorateStyle"));
    $("#material .styles").append(template("materSty", {
      lists: data.materials
    }));
    computedLine($("#materStyle"));
  }



  //首页banner
  $.ajax({
    url: URL + TMPURL + "/platformBanner/list",
    type: 'get',
    success: function (res) {
      if (res.success) {
        let data = res.data;
        $("#imgbox").append(template("bannerLists", {
          lists: data,
          IMG_URL: IMG_URL
        }));
        carousel();
      }
    }
  })
  //首页设计库
  $.ajax({
    url: URL + TMPURL + "/platformCase/list",
    type: 'get',
    success: function (res) {
      if (res.success) {
        let tarObj = {
          "case_style": "",
          "user_name": "",
          "head_img": "",
          "id": "",
          "case_img": "",
          "synopsis": "",
          "case_id": ""
        };
        let data = dealArr(res.data, tarObj);
        $("#design .design-lists").append(template("designLists", {
          lists: data,
          IMG_URL: IMG_URL
        }));
      }
    }
  })
  //找装修公司
  $.ajax({
    url: URL + TMPURL + "/platformCompany/list",
    type: 'get',
    success: function (res) {
      if (res.success) {
        let tarObj = {
          "cases": "",
          "company_id": "",
          "company_name": "",
          "grade": "",
          "construction_sites": "",
          "id": "",
          "img_default": "",
          "img_focus": "",
          "years": "",
          "content": ""
        };
        let data = dealArr(res.data, tarObj);
        data.forEach((curr,idx) =>{
          curr.content = $(curr.content).text();
          if(curr.grade){
            curr.grade = ("" + curr.grade).slice(0,1);
          }
          if(curr.cases){
            curr.cases = ("" + curr.cases).slice(0,1);
          }
          if(curr.construction_sites){
            curr.construction_sites = ("" + curr.construction_sites).slice(0,1);
          }
          if(curr.years){
            curr.years = ("" + curr.years).slice(0,1);
          }
        });
        $("#decoration .company-lists").append(template("decorationLists", {
          lists: data,
          IMG_URL: IMG_URL
        }));
        computedLine($("#designStyle"));
        companyInfo(data[0]);
          
        $("#decoration .company-lists").on("click", ".companyLogo", function () {
          var id = $(this).attr("name");
          // console.log(id);
          data.forEach((curr) => {
            if (curr.id == id) {
              companyInfo(curr);
            }
          })
        })
      }
    }
  })

  //切换显示公司信息
  function companyInfo(obj) {
    $("#decoration .company-info").html(template("companyInfos", {
      list: obj,
      IMG_URL: IMG_URL,
      COMPANYURL: COMPANYURL
    }));
  }
  //买材料
  $.ajax({
    url: URL + TMPURL + "/platformMaterials/list",
    type: 'get',
    success: function (res) {
      if (res.success) {
        let tarObj = {
          "id": "",
          "img": "",
          "name": "",
          "imgUrl": ""
        };
        let data = dealArr(res.data, tarObj);
        $("#material .mater-lists").append(template("materLists", {
          lists: data,
          IMG_URL: IMG_URL
        }));
      }
    }
  })
  //
  //合作品牌
  $.ajax({
    url: URL + TMPURL + "/platformCooperate/list",
    type: 'get',
    success: function (res) {
      if (res.success) {
        let tarObj = {
          "id": "",
          "img": "",
          "name": "",
          "imgUrl": ""
        };
        let data = dealArr(res.data, tarObj);
        $("#cooperate .cooperate-logos").append(template("cooperateLogos", {
          lists: data,
          IMG_URL: IMG_URL
        }));
      }
    }
  })


  //处理数据
  function dealArr(arr, tarObj) {
    let tmpArr = [];
    arr.forEach((curr) => {
      tmpArr.push(mergeObj(curr, tarObj));
    });
    return tmpArr;
  }
  //处理数据时的合并对象
  function mergeObj(target, source) {
    let tmpObj = {};
    for (var val in source) {
      tmpObj[val] = target[val] || source[val] || "";
    }
    return tmpObj;
  }


  //线条平均分配;
  computedLine($("#cooprateStyle"));

  // xiding
  ceiling();
  //计算线条宽度的函数；
  function computedLine(dom) {
    var styleWidth = dom.children('.styles').outerWidth(true);
    var circleWidth = dom.children(".circle").eq(0).outerWidth() + 1;
    var lineWidth = Math.floor((1300 - 2 * circleWidth - styleWidth) / 2);
    dom.children('.line').css({
      width: lineWidth
    })
  }
})
