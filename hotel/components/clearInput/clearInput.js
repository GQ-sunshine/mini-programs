// components/clearInput/clearInput.js
Component({
     externalClasses: ['input-class', 'icon-class'],

     /**
      * 组件的属性列表
      */
     properties: {
          inputKey: {
               type: String,
               value: ''
          },
          textAlign: {
               type: String,
               value: 'left'
          },
          disableClear: {
               type: Boolean,
               value: false
          },
          inputHint: {
               type: String,
               value: '搜索'
          },
          inputIcon: {
               type: String,
               value: 'search.png'
          },
          inputType: {
               type: String,
               value: 'text'
          },
          isPassword: {
               type: Boolean,
               value: false
          },
          confirmType: {
               type: String,
               value: "done"
          }
     },

     /**
      * 组件的初始数据
      */
     data: {
          isClearShow: false,
          inputValue: ''
     },

     /**
      * 组件的方法列表
      */
     methods: {
          inputListener: function (e) {
               var value = e.detail.value;
               var cursor = e.detail.cursor;
               if (value === null || value === undefined || value.length === 0) {
                    this.setData({
                         isClearShow: false
                    });
               } else {
                    this.setData({
                         isClearShow: true
                    });
               }
               var detail = {
                    value: value,
                    cursor: cursor,
                    inputKey: this.data.inputKey
               };
               this.triggerEvent('inputListener', detail);
          },

          inputConfirm: function (e) {
               var value = e.detail.value;
               var detail = {
                    inputKey: this.data.inputKey,
                    value: value
               }
               this.triggerEvent('inputConfirm', detail);
          },

          clearTap: function () {
               this.setData({
                    isClearShow: false,
                    inputValue: ''
               });
               var detail = {
                    value: '',
                    inputKey: this.data.inputKey
               };
               this.triggerEvent('inputListener', detail);
          }
     }
})
