// pages/bookHotel/bookHotel.js
import { i18n } from '../../i18n/lang';
import Config from '../../utils/configData';
const app = getApp()
var roomPrice;
var hotelName;
var roomName;
var startDate;
var endDate;

function generateOrderNumber() {
  let orderNumber = '';
  for (let i = 0; i < 10; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    orderNumber += randomDigit;
  }
  return orderNumber;
}

function getCurrentFormattedTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); 
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // 拼接成所需格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

Page({

     /**
      * 页面的初始数据
      */
     data: {
          isDiscount: false,
          roomPrice,
          hotelName,
          roomName,
          startDate,
          endDate,
          discount: i18n['不选择优惠'],
          name: '',
          phone: '',
          remark: '',
          i18n,
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          wx.setNavigationBarTitle({
               title: i18n['客房预订']
          })
          console.log(options);
          roomPrice = options.price;
          hotelName = options.hotelName;
          roomName = options.roomName;
          startDate = options.startDate;
          endDate = options.endDate;

          this.setData({
               roomPrice: roomPrice,
               hotelName: hotelName,
               roomName: roomName,
               startDate: startDate,
               endDate: endDate,
               i18n,
          });
     },
     orderSubscribe(template_id) {
          wx.request({
               url: `${Config.BASEURL}/sendOrderMessage`,
               method: 'POST',
               data: {
                    appid: Config.APPID,
                    token: app.globalData.userInfo.token,
                    template_id,
                    page: 'pages/orderList/orderList?type=todo',
                    data: {
                         'thing1': {
                              value: generateOrderNumber(),
                         },
                         'date': {
                              value: getCurrentFormattedTime(),
                         },
                         'thing2': {
                              value: app.globalData.userInfo.nickName || app.globalData.userInfo.phoneNumber,
                         },
                         'character_string': {
                              value: `${this.data.hotelName}:${this.data.roomName}:${this.data.roomPrice}_${this.data.remark}`
                         }
                    }
               },
               success: (res) => {
                    if(res.data.code === 200){
                         console.log('/sendOrderMessage request success', res)
                    } else {
                         console.log('/sendOrderMessage request fail', res)
                         wx.showModal({
                              title: '/sendOrderMessage request fail',
                              confirmText: i18n['确定'],
                              content: 'The returned code is not equal to 200',
                              showCancel: false
                         })
                    }
               },
               fail: (err) => {
                    console.log('wx.request fail===/sendOrderMessage', err)
                    wx.showModal({
                         title: 'wx.request fail',
                         confirmText: i18n['确定'],
                         content: err.errMsg,
                         showCancel: false
                    })
               }
          })
     },
     requestSubscribeMessage(tmplIds) {
          wx.requestSubscribeMessage({
               tmplIds,
               success: (res) => {
                    console.log('wx.requestSubscribeMessage===success', res)
                    const keysWithAccept = Object.entries(res)
                    .filter(([key, value]) => value === "accept") // 过滤出值为 "accept" 的项
                    .map(([key]) => key); // 提取出键
                    if (keysWithAccept.length > 0) {
                         this.orderSubscribe(keysWithAccept[0])
                    } else {
                         wx.showModal({
                              title: i18n['没有可用的消息模板'],
                              confirmText: i18n['确定'],
                              showCancel: false
                         })
                    }
               },
               fail: (res) => {
                    console.log('wx.requestSubscribeMessage===fail', res)
                    wx.showModal({
                         title: 'wx.requestSubscribeMessage fail',
                         confirmText: i18n['确定'],
                         content: `${res.errMsg}【${res.errCode}】`,
                         showCancel: false
                    })
               }
          })
     },
     payOrder(){
          wx.showLoading({
               title: i18n['提交中']
          })
          if(app.globalData.noServer) {
               this.requestPayment({
                    package:"fake",
                    timeStamp: Math.floor(Date.now() / 1000),
                    nonceStr: "",
                    signType: "RSA",
                    paySign: "MOCK"
               })
          } else {
               wx.request({
                    url: `${Config.BASEURL}/payOrderV3`,
                    method: 'POST',
                    data: {
                         appid: Config.APPID,
                         goods_detail: [{
                              "merchant_goods_id": Math.random().toString(36).substring(2, 12),
                              "wechatpay_goods_id": Math.floor(Math.random() * 10000).toString(),
                              "goods_name" : this.data.roomName,
                              "quantity" : 1,
                              "unit_price" : this.data.roomPrice
                         }],
                         id: app.globalData.userInfo?.id,
                         token: app.globalData.userInfo?.token
                    },
                    success: (res) => {
                         console.log('/payOrderV3 request success', res)
                         wx.hideLoading();
                         if(res.data.code === 200){
                              this.requestPayment(res.data)
                         } else {
                              console.log('/payOrderV3 request fail', res)
                              wx.showModal({
                                   title: '/payOrderV3 request fail',
                                   confirmText: i18n['确定'],
                                   content: 'The returned code is not equal to 200',
                                   showCancel: false
                              })
                         }
                    },
                    fail: (err) => {
                         wx.hideLoading();
                         console.log('wx.request fail===/payOrderV3', err)
                         wx.showModal({
                              title: 'wx.request fail',
                              confirmText: i18n['确定'],
                              content: err.errMsg,
                              showCancel: false
                         })
                    }
               })
          }
     },
     requestPayment(obj) {
          const { nonceStr, package:vpve,paySign,signType,timeStamp } = obj;
          wx.requestPayment({
               package:vpve,
               nonceStr,
               paySign,
               signType,
               timeStamp,
               success: () => {
                    if(app.globalData.userInfo.token) {
                         this.requestSubscribeMessage(['mti_wifrQVRYyPPryBIpzDJRQPosdrVFfxxHKefshhh'])
                    }
                    wx.showLoading({
                         title: i18n['支付成功']
                    })
                    const key = `orderTodo_${app.globalData.userInfo?.nickName}`
                    const orderList = wx.getStorageSync(key) || []
                    orderList.push(this.data)
                    wx.setStorage({
                         key,
                         data: orderList,
                         success: (res) => {
                              console.log('setStorage===success', res)
                         },
                         fail: (err) => {
                              console.log('setStorage===fail', err)
                         }
                    })
                    setTimeout(() => {
                         wx.reLaunch({
                              url: '/pages/orderList/orderList?type=todo',
                         })
                    }, 1000)
               },
               fail: (err) => {
                    wx.hideLoading();
                    console.log('wx.requestPayment fail===', err)
                    wx.showModal({
                         title: 'wx.requestPayment fail',
                         confirmText: i18n['确定'],
                         content: err.errMsg,
                         showCancel: false
                    })
               },
          });
     },
     payBtn() {
          if(!this.data.name || !this.data.phone) {
               wx.showModal({
                    confirmText: i18n['确定'],
                    content: i18n['请填写入住人及手机号码'],
                    showCancel: false
               })
          } else {
               this.payOrder()
          }
     },

     inputEvent(e) {
          const key = e?.detail?.inputKey
          this.setData({
              [key] : e?.detail?.value
          })
     },

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {

     },

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {

     },

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function () {

     },

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function () {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function () {

     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {

     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     }
})