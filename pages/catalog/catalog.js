// pages/catalog/catalog.js
// ajax参数对象
var goods_obj = {};
// 页面对象
var current_page;
// 当前分类
var cid = '';
// 页面
Page({
  data: {
    goods_obj: goods_obj,
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
    // 是否隐藏筛选层
    is_hidden_screen_box: true,
    // 是否隐藏顶部加载提示
    is_hidden_top_loading: true,
    // 还有更多商品
    is_more_goods: true,
    // 销量
    goods_sale: '',
    // 最低价
    low_price: '',
    // 最高价
    high_price: ''
  },
  onLoad: function(options) {
    cid = options.cid;
    wx.setNavigationBarTitle({
      title: options.title
    });
    this.init();
    initGoodsObj();
  },
  onReady: function() {
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
  // 隐藏筛选侧栏
  hideScreenBox: function() {
    this.setData({
      is_hidden_screen_box: true
    })
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
      deleteProperty(this.data.screen_btns[index - 1].an_name);
    } else {
      this.setData({
        [s]: true
      });
      if (index == 1 && this.data.screen_btns[1].is_select) {
        s = 'screen_btns[1].is_select';
        this.setData({
          [s]: false
        });
        if (goods_obj.hasOwnProperty('is_ju')) {
          delete goods_obj['is_ju'];
        }
      }
      if (index == 2 && this.data.screen_btns[0].is_select) {
        s = 'screen_btns[0].is_select';
        this.setData({
          [s]: false
        });
        if (goods_obj.hasOwnProperty('is_qiang')) {
          delete goods_obj['is_qiang'];
        }
      }
      addProperty(this.data.screen_btns[index - 1].an_name, '1');
    }

  },
  // 滚动事件
  scrollGoodsList: function(event) {
    // console.log(event.detail);
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
  },
  // 滑动到底部加载更多
  scrollLowerEvent: function() {
    loadNextPage();
  },
  // 回到顶部
  scrollToTop: function() {
    this.setData({
      "scroll_goods_list.top": 0
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
  // 重置
  clear: function() {
    this.resetScreenBtns();
    this.resetInput();
    this.clearGoodsObj();
  },
  // 清理goods_obj
  clearGoodsObj: function() {
    var e = '';
    if (goods_obj['sort'] != undefined && goods_obj['sort'] != '') {
      e = goods_obj['sort'];
    }
    initGoodsObj();
    addProperty('sort', e);
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
  // 确认
  confirm: function() {
    var flag = false;
    if (this.data.goods_sale != '') {
      goods_obj['sale_num'] = this.data.goods_sale;
      flag = true;
    }
    if (this.data.low_price != '') {
      goods_obj['start_price'] = this.data.low_price;
      flag = true;
    }
    if (this.data.high_price != '') {
      goods_obj['end_price'] = this.data.high_price;
      flag = true;
    }
    if (this.data.low_price != '' && this.data.high_price != '' && this.data.high_price < this.data.low_price) {
      var low = this.data.high_price;
      var high = this.data.low_price;
      goods_obj['start_price'] = low;
      goods_obj['end_price'] = high;
      this.setData({
        low_price: low,
        high_price: high
      })
    }
    if (flag) {
      var e = goods_obj['page_num'];
      addProperty('page_num', e);
    }
  }
  // 
})

// 初始化goods_obj
function initGoodsObj() {
  goods_obj = {};
  if (cid != '0') {
    goods_obj['goods_cid'] = cid;
  }
  goods_obj['page_num'] = 1;
  goods_obj['page_size'] = 10;
  // goods_obj['is_ju'] = 1;
  // goods_obj['is_qiang'] = 1;
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

// 解析商品列表
function parseGoodsList(data) {
  // console.log(data.goods);
  if (data.goods != null) {
    if (current_page.data.is_clear_list) {
      current_page.setData({
        goods_list: data.goods
      })
    } else {
      current_page.setData({
        goods_list: current_page.data.goods_list.concat(data.goods)
      })
    }
  }
  // 关闭动画
  closeLoading();
  // 显示没有更多了提示
  if (data.goods == null || data.goods.length < goods_obj['page_size']) {
    current_page.setData({
      is_more_goods: false
    })
  }
  // 可以进行下一次ajax请求
  setTimeout(function() {
    current_page.data.can_ajax = true;
  }, 400)

  // 
}

// 从goods_obj中添加属性
function addProperty(name, value) {
  goods_obj['page_num'] = 1;
  goods_obj[name] = value;
  prepareGetGoods();
  console.log(goods_obj);
}

// 从goods_obj中删除属性
function deleteProperty(name) {
  if (goods_obj.hasOwnProperty(name)) {
    goods_obj['page_num'] = 1;
    delete goods_obj[name];
    prepareGetGoods();
  }
  console.log(goods_obj);
}

// 加载下一页
function loadNextPage() {
  if (current_page.data.is_more_goods && current_page.data.can_ajax) {
    current_page.data.can_ajax = false;
    // 不清空
    current_page.data.is_clear_list = false;
    // 显示加载动画
    current_page.setData({
      is_hidden_loading: false
    })
    var num = goods_obj['page_num'];
    goods_obj['page_num'] = num + 1;
    setTimeout(function() {
      getGoods(parseGoodsList);
    }, 600)
  }
}

// 准备请求排序商品数据
function prepareGetGoods() {
  if (current_page.data.can_ajax) {
    current_page.data.can_ajax = false;
    // 关闭"没有更多了..."提示
    current_page.setData({
      is_more_goods: true
    })
    // 清空数组标志
    current_page.data.is_clear_list = true;
    // 返回顶部并开启加载动画
    current_page.setData({
      'scroll_goods_list.top': 0,
      is_hidden_top_loading: false
    })
    setTimeout(function() {
      getGoods(parseGoodsList);
    }, 400)
  }
}

// 关闭动画
function closeLoading() {
  current_page.setData({
    is_hidden_loading: true,
    is_hidden_top_loading: true
  })
}