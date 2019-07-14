//app.js
const config = require('./utils/config.js')
const { queryString } = require('./utils/util.js')
App({
  onLaunch: function (options) {
    // 记录进入小程序的参数
    this.globalData.system = wx.getSystemInfoSync()
    this.globalData.initOptions(options);
    this.globalData._loginToken = this.globalData.wxLogin(options);
  },
  globalData: {
    userInfo: null,
    accessToken: '',
    query: {},
    path: '',
    system: null,
    scene: '',
    config: config,
    initOptions: function (options) {
      const { query } = options
      this.path = options.path
      this.query = query
      this.scene = options.scene
    },
    wxLogin: function (options) { //登录逻辑
      const vx = this;
      const scene = options.scene
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            wx.request({
              url: config.BASE_URL + '/api/' + 'wechat/login',
              method: 'post',
              header: {
                'content-type': 'application/json'
              },
              data: {
                code: res.code,
                scene: scene
              },
              success: function (res) {
                if (res.data.success) {
                  vx.userInfo = res.data;
                  vx.accessToken = res.data.third_session
                  wx.setStorageSync(config.STORAGE_KEY, res.data.third_session)
                  if (vx.loginCallback) {
                    Promise.resolve(vx.loginCallback(res.data.third_session))
                  }
                  resolve(vx.accessToken);
                } else {
                  getApp().wxToast({
                    icon: 'none',
                    title: '登录失败',
                    duration: 1500
                  });
                  reject();
                }
              }
            })
          }
        })
      })
    },
    wxAll: function (objs) {  //Promise.all
      const vx = getApp().globalData
      const token = vx.accessToken || null
      // 如果还未登录，需要登录后再执行
      if (token) {
        return Promise.all(objs.map(item => {
          return getApp().globalData.wxFetch(item)
        }))
      } else {
        return new Promise((resolve, reject) => {
          vx.loginCallback = function (token) {
            Promise.all(objs.map(item => {
              return getApp().globalData.wxFetch(item, token)
            })).then((res) => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        })
      }

    },
    wxFetch: function (obj, accesstoken) { //封装的请求接口
      const vx = getApp().globalData
      const token = vx.accessToken || accesstoken || wx.getStorageSync(config.STORAGE_KEY) || null;
      return new Promise((resolve, reject) => {
        wx.request({
          url: config.BASE_URL + '/api/' + obj.url,
          method: obj.isGet ? 'get' : 'post',
          header: {
            'content-type': 'application/json',
            'Authorization': obj.token
              ? obj.token
              : token
                ? token
                : null
          },
          data: obj.data,
          success: function (result) {
            if (result.statusCode == 200) {
              if (result.data.success) {
                resolve(result.data)
              } else {
                vx.reqOperation(obj, result.data)
                resolve(result.data)
              }
            } else {
              vx.reqOperation(obj, result.data)
              reject(result)
            };
          },
          fail: function (err) {
            vx.reqOperation(obj)
            reject(err)
          },
          complete: function () {
            getApp().stopPullDown()
          }
        })
      })
    },
    wxRequest: function (obj) {
      const vx = getApp().globalData
      const token = vx.accessToken || null
      // 如果还未登录，需要登录后再执行
      if (token) {
        return new Promise((resolve, reject) => {
          vx.wxFetch(obj)
            .then((res) => {
              resolve(res)
            })
            .catch(err => {
              reject(err)
            })
        })
      } else {
        return new Promise((resolve, reject) => {
          vx.loginCallback = function (token) {
            vx.wxFetch(obj, token)
              .then((res) => {
                resolve(res)
              }).catch(err => {
                reject(err)
              })
          }
        })
      }
    },
    reqOperation: function (obj, data) {
      wx.showModal({
        content: data.message || '网络不给力，点击确定重试',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#28D4A1'
      })
    }
  },
  wxModal: function ({
    title = '',
    content,
    showCancel = false,
    confirmText = '知道了',
    confirm,
    cancel,
    complete
  }) {
    wx.showModal({
      title: title,
      content: content,
      confirmText,
      showCancel,
      confirmColor: '#28D4A1',
      success(res) {
        if (res.confirm) {
          confirm && confirm()
        } else if (res.cancel) {
          cancel && cancel()
        }
      },
      complete() {
        complete && complete()
      }
    })
  },
  wxToast: function ({
    title = '',
    icon = 'success',
    image = '',
    duration = 1000,
    mask = false,
    success,
    fail,
    complete
  }) {
    wx.showToast({
      title,
      icon,
      image,
      duration,
      mask,
      success() {
        success && success()
      },
      fail() {
        fail && fail()
      },
      complete() {
        complete && complete()
      }
    })
  },
  // showBarLoading: function() {
  //   getApp().showNavigationBarLoading && getApp().showNavigationBarLoading()
  // },
  // hideBarLoading: function() {
  //   getApp().hideNavigationBarLoading && getApp().hideNavigationBarLoading()
  // },
  onPullDownRefresh: function () {
    // this.showBarLoading()
    wx.showNavigationBarLoading()
  },
  stopPullDown: function () {
    // this.hideBarLoading()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  }
})