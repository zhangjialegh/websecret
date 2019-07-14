//index.js
//获取应用实例
const app = getApp()
const gd = app.globalData
const { smartTime } = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    prevent: false,
    cardLists: [],
    isLoading: true,
    taplock: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  handleCopy() {

  },
  getAllCards() {
    const vx = this
    this.setData({
      isLoading: true
    })
    gd.wxRequest({
      url: 'cards/list',
      isGet: true
    }).then(res=>{
      vx.setData({
        isLoading: false,
        cardLists: res.data.map(item => {
          item['updatedAt'] = smartTime(item['updatedAt'])
          return item
        })
      })
    })
  },
  goAddCard(id) {
    wx.navigateTo({
      url: '/pages/addinfo/addinfo',
    })
  },

  // 点击卡片去详情页
  goCardDetail(e) {
    if (this.data.taplock) {
      this.setData({
        taplock: false
      })
      return
    }
    const id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },

  // 长按卡片操作
  handleMoreOpt(e) {
    this.setData({
      taplock: true
    })
    const id = e.target.dataset.id
    const vx = this
    wx.showActionSheet({
      itemList: ['删除'],
      success(res) {
        if (res.tapIndex == 0) {
          vx.deleteCard(id)
        }
      }
    })
  },

  // 删除卡片
  deleteCard(id) {
    const vx = this
    gd.wxRequest({
      url: 'card/delete',
      isGet: true,
      data: {
        id
      }
    }).then(res=>{
      vx.setData({
        cardLists: res.data.map(item=>{
          item['updatedAt'] = smartTime(item['updatedAt'])
          return item
        })
      })
    })
  },

  // 初始化用户信息
  initUserInfo () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onLoad: function () {
    this.initUserInfo()
  },
  onShow: function () {
    this.getAllCards()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
