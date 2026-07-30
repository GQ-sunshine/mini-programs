import { i18n,lang } from '../../../../i18n/lang'

Page({
  onShareAppMessage() {
    return {
      title: i18n['Page interaction'],
      path: 'packageAPI/pages/page/native-page/native-page'
    }
  },
  data: {
    loginResult: '',
    payResult:'',
    loginText: i18n['Simulated login'],
    payText: i18n['Simulated payment'],
    mainAppText: i18n['Simulated enter Superapp page'],
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: i18n['Page interaction']
    })
  },

  mockLogin() {
    var opts = {
      api_name: 'mockLogin', // custom api name
      success: (res) => {
        console.log('mock login success:', res);
        let resultText = '';
        if (res.isAuth) {
          resultText = "Login success: " + res.userName;
        } else {
          resultText = "User refuse Auth";
        }
        this.setData({
          loginResult: resultText,
        })
        console.log('mock login success loginResult:', loginResult);
        console.log('mock login success:', resultText);
      },
      fail: function (res) {
        console.log('mock login fail');
      },
      complete: function (res) { },
      data: { // 入参
        miniAppName: 'test app',
        miniAppId: "123456",
      }
    }
    wx.invokeNativePlugin(opts);
  },

  mockPayOrder() {
    var opts = {
      api_name: 'mockPayment', // custom api name
      success: (res) => {
        console.log('mock pay success:', res);
        let result = "Successfully paid " + (res.actualAmount / 10000);
        this.setData({
          payResult: result,
        })
      },
      fail:  (res)=> {
        console.log('mock pay fail:', res);
        this.setData({
          payResult: "pay fail",
        })
      },
      complete: function (res) { },
      data: {
        miniAppName: 'test app',
        miniAppId: "123456",
      }
    }
    wx.invokeNativePlugin(opts);
  },

  mockRunMainAppPage() {

    var opts = {
      api_name: 'mockRunMainAppPage', // api名称
      success: function (res) {
        this.setData
        console.log('mock main page success');
      },
      fail: function (res) {
        console.log('mock main page fail');
      },
      complete: function (res) { },
      data: { // 入参
        miniAppName: 'test app',
      }
    }
    wx.invokeNativePlugin(opts);

  },
})
