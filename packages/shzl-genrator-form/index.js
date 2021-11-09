/*
 * @Author: your name
 * @Date: 2021-07-26 17:26:21
 * @LastEditTime: 2021-08-31 11:01:39
 * @LastEditors: 张鹏
 * @Description: In User Settings Edit
 * @FilePath: /sgup-admin/src/component/genform/index.js
 */
import VueI18n from 'vue-i18n';
// import "normalize.css/normalize.css";

import shzlMakingForm from './components/Container.vue';
import shzlGenerateForm from './components/GenerateForm.vue';

import enUS from './lang/en-US';
import zhCN from './lang/zh-CN';

import './iconfont/iconfont.css';
import './styles/cover.scss';
import './styles/index.scss';

const loadLang = function(Vue, lang, locale, i18n) {
   if (locale) {
      locale('en-US', { ...locale('en-US'), ...enUS });
      locale('zh-CN', { ...locale('zh-CN'), ...zhCN });
      Vue.config.lang = lang;
   } else if (i18n) {
      i18n.setLocaleMessage('en-US', { ...i18n.messages['en-US'], ...enUS });
      i18n.setLocaleMessage('zh-CN', { ...i18n.messages['zh-CN'], ...zhCN });
      i18n.locale = lang;
   } else {
      Vue.use(VueI18n);
      Vue.locale('en-US', { ...Vue.locale('en-US'), ...enUS });
      Vue.locale('zh-CN', { ...Vue.locale('zh-CN'), ...zhCN });
      Vue.config.lang = lang;
   }
};

shzlMakingForm.install = function(
   Vue,
   opts = {
      lang: 'zh-CN',
      locale: null,
      i18n: null,
   }
) {
   loadLang(Vue, opts.lang, opts.locale, opts.i18n);
   Vue.component(shzlMakingForm.name, shzlMakingForm);
};

shzlGenerateForm.install = function(
   Vue,
   opts = {
      lang: 'zh-CN',
      locale: null,
      i18n: null,
   }
) {
   loadLang(Vue, opts.lang, opts.locale, opts.i18n);
   Vue.component(shzlGenerateForm.name, shzlGenerateForm);
};

// const components = [shzlMakingForm, GenerateForm];

// const install = function(
//    Vue,
//    opts = {
//       lang: 'zh-CN',
//       locale: null,
//       i18n: null,
//    }
// ) {
//    loadLang(Vue, opts.lang, opts.locale, opts.i18n);
//    components.forEach((component) => {
//       Vue.component(component.name, component);
//    });
// };

// if (typeof window !== 'undefined' && window.Vue) {
//    install(window.Vue);
// }

// export { install, shzlMakingForm, GenerateForm };

export default {
   shzlMakingForm,
   shzlGenerateForm,
};
