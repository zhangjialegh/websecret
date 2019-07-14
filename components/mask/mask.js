// components/mask/mask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    opacity: {
      type: Number,
      value: 0.3
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  // 组件生命周期
  detached() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickoutside(e) {
      this.triggerEvent('outside');
    },
    stopBubble: function () {
      return;
    }
  }
})
