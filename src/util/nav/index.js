import $ from 'jquery'
$(function () {

  

  var show = function () {
    $('#header-nav .list .listbox').hide()
    $('#header-nav .placeholder').hide()
    $('#header-nav input').focus()
    $('#header-nav .select').show()
    $('#header-nav .select').on('click', function (e) {
      e.stopPropagation();
      $('#header-nav  ul').show()
    })
    $('#header-nav  ul').on('click', function (e) {
      e.stopPropagation();
    })
    $(document).on('click', function (e) {
      $('#header-nav .list .listbox').show()
      $('#header-nav .select').hide()
      $('#header-nav .placeholder').show()
      $('#header-nav  ul').hide()
      $('#header-nav .input').stop().animate({
        width: "240px"
      })
      $('#header-nav .inputbox').stop().animate({
        width: "240px"
      })
      $('#header-nav .inputbox input').stop().animate({
        width: "100px"
      })
      $('#header-nav .inputbox input').val("")
    })
  }
  $('#header-nav .placeholder').on('click', function (e) {
    e.stopPropagation();
    // console.log('nav', $('#header-nav .input'))
    $('#header-nav .input').stop().animate({
      width: "488px"
    })
    $('#header-nav .inputbox').stop().animate({
      width: "488px"
    })
    $('#header-nav .inputbox input').stop().animate({
      width: "360px"
    })
    show();
  })
  $('#header-nav .input input').on('click', function (e) {
    // console.log('input')
    e.stopPropagation();
    $('#header-nav .select').hide()
    $('#header-nav  ul').hide()
    show();
  })
})
