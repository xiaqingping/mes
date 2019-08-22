import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enUs from './locale/en-US';
import zhCn from './locale/zh-CN';

Vue.use(VueI18n);

const defaultLanguage = 'zh-CN';

const i18n = new VueI18n({
  locale: 'zh-CN', // 语言标识
  fallbackLocale: defaultLanguage,
  messages: {
    'zh-CN': enUs,
    'en-US': zhCn
  }
});
export default i18n;
