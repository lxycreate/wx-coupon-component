//index.js
//获取应用实例
const app = getApp()

// 当前页面对象
var current_page;
// 引入通用方法
var util = require('../../utils/util.js');
// 页面
Page({
  data: {
    goods_obj:{},
    // 目录跳转按钮
    cid_btns: [{
      name: '全部',
      value: '0',
      class_name: 'all',
      icon_class_name: 'icon-yingyong'
    }, {
      name: '女装',
      value: '1',
      class_name: 'dress',
      icon_class_name: 'icon-qunzi'
    }, {
      name: '男装',
      value: '2',
      class_name: 'man',
      icon_class_name: 'icon-xizhuang'
    }, {
      name: '内衣',
      value: '3',
      class_name: 'underwear',
      icon_class_name: 'icon-neiyi'
    }, {
      name: '数码',
      value: '4',
      class_name: 'digital',
      icon_class_name: 'icon-bijiben'
    }, {
      name: '美食',
      value: '5',
      class_name: 'food',
      icon_class_name: 'icon-shiwu'
    }, {
      name: '美妆',
      value: '6',
      class_name: 'beauty',
      icon_class_name: 'icon-hufupin'
    }, {
      name: '母婴',
      value: '7',
      class_name: 'infant',
      icon_class_name: 'icon-naiping'
    }, {
      name: '鞋包',
      value: '8',
      class_name: 'shoes',
      icon_class_name: 'icon-nvbao'
    }, {
      name: '家居',
      value: '9',
      class_name: 'household',
      icon_class_name: 'icon-chuang'
    }, {
      name: '文体',
      value: '10',
      class_name: 'sport',
      icon_class_name: 'icon-bangqiu'
    }, {
      name: '其他',
      value: '11',
      class_name: 'else',
      icon_class_name: 'icon-qita'
    }],
    // 商品列表
    goods_list: [],
    // 是否显示正在加载
    is_hidden_loading: false,
    // 是否显示回到顶部按钮
    is_hidden_top: true,
    scroll_goods_list: {
      top: 0, // 用于设置滚动条位置
      height: 0 // 滚动区域可视高度
    },
    // 请求错误计数器
    error_count: 0,
    // 可以进行ajax请求标志
    can_ajax: true,
    // 更多商品标志
    is_more_goods: true
  },
  onLoad() {
    current_page = util.getCurrentPage();
    var query = wx.createSelectorQuery();
    query.select('.js_scroll_box').boundingClientRect()
    query.exec(function(res) {
      current_page.data.scroll_goods_list.height = res[0].height;
      console.log(current_page.data.scroll_goods_list.height);
    })
  },
  // 页面渲染完成
  onReady() {
    this.initGoodsObj();
    setTimeout(function() {
      util.getGoods(util.parseGoodsList);
    }, 400)
  },
  // 初始化goods_obj
  initGoodsObj: function() {
    this.data.goods_obj['page_num'] = 1;
    this.data.goods_obj['page_size'] = 10;
    this.data.goods_obj['sort'] = 'goods_sale desc';
  },
  // 跳转到搜索页
  jumpToSearch: function() {
    wx.navigateTo({
      url: "../../pages/search/search"
    })
  },
  // 页面跳转到不同目录页面
  jumpToCatalog: function(event) {
    var value = event.currentTarget.dataset.value;
    var url = '../../pages/catalog/catalog?cid=' + value + '&title=' + this.data.cid_btns[value].name;
    wx.navigateTo({
      url: url
    })
  },

  // 底部上滑加载更多
  scrollLowerEvent: function() {
    if (this.data.can_ajax && this.data.is_more_goods) {
      this.data.can_ajax = false;
      this.setData({
        is_hidden_loading: false
      });
      var num = this.data.goods_obj['page_num'];
      this.data.goods_obj['page_num'] = num + 1;
      setTimeout(function() {
        util.getGoods(util.parseGoodsList)
      }, 600)
    }
  },
  // 商品列表滚动事件
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
  // 回到顶部
  scrollToTop: function() {
    this.setData({
      "scroll_goods_list.top": 0
    })
  }

});