import { log } from '../../../../util/util'
import { webViewUrl } from '../../../../config';

Page({
  data: {
    theme: 'light',
    // src: 'https://miniprogram.tcsas-superapp.com/h5/index.html#/',
    // src: 'https://trtc.io/exhibition/details?scene=education&from=app'
    // src: 'https://game.jolibox.com/game?gameId=G32004080378888813940087643071&orientation=VERTICAL&joliSource=eyJjaGFubmVsIjoiSzNYM0MifQ.e30.4z6y69VnEboWvnfwFC7YnWyXU0OPJtsZzBC3x-b2OmQ'
    // src: 'https://drive.google.com/file/d/19vAiehxZjQP6KitCW8jwdew1eZZqUqxE/view?usp=drive_link'
    src: "http://10.7.140.45:8080",
  },
  onShareAppMessage() {
    return {
      title: 'webview',
      path: 'packageComponent/pages/open/web-view/web-view'
    }
  },
  onLoad(opt) {
    // console.log("parameter---------------", opt)
    // this.setData({
    //   src: webViewUrl
    // })
    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  },
  webviewLoad(e) {
    log('-------webviewLoad', e)
  },
  webviewError(e) {
    log('-------webviewError', e);
    wx.navigateBack({
      delta: -1,
    })
  }
})
