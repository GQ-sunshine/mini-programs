//app.js
import { i18n } from './i18n/lang';
var commonUtils = require('common/commonUtils.js');
var httpRequest = require('common/request.js');

App({
     onLaunch: function (res) {
          this.globalData.noServer = (res.extendData || '').indexOf('noServer=1') !== -1
          // wx.setEnableDebug({
          //      enableDebug: false
          // })
          var that = this;
          wx.getSystemInfo({
               success: function (res) {
                    const version = res.version;
                    if(commonUtils.compareVersion(version, '2.1.1') === -1) {
                         wx.showModal({
                              title: i18n['APP版本过低'],
                              confirmText: i18n['确定'],
                              content: i18n['为了确保您能使用最新功能，请升级到2.1.1及以上版本'],
                              showCancel: false
                         })
                    }
                    var sdkVersion = res.SDKVersion;
                    var versionCompare = commonUtils.compareVersion(sdkVersion, '2.0.7');
                    if (versionCompare == -1) {
                         that.globalData.isVersionHigh = false
                    } else {
                         that.globalData.isVersionHigh = true
                    }
               },
          });
          const tabBarText = ['首页', '我的'];
          tabBarText.map((item, index) => {
               wx.setTabBarItem({
                    index: index,
                    text: i18n[item],
               });
          });
     },
     globalData: {
          userInfo: null,
          isVersionHigh: false,
          noServer: false
     },
     func: {
          httpRequest: httpRequest.httpRequest,
          dateFormat: commonUtils.dateFormat,
          floatAdd: commonUtils.floatAdd,
          floatSub: commonUtils.floatSub,
          floatDiv: commonUtils.floatDiv,
          floatMul: commonUtils.floatMul,
          compareVersion: commonUtils.compareVersion,
     }
})