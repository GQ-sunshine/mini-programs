import { i18n,lang } from '../../../i18n/lang'
Page({
  onShareAppMessage() {
    return {
      title: i18n['Jump'],
      path: 'packageAPI/pages/jump/jump'
    }
  },

  data: {
    theme: 'light',
    setting: {},
    appId: ''
  },

  formInputChange(e) {
    this.setData({
      appId: e.detail.value
    });
  },

  // Open a half-screen mini program
  openhalfscreenminiprogram() {
    if (wx.canIUse('openEmbeddedMiniProgram')) {
      if (!this.data.appId) {
        wx.showToast({
          icon: 'none',
          title: i18n['jump0']
        });
        return;
      }
      wx.openEmbeddedMiniProgram({
        appId: this.data.appId, // Tencent Public Welfare
        extraData: {
          foo: 'bar'
        },
        // envVersion: 'develop',
        success(res) {
          // Successfully opened
        }
      })
    } else {
      wx.showModal({
        confirmText: i18n['confirm'],
        cancelText: i18n['cancel'],
        title: i18n['jump1']
      });
    }
  },

  // Open another mini program
  openanotherminiprogram() {
    if (!this.data.appId) {
      wx.showToast({
        icon: 'none',
        title: i18n['jump2']
      });
      return;
    }
    wx.navigateToMiniProgram({
      appId: this.data.appId,
      extraData: {
        foo: 'bar'
      },
      // envVersion: 'develop',
      success(res) {
        // Successfully opened
      }
    })
  },

  // Return to the previous mini program
  returnminiprogram() {
    wx.navigateBackMiniProgram({
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // Successfully returned
      },
      fail(err) {
        wx.showModal({
          confirmText: i18n['confirm'],
          cancelText: i18n['cancel'],
          title: i18n['jump3'],
          content: JSON.stringify(err)
        });
      }
    })
  },

  // Restart mini program with a valid path
  restartminiprogramvalidpath() {
    wx.restartMiniProgram({
      path: '/packageComponent/pages/view/view/view?aaa=1',
      /**
 * 跳转成功后的回调，显示国际化提示信息
 */
success() {
        wx.showToast({
          title: i18n['jump12'],
          icon: 'none',
          duration: 2000
        })
      },
      fail(err) {
        console.log('=====restart fail', err);
        wx.showToast({
          title: i18n['jump13'],
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // Restart mini program with an invalid path
  restartminiprograminvalidpath() {
    wx.restartMiniProgram({
      path: '/packageComponent/pages/view/view/view1?aaa=1',
      success() {
        wx.showToast({
          title: i18n['jump12'],
          icon: 'none',
          duration: 2000
        })
      },
      fail(err) {
        console.log('=====restart fail', err);
        wx.showToast({
          title: i18n['jump13'],
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // Restart mini program and jump to tabbar page
  restartminiprogramtabbar() {
    wx.restartMiniProgram({
      path: 'page/component/index',
      success() {
        wx.showToast({
          title: i18n['jump12'],
          icon: 'none',
          duration: 2000
        })
      },
      fail(err) {
        console.log('=====restart fail', err);
        wx.showToast({
          title: i18n['jump13'],
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // Listen for embedded mini program height change
  onEmbeddedHeightChange() {
    if (!wx.onEmbeddedMiniProgramHeightChange) {
      wx.showToast({ icon: 'none', title: i18n['jump1'] });
      return;
    }
    this._embeddedHeightHandler = (res) => {
      wx.showToast({
        icon: 'none',
        title: (i18n['jump16'] || 'Embedded height') + ': ' + (res && res.height)
      });
      console.log('onEmbeddedMiniProgramHeightChange', res);
    };
    wx.onEmbeddedMiniProgramHeightChange(this._embeddedHeightHandler);
    wx.showToast({ icon: 'none', title: i18n['jump17'] || 'Listener registered' });
  },

  // Remove embedded mini program height change listener
  offEmbeddedHeightChange() {
    if (!wx.offEmbeddedMiniProgramHeightChange) {
      wx.showToast({ icon: 'none', title: i18n['jump1'] });
      return;
    }
    if (this._embeddedHeightHandler) {
      wx.offEmbeddedMiniProgramHeightChange(this._embeddedHeightHandler);
      this._embeddedHeightHandler = null;
    } else {
      wx.offEmbeddedMiniProgramHeightChange();
    }
    wx.showToast({ icon: 'none', title: i18n['jump18'] || 'Listener removed' });
  },

  // Listen for API category change
  onApiCategoryChangeHandler() {
    if (!wx.onApiCategoryChange) {
      wx.showToast({ icon: 'none', title: i18n['jump1'] });
      return;
    }
    this._apiCategoryHandler = (res) => {
      wx.showToast({
        icon: 'none',
        title: (i18n['jump19'] || 'API category') + ': ' + (res && res.apiCategory)
      });
      console.log('onApiCategoryChange', res);
    };
    wx.onApiCategoryChange(this._apiCategoryHandler);
    wx.showToast({ icon: 'none', title: i18n['jump17'] || 'Listener registered' });
  },

  // Remove API category change listener
  offApiCategoryChangeHandler() {
    if (!wx.offApiCategoryChange) {
      wx.showToast({ icon: 'none', title: i18n['jump1'] });
      return;
    }
    if (this._apiCategoryHandler) {
      wx.offApiCategoryChange(this._apiCategoryHandler);
      this._apiCategoryHandler = null;
    } else {
      wx.offApiCategoryChange();
    }
    wx.showToast({ icon: 'none', title: i18n['jump18'] || 'Listener removed' });
  },

  // Exit the current mini program
  exitminiprogram() {
    wx.exitMiniProgram({
      success() {
        wx.showToast({
          title: i18n['jump4'],
          icon: 'none',
          duration: 2000
        })
      },
      fail() {
        wx.showToast({
          title: i18n['jump5'],
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: i18n['Jump']
    })
    this.setData({
      t: i18n,
      lang
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  }
})
