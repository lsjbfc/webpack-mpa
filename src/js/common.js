var $sliderConnect = $('#slider_connect')
var $modalContent = $('#modal_content')
var $modalCont = $('#modal_cont')
$modalContent.hide()
$sliderConnect.click(function(){
  $modalContent.show()

})
$modalCont.click(function(e){
  $modalContent.hide()
})