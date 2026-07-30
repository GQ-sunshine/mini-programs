// pages/searchPage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    filterList: [],
    accountList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.getAuthList();
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

  onInput({ detail }) {
    const { value } = detail.detail;

    if(value.length) {
      this.setData({
        keyword: value
      });

      const list = this.data.accountList?.filter(item => {
        const { title, user } = item;
        return decodeURIComponent(title).includes(value) || decodeURIComponent(user).includes(value)
      });

      if (list?.length) {
        this.setData({
          filterList: list
        });
      }
    } else {
      this.setData({
        filterList: []
      });
    }
  },

  onClear() {
    this.setData({
      keyword: '',
      filterList: []
    });
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
          wx.showModal({
            title: 'request failed',
            confirmText: 'confirm',
            content: JSON.stringify(resData),
            showCancel: false
          });
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