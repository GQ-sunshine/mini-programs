
//app.js
require('./utils/login-auth');
App({
  onLaunch: function () {
    // show localstorage
    const userInfo = wx.getStorageSync('userInfo');
    if(userInfo) {
      this.globalData.userInfo = JSON.parse(userInfo);
    }
  },
  globalData: {
    // url: 'http://9.134.238.9:8080',
    // appId: 'mpkuhxvn4voggulu',
    url: 'https://miniprogram.tcsas-superapp.com',
    appId: 'mp28t2d5a771fldh',
    userInfo: null, 
    noServer: (wx.getEnterOptionsSync()?.extendData || "").indexOf("noServer=1") !== -1,
      // 设置需要回调的地址
    setCallbackUrl: function(mode) {
      return new Promise((resolve,reject) => {
        let pages = getCurrentPages(); //获取加载的页面
        let currentPage = pages[pages.length - 1]; //获取当前页面的对象
        let urlPage = ''; // 存储的跳转地址
        let url = currentPage.route; //当前页面url
        let argumentsStr = '';
        let options = currentPage.options; //如果要获取url中所带的参数可以查看options
        for (let key in options) {
          let value = options[key];
          argumentsStr += key + '=' + value + '&';
        }
        if(argumentsStr) {
            argumentsStr = argumentsStr.substring(0, argumentsStr.length - 1);
            urlPage = url + '?' + argumentsStr;
        } else {
            urlPage = url;
        }
        let callbackObj = {
            callbackUrl: `/${urlPage}`,
            mode: mode || 'redirectTo'
        }
        wx.setStorageSync('callbackObj', JSON.stringify(callbackObj));
        resolve();
      })
    },

    // 获取本地可以回调的地址
    getCallBackUrl: function() {
      return new Promise((resolve,reject) => {
        const callbackObj = wx.getStorageSync('callbackObj');
        if(callbackObj) {
            let resultObj = JSON.parse(callbackObj);
            let callbackUrl = resultObj.callbackUrl;
            let mode = resultObj.mode;
            mode == 'redirectTo' && wx.redirectTo({url: callbackUrl});
            mode == 'switchTab' && wx.switchTab({url: callbackUrl});
            mode == 'reLaunch' && wx.reLaunch({url: callbackUrl});
            mode == 'navigateTo' && wx.navigateTo({url: callbackUrl});

            wx.removeStorageSync('callbackObj');
            resolve();
        } else {
            reject();
        }
      });
    },
  }
})