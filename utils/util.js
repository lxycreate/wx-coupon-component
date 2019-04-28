// 通用方法
// 获取当前页面
function getCurrentPage() {
  var pages = getCurrentPages() //获取加载的页面
  return pages[pages.length - 1] //获取当前页面的对象
}

// 向goods_obj中添加数据
function addProperty(name, value) {
  var obj = getCurrentPage();
  obj.data.goods_obj['page_num'] = 1;
  obj.data.goods_obj[name] = value;
  prepareGetGoods();
}

// 从goods_obj中删除属性
function deleteProperty(name) {
  var obj = getCurrentPage();
  if (obj.data.goods_obj.hasOwnProperty(name)) {
    obj.data.goods_obj['page_num'] = 1;
    delete obj.data.goods_obj[name];
    prepareGetGoods();
  }
}

// 准备请求商品数据
function prepareGetGoods() {
  var obj = getCurrentPage();
  if (obj.data.can_ajax) {
    obj.data.can_ajax = false;
    // 关闭"没有更多了..."提示
    obj.setData({
      is_more_goods: true
    })
    // 清空数组标志
    obj.data.is_clear_list = true;
    // 返回顶部并开启加载动画
    obj.setData({
      'scroll_goods_list.top': 0,
      is_hidden_top_loading: false
    })
    setTimeout(function() {
      getGoods(parseGoodsList);
    }, 400)
  }
}
// 加载下一页
function loadNextPage() {
  var obj = getCurrentPage();
  if (obj.data.is_more_goods && obj.data.can_ajax) {
    obj.data.can_ajax = false;
    // 不清空
    obj.data.is_clear_list = false;
    // 显示加载动画
    obj.setData({
      is_hidden_loading: false
    })
    var num = obj.data.goods_obj['page_num'];
    obj.data.goods_obj['page_num'] = num + 1;
    setTimeout(function() {
      getGoods(parseGoodsList);
    }, 600)
  }
}
// 获取商品数据
function getGoods(callback) {
  console.log("获取商品数据")
  var obj = getCurrentPage();
  wx.request({
    url: 'http://localhost:8088/getGoods',
    data: obj.data.goods_obj,
    method: 'get',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      obj.data.error_count = 0;
      if (res != null && res.data != null) {
        callback(res.data);
      }
    },
    fail: function(res) {
      obj.data.error_count++;
      // 错误三次就无法请求
      if (obj.data.error_count >= 3) {
        obj.data.can_ajax = false;
      }
      console.log('请求错误' + res);
      closeLoading();
    }
  })
}

// 解析商品数据
function parseGoodsList(data) {
  var obj = getCurrentPage();
  if (data.goods != null) {
    if (obj.data.is_clear_list) {
      obj.setData({
        goods_list: data.goods
      })
    } else {
      obj.setData({
        goods_list: obj.data.goods_list.concat(data.goods)
      })
    }
  }
  // 关闭动画
  closeLoading();
  // 显示没有更多了提示
  if (data.goods == null || data.goods.length < obj.data.goods_obj['page_size']) {
    obj.setData({
      is_more_goods: false
    })
  }
  // 可以进行下一次ajax请求
  setTimeout(function() {
    obj.data.can_ajax = true;
  }, 400)
  // 
}

// 关闭动画
function closeLoading() {
  var obj = getCurrentPage();
  if (obj.data.is_hidden_loading != undefined) {
    obj.setData({
      is_hidden_loading: true
    })
  }
  if (obj.data.is_hidden_top_loading != undefined) {
    obj.setData({
      is_hidden_top_loading: true
    })
  }
}

module.exports = {
  getCurrentPage: getCurrentPage,
  addProperty: addProperty,
  deleteProperty: deleteProperty,
  loadNextPage: loadNextPage,
  getGoods: getGoods,
  parseGoodsList: parseGoodsList,
  closeLoading: closeLoading,

}