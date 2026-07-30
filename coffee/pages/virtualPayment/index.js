import i18n from '../../i18n/index';
import { getUserInfo } from '../../service/storage';
import { setTabBar } from '../../utils/i18n';
import utils from '../../utils/index';

const serverUrl = utils.miniServer;
const mnpId = utils.getAppId();

// pages/virtualPayment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currencyType: 'USD',
    productId: '',
    goodsName: '',
    goodsPrice: '',
    buyQuantity: 1,
    userInfo: null
  },

  onLoad: function (options) {
    setTabBar();
    wx.setNavigationBarTitle({
      title: i18n.t('虚拟支付')
    })

    // 设置随机商品名
    const productNames = ["能量水晶", "星际通行证", "神秘宝箱", "加速药水", "限量版皮肤"];
    const randomIndex = Math.floor(Math.random() * productNames.length);
    this.setData({
      goodsName: productNames[randomIndex]
    });
    
    const userInfo = getUserInfo();
    if (!userInfo) {
      wx.showToast({
        title: i18n.t('请先登录后操作'),
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/index'
            });
          }, 1000);
        }
      });
    } else {
      this.setData({ userInfo });
    }
  },

  handleInputValue(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  handlePurchase() {
    const { currencyType, productId, goodsName, goodsPrice, buyQuantity } = this.data;

    if (!productId) {
      wx.showToast({
        title: '请输入道具ID',
        icon: 'none'
      });
      return;
    }

    if (!goodsPrice || goodsPrice <= 0) {
      wx.showToast({
        title: '请输入有效的单价',
        icon: 'none'
      });
      return;
    }

    if (!buyQuantity || buyQuantity <= 0) {
      wx.showToast({
        title: '请输入有效的数量',
        icon: 'none'
      });
      return;
    }

    const detail = {
      buyQuantity: Number(buyQuantity),
      currencyType: currencyType,
      productId: productId,
      goodsName: goodsName,
      unitPrice: Number(goodsPrice),
    };

    wx.request({
      url: `${serverUrl}/requestVirtualPayment`,
      method: 'POST',
      data: {
        token: this.data.userInfo.token,
        appid: mnpId,
        detail,
      },
      success: ({ data: { paySig, signature, signData } }) => {
        console.log('小程序后台 requestVirtualPayment success------->');
        // console.log('requestVirtualPaymentRes', paySig, signature, signData);
        console.log('小程序客户端 paySig  ------->', paySig);
        console.log('小程序客户端 signature  ------->', signature);
        console.log('小程序客户端 signData  ------->', signData);

        wx.requestVirtualPayment({
          signData,
          paySig,
          signature,
          mode: 'short_series_goods',
          success: (res) => {
            console.log('requestVirtualPayment success', res)
            this.setData({ buyQuantity: 0 });
            wx.showModal({
              title: '支付成功',
              content: '恭喜你支付成功！',
            })
          },
          fail: ({ errMsg, errCode }) => {
            console.error(errMsg, errCode)
            wx.showModal({
              title: '支付失败' + errCode,
              content: errMsg,
            })
          },
        })
      },
      fail: (err) => {
        console.log('小程序后台 requestVirtualPayment err------->', err)
      }
    })
  }
})

