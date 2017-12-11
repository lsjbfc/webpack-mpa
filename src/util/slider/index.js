$(function () {
  $('#slider .top').on('click', e => {
    // function getScrollTop() {
    //   var scrollTop = 0;
    //   if (document.documentElement && document.documentElement.scrollTop) {
    //     scrollTop = document.documentElement.scrollTop;
    //   } else if (document.body) {
    //     scrollTop = document.body.scrollTop;
    //   }
    //   return scrollTop;
    // }
    // var height = getScrollTop();
    // var s = height / 5
    // var timer = setInterval(function () {
    //   window.scrollTo(0, height);
    //   if (height <= 0) {
    //     clearInterval(timer)
    //     height = 0
    //   }
    //   height = height - s;
    // }, 13)
    $("html,body").stop().animate({
      "scrollTop": 0
    })
  })
})
