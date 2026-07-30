// pages/setting/setting.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountId: null,
    name: '',
    newName: '',
    description: '',
    color: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
     const { info = `{}` } = query;
     const accountInfo = JSON.parse(info);

     this.setData({
       accountId: accountInfo.accountId,
       name: accountInfo.name,
       description: accountInfo.description,
       color: accountInfo.color
     });
    console.log('=====options', accountInfo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  onAccountChange({ detail }) {
    const { value } = detail;

    this.setData({
      newName: value
    });
    console.log('====deatil', detail);
  },

  deleteAccount() {
    console.log('===deleteAccount', this.data.accountId);
    wx.showModal({
      title: 'Account Deletion Confirmation',
      content: 'Confirm whether to delete this account.',
      success: (res) => {
        if(res.confirm) {
          wx.request({
            url: `${app.globalData.url}/deleteAuthCode`,
            method: "POST",
            data: {
              token: app.globalData.userInfo?.token,
              appid: app.globalData.appId,
              id: this.data.accountId
            },
            success: ({ data }) => {
              const { code, data: resData } = data;
              if(code === 200) {
                wx.showToast({
                  title: 'Account deleted successfully.'
                });

                wx.reLaunch({
                  url: `/pages/index/index`
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
                wx.showModal({
                  title: 'deleteAuthCode failed',
                  confirmText: 'confirm',
                  content: JSON.stringify(resData),
                  showCancel: false
                });
              }
            },
            fail: (err) => {
                console.log('deleteAuthCode request fail', err)
                wx.showModal({
                    title: 'deleteAuthCode failed',
                    confirmText: 'confirm',
                    content: err.errMsg,
                    showCancel: false
                })
            },
          })
        }
        
      }
    })
    
  },

  saveAccount() {
     wx.request({
      url: `${app.globalData.url}/updateAuthTitle`,
      method: "POST",
      data: {
        token: app.globalData.userInfo?.token,
        appid: app.globalData.appId,
        id: this.data.accountId,
        title: this.data.newName
      },
      success: ({ data }) => {
        const { code, data: resData } = data;
        if(code === 200) {
          wx.showToast({
            title: 'Account update successfully.'
          });

          this.setData({
            name: this.data.newName
          });
        }  else if(code === 401 || code === 402 || code === 500) {
          wx.showToast({
              title: 'Login expired',
              icon: 'none'
          });
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else {
          wx.showModal({
            title: 'updateAccount failed',
            confirmText: 'confirm',
            content: JSON.stringify(resData),
            showCancel: false
          });
        }
      },
      fail: (err) => {
          console.log('updateAccount request fail', err)
          wx.showModal({
              title: 'updateAccount failed',
              confirmText: 'confirm',
              content: err.errMsg,
              showCancel: false
          })
      },
    })
  }
})