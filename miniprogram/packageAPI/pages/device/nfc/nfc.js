const baseAction = [
  'connect',
  'close',
  'setTimeout',
  'isConnected',
  'getMaxTransceiveLength',
  'transceive'
];
const actionList = {
  'mifareClassic': baseAction,
  'mifareUltralight': baseAction,
  'nfcB': baseAction,
  'nfcF': baseAction,
  'nfcV': baseAction,
  'isoDep': baseAction.concat('getHistoricalBytes'),
  'nfcA': baseAction.concat('getSak').concat('getAtqa'),
  'ndef': baseAction.concat('writeNdefMessage').concat('onNdefMessage').concat('offNdefMessage')
}
actionList['ndef'] = actionList['ndef'].filter(item => item !== 'transceive').filter(item => item !== 'getMaxTransceiveLength');


/**
 * NFC NDEF 数据解码方法（完整版）
 * @param {Object} nfcData - NFC原始数据对象
 * @returns {Array} 解码后的记录数组
 */
function decodeNFCData(nfcData) {
  // URI协议前缀映射表
  const URI_PROTOCOLS = {
    0x00: '', 0x01: 'http://www.', 0x02: 'https://www.', 0x03: 'http://',
    0x04: 'https://', 0x05: 'tel:', 0x06: 'mailto:', 0x07: 'ftp://anonymous:anonymous@',
    0x08: 'ftp://ftp.', 0x09: 'ftps://', 0x0A: 'sftp://', 0x0B: 'smb://',
    0x0C: 'nfs://', 0x0D: 'ftp://', 0x0E: 'dav://', 0x0F: 'news:',
    0x10: 'telnet://', 0x11: 'imap:', 0x12: 'rtsp://', 0x13: 'urn:',
    0x14: 'pop:', 0x15: 'sip:', 0x16: 'sips:', 0x17: 'tftp:',
    0x18: 'btspp://', 0x19: 'btl2cap://', 0x1A: 'btgoep://', 0x1B: 'tcpobex://',
    0x1C: 'irdaobex://', 0x1D: 'file://', 0x1E: 'urn:epc:id:', 0x1F: 'urn:epc:tag:',
    0x20: 'urn:epc:pat:', 0x21: 'urn:epc:raw:', 0x22: 'urn:epc:', 0x23: 'urn:nfc:'
  };

  // 字节转字符串
  const bytesToString = (bytes, encoding = 'utf-8') => {
    try {
      return new TextDecoder(encoding).decode(bytes);
    } catch (e) {
      let str = '';
      for (let i = 0; i < bytes.length; i++) {
        str += String.fromCharCode(bytes[i]);
      }
      return decodeURIComponent(escape(str));
    }
  };

  // 解码URI记录
  const decodeUri = (payload) => {
    if (payload.length === 0) return { type: 'uri', value: '' };
    const protocol = URI_PROTOCOLS[payload[0]] || '';
    const uriPart = bytesToString(payload.slice(1));
    return { type: 'uri', value: protocol + uriPart };
  };

  // 解码文本记录
  const decodeText = (payload) => {
    if (payload.length === 0) return { type: 'text', value: '', language: '' };
    const statusByte = payload[0];
    const isUtf16 = (statusByte & 0x80) !== 0;
    const langLen = statusByte & 0x3F;
    const language = bytesToString(payload.slice(1, 1 + langLen));
    const text = bytesToString(payload.slice(1 + langLen), isUtf16 ? 'utf-16' : 'utf-8');
    return { type: 'text', value: text, language };
  };

  // 解码外部类型
  const decodeExternal = (typeBytes, payload) => {
    const mimeType = bytesToString(typeBytes);
    let value = bytesToString(payload);
    if (mimeType.includes('json')) {
      try { value = JSON.parse(value); } catch (e) {}
    }
    return { type: 'external', mimeType, value };
  };

  // 主解码逻辑
  const results = [];
  console.log('\n========== NFC数据解码开始 ==========');
  
  if (!nfcData.messages || nfcData.messages.length === 0) {
    console.log('⚠️ 没有找到NFC消息');
    return results;
  }

  nfcData.messages.forEach((message, msgIdx) => {
    console.log(`\n📦 消息 ${msgIdx + 1}: 包含 ${message.records?.length || 0} 条记录`);
    
    if (!message.records) return;

    message.records.forEach((record, recIdx) => {
      try {
        const typeBytes = new Uint8Array(record.type);
        const idBytes = new Uint8Array(record.id);
        const payloadBytes = new Uint8Array(record.payload);
        const typeStr = bytesToString(typeBytes);
        const idStr = idBytes.length > 0 ? bytesToString(idBytes) : '';

        let decoded = { tnf: record.tnf, typeString: typeStr, id: idStr };

        // 根据TNF类型解码
        if (record.tnf === 1) { // Well-Known Type
          if (typeStr === 'U') {
            Object.assign(decoded, decodeUri(payloadBytes));
          } else if (typeStr === 'T') {
            Object.assign(decoded, decodeText(payloadBytes));
          } else {
            decoded.type = 'unknown';
            decoded.value = bytesToString(payloadBytes);
          }
        } else if (record.tnf === 4) { // External Type
          Object.assign(decoded, decodeExternal(typeBytes, payloadBytes));
        } else {
          decoded.type = 'unsupported';
          decoded.value = bytesToString(payloadBytes);
        }

        results.push({ messageIndex: msgIdx, recordIndex: recIdx, ...decoded });

        // 打印解码结果
        console.log(`\n📄 记录 ${recIdx + 1}:`);
        console.log(`   TNF: ${record.tnf} | Type: ${typeStr || '(空)'}`);
        console.log(`   数据类型: ${decoded.type}`);
        
        if (decoded.type === 'uri') {
          console.log(`   🔗 URI内容: ${decoded.value}`);
        } else if (decoded.type === 'text') {
          console.log(`   📝 文本内容: ${decoded.value}`);
          console.log(`   🌍 语言: ${decoded.language || 'unknown'}`);
        } else if (decoded.type === 'external') {
          console.log(`   📋 MIME类型: ${decoded.mimeType}`);
          console.log(`   🆔 记录ID: ${decoded.id || '(无)'}`);
          console.log(`   💾 数据内容:`, typeof decoded.value === 'object' 
            ? JSON.stringify(decoded.value, null, 2) 
            : decoded.value);
        } else {
          console.log(`   ❓ 原始内容: ${decoded.value}`);
        }
        
        console.log(`   📊 字节信息: Type=${typeBytes.length}, ID=${idBytes.length}, Payload=${payloadBytes.length}`);

      } catch (error) {
        console.error(`❌ 记录 ${recIdx + 1} 解码失败:`, error.message);
        results.push({ 
          messageIndex: msgIdx, 
          recordIndex: recIdx, 
          error: error.message 
        });
      }
    });
  });

  console.log('\n========== 解码完成 ==========');
  console.log(`✅ 成功解码 ${results.filter(r => !r.error).length}/${results.length} 条记录\n`);
  
  return results;
}


import { i18n,lang } from '../../../../i18n/lang'
Page({
  onShareAppMessage() {
    return {
      title: 'nfc',
      path: 'packageAPI/pages/device/nfc/nfc'
    }
  },

  data: {
    tech: [],
    pairTech: [], // Matching protocol
    handleList: [], // Specific methods of the object
    device: '',
    message: '',
    theme: 'light'
  },
  // Listening function
  discovered(res) {
    // function discoverHandler(res) {
    //     if (res.techs.includes(nfc.tech.ndef)) {
    //       console.log(res.messages)
    //       const ndef = nfc.getNdef()
    //       ndef.writeNdefMessage({
    //         uris: [''],
    //         complete(res) {
    //           console.log('res:', res)
    //         }
    //       })
    //       return
    //     }

    //     if (res.techs.includes(nfc.tech.nfcA)) {
    //       const nfcA = nfc.getNFCA()
    //       nfcA.transceive({
    //         data: new ArrayBuffer(0),
    //         complete(res) {
    //           console.log('res:', res)
    //         }
    //       })
    //       return
    //     }
    //   }
    console.log('discovered---------------> res', res);
    const { techs, messages = [i18n['nfc9']] } = res;

    decodeNFCData(res);

    const {records} = messages[0];
    const record = records[0];

    function hexToUtf8Str(hexStr) {
      let str = '';
      for (let i = 0; i < hexStr.length; i += 2) {
        const charCode = parseInt(hexStr.substr(i, 2), 16);
        str += String.fromCharCode(charCode);
      }
      return str;
    }

    function ab2hex(buffer) {

      var hexArr = Array.prototype.map.call(

        new Uint8Array(buffer),

        function (bit) {

          return ('00' + bit.toString(16)).slice(-2)

        }

      )

      return hexArr.join('');

    }

    function arrayBufferToUtf8Str(buffer) {
      const uint8 = new Uint8Array(buffer);
      let str = '';
      let i = 0;
      const len = uint8.length;

      // 逐字节解析，严格按 UTF-8 规则（兼容所有多字节）
      while (i < len) {
        const c = uint8[i];
        // 1. 单字节（ASCII）：0x00-0x7F
        if (c < 0x80) {
          str += String.fromCharCode(c);
          i++;
        }
        // 2. 双字节：0xC0-0xDF（少见，兼容）
        else if (c >= 0xC0 && c <= 0xDF && i+1 < len) {
          const code = ((c & 0x1F) << 6) | (uint8[i+1] & 0x3F);
          str += String.fromCharCode(code);
          i += 2;
        }
        // 3. 三字节（中文核心）：0xE0-0xEF
        else if (c >= 0xE0 && c <= 0xEF && i+2 < len) {
          const code = ((c & 0x0F) << 12) | ((uint8[i+1] & 0x3F) << 6) | (uint8[i+2] & 0x3F);
          str += String.fromCharCode(code);
          i += 3;
        }
        // 4. 四字节（emoji，兼容）
        else if (c >= 0xF0 && c <= 0xF7 && i+3 < len) {
          const code = ((c & 0x07) << 18) | ((uint8[i+1] & 0x3F) << 12) | ((uint8[i+2] & 0x3F) << 6) | (uint8[i+3] & 0x3F);
          str += String.fromCodePoint(code);
          i += 4;
        }
        // 无效字节：跳过（避免乱码扩散）
        else {
          i++;
        }
      }
      return str;
    }


    records.map(record => {
      if (record.tnf === 1) {
        const payload = record.payload;
        const uint8 = new Uint8Array(payload);
        
        // ========== 关键调试：打印完整payload信息 ==========
        console.log('完整payload字节数：', uint8.length);
        console.log('完整payload十六进制：', ab2hex(payload));
        
        // ========== 精准计算语言码长度和起始位置 ==========
        const statusByte = uint8[0];
        const langLength = statusByte & 0x1F; // 状态字节低5位=语言码长度
        console.log('状态字节：', statusByte.toString(16)); // 比如0x02（语言码长度2）
        console.log('计算的语言码长度：', langLength);
        
        // 校验：语言码长度不能超过payload剩余长度（防止越界）
        const contentStart = 1 + langLength;
        if (contentStart >= uint8.length) {
          console.error('语言码长度计算错误，有效内容起始位置越界！');
          return;
        }
        
        // ========== 截取完整的有效内容 ==========
        const contentUint8 = uint8.slice(contentStart);
        console.log('有效内容字节数：', contentUint8.length);
        console.log('有效内容十六进制：', ab2hex(contentUint8.buffer));
        
        // ========== 解码（解决乱码） ==========
        const result = arrayBufferToUtf8Str(contentUint8.buffer);
        console.log('最终解析结果：', result); // 完整且无乱码
      }
    })

    this.setData({
      pairTech: techs,
      message: messages.join(';\n')
    });
  },
  
  newDevice(e) {
    const method = e.currentTarget.dataset.method;
    console.log('Instantiating --------------- method', method);
    this.setData({
      device: method
    })
    const { key, value: newFn, action } = this.fnMap[method];
    console.log('this.fnMap --------------', JSON.stringify(this.fnMap));
    console.log('adapter\'s method', key, ' ---------------called', newFn);
    // Instantiate an object
    this.targetPair = newFn();
    this.setData({
      handleList: action
    });
  },

  doMethod(e) {
    const { device } = this.data;
    const method = e.currentTarget.dataset.method;
    let fn = this.targetPair[method];
    fn = fn.bind(this.targetPair);
    const toastMsg = `${device}-${method}`;

    if (method === 'writeNdefMessage') { // ndef
      fn({
        uris: [
          'https://www.example.com',      // 网址
          'tel:+8612345678901',            // 电话号码
          'mailto:test@example.com'        // 邮箱
        ],
        texts: [
          'Hello NFC',           // 英文问候
          '你好 NFC',            // 中文问候
          'Test message 123'     // 测试消息
        ],
        records: new ArrayBuffer(8), // Binary object array, specifying id, type, and payload (all of ArrayBuffer type)
        complete(res) {
          console.log(`${toastMsg} complete---------------`, res);
          wx.showToast({
            title: `${toastMsg}--- ${JSON.stringify(res)}`,
            duration: 1000
          })
        }
      })
    } else if (method === 'offNdefMessage') {  // ndef
      console.log('offNdefMessage ---------------call');
      fn((res) => {
        console.log(`${toastMsg} call---------------`, res);
        wx.showToast({
          title: `${toastMsg}offNdefMessage --- ${JSON.stringify(res)}`,
          duration: 1000
        })
      })
    } else if (method === 'onNdefMessage') {  // ndef
      console.log('onNdefMessage ---------------call');
      fn((res) => {
        console.log(`${toastMsg} call---------------`, res);
        wx.showToast({
          title: `${toastMsg}onNdefMessage --- ${JSON.stringify(res)}`,
          duration: 1000
        })
      })
    } else if (method === 'transceive') { // Write a separate case for passing data
      fn({
        data: new ArrayBuffer(16),
        complete(res) {
          console.log(`${toastMsg} complete---------------`, res);
          wx.showToast({
            title: `${toastMsg}--- ${JSON.stringify(res)}`,
            duration: 1000
          })
        }
      })
    } else { // Common examples for success, fail, and complete
      fn({
        success: function (res) {
          console.log(`${toastMsg} success---------------`, res)
          wx.showToast({
            title: `${toastMsg}${i18n['nfc10']}`,
            duration: 1000
          });
        }, fail: function (faile) {
          console.log(`${toastMsg} fail---------------`, faile)
          wx.showToast({
            title: `${toastMsg}${i18n['nfc11']}`,
            duration: 1000
          });
        }
      })
    }
  },

  start() {
    if (this.adapter) {
      console.log('Destroying old instance ---------------');
      this.adapter.offDiscovered(this.discovered);
      this.adapter.stopDiscovery();
      this.adapter = null;
    }
    const adapter = wx.getNFCAdapter();
    if (!adapter) {
      return;
    }
    this.adapter = adapter;
    console.log('Mini-program demo adapter ---------------', this.adapter);
    console.log('Mini-program demo adapter\'s tech ---------------', this.adapter.tech);
    const tech = Object.keys(adapter.tech);

    this.fnMap = {};
    tech.forEach(item => {
      const all = item.split('');
      const firstLetter = all.splice(0, 1);
      const fnName = 'get' + firstLetter.join('').toUpperCase() + all.join('');
      this.fnMap[item] = {
        key: fnName,
        value: adapter[fnName],
        action: actionList[item]
      }
    })
    this.setData({
      tech
      
    });
    adapter.onDiscovered(this.discovered);
  },

  startDiscovery() {
    this.adapter.startDiscovery({
      success: function (res) {
        wx.showToast({
          title: i18n['nfc0'],
          duration: 1000
        });
      },
      faile: function () {
        wx.showToast({
          title: i18n['nfc1'],
          duration: 1000
        });
      }
    })
  },

  stopDiscovery() {
    this.adapter.stopDiscovery({
      success: function (res) {
        wx.showToast({
          title: i18n['nfc2'],
          duration: 1000
        });
      },
      faile: function () {
        wx.showToast({
          title: i18n['nfc3'],
          duration: 1000
        });
      }
    })
  },

  getNFCAdapter() {
    this.start();
    console.log(this.adapter, '---------------adapter');
  },

  onLoad() {
    this.setData({
      t: i18n,
      lang
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  }
})
