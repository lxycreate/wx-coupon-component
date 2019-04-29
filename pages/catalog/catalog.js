// pages/catalog/catalog.js
// 当前分类
var cid = '';
// 引入通用方法
var util = require('../../utils/util.js');
// 页面
Page({
  data: {
    goods_obj: {},
    // 商品列表
    goods_list: [],
    // 是否显示加载动画
    is_hidden_loading: false,
    // 是否显示返回顶部
    is_hidden_top: true,
    scroll_goods_list: {
      top: 0, // 用于设置滚动条位置
      height: 0 // 滚动区域可视高度
    },
    // 请求错误计数器
    error_count: 0,
    // 可以进行ajax请求标志
    can_ajax: true,
    // 清空数组标志
    is_clear_list: false,
    // 是否隐藏顶部加载提示
    is_hidden_top_loading: true,
    // 还有更多商品
    is_more_goods: true
  },
  onLoad: function(options) {
    cid = options.cid;
    wx.setNavigationBarTitle({
      title: options.title
    });
    this.init();
    this.initGoodsObj();
  },
  onReady: function() {
    setTimeout(function() {
      util.getGoods(util.parseGoodsList);
    }, 400)
  },
  init: function() {
    var current_page = util.getCurrentPage();
    var query = wx.createSelectorQuery();
    query.select('.js_scroll_box').boundingClientRect()
    query.exec(function(res) {
      current_page.data.scroll_goods_list.height = res[0].height;
    })
  },
  // 初始化goods_obj
  initGoodsObj: function() {
    this.data.goods_obj = {};
    if (cid != '0') {
      this.data.goods_obj['goods_cid'] = cid;
    }
    this.data.goods_obj['page_num'] = 1;
    this.data.goods_obj['page_size'] = 10;
  },

  // 滚动事件
  scrollGoodsList: function(event) {
    util.scrollGoodsList(event);
  },
  // 滑动到底部加载更多
  scrollLowerEvent: function() {
    util.loadNextPage();
  },

  // 重置goods_obj
  clearGoodsObj: function() {
    var e = '';
    if (this.data.goods_obj['sort'] != undefined && this.data.goods_obj['sort'] != '') {
      e = this.data.goods_obj['sort'];
    }
    this.initGoodsObj();
    util.addProperty('sort', e);
  },
  // 
})
