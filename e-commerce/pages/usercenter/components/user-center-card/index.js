import { AuthStepType } from './status';
const app = getApp();

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    currAuthStep: {
      type: Number,
      value: AuthStepType.ONE,
    },
    userInfo: {
      type: Object,
      value: {},
    },
    isNeedGetUserInfo: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    lang: app.globalData.lang,
    defaultAvatarUrl: 'https://miniprogram.tcsas-superapp.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    AuthStepType,
  },
  methods: {
    gotoUserEditPage() {
      this.triggerEvent('gotoUserEditPage');
    },
  },
});
