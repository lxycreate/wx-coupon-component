// pages/detail/detail.js
// 当前页面对象
var current_page;
var goods_id;
Page({
  data: {
    goods_detail: {
      after_coupon: 0,
      cid: 0,
      coupon_end: "0000-00-00",
      coupon_price: 0,
      coupon_url: "",
      dsr: 0,
      goods_id: "0",
      goods_pic: "../images/default.png",
      goods_price: 0,
      goods_sale: 0,
      goods_title: "",
      goods_url: "",
      is_gold: 0,
      is_hai: 0,
      is_ji: 0,
      is_ju: 0,
      is_qiang: 0,
      is_tmall: 0,
      is_yun: 0
    }, // 商品详情对象
    goods_list: [], // 商品列表
    error_count: 0, // 请求错误次数
    can_ajax: true, //可以进行ajax请求
    scroll_goods_list: {
      top: 0
    }
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "商品详情"
    });
    goods_id = options.id;
    this.init();
  },
  onReady: function() {
    getGoodsDetail(parseData);
  },
  init: function() {
    var pages = getCurrentPages() //获取加载的页面
    current_page = pages[pages.length - 1] //获取当前页面的对象
  },
  // 跳转详情页
  jumpToDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var url = "../../pages/detail/detail?id=" + id;
    wx.navigateTo({
      url: url
    })
  },
  // 跳转到领券
  jumpToCoupon: function(e) {
    var coupon = e.currentTarget.dataset.url.split("?");
    var temp = coupon[1].split('&');
    var sellerId = temp[0].split('=')[1];
    var activityId = temp[1].split('=')[1];
    var url = "../../pages/coupon/coupon?sellerId=" + sellerId + "&activityId=" + activityId;
    wx.navigateTo({
      url: url
    })
  }
})

// 获取商品详情
function getGoodsDetail(callback) {
  wx.request({
    url: 'http://localhost:8088/getGoodsDetail',
    data: {
      goods_id: goods_id
    },
    method: 'get',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      // 错误次数清零
      current_page.data.error_count = 0;
      if (res != null && res.data != null) {
        callback(res.data);
      }
    },
    fail: function(res) {
      current_page.data.error_count++;
      // 错误三次就无法请求
      if (current_page.data.error_count >= 3) {
        current_page.data.can_ajax = false;
      }
      console.log('请求错误' + res);
      closeLoading();
    }
  })
}

// 解析数据
function parseData(data) {
  if (data.goods_detail != null && data.goods_list != null) {
    current_page.setData({
      goods_detail: data.goods_detail,
      goods_list: data.goods_list
    })
  }

}