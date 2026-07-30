Page({
  data: {
    webURL: 'file://distH5/index.html'
  },
  bindevent: function(e) {
    const { data } = e.detail
    console.log('Received a message from the offline H5===', data)
    // Send a message to H5
    wx.sendWebviewEvent({
      message: `I'm miniProgram, I received: ${data.message}`
    })
  }
})
