import '../css/base.scss'
import '../css/index.scss'

var $focusBanner = $("#focus-banner");
var $bannerList = $("#focus-banner-list li");
var $focusHandle = $(".focus-handle");
var $bannerImg = $(".focus-banner-img");
var $nextBnt = $("#next-img");
var $prevBnt = $("#prev-img");
var $focusBubble = $("#focus-bubble");
var bannerLength = $bannerList.length;
var _index = 0;
var _timer = "";
var _height = $(".focus-banner-img").find("img").height();
$focusBanner.height(_height);
$bannerImg.height(_height);
for (var i = 0; i < bannerLength; i++) {
  $bannerList.eq(i).css("zIndex", bannerLength - i);
  $focusBubble.append('<li><a href="javascript:;">' + i + '</a></li>');
};
$focusBubble.find("li").eq(0).addClass("current");
var bubbleLength = $focusBubble.find("li").length;
$focusBubble.css({
  "width": bubbleLength * 60,
  "marginLeft": -bubbleLength * 24,
}); //初始化
$focusBubble.on("click", "li", function () {
  $(this).addClass("current").siblings().removeClass("current");
  _index = $(this).index();
  changeImg(_index);
}); //点击轮换
$prevBnt.on("click", function () {
  _index++;
  if (_index > bannerLength - 1) {
    _index = 0;
  };
  changeImg(_index);
}); //下一张

$nextBnt.on("click", function () {
  _index--;
  if (_index < 0) {
    _index = bannerLength - 1;
  };
  changeImg(_index);
}); //上一张

function changeImg(_index) {
  $bannerList.eq(_index).fadeIn(250);
  $bannerList.eq(_index).siblings().fadeOut(200);
  $focusBubble.find("li").removeClass("current");
  $focusBubble.find("li").eq(_index).addClass("current");
  clearInterval(_timer);
  _timer = setInterval(function () {
    $prevBnt.click()
  }, 5000);
}; //切换主函数
_timer = setInterval(function () {
  $prevBnt.click()
}, 5000);


function isIE() { //ie?
  if (!!window.ActiveXObject || "ActiveXObject" in window)
    return true;
  else
    return false;
};

if (!isIE()) {
  // $(window).resize(function () {
  //   window.location.reload();
  // });
} else {
  if (!+'\v1' && !'1' [0]) {
    alert("老铁什么年代啦还在搞ie8以下版本啊！");
  } else {
    $(window).resize(function () {
      window.location.reload();
    });
  };
};

require('./common.js')
