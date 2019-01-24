//index.js
//获取应用实例
const app = getApp()
// ajax参数
var goods_obj = {};
// 页面
Page({
  data: {
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
    goods_list: []
  },
  onLoad(data) {
 
  },
  // 页面渲染完成
  onReady() {
    this.initGoodsObj();
    this.getGoods(this.parseGoodsList);
  },
  // 初始化goods_obj
  initGoodsObj: function() {
    goods_obj['page_num'] = 1;
    goods_obj['sort'] = 'goods_sale desc';
  },
  // 获取商品
  getGoods: function(callback) {
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
  },
  // 解析商品列表
  parseGoodsList: function(data) {
    if (data.goods != null && data.goods.length > 0) {
      // this.onLoad(data.goods);
      this.setData({
        goods_list: this.data.goods_list.concat(data.goods)
      })
    }
  }
});