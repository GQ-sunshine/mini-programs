const app = getApp();

Page({
  data: {
    accountInfo: {
      // accountId: 1,
      // name: 'Google',
      // description: 'example@gmail.com'
    },
    progress: 0,
    timer: 30,
    code: '',
    interval: null,
  },
  
  onLoad: function (query) {
    const { id } = query;

    this.generateRandomCode(id);
  },

  onShow() {
    console.log('====this.accountInfo', this.data.accountInfo.accountId);
    if(this.data.accountInfo?.accountId) {
      clearInterval(this.data.interval);
      this.generateRandomCode(this.data.accountInfo?.accountId);
    }
  },

  onUnload() {
    clearInterval(this.data.interval);
    this.setData({
      interval: null
    });
  },

  generateRandomCode(id) {
    // const code = Math.floor(100000 + Math.random() * 900000).toString();
    // return code.slice(0, 3) + ' ' + code.slice(3);
    wx.request({
        url: `${app.globalData.url}/getAuthCode`,
        method: "POST",
        data: {
          id,
          token: app.globalData.userInfo?.token,
          appid: app.globalData.appId
        },
        success: ({ data }) => {
            const { code, data: resData } = data;
            console.log('===generateRandomCode code', code, resData);
          if(code === 200) {
            const { id, title, user, code, countDown, color } = resData || {};
            this.setData({
              accountInfo: {
                accountId: id,
                name: decodeURIComponent(title),
                description: decodeURIComponent(user),
                color
              },
              code: code.slice(0, 3) + ' ' + code.slice(3)
            });

            if (countDown) {
              this.setData({
                timer: countDown,
                progress: ((30 - countDown)/ 30) * 360
              });

              const interval = setInterval(() => {
                this.updateDetailTimer();
              }, 1000);

              this.setData({
                interval,
              })
            }
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

  updateDetailTimer() {
    console.log('=====updateDetailTimer', this.data.accountInfo.accountId);
      if (!this.data.accountInfo.accountId) return;
      
      let newTime = this.data.timer - 1;
      if (newTime <= 0) {
        clearInterval(this.data.interval);
        this.generateRandomCode(this.data.accountInfo.accountId);
        this.setData({
          progress: 0,
          timer: 30
        });
        return;
      }
      // 更新圆环进度
      const progress = ((30 - newTime) / 30) * 360;
      this.setData({
        progress,
        timer: newTime
      });
    },

    onCopy() {
      wx.setClipboardData({
        data: this.data.code,
        success: () => {
          wx.showToast({
            title: 'Copy successful',
          });
        }
      });
    },

    toSettings() {
      wx.navigateTo({
        url: `/pages/setting/setting?info=${JSON.stringify(this.data.accountInfo)}`
      });
    }
})
