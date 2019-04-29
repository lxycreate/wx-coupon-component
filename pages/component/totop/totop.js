// pages/component/totop/totop.js
var util = require('../../../utils/util.js');
Component({
  externalClasses: ['iconfont', 'icon-xiangshang'],
  // 页面生命周期
  pageLifetimes: {
    show() {
      this.data.current_page = util.getCurrentPage();
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    is_hidden_top: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    current_page: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 回到顶部
    scrollToTop: function() {
      this.data.current_page.setData({
        "scroll_goods_list.top": 0
      })
    }
  }
})