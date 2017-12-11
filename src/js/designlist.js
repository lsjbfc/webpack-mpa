import '../css/base.scss';
import '../css/header.scss';
import '../css/nav.scss';
import '../css/slider.scss';
import '../css/footer.scss';
import '../util/nav/index.js';
import '../util/slider/index.js';
import '../css/designlist.scss';
import {
  footerData
} from '../util/footer/index.js';
import $ from 'jquery';
import template from '../lib/template-web.js';
import '../common/common.js';
import {
  URL,
  TMPURL,
  IMG_URL,
} from '../common/common.js';

$(function () {
  $("#navHover .list .listbox span").eq(1).find("a").addClass("active");
  class Getdata {
    constructor() {
      this.page = 0;
      this.type = {
        id: '',
        label: '',
        type: ''
      };
      this.style = {
        id: '',
        label: '',
        type: ''
      };
      this.navlistdata = {};
      this.con = [];
      this.serchs = false;
      this.sort = '';
    }
    start() {
      $.ajax({
        url: URL + TMPURL + "/design/designTag",
        type: "get",
        data: {}
      }).fail(err => {
        console.log(err)
      }).done(data => {
        if (!data.success) {
          console.log('data error');
          return;
        }
        this.navlistdata = data.data;
        this.navlist(data.data);
      });
      this.more();
      this.adv();
    }
    navlist(data) {
      var html = template('navlist', {
        data: data
      });
      $('.nav-list .list').html(html);
    }
    lists(data) {
      $('.more .yes').off('click');
      var list = data.list;
      var hasNextPage = data.hasNextPage;
      var total = data.total;
      $('.main p .mark').text(total);
      if (list.length === 0) {
        $('.none').css('display', 'block');
        $('.no').css('display', 'none');
        $('.yes').css('display', 'none');
        $('.more').css('display', 'none');
        $('.main-box .lists').html("");
        console.log('none')
        return;
      } else {
        if (this.serchs) {
          $('.main-box .left .lists').html('');
          this.serchs = false;
        }
        $('.none').css('display', 'none');
        $('.more').css('display', 'block');
      }
      var html = template('lists', {
        list: list,
        IMG_URL: IMG_URL
      });

      if (!hasNextPage) {
        $('.more .yes').hide();
        $('.more .no').css("display", 'block');
      } else {
        $('.more .yes').css("display", 'block');
        $('.more .no').hide()
      }
      if (this.serchs) {
        $('.main-box .left .lists').html('');
        this.serchs = false;
      }
      $('.main-box .left .lists').append(html);

      $('.more .yes').on('click', data => {
        this.serchs = false;
        this.more();
      });
      this.serch();
    }
    serch() {
      var that = this;
      $('.nav-list .list dd').off('click');
      $('.nav-list .list dd').on('click', function () {
        $(this).parent().find('dd').removeClass('active').end().end().addClass('active');
        var id = $(this).attr('data-id') || '';
        var type = $(this).attr('data-type');
        that[type].id = id;
        var label = '';
        for (var i = 0, len = that.navlistdata[type].length; i < len; i++) {
          if (that.navlistdata[type][i].id === id) {
            label = that.navlistdata[type][i].tagValue;
            break;
          }
        }
        that[type].label = label;
        that[type].type = type;
        that.page = 0;
        var arr = [];
        if (that.type.id) {
          arr.push(that.type);
        }
        if (that.style.id) {
          arr.push(that.style);
        }
        var conhtml = template('condition', {
          arr: arr
        });
        $('.conditions').show().find('.con').html(conhtml);
        $('.default').hide();
        $('.conditions').show();
        that.serchs = true;
        that.more();
      });
      $('.main-box .left .sort span').off('click');
      $('.main-box .left .sort span').on('click', function (e) {
        // $(this)
        // a.grade desc asc
        // a.cases desc
        that.page = 0;
        that.serchs = true;
        var type = $(this).attr('data-type');
        var sort = $(this).attr('data-sort');
        if (type === 'def') {
          $(this).parent().find('span').removeClass('des').removeClass('asc').end().end().attr('data-sort', 'desc').removeClass('asc').addClass('des');
          that.sort = '';
        } else if (type === 'grade') {
          if (sort === '') {
            $(this).parent().find('span').removeClass('des').removeClass('asc').end().end().attr('data-sort', 'desc').removeClass('asc').addClass('des');
            that.sort = "a.grade asc";
          } else if (sort === 'desc') {
            that.sort = "a.grade desc";
            $(this).parent().find('span').removeClass('des').removeClass('asc').end().end().attr('data-sort', 'asc').removeClass('des').addClass('asc');
          } else if (sort === 'asc') {
            that.sort = "a.grade asc";
            $(this).parent().find('span').removeClass('des').removeClass('asc').end().end().attr('data-sort', 'desc').removeClass('asc').addClass('des');
          } else {
            that.sort = '';
          }

        } else if (type === 'cases') {
          if (sort === '') {
            $(this).parent().find('span').removeClass('des').removeClass('asc').end().end().attr('data-sort', 'desc').removeClass('asc').addClass('des');
            that.sort = "a.cases asc";
          } else if (sort === 'desc') {
            that.sort = "a.cases desc";
            $(this).parent().find('span').removeClass('des').removeClass('asc').end().end().attr('data-sort', 'asc').removeClass('des').addClass('asc');
          } else if (sort === 'asc') {
            that.sort = "a.cases asc";
            $(this).parent().find('span').removeClass('des').removeClass('asc').end().end().attr('data-sort', 'desc').removeClass('asc').addClass('des');
          } else {
            that.sort = '';
          }
        } else {
          that.sort = '';
        }
        that.more()
      });

    }
    more() {
      var that = this;
      $.ajax({
        url: URL + TMPURL + "/design/designerquerypage",
        type: "get",
        data: {
          page: ++that.page,
          style: that.style.id,
          type: that.type.id,
          sort: that.sort
        }
      }).fail(err => {
        console.log(err)
      }).done(data => {
        if (!data.success) {
          console.log('data error');
          return;
        }
        that.lists(data.data)
      });
    }
    adv() {
      $.ajax({
        url: URL + TMPURL + "/platformAdvertising/list",
        type: "get",
        data: {
          type: 1
        }
      }).fail(err => {
        console.log(err);
      }).done(data => {
        if (!data.success) {
          console.log('data error');
          return;
        }
        console.log(data.data)
        var html = template('adv', {
          lists: data.data,
          IMG_URL: IMG_URL
        });
        $('.main-box .right').html(html)
      });
    }
  }
  var getdata = new Getdata();
  getdata.start()
})
