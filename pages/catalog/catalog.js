// pages/catalog/catalog.js
// ajax参数对象
var goods_obj = {};
// 页面对象
var current_page;
// 页面
Page({
  data: {

  },
  onLoad: function(options) {

  }
})

// 初始化goods_obj
function initGoodsObj() {
  goods_obj = {};
  goods_obj['page_num'] = 1;
  goods_obj['page_size'] = 20;
}