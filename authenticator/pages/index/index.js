//index.js
//get application instance
const app = getApp();
const { randomColor } = require('../../utils/util');

Page({
  data: {
    accountList: [],
    focus: false
  },

  onShow() {
    console.log('=====stop');
    try {
      wx.stopPullDownRefresh();
    } catch(err) {
      console.log(err);
    }
    
    this.getAuthList();
  },

  onInputFocus() {
    wx.navigateTo({
      url: '/pages/searchPage/searchPage'
    });
  },

  scanCode() {
    wx.scanCode({
      scanType: 'qrCode',
      success: ({ result, scanType }) => {
        this.bindAuth(result);
      },
      fail: (err) => {
        console.log('scanCode', err);
        wx.showModal({
          title: 'scanCode failed',
          content: err.errMsg
        });
      }
    });
  },

  bindAuth(scanUrl) {
    wx.request({
      url: `${app.globalData.url}/bindAuth`,
      method: "POST",
      data: {
        scanUrl,
        token: app.globalData.userInfo?.token,
        appid: app.globalData.appId
      },
      success: ({ data }) => {
        const { code, data: resData } = data;
        if(code === 200) {
          wx.navigateTo({
            url: `/pages/detail/detail?id=${resData.id}`
          });
        }  else if(code === 401 || code === 402) {
          wx.showToast({
              title: 'Login expired',
              icon: 'none'
          });
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else {
          wx.showModal({
            title: 'request failed',
            confirmText: 'confirm',
            content: JSON.stringify(resData),
            showCancel: false
          });
        }
      },
      fail: (err) => {
          console.log('bindAuth request fail', err)
          wx.showModal({
              title: 'request failed',
              confirmText: 'confirm',
              content: err.errMsg,
              showCancel: false
          })
      },
    })
  },

  getAuthList() {
     wx.request({
      url: `${app.globalData.url}/getAuthList`,
      method: "POST",
      data: {
        token: app.globalData.userInfo?.token,
        appid: app.globalData.appId
      },
      success: ({ data }) => {
        const { code, data: resData } = data;
        if(code === 200) {
          console.log('=====getAuthList data', resData);
          const list = resData.list?.map(item => {
            return {
              ...item,
              name: decodeURIComponent(item.title),
              description: decodeURIComponent(item.user),
            }
          })
          this.setData({
            accountList: list || [],
          });
        } else if(code === 401 || code === 402) {
          wx.showToast({
              title: 'Login expired',
              icon: 'none'
          });
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else {
          console.log('=====getAuthList fail', resData, code);
          // wx.showModal({
          //   title: 'request failed',
          //   confirmText: 'confirm',
          //   content: JSON.stringify(resData),
          //   showCancel: false
          // });
        }
      },
      fail: (err) => {
          console.log('getAuthList request fail', err)
          wx.showModal({
              title: 'request failed',
              confirmText: 'confirm',
              content: err.errMsg,
              showCancel: false
          });
      },
    })
  },
})
