Component({
    properties: {
        accountList: {
          type: Array,
          value: []
        },
        noData: {
            type: String,
            value: "You haven't added any available accounts yet."
        }
    },

    data: {}, // 私有数据，可用于模板渲染

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () { },
        moved: function () { },
        detached: function () { },
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
    ready: function() { },


    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () { },
        hide: function () { },
        resize: function () { },
    },

    methods: {
       toDetail(info) {
            const { dataset } = info.currentTarget;
            console.log('====info', dataset.info);
            wx.navigateTo({
            url: `/pages/detail/detail?id=${dataset.info.id}&color=${dataset.info.color}`
            });
        }
    }
})