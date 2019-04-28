// pages/component/totop/totop.js
var util = require('../../../utils/util.js');
Component({
  externalClasses: ['iconfont','icon-xiangshang'],
  /**
   * 组件的属性列表
   */
  properties: {
    is_hidden_top:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 回到顶部
    scrollToTop:function(){
      util.getCurrentPage().setData({
        "scroll_goods_list.top": 0
      })
    }
  }
})
