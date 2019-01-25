// pages/catalog/catalog.js
// ajax参数对象
var goods_obj = {};
// 页面对象
var current_page;
// 页面
Page({
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
    // 商品列表
    goods_list: [],
    // 当前排序方式
    sort_way: 0,
    // 是否显示加载动画
    is_hidden_loading: false,
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
    // 是否隐藏顶部加载提示
    is_hidden_top_loading: true
  },
  onLoad: function(options) {
    this.init();
    initGoodsObj();
    setTimeout(function() {
      getGoods(parseGoodsList);
    }, 400);
  },
  init: function() {
    var pages = getCurrentPages() //获取加载的页面
    current_page = pages[pages.length - 1] //获取当前页面的对象
    var query = wx.createSelectorQuery();
    query.select('.js_scroll_box').boundingClientRect()
    query.exec(function(res) {
      current_page.data.scroll_goods_list.height = res[0].height;
      console.log(res[0].height);
    })
  },
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
      this.data.sort_way = index;
    }
    // 事件
    if (index < 2) {
      this.setData({
        is_price_asc: false,
        is_price_desc: false
      })
    }
    if (index == 0) {
      deleteProperty('sort');
    }
    if (index == 1) {
      addProperty('sort', 'goods_sale desc');
    }
    if (index == 2 && temp == 2) {
      if (this.data.is_price_asc) {
        this.setData({
          is_price_asc: false,
          is_price_desc: true
        })
        addProperty('sort', 'goods_price desc');
      } else {
        this.setData({
          is_price_asc: true,
          is_price_desc: false
        })
        addProperty('sort', 'goods_price asc');
      }
    }
    if (index == 2 && temp != 2) {
      this.setData({
        is_price_asc: true,
        is_price_desc: false
      })
      addProperty('sort', 'goods_price asc');
    }
  },
  // 滚动事件
  scrollGoodsList: function(event) {
    if (event.detail.scrollTop > this.data.scroll_goods_list.height) {
      this.setData({
        is_hidden_top: false
      })
    } else {
      this.setData({
        is_hidden_top: true
      })
    }
  }, // 回到顶部
  scrollToTop: function() {
    this.setData({
      "scroll_goods_list.top": 0
    })
  }
  // 
})

// 初始化goods_obj
function initGoodsObj() {
  goods_obj = {};
  goods_obj['page_num'] = 1;
  goods_obj['page_size'] = 20;
}

// 获取商品
function getGoods(callback) {
  wx.request({
    url: 'http://localhost:8088/getGoods',
    data: goods_obj,
    method: 'get',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
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
  });
}

// 解析商品列表
function parseGoodsList(data) {
  if (data.goods != null && data.goods.length > 0) {
    if (current_page.data.is_clear_list) {
      current_page.setData({
        goods_list: []
      })
    }
    current_page.setData({
      goods_list: current_page.data.goods_list.concat(data.goods),
      is_hidden_loading: true,
      is_hidden_top_loading: true
    })
  }
}

// 从goods_obj中添加属性
function addProperty(name, value) {
  goods_obj['page_num'] = 1;
  goods_obj[name] = value;
  prepareSortGoods();
}

// 从goods_obj中删除属性
function deleteProperty(name) {
  if (goods_obj.hasOwnProperty(name)) {
    goods_obj['page_num'] = 1;
    delete goods_obj[name];
    prepareSortGoods();
  }
  console.log(goods_obj);
}

// 准备请求排序商品数据
function prepareSortGoods() {
  current_page.data.is_clear_list = true;
  current_page.setData({
    'scroll_goods_list.top': 0,
    is_hidden_top_loading: false
  })
  setTimeout(function() {
    getGoods(parseGoodsList);
  }, 400)
}

// 关闭动画
function closeLoading() {
  current_page.setData({
    is_hidden_loading: true,
    is_hidden_top_loading: true
  })
}