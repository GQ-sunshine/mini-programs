Page({
  data: {
  },
  // event handler function
  navigateToOnlineH5: function () {
    wx.navigateTo({
      url: '/pages/onlineH5/onlineH5'
    })
  },
  navigateToOfflineH5: function () {
    wx.navigateTo({
      url: '/pages/offlineH5/offlineH5'
    })
  },
})
