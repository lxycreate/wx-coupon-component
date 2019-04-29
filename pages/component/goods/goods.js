// pages/component/goods/goods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods_list: Array
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
    // 图片加载出错时设置默认图片
    setDefaultPic:function(event){

    },
    // 跳转到详情页
    jumpToDetail:function(e){
      var id = e.currentTarget.dataset.id;
      var url = "../../pages/detail/detail?id=" + id;
      wx.navigateTo({
        url: url
      })
    },
    // 跳转到领券
    jumpToCoupon: function (e) {
      var coupon = e.currentTarget.dataset.url.split("?");
      var temp = coupon[1].split('&');
      var sellerId = temp[0].split('=')[1];
      var activityId = temp[1].split('=')[1];
      var url = "../../pages/coupon/coupon?sellerId=" + sellerId + "&activityId=" + activityId;
      wx.navigateTo({
        url: url
      })
    }
  }
})