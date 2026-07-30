// pages/userInfo/userInfo.js
import { i18n } from '../../i18n/lang';
import Config from '../../utils/configData';
var app = getApp();

Page({

     /**
      * 页面的初始数据
      */
     data: {
          userHead: '',
          userHeadBase64: '',
          nickName: '',
          phoneNumber: '',
          emailAddress: '',
          isLoading: false,
          isLoadingReset: false
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          wx.setNavigationBarTitle({
               title: i18n['个人信息']
          })
          this.setData({
               i18n
          })
     },

     initLoginMsg: function () {
          if (app.globalData.userInfo) {
               this.setData({
                    userHead: app.globalData.userInfo.avatarUrl,
                    nickName: app.globalData.userInfo.nickName,
                    phoneNumber: app.globalData.userInfo.phoneNumber || '',
                    emailAddress: app.globalData.userInfo.emailAddress || ''
               })
          }
     },

     onChooseAvatar(e) {
        console.log('onChooseAvatar===', e)
        const { avatarUrl } = e.detail
        if(avatarUrl.includes('/tmp')) {
          wx.compressImage({
            src: avatarUrl,
            quality: 5,
            success: (compressRes) => {
              const fs = wx.getFileSystemManager();
              fs.readFile({
                filePath: compressRes.tempFilePath,
                encoding: 'base64',
                success: (data) => {
                  console.log('base64===', data.data.length)
                  this.setData({
                    userHeadBase64: 'data:image/png;base64,' + data.data,
                    userHead: 'data:image/png;base64,' + data.data
                  })
                },
                fail: (err) => {
                  console.error('readFile error===', err);
                }
              });
            },
            fail: (err) => {
              console.error('compressImage error===', err);
            }
          });
        }
        if(avatarUrl) {
          this.setData({
            userHead: avatarUrl,
          })
        }
     },

     nickNameChange(e) {
       console.log('nickNameChange===', e.detail.value)
       this.setData({
         nickName: e.detail.value
       })
     },

     clickGetEmailAddress() {
          wx.showLoading();
     },

     clickGetPhoneNumber() {
          wx.showLoading();
     },

      handleGetPhoneNumber(e) {
        console.log('getPhoneNumber success===', e.detail)
        const { code, errMsg, errno } = e.detail
        if (code) {
          //发起网络请求
          wx.request({
            url: `${Config.BASEURL}/getUserPhone`,
            method: "POST",
            data: {
              appid: Config.APPID,
              code,
              token: app.globalData.userInfo.token
            },
            success: (res) => {
              wx.hideLoading()
              console.log('getPhoneNumber request success===', res)
              const { code = -1, data = {}, msg } = res?.data || {};
              if (code === 200) { // 换取手机号信息成功
                this.setData({
                  phoneNumber: data?.phoneNumber
                })
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
              wx.hideLoading()
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
          wx.hideLoading()
          console.log('getPhoneNumber does not return code', e.detail)
          wx.showModal({
            title: 'getPhoneNumber fail',
            confirmText: i18n['确定'],
            content: errno === '200000' ? i18n['请确认在APP中已经设置了手机号码'] : `${errno}: ${errMsg}`,
            showCancel: false
          })
        }
    },

     handleGetEmailAddress(e) {
      console.log('getEmailAddress success===', e.detail)
      const { code, errMsg, errno } = e.detail
      if (code) {
        //发起网络请求
        wx.request({
          url: `${Config.BASEURL}/getUserEmailDirect`,
          method: "POST",
          data: {
            appid: Config.APPID,
            code
          },
          success: (res) => {
            wx.hideLoading()
            console.log('getEmailAddress request success===', res)
            const { code = -1, data = {}, msg } = res?.data || {};
            if (code === 200) { // 换取邮箱信息成功
              this.setData({
                emailAddress: data?.emailAddress
              })
            } else {
              const msg = res?.data?.data?.msg || res?.data || '/getEmailAddress request fail'
              const errcode = res?.data?.data?.errcode || code
              console.log('/getEmailAddress request fail', res)
              wx.showModal({
                title: i18n['获取邮箱地址失败'],
                confirmText: i18n['确定'],
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
              confirmText: i18n['确定'],
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
          confirmText: i18n['确定'],
          content: errno === '200000' ? i18n['请确认在APP中已经设置了邮箱'] : `${errno}: ${errMsg}`,
          showCancel: false
        })
      }
    },

    handleReset() {
      this.setData({
          isLoadingReset: true,
          userHead: `${Config.BASEURL}/default.png`,
          userHeadBase64: '',
          nickName: app.globalData.userInfo.account,
          phoneNumber: '',
          emailAddress: '',
      })
      this.updateUserInfo('isLoadingReset')
    },

     handleSave() {
          this.setData({
               isLoading: true
          })
          this.updateUserInfo('isLoading')
     },

     updateUserInfo(loadingName) {
       wx.request({
            url: `${Config.BASEURL}/updateUserInfo`,
            method: "POST",
            data: {
              appid: Config.APPID,
              token: app.globalData.userInfo.token,
              userInfo: {
                   avatarUrl: this.data.userHead,
                   nickName: this.data.nickName,
                   phone: this.data.phoneNumber,
                   email: this.data.emailAddress
              }
            },
            success: (res) => {
              this.setData({
                [loadingName]: false
              })
              console.log('wx.request success===', res)
              const { code = -1, data = {} } = res?.data || {};
              if (code === 200) { // 更新用户信息成功
                wx.showToast({
                    title: i18n['更新用户信息成功'],
                    icon: 'success',
                    duration: 500
                })
                app.globalData.userInfo =  Object.assign(app.globalData.userInfo || {}, {
                    avatarUrl: this.data.userHead,
                    nickName: this.data.nickName,
                    phoneNumber: this.data.phoneNumber,
                    emailAddress: this.data.emailAddress
                  })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 500)
              } else {
                const msg = res?.data?.data?.msg || res?.data || '/updateUserInfo request fail'
                const errcode = res?.data?.data?.errcode || code
                console.log('/updateUserInfo request fail', res)
                wx.showModal({
                  title: i18n['更新用户信息失败'],
                  confirmText: i18n['确定'],
                  content: `/updateUserInfo fail:${msg}[code:${errcode}]`,
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
                title: i18n['更新用户信息失败'],
                confirmText: i18n['确定'],
                content: err.errMsg,
                showCancel: false
              })
            },
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
          if(!this.data.userHeadBase64) {
            this.initLoginMsg();
          }
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