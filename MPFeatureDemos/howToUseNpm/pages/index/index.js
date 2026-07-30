let sjcl;
try {
    sjcl = require('sjcl');
} catch (err) { }

const SJCL = {
  init() {
    if (sjcl) {
      sjcl.random.addEntropy((new Date()).getTime(), 200);
      sjcl.random.addEntropy(Math.random(), 200);
    }
    return sjcl;
  },
  str2hex(str) {
    if (str === '') return '';
    let arr = [];
    for (let i = 0; i < str.length; i++) {
      arr.push(str.charCodeAt(i).toString(16));
    }
    return arr.join('');
  },

  rightPad(str, targetLength, padChar) {
    return str + Array(targetLength - str.length + 1).join(padChar);
  },

  getKey(pd) {
    if (pd) {
      const pdLen = pd.length;
      if (pdLen > 32) pd = pd.slice(0, 32);
      else if (pdLen > 24 && pdLen < 32) pd = pd.slice(0, 24);
      else if (pdLen > 16 && pdLen < 24) pd = pd.slice(0, 16);
      else if (pdLen < 16) pd = this.rightPad(pd, 16, '0');
    } else {
      pd = this.rightPad('', 32, '0');
    }
    return sjcl.codec.hex.toBits(this.str2hex(pd));
  },

  getRandomIv() {
    const ivBits = sjcl.random.randomWords(3);
    return sjcl.codec.base64.fromBits(ivBits);
  },

  encrypt(pd, data) {
    const key = this.getKey(pd);
    const iv = this.getRandomIv();
    let encryptedData = sjcl.encrypt(key, JSON.stringify(data), { mode: 'gcm', ts: 128, iv });
    encryptedData = JSON.parse(encryptedData);
    return {
      iv: encryptedData.iv,
      ct: encryptedData.ct
    }
  },

  decrypt(pd, data) {
    const key = this.getKey(pd);
    const encryptedData = Object.assign(data, { mode: 'gcm', ts: 128 });
    const plainText = sjcl.decrypt(key, JSON.stringify(encryptedData));
    return JSON.parse(plainText);
  },
}

Page({
  data: {
    plaintext: 'Hello, World!!!',
    iv: '',
    secret: '',
    decryptedText: '',
    npmInit: true
  },
  onLoad: function () {
    const init = SJCL.init();
    if (init) {
      const encryptedData = SJCL.encrypt("123", this.data.plaintext);
      this.setData({
        iv: encryptedData.iv,
        secret: encryptedData.ct
      });
      const decryptedText = SJCL.decrypt("123", encryptedData);
      this.setData({
        decryptedText: decryptedText
      })
    } else {
      this.setData({
        npmInit: false
      })
    }
  },
});