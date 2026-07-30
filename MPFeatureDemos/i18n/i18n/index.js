import en_US from './locales/en-US';
import id_ID from './locales/id_ID';

const LANGUAGES = {
  EN_US: 'en_US',
  ID_ID: 'id_ID'
};

const wordsMap = {
  [LANGUAGES.EN_US]: en_US,
  [LANGUAGES.ID_ID]: id_ID,
};

const systemLang = wx.getSystemInfoSync().language.toLowerCase();

let currentLang = LANGUAGES.EN_US;
let i18n = wordsMap[currentLang];

(function initLanguage() {
  if (systemLang.startsWith('en')) {
    currentLang = LANGUAGES.EN_US;
  } else if (systemLang.startsWith('id')) {
    currentLang = LANGUAGES.ID_ID;
  }
  i18n = wordsMap[currentLang];
})();

function changeLang(language) {
  if (!Object.values(LANGUAGES).includes(language)) {
    console.warn(`Unsupported language: ${language}`);
    return;
  }
  currentLang = language;
  i18n = wordsMap[language];
  wx.setStorageSync("lang", language);
}

function getLang() {
  return currentLang;
}

export { i18n, currentLang as lang, changeLang, getLang };