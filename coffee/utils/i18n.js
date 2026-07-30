import i18n from '../i18n/index';
export const setTabBar = () => {
    wx.setTabBarItem({
        index: 0,
        text: i18n.t('首页'),
    });
    wx.setTabBarItem({
        index: 1,
        text: i18n.t('点单'),
    });
    wx.setTabBarItem({
        index: 2,
        text: i18n.t('订单'),
    });
    wx.setTabBarItem({
        index: 3,
        text: i18n.t('虚拟支付'),
    });
}