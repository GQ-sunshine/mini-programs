// pages/homePage/homePage.js
import { i18n, getLang } from '../../i18n/lang';
var app = getApp();
var tencentMapUrl = 'http://apis.map.qq.com/ws/geocoder/v1/';
var googleMapUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
var inChina = getLang() === 'zh_CN';
var mapUrl = inChina ? tencentMapUrl : googleMapUrl;
const mapKey = require('../../tcmpp.config.js');

var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth() + 1;
var currentDay = new Date().getDate();
var currentWeek = new Date().getDay();
var currentDate = currentYear + '-' + currentMonth + '-' + currentDay;

var startDate = '';
var startYear;
var startDay;
var startMonth;
var startWeek;
var endOfStartDate = '2024-12-31';
var startDayCount;

var endDate = '';
var endYear;
var endDay;
var endMonth;
var endWeek;
var endOfEndDate = '2024-12-31';

var dayCount = 1;

Page({

     /**
      * 页面的初始数据
      */
     data: {
          homeAdvertises: [
               {
                    'unique': 0,
                    'imgSrc': '../../res/images/ic_home_advertise.png',
                    'webUrl': ''
               },
               {
                    'unique': 1,
                    'imgSrc': '../../res/images/ic_home_advertise.png',
                    'webUrl': ''
               },
               {
                    'unique': 2,
                    'imgSrc': '../../res/images/ic_home_advertise.png',
                    'webUrl': ''
               }
          ],

          location: i18n['定位中'] + '...',
          startDate: '',
          currentDate: '',
          endOfStartDate: '',
          endDate: '',
          endOfEndDate: '',
          startDay: '',
          startMonth: '',
          startWeek: '',
          endDay: '',
          endMonth: '',
          endWeek: '',
          dayCount: 1,
          i18n,
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          this.setData({
            i18n,
          })
          this.getLocalLocation();

          startDate = currentDate;
          startYear = currentYear;
          startDay = currentDay;
          startMonth = currentMonth;
          startWeek = currentWeek;

          this.initEndDate();

          this.setSearchDate();
     },

     homeAdvertisesTap: function (e) {
          var index = e.currentTarget.dataset.index;
          // wx.showToast({
          //      title: 'Click' + index,
          //      icon: 'none'
          // })
     },

     getLocalLocation: function () {
          this.setData({
               location: i18n['定位中'] + '...'
          });
          var that = this;
          wx.getLocation({
               success: function (res) {
                    const gMapData = {
                         key: mapKey.GMapKey,
                         latlng: res.latitude + ',' + res.longitude
                    };
                    const tMapData = {
                         key: mapKey.TMapKey,
                         location: res.latitude + ',' + res.longitude
                    };
                    const paramData = inChina ? tMapData : gMapData
                    app.func.httpRequest(mapUrl, paramData, 'GET', {
                              'content-type': 'application/json'
                         }, function (result) {
                              console.log('locationInfo===', result)
                              if (result) {
                                   if(inChina) {
                                        that.setData({
                                             location: result.result.address_component.city
                                        });
                                   } else {
                                        const locationData = result.results[0]?.address_components?.find(item => {
                                             return item.types.includes('administrative_area_level_1')
                                        })
                                        that.setData({
                                             location: locationData.short_name
                                        });
                                   }
                              } else {
                                   that.setData({
                                        location: i18n['定位失败']
                                   });
                              }
                         });
               },
               fail: function (res) {
                    that.setData({
                         location: i18n['定位失败']
                    });
               }
          })
     },

     selectCity: function () {
          wx.navigateTo({
               url: '../select_city/select_city'
          })
     },

     searchEvent: function () {
          if (location == i18n['定位中'] + '...') {
               wx.showToast({
                    title: i18n['定位中,请稍后'],
                    icon: 'none'
               })
          } else {
               wx.navigateTo({
                    url: '../../pages/searchHotel/searchHotel?location=' + this.data.location,
               })
          }
     },

     filterTap: function () {
          if (location == i18n['定位中'] + '...') {
               wx.showToast({
                    title: i18n['定位中,请稍后'],
                    icon: 'none'
               })
          } else {
               wx.navigateTo({
                    url: '../../pages/searchHotel/searchHotel?location=' + this.data.location,
               })
          }
     },

     nearbyTap: function () {
          if (location == i18n['定位中'] + '...') {
               wx.showToast({
                    title: i18n['定位中,请稍后'],
                    icon: 'none'
               })
          } else {
               wx.navigateTo({
                    url: '../../pages/searchHotel/searchHotel?location=' + this.data.location,
               })
          }
     },

     startDateChange: function (e) {
          console.log(e);
          startDate = e.detail.value;
          var startArray = startDate.split('-');
          startYear = parseInt(startArray[0]);
          startDay = parseInt(startArray[2]);
          startMonth = parseInt(startArray[1]);
          startWeek = new Date(startYear, startMonth, startDay).getDay();

          var startFormat = this.formatDate(startDate);
          var endFormat = this.formatDate(endDate);
          if (new Date(endFormat) < new Date(startFormat)) {
               this.initEndDate();
          }

          this.setSearchDate();
     },

     endDateChange: function (e) {
          console.log(e);
          endDate = e.detail.value;
          var endArray = endDate.split('-');
          endYear = parseInt(endArray[0]);
          endDay = parseInt(endArray[2]);
          endMonth = parseInt(endArray[1]);
          endWeek = new Date(endYear, endMonth, endDay).getDay();

          this.setSearchDate();
     },

     getWeekday: function (week) {
          var weekday = new Array(7)
          weekday[1] = i18n['周一']
          weekday[2] = i18n['周二']
          weekday[3] = i18n['周三']
          weekday[4] = i18n['周四']
          weekday[5] = i18n['周五']
          weekday[6] = i18n['周六']
          weekday[7] = i18n['周日']

          return weekday[week];
     },

     prefixInteger: function (num, length) {
          return (Array(length).join('0') + num).slice(-length);
     },

     getDayCount: function (startDate, endDate) {
          var startFormat = this.formatDate(startDate);
          var endFormat = this.formatDate(endDate);
          console.log(startFormat + "->" + endFormat);
          var start = new Date(startFormat);
          var end = new Date(endFormat);

          console.log(start + "->" + end);
          var result = end - start;
          if (result >= 0) {
               var days = parseInt(result / (1000 * 60 * 60 * 24));
               return days == 0 ? 1 : days;
          } else {
               return 0;
          }
     },

     formatDate: function (date) {
          return date.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/');
     },

     initEndDate: function () {
          startDayCount = new Date(startYear, startMonth, 0).getDate();

          if (startMonth == 12 && startDay == 31) {
               endYear = startYear + 1;
               endMonth = 1;
               endDay = 1;
          } else {
               endYear = startYear;
               if (startDay <= startDayCount) {
                    endMonth = startMonth
                    endDay = startDay + 1;
               } else {
                    endMonth = startMonth + 1;
                    endDay = 1;
               }
          }
          if (currentWeek >= 7) {
               endWeek = 1;
          } else {
               endWeek = currentWeek + 1;
          }
          endDate = endYear + '-' + endMonth + '-' + endDay;
     },

     setSearchDate: function () {
          this.setData({
               currentDate: currentDate,

               startDate: startDate,
               startDay: this.prefixInteger(startDay, 2),
               startMonth: this.prefixInteger(startMonth, 2),
               startWeek: this.getWeekday(startWeek),
               endOfStartDate: '2024-12-31',

               endDate: endDate,
               endDay: this.prefixInteger(endDay, 2),
               endMonth: this.prefixInteger(endMonth, 2),
               endWeek: this.getWeekday(endWeek),
               endOfEndDate: '2024-12-31',

               dayCount: this.getDayCount(startDate, endDate)
          });
          app.globalData.currentDate = startDate
          app.globalData.startDay = startDay
          app.globalData.startMonth = startMonth
          app.globalData.startWeek = startWeek
          app.globalData.dayCount = this.data.dayCount

          app.globalData.endDay = endDay
          app.globalData.endMonth = endMonth
          app.globalData.endWeek = endWeek
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
          return {
               title: `${i18n['探索Hotel，发现您的理想住宿']}`,
               path: '/pages/homePage/homePage'
          }
     }
})