// pages/addinfo/addinfo.js
const gd = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webname: '',
    name: '',
    remark: ''
  },

  isValid(val) {
    return val && val.trim()
  },

  handleInput(e) {
    const { value } = e.target.dataset
    this.setData({
      [value]: e.detail.value
    })
  },
  handleFocus(e) {
    const { value } = e.target.dataset
    this.setData({
      ['active' + value]: value
    })
  },
  handleBlur(e) {
    const { value } = e.target.dataset
    this.setData({
      ['active' + value]: ''
    })
  },
  handleRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  saveData() {
    const { name, remark, webname } = this.data
    if (!this.isValid(webname)) {
      wx.showToast({
        icon: 'none',
        title: '网站名不能为空',
        duration: 1500
      })
    } else if (!this.isValid(name)) {
      wx.showToast({
        icon: 'none',
        title: '登录名不能为空',
        duration: 1500
      })
    } else {
      // TODO: 提交更新
      gd.wxRequest({
        url: 'cards/insert',
        isGet: false,
        data: {
          webname,
          account: name,
          remark
        }
      }).then(res => {
        if(res.success) {
          const pages = getCurrentPages()
          const PrePage = pages[pages.length - 2]
          PrePage.getAllCards()
          wx.navigateBack()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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