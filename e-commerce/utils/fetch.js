const USER_NAME = "USER_NAME";
const USER_INFO = "USER_INFO";
const { noServer = false } = getApp().globalData;

const appid = "mp3q0cigfj5e03z8";
const host = "https://miniprogram.tcsas-superapp.com"; // Don't end with /

const login = (userInfo) => {
  wx.setStorageSync(USER_NAME, userInfo.userName);
  wx.setStorageSync(USER_INFO, userInfo);
};

const getUserName = () => {
  return wx.getStorageSync(USER_NAME);
};

const getToken = () => {
  const { token } = wx.getStorageSync(USER_INFO);
  return token;
};

const logout = () => {
  wx.setStorageSync(USER_NAME, "");
};

const loginFromServer = function loginFromServer(code, success, fail) {
  if (noServer) {
    setTimeout(() => {
      success?.({
        userName: "offlineUser",
      });
    }, 1000);
    return;
  }
  wx.request({
    url: `${host}/getUserInfo`,
    method: "POST",
    data: { appid, code },
    fail() {
      fail?.();
    },
    success(res) {
      console.log("mp server resp :", res);
      const { code = -1 } = res?.data || {};
      if (code === 200) {
        success?.(res?.data.data);
      } else {
        fail?.(res?.data?.data?.msg || "login error");
      }
    },
  });
};

/**
 * 统一下单
 * @param {*} total
 * @param {*} attach
 * @param {*} body
 * @param {*} id
 */
const commonPay = function commonPay({ orderData, discount = 0, success, fail }) {
  if (noServer) {
    success?.({
      package: "fake",
      timeStamp: Math.floor(Date.now() / 1000) + "",
      nonceStr: "",
      signType: "RSA",
      paySign: "MOCK",
    });
    return;
  }
  wx.showLoading({ title: "loading order" });
  wx.request({
    url: `${host}/payOrderV3`,
    method: "POST",
    data: {
      appid,
      goods_detail: orderData.map((item) => ({
        merchant_goods_id: Math.random().toString(36).substring(2, 12),
        wechatpay_goods_id: Math.floor(Math.random() * 10000).toString(),
        goods_name: item.title || item.goodsName,
        quantity: item.quantity,
        unit_price: item.price / 100,
      })),
      discount: discount / 100,
      token: getToken(),
    },
    fail() {
      wx.hideLoading();
      fail?.();
    },
    success(res) {
      console.log("mp server resp:", res);
      const { code = -1, ...payInfo } = res?.data || {};
      if (code === 200) {
        wx.hideLoading();
        success?.(payInfo);
      } else {
        wx.hideLoading();
        fail?.("pay error");
      }
    },
  });
};

export { loginFromServer, login, logout, getUserName, commonPay };
