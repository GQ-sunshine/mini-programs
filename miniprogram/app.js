console.log('QAPM_DEVICE_ID', wx.getStorageSync("QAPM_DEVICE_ID"));
typeof __wxConfig.qapmSetField==="function" && __wxConfig.qapmSetField("logLevel",5)

import { i18n, lang } from './i18n/lang'
import { log } from './util/util'

const themeListeners = [];
global.isDemo = true;

    function formatJsError(type, args) {
      let errorType = "";
      let errorValue = "";
      let stack = "";
      let stackArr = [];

      try {
          if (type === "MpError") {
              // wx.onError 传入的是字符串（小程序特性，不是标准 Error 对象）
              stack = args;
              stackArr = args.split("\n");
              // 错误类型在第3行，例如 "TypeError: Cannot read property..."
              errorType = stackArr[2].split(":")[0];
              errorValue = stackArr[2].split(":").slice(1).join("");
          } 
          else if (type === "PromiseError") {
              // wx.onUnhandledRejection 传入 {promise, reason}
              stack = args.reason.stack ? args.reason.stack : args.reason;
              if (args.reason && args.reason.stack) {
                  stackArr = args.reason.stack.split("\n");
              } else if (typeof args.reason === "string") {
                  stackArr = [args.reason];
              } else {
                  stackArr = [];
              }
              errorType = "PromiseError";
              errorValue = "-";
          } 
          else if (type === "VueError") {
              stack = args.stack;
              stackArr = args.stack.split("\n");
              errorType = stackArr[0].split(":")[0];
              errorValue = args.message;
          } 
          else {
              stack = args.toString();
              errorType = "Error";
              errorValue = args.toString();
          }
      } catch (e) {
          errorType = "Error";
          errorValue = "";
      }

      // // 上报数据
      // reportError({
      //     type: errorType,        // TypeError / PromiseError / VueError 等
      //     message: errorValue,     // 错误消息
      //     stack: stack,            // 完整堆栈字符串
      //     page: getCurrentPage(),  // 当前页面
      //     timestamp: Date.now(),
      //     level: "error"
      // });
      console.log('=====stack', stack);
    }

wx.onError(err => {
  console.log('Error:', err);
 formatJsError('MpError', err);
});

App({
  onLaunch(opts, data) {

    console.log('=====wx.getSystemInfoSync', wx.getSystemInfoSync());
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // Callback after requesting new version information
      log('onCheckForUpdate--------', res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      log('onUpdateReady--------')
      wx.showModal({
        confirmText: i18n['confirm'],
        cancelText: i18n['cancel'],
        title: i18n['app0'],
        content: i18n['app1'],
        success: function (res) {
          if (res.confirm) {
            // The new version has been downloaded successfully, call applyUpdate to apply the new version and restart
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // New version download failed
      log('onUpdateFailed--------')
    })

    const canIUseSetBackgroundFetchToken = wx.canIUse('setBackgroundFetchToken')
    if (canIUseSetBackgroundFetchToken) {
      wx.setBackgroundFetchToken({
        token: 'getBackgroundFetchToken'
      })
    }

    log('App Launch', opts)
    log('App Launch getLaunchOptionsSync', wx.getLaunchOptionsSync())
    log('App Launch getEnterOptionsSync', wx.getEnterOptionsSync())

    if (data && data.path) {
      wx.navigateTo({
        url: data.path
      })
    }
    wx.onAppShow(this.appShowHandler);
    // wx.on
  },
  onShow(opts) {
    log('App Show', opts)
    log('App Show getEnterOptionsSync', wx.getEnterOptionsSync())
    this.addOnPageNotFound();
    // this.offPageNotFound();  // Verify if wx.offPageNotFound is effective, uncomment and recompile
    this.getShareInfo(opts.shareTicket)
  },
  onHide() {
    log('App Hide');
    this.offPageNotFound();
  },
  appShowHandler() {
    wx.showToast({
      title: i18n['app3'],
      icon: 'none'
    })
    log('Switched to the foreground');
  },
  appHideHandler() {
    log('Switched to the background');
    wx.showToast({
      title: i18n['app4'],
      icon: 'none'
    })
  },
  pageNotFoundCb(res) {
    wx.showModal({
      confirmText: i18n['confirm'],
      cancelText: i18n['cancel'],
      title: i18n['app5'],
      content: JSON.stringify(res)
    });
  },
  addOnPageNotFound() {
    wx.onPageNotFound(this.pageNotFoundCb);
  },
  offPageNotFound() {
    wx.offPageNotFound(this.pageNotFoundCb);
  },
  getShareInfo(shareTicket) {
    if (shareTicket) {
      wx.getShareInfo({
        shareTicket,
        success: (res) => {
          wx.showModal({
            confirmText: i18n['confirm'],
            cancelText: i18n['cancel'],
            title: 'getShareInfo success',
            content: JSON.stringify(res)
          })
        },
        fail: (err) => {
          log('get share info fail', err)
        },
        complete: () => {
          log('get share info complete')
        }
      })
    } else {
      log('shareTicket is undefined')
    }
  },
  onError(err) {
    formatJsError('MpError', err);

    log('App Error--------', err)
  },
  onPageNotFound(opts) {
    log('Page Not Found--------', opts)
  },
  /**
 * 处理未捕获的 Promise 拒绝事件
 * @param {Object} opts - 未捕获拒绝事件的相关信息
 * @param {string|number} opts.type - 事件类型
 * @param {Promise} opts.promise - 被拒绝的 Promise 对象
 * @param {*} opts.reason - 拒绝的原因
 */
onUnhandledRejection(opts) {
    log('Unhandled Rejection--------', opts)
  },
  onThemeChange({ theme }) {
    this.globalData.theme = theme
    log('App.onThemeChange change--------', theme);;
    themeListeners.forEach((listener) => {
      listener(theme)
    })
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener)
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener)
    if (index > -1) {
      themeListeners.splice(index, 1)
    }
  },
  globalData: {
    theme: wx.getSystemInfoSync().theme,
    hasLogin: false,
    openid: null,
    iconTabbar: '/page/weui/example/images/icon_tabbar.png'
  },
})
