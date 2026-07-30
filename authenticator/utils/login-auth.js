const oldPage = Page;
const authPage = [
    'pages/index/index',
    'pages/detail/detail',
    'pages/searchPage/searchPage',
    'pages/setting/setting'
]

Page = function (pageParams) {
    const {
        onLoad,
    } = pageParams;

    pageParams.onLoad = async function (params) {
        const app = getApp();
        const pages = getCurrentPages(); //获取加载的页面
        const currentPage = pages[pages.length - 1]; //获取当前页面的对象

        if(!app.globalData.userInfo && authPage.indexOf(currentPage.route) !== -1) {
            app.globalData.setCallbackUrl().then(() => {
                wx.redirectTo({
                    url: '/pages/login/login'
                });
            });
        } else {
            onLoad && onLoad.call(this, params);
        }
    };
   
    return oldPage(pageParams);
};