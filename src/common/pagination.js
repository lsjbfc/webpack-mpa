export const pagelist = function (options, callback) {
  var options = options || {}
  if (!options.current) {
    return 'error'
  }
  var showlen = options.len || 2
  var list = options.list || [1]
  var pre = '上一页'
  var next = '下一页'
  var current = options.current
  var len = list.length || 1
  var html = ''
  var DOM = options.dom || 'li'
  var ellipses = '<' + DOM + ' class=ellipsis>···</' + DOM + '>'
  var aftershow = false
  var beforeshow = false
  var all = '<' + DOM + ">共<i class='all'>" + options.all + '</i>条</' + DOM + '>'
  var hasPreviousPage = options.hasPreviousPage
  var hasNextPage = options.hasNextPage

  if (!hasPreviousPage) {
    pre = '<' + DOM + " class='pre disable'>" + pre + '</' + DOM + '>'
  } else {
    pre = '<' + DOM + " class='pre'>" + pre + '</' + DOM + '>'
  }
  if (!hasNextPage) {
    next = '<' + DOM + " class='next disable'>" + next + '</' + DOM + '>'
  } else {
    next = '<' + DOM + " class='next'>" + next + '</' + DOM + '>'
  }

  function li (val) {
    if (val === undefined) {
      return
    }
    if (val == current) {
      return '<' + DOM + " class='page active' data-index='" + (val) + "'>" + list[val - 1] + '</' + DOM + '>'
    } else {
      return '<' + DOM + " class='page' data-index='" + (val) + "'>" + list[val - 1] + '</' + DOM + '>'
    }
  }

  for (var i = 1; i <= len; i++) {
    if (i === 1) {
            // html+=all;
      html += pre
      html += li(i)
    }
    if (i == current && i !== 1 && i !== len && Math.abs((i - current)) > showlen) { //
      html += li(i)
    }
    if (i !== 1 && i !== len && Math.abs((i - current)) <= showlen) {
      html += li(i)
    }
    if (i !== 1 && i !== len && Math.abs((i - current)) > showlen) {
      if (i >= current) {
        if (!aftershow) {
          html += ellipses
        }
        aftershow = true
      }
      if (i <= current) {
        if (!beforeshow) {
          html += ellipses
        }
        beforeshow = true
      }
    }
    if (i === len) { // && i!==current
      if (i !== 1) {
        html += li(i)
      }
      html += next
            // html+="<li>跳转至</li>"
            // html+="<li><input maxlength='2'  type='text'/></li>"
            // html+="<li class='btn'>跳转</li>"
    }
  }
  callback && callback(html)
}
