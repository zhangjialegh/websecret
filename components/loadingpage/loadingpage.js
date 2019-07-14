// components/loadingpage/loadingpage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLoading: false
  },

  // 组件的生命周期
  // lifetimes: {
  //   attached() {
  //     this.setData({
  //       isLoading: this.properties['show']
  //     })
  //   }
  // },

  // 数据监听器
  observers: {
    'show': function (show) {
      this.setData({
        isLoading: show
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
