// pages/login/login.js
import { i18n } from '../../i18n/lang';
import Config from '../../utils/configData';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nextBtnBc: '#4a4c5b',
    isLoading: false,
    isLoadingPhone: false,
    i18n
  },
  onLoad() {
    this.setData({
      i18n
    })
  },
  handleLogin: function() {
    this.setData({
      isLoading: true
    })
    this.login('isLoading')
  },
  // 登录
  login: function (loadingName) {
    wx.login({
      success: (res) => {
        console.log('wx.login success===', res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: `${Config.BASEURL}/getUserInfo`,
            method: "POST",
            data: {
              appid: Config.APPID,
              code: res.code
            },
            success: (res) => {
              this.setData({
                [loadingName]: false
              })
              console.log('wx.request success===', res)
              const { code = -1, data = {} } = res?.data || {};
              if (code === 200) { // 换取用户信息成功
                wx.showToast({
                    title: i18n['登录成功'],
                    icon: 'success',
                    duration: 500
                })
                app.globalData.userInfo = {
                  ...app.globalData.userInfo,
                  avatarUrl: data.avatarUrl || '../../res/images/avatar2.png',
                  account: data.account,
                  nickName: data.userName,
                  id: data.id,
                  token: data.token,
                  phoneNumber: data.phone || app.globalData?.userInfo?.phoneNumber || '',
                  emailAddress: data.email
                }
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 500)
              } else {
                const msg = res?.data?.data?.msg || '/getUserInfo request fail'
                const errcode = res?.data?.data?.errcode || code
                console.log('/getUserInfo request fail', res)
                wx.showModal({
                  title: i18n['登录失败'],
                  confirmText: i18n['确定'],
                  content: `/getUserInfo fail:${msg}[code:${errcode}]`,
                  showCancel: false
                })
              }
            },
            fail: (err) => {
              this.setData({
                [loadingName]: false
              })
              console.log('wx.request fail', err)
              wx.showModal({
                title: i18n['登录失败'],
                confirmText: i18n['确定'],
                content: err.errMsg,
                showCancel: false
              })
            },
          })
        } else {
          this.setData({
            [loadingName]: false
          })
          console.log('wx.login does not return code', res)
          wx.showModal({
            title: i18n['登录失败'],
            confirmText: i18n['确定'],
            content: res.errMsg,
            showCancel: false
          })
        }
      },
      fail: (err) => {
        this.setData({
          [loadingName]: false
        })
        console.log('wx.login fail===', err)
        wx.showModal({
          title: i18n['登录失败'],
          confirmText: i18n['确定'],
          content: err.errMsg,
          showCancel: false
        })
      }
    })
  },
  loginQuick() {
    this.setData({
      isLoadingPhone: true
    })
  },
  handleGetPhoneNumber(e) {
    console.log('getPhoneNumber success===', e.detail)
    const { code, errMsg } = e.detail
    if (code) {
        //发起网络请求
        wx.request({
          url: `${Config.BASEURL}/getUserPhoneDirect`,
          method: "POST",
          data: {
            appid: Config.APPID,
            code,
          },
          success: (res) => {
            console.log('getPhoneNumber request success===', res)
            const { code = -1, data = {}, msg } = res?.data || {};
            if (code === 200) { // 换取手机号信息成功
              app.globalData.userInfo = {
                phoneNumber: data?.phoneNumber,
                loginQuick: true
              }
              this.login('isLoadingPhone')
            } else {
              const msg = res?.data?.data?.msg || res?.data || '/getPhoneNumber request fail'
              const errcode = res?.data?.data?.errcode || code
              console.log('/getPhoneNumber request fail', res)
              wx.showModal({
                title: i18n['获取手机号码失败'],
                confirmText: i18n['确定'],
                content: `/getPhoneNumber fail:${msg}[code:${errcode}]`,
                showCancel: false
              })
            }
          },
          fail: (err) => {
            this.setData({
              isLoadingPhone: false
            })
            console.log('wx.request fail', err)
            wx.showModal({
              title: 'wx.request fail',
              confirmText: i18n['确定'],
              content: err.errMsg,
              showCancel: false
            })
          },
        })
      } else {
        this.setData({
          isLoadingPhone: false
        })
        console.log('getPhoneNumber does not return code', e.detail)
        wx.showModal({
          title: 'getPhoneNumber fail',
          confirmText: i18n['确定'],
          content: i18n['请确认在APP中已经设置了手机号码'],
          showCancel: false
        })
      }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
      return {
        title: `${i18n['欢迎来到Hotel，立即登录体验奢华住宿']}`,
        path: '/pages/login/login'
      }
    }
})