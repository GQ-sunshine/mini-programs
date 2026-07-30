//js
const app = getApp();

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        show: true
    },
    onLoad: function () {
      wx.setNavigationBarTitle({
        title: 'login',
      });
    },

    onUnload() {
        wx.removeStorageSync('callbackObj');
    },

    loginCallback(res) {
        const cb = () => {
            const {
                code = -1, data = {}
            } = res?.data || {};
            if (code === 200) { // 换取用户信息成功
                // const info = {
                //     userName: data.userName,
                //     id: data.id
                // }
                app.globalData.userInfo = data;
                wx.setStorageSync('userInfo', JSON.stringify(data));
            } else {
                console.log('getUserInfo request fail', res)
                wx.showModal({
                    title: 'login failed',
                    confirmText: 'confirm',
                    content: 'The returned code is not equal to 200',
                    showCancel: false
                })
            }
        }

        app.globalData.getCallBackUrl()
        .then(() => {
            cb();
        })
        .catch(err => {
            console.log('no data', err);
            cb();
            wx.navigateBack({
                delta: 1
            });
        });
    },

    onlineLogin(code) {
        wx.request({
            url: `${app.globalData.url}/getUserInfo`,
            method: "POST",
            data: {
                appid: app.globalData.appId,
                code,
            },
            success: (res) => {
               this.loginCallback(res);
            },
            fail: (err) => {
                console.log('getUserInfo request fail', err)
                wx.showModal({
                    title: 'login failed',
                    confirmText: 'confirm',
                    content: err.errMsg,
                    showCancel: false
                })
            },
        })
    },

    loginMock() {
        this.loginCallback({
            data: {
                code: 200,
                data: {
                    id: 276553733,
                    userName: 'offlineUser'
                }
            }
        })
    },

    bindGetUserInfo: function (event) {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.login({
                        success: (res) => {
                            const code = res.code; //login code
                            if (code) {
                             app.globalData.noServer ? this.loginMock()  : this.onlineLogin(code);
                            } else {
                                console.log('get login code failed' + r.errMsg)
                            }
                        },
                        fail: () => {
                            console.log('login faild')
                        }
                    })

                } else {
                    console.log('get setting faild')
                }

            }
        })

    }
})