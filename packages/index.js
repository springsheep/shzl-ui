/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 13:48:35
 */
import VueI18n from 'vue-i18n';
import enUS from './shzl-genrator-form/lang/en-US';
import zhCN from './shzl-genrator-form/lang/zh-CN';
import './shzl-genrator-form/iconfont/iconfont.css';
import './shzl-genrator-form/styles/cover.scss';
import './shzl-genrator-form/styles/index.scss';
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
// 导入颜色选择器组件
import shzlColorPicker from './shzl-color-picker';
import shzlGenratorForm from './shzl-genrator-form';
import shzlBpmn from './shzl-bpmn';

let shzlMakingForm = shzlGenratorForm.shzlMakingForm;
let shzlGenerateForm = shzlGenratorForm.shzlGenerateForm;
// 存储组件列表
const components = [shzlColorPicker, shzlMakingForm, shzlGenerateForm, shzlBpmn];

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function(
   Vue,
   opts = {
      lang: 'zh-CN',
      locale: null,
      i18n: null,
   }
) {
   // 判断是否可以安装
   if (install.installed) return;
   loadLang(Vue, opts.lang, opts.locale, opts.i18n);
   // 遍历注册全局组件
   components.map((component) => Vue.component(component.name, component));
};

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
   install(window.Vue);
}

export default {
   // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
   install,
   // 以下是具体的组件列表
   shzlColorPicker,
   shzlMakingForm,
   shzlGenerateForm,
   shzlBpmn,
};
