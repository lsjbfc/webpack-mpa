import $ from 'jquery'

import template from '../../lib/template-web.js'
import {
  URL,
  TMPURL,
  ceiling,
  IMG_URL,
  IMG
} from '../../common/common.js'

$.ajax({
  url: URL + TMPURL + "/ptindex/performance",
  type: 'get',
  success: function (res) {
    if (res.success) {
      let data = res.data;
      $("#commonFooter .header .left").append(template("commonFootNum", {
        list: data
      }));
    }
  }
})


export const footerData = function (fn) {
  $.ajax({
    url: URL + TMPURL + "/baseSettings/list",
    type: 'get',
    success: function (res) {
      if (res.success) {
        let data = res.data;
        $("#commonFootTel").text(data.base[0].serviceHotline || "");
        $("#commonFootQrCode").attr("src",IMG_URL + data.base[0].qrCode +IMG(114,114));
        $("#commonFooter .icp").text(data.base[0].icp || "");
        fn && fn(data);
      }
    }
  })
}
