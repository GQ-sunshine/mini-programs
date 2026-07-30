const app = getApp()
import { i18n,lang } from '../../../../i18n/lang'
Page({
  onShareAppMessage() {
    return {
      path: 'packageAPI/pages/api/login/login'
    }
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: i18n['login3']
    })
    this.setData({
      t: i18n,
      lang
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
  },
  data: {
    theme: 'light',
    code: ''
  },
  login() {
    const that = this
    wx.login({
      success(res) {
        console.log('======res', res)
        app.globalData.hasLogin = true
        that.setData({
          hasLogin: true,
          code: res.code
        })
      },
      fail: err => {
        console.log('login err', err)
      }
    })
  }
})
