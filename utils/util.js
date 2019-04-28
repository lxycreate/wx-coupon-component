// 通用方法
// 获取商品数据
function getGoods(obj, callback) {
  wx.request({
    url: 'http://localhost:8088/getGoods',
    data: obj.data.goods_obj,
    method: 'get',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      obj.data.error_count = 0;
      if (res != null && res.data != null) {
        callback(obj, res.data);
      }
    },
    fail: function(res) {
      obj.data.error_count++;
      // 错误三次就无法请求
      if (obj.data.error_count >= 3) {
        obj.data.can_ajax = false;
      }
      console.log('请求错误' + res);
      closeLoading(obj);
    }
  })
}

// 解析商品数据
function parseGoodsList(obj, data) {
  if (data.goods != null && data.goods.length > 0) {
    obj.setData({
      goods_list: obj.data.goods_list.concat(data.goods),
      is_hidden_loading: true
    })
  }
  // 显示没有更多商品
  if (data.goods == null || data.goods.length < obj.data.goods_obj['page_size']) {
    obj.setData({
      is_more_goods: false
    })
  }
  obj.data.can_ajax = true; // 可以进行下一次ajax请求
}

// 关闭动画
function closeLoading(obj) {
  obj.setData({
    is_hidden_loading: true
  })
}

module.exports = {
  getGoods: getGoods,
  parseGoodsList: parseGoodsList,
  closeLoading: closeLoading
}