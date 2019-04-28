// pages/search/search.js
// 页面对象
var current_page;
// 引入通用方法
var util = require('../../utils/util.js');
Page({
  data: {
    goods_obj: {},
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
    // 筛选弹窗里的按钮
    screen_btns: [{
        name: '淘抢购', //名称   
        index: 1, //必须使用自定义的index，否则监听filter_value的函数中出现异常出现-0
        an_name: 'is_qiang', //搜索时的对应的参数名
        is_select: false // 是否被选中
      }, {
        name: '聚划算',
        index: 2,
        an_name: 'is_ju',
        is_select: false
      },
      {
        name: '天猫',
        index: 3,
        an_name: 'is_tmall',
        is_select: false
      }, {
        name: '金牌卖家',
        index: 4,
        an_name: 'is_gold',
        is_select: false
      }, {
        name: '海淘',
        index: 5,
        an_name: 'is_hai',
        is_select: false
      },
      {
        name: '运费险',
        index: 6,
        an_name: 'is_yun',
        is_select: false
      }
    ],
    // 商品列表
    goods_list: [],
    // 搜索关键词
    search_word: '',
    // 当前排序方式
    sort_way: 0,
    // 是否显示加载动画
    is_hidden_loading: true,
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
    // 隐藏升序排序图标
    is_price_asc: false,
    // 隐藏降序排序图标
    is_price_desc: false,
    // 清空数组标志
    is_clear_list: false,
    // 是否隐藏筛选层
    is_hidden_screen_box: true,
    // 是否隐藏顶部加载提示
    is_hidden_top_loading: true,
    // 还有更多商品
    is_more_goods: true,
    // 销量
    goods_sale: '',
    // 最低价
    low_price: '',
    // 最高价
    high_price: ''
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    this.init();
    this.initGoodsObj();
  },

  onReady: function() {},
  init: function() {
    var pages = getCurrentPages() //获取加载的页面
    current_page = pages[pages.length - 1] //获取当前页面的对象
    var query = wx.createSelectorQuery();
    query.select('.js_scroll_box').boundingClientRect()
    query.exec(function(res) {
      current_page.data.scroll_goods_list.height = res[0].height;
    })
  },
  // 初始化goods_obj
  initGoodsObj: function() {
    this.data.goods_obj = {};
    this.data.goods_obj['page_num'] = 1;
    this.data.goods_obj['page_size'] = 10;
  },
  // 获取搜索关键词
  getWord: function(e) {
    var temp = e.detail.value;
    if (temp != '') {
      this.data.search_word = temp;
    }
  },
  // 搜索
  search: function() {
    if (this.data.search_word != '') {
      util.addProperty('word', this.data.search_word);
    }
  },
  // 滚动事件
  scrollGoodsList: function(event) {
    if (event.detail.scrollTop > this.data.scroll_goods_list.height && this.data.is_hidden_top) {
      this.setData({
        is_hidden_top: false
      })
    } else if (event.detail.scrollTop < this.data.scroll_goods_list.height && !this.data.is_hidden_top) {
      this.setData({
        is_hidden_top: true
      })
    }
  },
  // 滑动到底部加载更多
  scrollLowerEvent: function() {
    loadNextPage();
  },
  // 回到顶部
  scrollToTop: function() {
    this.setData({
      "scroll_goods_list.top": 0
    })
  },
  // 清理goods_obj
  clearGoodsObj: function() {
    var e = '';
    if (this.data.goods_obj['sort'] != undefined && this.data.goods_obj['sort'] != '') {
      e = this.data.goods_obj['sort'];
    }
    // 保留搜索关键词
    var t = '';
    if (this.data.goods_obj['word'] != undefined && this.data.goods_obj['word'] != '') {
      t = this.data.goods_obj['word'];
    }
    this.initGoodsObj();
    if (t != '') {
      this.data.goods_obj['word'] = t;
    }
    util.addProperty('sort', e);
  },

})