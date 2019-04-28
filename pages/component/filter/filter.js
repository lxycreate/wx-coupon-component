// pages/component/filter/filter.js
// 引入通用方法
var util = require('../../../utils/util.js');
Component({
  externalClasses: ['fix_filter_height', 'iconfont', 'icon-xiangshang1','icon-xiangxia'],
  /**
   * 组件的属性列表
   */
  properties: {
    // 按钮
    filter_btns: Array,
    // 是否升序
    is_price_asc: Boolean,
    // 是否降序
    is_price_desc: Boolean,
    // 是否隐藏过滤弹窗
    is_hidden_screen_box: Boolean,
    // 过滤弹窗中的按钮
    screen_btns: Array,
    // 商品销量
    goods_sale: String,
    // 最低价
    low_price: String,
    // 最高价
    high_price: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 当前排序方式
    sort_way: 0
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
    getInputSale: function (e) {
      if (e.detail.value != '') {
        this.data.goods_sale = e.detail.value;
      }
    },
    // 获取最低价
    getLowPrice: function (e) {
      if (e.detail.value != '') {
        this.data.low_price = e.detail.value;
      }
    },
    // 获取最高价
    getHighPrice: function (e) {
      if (e.detail.value != '') {
        this.data.high_price = e.detail.value;
      }
    },
    // 筛选事件
    changeScreen: function (event) {
      var obj = util.getCurrentPage();
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
          delete obj.data.goods_obj['is_ju'];
        }
        if (index == 2 && this.data.screen_btns[0].is_select) {
          s = 'screen_btns[0].is_select';
          this.setData({
            [s]: false
          });
          delete obj.data.goods_obj['is_qiang'];
        }
        util.addProperty(this.data.screen_btns[index - 1].an_name, '1');
      }
    },
    // 重置
    clear: function () {
      this.resetScreenBtns();
      this.resetInput();
      this.clearGoodsObj();
    },
    // 重置筛选按钮
    resetScreenBtns: function () {
      var s = '';
      for (var i = 0; i < 3; ++i) {
        s = 'screen_btns[' + i + '].is_select';
        this.setData({
          [s]: false
        })
      }
    },
    // 重置input
    resetInput: function () {
      this.setData({
        goods_sale: '',
        low_price: '',
        high_price: ''
      })
    },
    // 清理goods_obj
    clearGoodsObj: function () {
      util.getCurrentPage().clearGoodsObj();
    },
    // 确认
    confirm: function () {
      var obj = util.getCurrentPage();
      var flag = false;
      if (this.data.goods_sale != '') {
        obj.data.goods_obj['sale_num'] = this.data.goods_sale;
        flag = true;
      }
      if (this.data.low_price != '') {
        obj.data.goods_obj['start_price'] = this.data.low_price;
        flag = true;
      }
      if (this.data.high_price != '') {
        obj.data.goods_obj['end_price'] = this.data.high_price;
        flag = true;
      }
      if (this.data.low_price != '' && this.data.high_price != '' && this.data.high_price < this.data.low_price) {
        var low = this.data.high_price;
        var high = this.data.low_price;
        obj.data.goods_obj['start_price'] = low;
        obj.data.goods_obj['end_price'] = high;
        this.setData({
          low_price: low,
          high_price: high
        })
      }
      if (flag) {
        var e = obj.data.goods_obj['page_num'];
        util.addProperty('page_num', e);
      }
    }
  }
})