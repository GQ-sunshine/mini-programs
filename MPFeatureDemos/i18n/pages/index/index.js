//index.js
import { i18n, getLang, changeLang } from '../../i18n/index';

//get application instance
const app = getApp()

Page({
  onLoad() {
    this.setData({
      i18n
    })
  },
  data: {
    msg: '',
    lang: getLang()
  },
  updateLang(lang) {
    changeLang(lang)
    this.setData({
      lang,
      i18n
    })
  },
  switchLanguage() {
    this.updateLang(this.data.lang === 'en_US' ? 'id_ID' : 'en_US')
  },
  showMessage() {
    const { i18n, lang } = this.data;
    wx.showToast({
      title: `${i18n['current Language']}: ${lang}`,
      icon: 'none'
    })
  }
})
