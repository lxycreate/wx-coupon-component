// pages/component/filter/filter.js
// 当前页面对象
var current_page;
// 引入通用方法
var util = require('../../../utils/util.js');
Component({
  // 外部的类
  externalClasses: ['fix_filter_height', 'iconfont', 'icon-xiangshang1', 'icon-xiangxia'],
  // 页面生命周期
  pageLifetimes: {
    show() {
      current_page = util.getCurrentPage();
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
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
    // 当前排序方式
    sort_way: 0,
    // 隐藏升序排序图标
    is_price_asc: false,
    // 隐藏降序排序图标
    is_price_desc: false,
    // 是否隐藏筛选层
    is_hidden_screen_box: true,
    // 销量
    goods_sale: '',
    // 最低价
    low_price: '',
    // 最高价
    high_price: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变排序方式
    changeSortWay: function(event) {
      var temp = this.data.sort_way;
      var index = event.currentTarget.dataset.index;
      // 变颜色
      if (index < 3) {
        if (index != temp) {
          var s = '';
          for (var i = 0; i < this.data.filter_btns.length; ++i) {
            s = 'filter_btns[' + i + '].is_select';
            this.setData({
              [s]: false
            })
          }
          s = 'filter_btns[' + index + '].is_select';
          this.setData({
            [s]: true
          })
        }
        // 隐藏筛选
        this.hideScreenBox();
        this.data.sort_way = index;
      }
      // 显示筛选侧栏
      if (index == 3) {
        this.setData({
          is_hidden_screen_box: false
        })
      }
      // 事件
      if (index < 2) {
        this.setData({
          is_price_asc: false,
          is_price_desc: false
        })
      }
      if (index == 0) {
        util.deleteProperty('sort');
      }
      if (index == 1) {
        util.addProperty('sort', 'goods_sale desc');
      }
      if (index == 2 && temp == 2) {
        if (this.data.is_price_asc) {
          this.setData({
            is_price_asc: false,
            is_price_desc: true
          })
          util.addProperty('sort', 'goods_price desc');
        } else {
          this.setData({
            is_price_asc: true,
            is_price_desc: false
          })
          util.addProperty('sort', 'goods_price asc');
        }
      }
      if (index == 2 && temp != 2) {
        this.setData({
          is_price_asc: true,
          is_price_desc: false
        })
        util.addProperty('sort', 'goods_price asc');
      }
    },
    // 隐藏筛选侧栏
    hideScreenBox: function() {
      this.setData({
        is_hidden_screen_box: true
      })
    },
    // 获取输入的销量值
    getInputSale: function(e) {
      if (e.detail.value != '') {
        this.data.goods_sale = e.detail.value;
      }
    },
    // 获取最低价
    getLowPrice: function(e) {
      if (e.detail.value != '') {
        this.data.low_price = e.detail.value;
      }
    },
    // 获取最高价
    getHighPrice: function(e) {
      if (e.detail.value != '') {
        this.data.high_price = e.detail.value;
      }
    },
    // 筛选事件
    changeScreen: function(event) {
      var index = event.currentTarget.dataset.index;
      var temp = index - 1;
      var s = 'screen_btns[' + temp + '].is_select';
      if (this.data.screen_btns[index - 1].is_select) {
        this.setData({
          [s]: false
        });
        util.deleteProperty(this.data.screen_btns[index - 1].an_name);
      } else {
        this.setData({
          [s]: true
        });
        if (index == 1 && this.data.screen_btns[1].is_select) {
          s = 'screen_btns[1].is_select';
          this.setData({
            [s]: false
          });
          delete current_page.data.goods_obj['is_ju'];
        }
        if (index == 2 && this.data.screen_btns[0].is_select) {
          s = 'screen_btns[0].is_select';
          this.setData({
            [s]: false
          });
          delete current_page.data.goods_obj['is_qiang'];
        }
        util.addProperty(this.data.screen_btns[index - 1].an_name, '1');
      }
    },
    // 重置
    clear: function() {
      this.resetScreenBtns();
      this.resetInput();
      this.clearGoodsObj();
    },
    // 重置筛选按钮
    resetScreenBtns: function() {
      var s = '';
      for (var i = 0; i < 3; ++i) {
        s = 'screen_btns[' + i + '].is_select';
        this.setData({
          [s]: false
        })
      }
    },
    // 重置input
    resetInput: function() {
      this.setData({
        goods_sale: '',
        low_price: '',
        high_price: ''
      })
    },
    // 清理goods_obj
    clearGoodsObj: function() {
      util.getCurrentPage().clearGoodsObj();
    },
    // 确认
    confirm: function() {
      var flag = false;
      if (this.data.goods_sale != '') {
        current_page.data.goods_obj['sale_num'] = this.data.goods_sale;
        flag = true;
      }
      if (this.data.low_price != '') {
        current_page.data.goods_obj['start_price'] = this.data.low_price;
        flag = true;
      }
      if (this.data.high_price != '') {
        current_page.data.goods_obj['end_price'] = this.data.high_price;
        flag = true;
      }
      if (this.data.low_price != '' && this.data.high_price != '' && this.data.high_price < this.data.low_price) {
        var low = this.data.high_price;
        var high = this.data.low_price;
        current_page.data.goods_obj['start_price'] = low;
        current_page.data.goods_obj['end_price'] = high;
        this.setData({
          low_price: low,
          high_price: high
        })
      }
      if (flag) {
        var e = current_page.data.goods_obj['page_num'];
        util.addProperty('page_num', e);
      }
    }
  }
})