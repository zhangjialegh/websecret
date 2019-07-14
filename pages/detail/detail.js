// pages/detail.js
const gd = getApp().globalData
const { generateCode } = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editing: false,
    name: '',
    recordPwd: '',
    diffCode: '',
    genePwd: '',
    remark: '',
    pwdShow: false,
    id: null,
    cardInfo: null,
    color: '',
    isLoading: true
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
  handleRemarkInput(e) {
    this.setData({
      remark: e.detail.value
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
  togglePwdShow() {
    this.setData({
      pwdShow: !this.data.pwdShow
    })
  },
  toggleEdit() {
    const { editing, name, remark, id } = this.data
    const vx = this
    if(!editing) {
      this.setData({
        editing: true
      })
    } else {
      if(!this.isValid(name)) {
        wx.showToast({
          title: '登录名不能为空',
          duration: 1500
        })
      } else {
        // TODO: 提交更新
        gd.wxRequest({
          url: 'card/update',
          isGet: false,
          data: {
            id,
            account: name,
            remark
          }
        }).then(res=>{
          if(res.success) {
            wx.showToast({
              title: '信息更新成功'
            })
            vx.setData({
              editing: false
            })
          }
        })
      }
    }
  },

  handleNameCopy() {
    wx.setClipboardData({
      data: this.data.name,
      success(res){
        wx.showToast({
          title: '登录名复制成功',
          icon:'success'
        })
      }
    })
  },
  handlePwdCopy() {
    wx.setClipboardData({
      data: this.data.genePwd,
      success(res) {
        wx.showToast({
          title: '密码复制成功',
          icon: 'success'
        })
      }
    })
  },
  // 生成密码
  generate() {
    const { recordPwd, diffCode } = this.data
    if(!this.isValid(recordPwd)) {
      wx.showToast({
        title: '记忆密码不能为空',
        icon: 'none'
      })
    } else if (!this.isValid(diffCode)) {
      wx.showToast({
        title: '区分代号不能为空',
        icon: 'none'
      })
    } else {
      const pwd = generateCode(diffCode, recordPwd)
      this.setData({
        genePwd: pwd
      })
    }
  },

  // 动态设置背景色
  daynamicBgs() {
    const colors = gd.config.COLORS_PICK
    const color = colors[Math.round(Math.random() * 9)]
    console.log(color,'color')
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })
    this.setData({
      color
    })
  },

  // 获取卡片详情
  getCardDetail(id) {
    const vx = this
    this.setData({
      isLoading: true
    })
    gd.wxRequest({
      url:'card/detail',
      isGet: true,
      data: {
        id
      }
    }).then(res=>{
      vx.setData({
        isLoading: false,
        cardInfo: res.data,
        name: res.data.account,
        remark: res.data.remark
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.daynamicBgs()
    this.getCardDetail(options.id)
    this.setData({
      id: options.id
    })
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