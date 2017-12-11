import $ from 'jquery'
import template from '../../lib/template-web.js'
import {
  URL,
  TMPURL
} from '../../common/common'






// //提交
// export const submitData = function (type) {
//   var obj = {};
//   obj.userName = $("#userName").val();
//   obj.mobile = $("#mobile").val();
//   obj.houseType = $("#alertHouses").attr("name") || '';
//   obj.area = $("#area").val();
//   obj.remark = $("#remark").val();
//   obj.room = $("#alertQuote .room").val();
//   obj.hall = $("#alertQuote .hall").val();
//   obj.kitchen = $("#alertQuote .kitchen").val();
//   obj.toilet = $("#alertQuote .toilet").val();
//   obj.type = type;
//   $.ajax({
//     url: URL + TMPURL + "/design/subscribe",
//     type: "post",
//     data: obj,
//     success: function (res) {
//       if (res.success) {
//         // alert("222");
//       }
//     }
//   })
// }


export const commonAlert = {
  init: function () {
    var that = this;
    $.ajax({
      url: URL + TMPURL + "/tag/list",
      type: "get",
      data: {
        type: 1
      },
      success: function (res) {
        if (res.success) {
          let data = res.data || [];
          if (data.length > 0) {
            $("#alertHouses").append(template("alertHouse", {
              data: data
            }));
            that.customSelect();
          }
        }
      }
    });
    $("#alertQuote").on("click", ".close", function () {
      that.close();
    });
  },
  submitBind: function (type, fn) {
    let that = this;
    //给提交按钮按钮绑定事件;
    $("#submitBtn").on("click", function () {
      var obj = {};
      obj.userName = $("#userName").val();
      obj.mobile = $("#mobile").val();
      obj.houseType = $("#alertHouses").attr("name") || '';
      obj.area = $("#area").val();
      obj.remark = $("#remark").val();
      obj.room = $("#alertQuote .room").val();
      obj.hall = $("#alertQuote .hall").val();
      obj.kitchen = $("#alertQuote .kitchen").val();
      obj.toilet = $("#alertQuote .toilet").val();
      obj.type = type;
      var userFlag = that.validate(obj.userName, ['用户名不能为空']);
      if (!userFlag) {
        return
      }
      var reg = /^1[3|4|5|7|8][0-9]{9}$/; //手机号的正则;
      var mobileFlag = that.validate(obj.mobile, ['手机号不能为空', '请填写正确的手机号格式'], reg);
      if (!mobileFlag) {
        return
      }
      var typeFlag = that.validate(obj.houseType, ['房屋风格必选']);
      if (!typeFlag) {
        return
      }
      var reg1 = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/; //大于0的正实数
      var areaFlag = that.validate(Number(obj.area), ['面积不能为空', '面积为大于0的数字'], reg1);
      if (!areaFlag) {
        return
      };
      $.ajax({
        url: URL + TMPURL + "/design/subscribe",
        type: "post",
        data: obj,
        success: function (res) {
          if (res.success) {
            that.close();
          }else{
            $("#tipBox").text(res.data.msg).show();
          }
        }
      });
      fn && fn();
    })
  },
  customSelect: function () { //自定义下拉框的事件绑定
    $("#decoStyle").on("click", ".select-cont,.triangle", function (e) {
      e.stopPropagation();
      var showStatus = $("#alertHouses").css("display");
      // console.log(showStatus);
      if (showStatus == "none") {
        $("#decoStyle .triangle").addClass("triangleRotate");
        $("#alertHouses").show();
      } else {
        $("#decoStyle .triangle").removeClass("triangleRotate");
        $("#alertHouses").hide();
      }
    })
    $("#decoStyle").on("click", ".select-list", function (e) {
      e.stopPropagation();
      var id = $(this).attr("name"),
        content = $(this).text();
      $("#alertHouses").attr("name", id);
      $("#decoStyle .select-cont").text(content).addClass("selectCont");
      $("#decoStyle .triangle").removeClass("triangleRotate");
      $("#alertHouses").hide();
    })
    $(document).on("click", function () {
      $("#alertHouses").hide();
    })
  },
  clear: function () {
    $("#alertQuote .portrit img").attr("src", '#');
    $("#alertQuote .alertCase").text("0");
    $("#alertQuote .alertCons").text("0");
    $("#alertQuote .name").text("");
    $("#userName").val("");
    $("#mobile").val("");
    $("#decoStyle .select-cont").text("装修类型：请选择").removeClass("selectCont");
    $("#decoStyle .triangle").removeClass("triangleRotate");
    $("#alertHouses").hide();
    $("#area").val('');
    $("#remark").val('');
    $("#alertQuote .house").val('1');
    $("#tipBox").empty().hide();
  },
  close: function(){
    $("#alertQuote").hide();
    this.clear();
  },
  //检查数据
  validate: function (val, tipMsg, valiRule) {
    if (val === '') {
      $("#tipBox").text(tipMsg[0]).show();
      return false;
    } else {
      if (typeof valiRule == 'undefined') {
        $("#tipBox").empty().hide();
        return true;
      }
      var result = valiRule.test(val);
      if (result) {
        $("#tipBox").empty().hide();
        return true;
      } else {
        $("#tipBox").text(tipMsg[1]).show()
        return false;
      }
    }
  }
}
