import{ i18n } from '../../../../i18n/lang';
const app = getApp()

Page({
  data: {
    avatarUrl: '../../../resources/pic/defaultAvatar.png',
    theme: wx.getSystemInfoSync().theme,
  },
  onLoad() {
    this.setData({
      t: i18n
    })
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  }
})
