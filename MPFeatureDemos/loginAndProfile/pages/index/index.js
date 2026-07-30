// pages/minePage/minePage.js
var app = getApp();
var isLoginSuccess = false;
const defaultAvatar = '../../assets/ic_mine_normal.png';

Page({
     data: {
          userHead: defaultAvatar,
          userTitle: 'Tap to log in',
          phoneNumber: '',
          emailAddress: '',
          appid: 'mpyzxqg4o9yzw5px',
          baseUrl: 'https://miniprogram.tcsas-superapp.com',   // // Mini program backend service address
     },

     bindchange(e) {
       console.log('nickNameChange===', e.detail.value)
     },

     onChooseAvatar(e) {
          console.log('onChooseAvatar===', e)
          const { avatarUrl } = e.detail 
          if(avatarUrl) {
            this.setData({
               userHead: avatarUrl,
            })
            app.globalData.userInfo =  Object.assign(app.globalData.userInfo || {}, {avatarUrl})
          }
     },

    loginTap: function () {
      wx.showLoading();
      wx.login({
        success: (res) => {
          console.log('wx.login success===', res)
          if (res.code) {
            wx.request({
              url: `${this.data.baseUrl}/getUserInfo`,  // Customized mini program backend interface for obtaining user login information
              method: "POST",
              data: {
                appid: this.data.appid,
                code: res.code
              },
              success: (res) => {
                wx.hideLoading()
                console.log('wx.request success===', res)
                const { code = -1, data = {} } = res?.data || {};
                if (code === 200) {
                  wx.showToast({
                      title: 'Logged in successfully',
                      icon: 'success',
                      duration: 500
                  })
                  this.setData({
                      userTitle: data.userName
                  })
                  app.globalData.userInfo = {
                    nickName: data.userName,
                    userId: data.id,
                    token: data.token
                  }
                } else {
                  const msg = res?.data?.data?.msg || '/getUserInfo request fail'
                  const errcode = res?.data?.data?.errcode || code
                  console.log('/getUserInfo request fail', res)
                  wx.showModal({
                    title: 'Login failed',
                    confirmText: 'Confirm',
                    content: `/getUserInfo fail:${msg}[code:${errcode}]`,
                    showCancel: false
                  })
                }
              },
              fail: (err) => {
                wx.hideLoading()
                console.log('wx.request fail', err)
                wx.showModal({
                  title: 'Login failed',
                  confirmText: 'Confirm',
                  content: err.errMsg,
                  showCancel: false
                })
              },
            })
          } else {
            wx.hideLoading()
            console.log('wx.login does not return code', res)
            wx.showModal({
              title: 'Login failed',
              confirmText: 'Confirm',
              content: res.errMsg,
              showCancel: false
            })
          }
        },
        fail: (err) => {
          wx.hideLoading()
          console.log('wx.login fail===', err)
          wx.showModal({
            title: 'Login failed',
            confirmText: 'Confirm',
            content: err.errMsg,
            showCancel: false
          })
        }
      })
    },

     clickGetPhoneNumber() {
          wx.showLoading();
     },

     clickGetEmailAddress() {
          wx.showLoading();
     },

    handleGetPhoneNumber(e) {
      console.log('getPhoneNumber success===', e.detail)
      const { code, errMsg } = e.detail
      if (!app.globalData.userInfo) {
        wx.hideLoading()
        wx.showModal({
          title: 'Please log in first',
          confirmText: 'Confirm',
          showCancel: false
        })
        return
      }
      if (code) {
        wx.request({
          url: `${this.data.baseUrl}/getUserPhone`,  // Customized mini program backend interface for obtaining phone number
          method: "POST",
          data: {
            appid: this.data.appid,
            code,
            token: app.globalData.userInfo.token
          },
          success: (res) => {
            wx.hideLoading()
            console.log('getPhoneNumber request success===', res)
            const { code = -1, data = {} } = res?.data || {};
            if (code === 200) {
              this.setData({
                phoneNumber: data?.phoneNumber
              })
            } else {
              const msg = res?.data?.data?.msg || '/getPhoneNumber request fail'
              const errcode = res?.data?.data?.errcode || code
              console.log('/getPhoneNumber request fail', res)
              wx.showModal({
                title: 'Failed to retrieve phone number',
                confirmText: 'Confirm',
                content: `/getPhoneNumber fail:${msg}[code:${errcode}]`,
                showCancel: false
              })
            }
          },
          fail: (err) => {
            wx.hideLoading()
            console.log('wx.request fail', err)
            wx.showModal({
              title: 'wx.request fail',
              confirmText: 'Confirm',
              content: err.errMsg,
              showCancel: false
            })
          },
        })
      } else {
        wx.hideLoading()
        console.log('getPhoneNumber does not return code', e.detail)
        wx.showModal({
          title: 'getPhoneNumber fail',
          confirmText: 'Confirm',
          content: errMsg,
          showCancel: false
        })
      }
    },

    handleGetEmailAddress(e) {
      console.log('getEmailAddress success===', e.detail)
      const { code, errMsg } = e.detail
      if (code) {
        wx.request({
          url: `${this.data.baseUrl}/getUserEmailDirect`,  // Customized mini program backend interface for obtaining email
          method: "POST",
          data: {
            appid: this.data.appid,
            code
          },
          success: (res) => {
            wx.hideLoading()
            console.log('getEmailAddress request success===', res)
            const { code = -1, data = {} } = res?.data || {};
            if (code === 200) {
              this.setData({
                emailAddress: data?.emailAddress
              })
            } else {
              const msg = res?.data?.data?.msg || '/getEmailAddress request fail'
              const errcode = res?.data?.data?.errcode || code
              console.log('/getEmailAddress request fail', res)
              wx.showModal({
                title: 'Failed to retrieve email address',
                confirmText: 'Confirm',
                content: `/getEmailAddress fail:${msg}[code:${errcode}]`,
                showCancel: false
              })
            }
          },
          fail: (err) => {
            wx.hideLoading()
            console.log('wx.request fail', err)
            wx.showModal({
              title: 'wx.request fail',
              confirmText: 'Confirm',
              content: err.errMsg,
              showCancel: false
            })
          },
        })
      } else {
        wx.hideLoading()
        console.log('getEmailAddress does not return code', e.detail)
        wx.showModal({
          title: 'getEmailAddress fail',
          confirmText: 'Confirm',
          content: errMsg,
          showCancel: false
        })
      }
    },

    checkSession: function() {
      wx.checkSession({
        success () {
          wx.showModal({
            title: 'checkSession',
            confirmText: 'Confirm',
            content: 'session_key has not expired',
            showCancel: false,
          })
        },
        fail: () => {
          wx.showModal({
            title: 'checkSession',
            confirmText: 'Confirm',
            content: 'session_key has expired, please log in again',
            showCancel: false,
            success: () => {
              this.setData({
                userHead: defaultAvatar,
                userTitle: 'Tap to log in',
                phoneNumber: '',
                emailAddress: ''
              })
              app.globalData.userInfo = null
            }
          })
        }
      })
    }
})