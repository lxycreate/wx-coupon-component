// pages/catalog/catalog.js
// ajax参数对象
var goods_obj = {};
// 页面对象
var current_page;
// 页面
Page({
  data: {
    filter_btns: [{
        name: '综合',
        index: 0,
        is_select: true
      },
      {
        name: '销量',
        index: 1,
        is_select: false
      }, {
        name: '价格',
        index: 2,
        is_select: false
      }, {
        name: '筛选',
        index: 3,
        is_select: false
      }
    ],
    // 商品列表
    goods_list: [],
    // 当前排序方式
    sort_way: 0,
    // 是否显示加载动画
    is_hidden_loading: true,
    // 是否显示返回顶部
    is_hidden_top: true,
    scroll_goods_list: {
      top: 0, // 用于设置滚动条位置
      height: 0 // 滚动区域可视高度
    }
  },
  onLoad: function(options) {
    this.init();
    initGoodsObj();
    getGoods(parseGoodsList);
  },
  init: function() {
    var pages = getCurrentPages() //获取加载的页面
    current_page = pages[pages.length - 1] //获取当前页面的对象
    var query = wx.createSelectorQuery();
    query.select('.js_scroll_box').boundingClientRect()
    query.exec(function(res) {
      current_page.data.scroll_goods_list.height = res[0].height;
      console.log(res[0].height);
    })
  },
  // 滚动事件
  scrollGoodsList: function(event) {
    if (event.detail.scrollTop > this.data.scroll_goods_list.height) {
      this.setData({
        is_hidden_top: false
      })
    } else {
      this.setData({
        is_hidden_top: true
      })
    }
  }, // 回到顶部
  scrollToTop: function() {
    this.setData({
      "scroll_goods_list.top": 0
    })
  }
  // 
})

// 初始化goods_obj
function initGoodsObj() {
  goods_obj = {};
  goods_obj['page_num'] = 1;
  goods_obj['page_size'] = 20;
}

// 获取商品
function getGoods(callback) {
  wx.request({
    url: 'http://localhost:8088/getGoods',
    data: goods_obj,
    method: 'get',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      if (res != null && res.data != null) {
        callback(res.data);
      }
    }
  });
}

// 解析商品列表
function parseGoodsList(data) {
  if (data.goods != null && data.goods.length > 0) {
    current_page.setData({
      goods_list: current_page.data.goods_list.concat(data.goods),
      is_hidden_loading: true
    })
  }
}