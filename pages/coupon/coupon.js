// pages/coupon/coupon.js
Page({
  data: {
    url: ''
  },
  onLoad: function(options) {
    var temp = "https://uland.taobao.com/quan/detail?sellerId=" + options.sellerId + "&activityId=" + options.activityId;
    this.setData({
      url: temp
    })
  }
})