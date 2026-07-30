Component({
    properties: {
        placeholder: {
            type: String,
            value: 'Search for account'
        },
        confirmType: {
            type: String,
            value: 'done'
        },
        showClear: {
            type: Boolean,
            value: false
        },
        value: {
            type: String,
            value: ''
        },
        autoFocus: {
            type: Boolean,
            value: false
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
        onInput(detail) {
            this.triggerEvent('input', detail);
        },

        onFocus(detail) {
            console.log('------onfocus')
            this.triggerEvent('focus', detail);
        },

        onBlur() {
            this.triggerEvent('blur');
        },

        onConfirm(detail) {
            this.triggerEvent('confirm', detail);
        },
        onClear() {
            this.triggerEvent('clear');
        }
    }
})