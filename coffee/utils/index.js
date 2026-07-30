module.exports = {
    miniServer: 'https://ecosystem-test.tcmppcloud.com', // 测试环境
    getAppId: () => {
        return wx.getAccountInfoSync().miniProgram.appId;
    }
}