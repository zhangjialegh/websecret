// components/moview/moview.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    taplock: false
  },
  attached() {
    const closeMove = wx.getStorageSync('closeMove')
    console.log(closeMove,'gggg')
    if(closeMove) return
    this.setData({
      show: true
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goAbout() {
      if (this.data.taplock) {
        this.setData({
          taplock: false
        })
        return
      }
      wx.navigateTo({
        url: '/pages/about/about'
      })
    },
    handlelongtap() {
      const vx = this
      this.setData({
        taplock: true
      })
      wx.showActionSheet({
        itemList: ['删除'],
        success(res) {
          if (res.tapIndex == 0) {
            vx.deleteCard()
          }
        }
      })
    },
    deleteCard() {
      this.setData({
        show: false
      })
      wx.setStorage({
        key: 'closeMove',
        data: true
      })
    }
  }
})
