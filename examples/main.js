/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 14:29:17
 */
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, {
   size: 'small',
   zIndex: 3000,
});
import hljs from 'highlight.js';
import 'highlight.js/styles/railscasts.css';
import shzlUi from './../packages/index';
Vue.use(shzlUi);

Vue.directive('hljs', (el) => {
   let blocks = el.querySelectorAll('pre');
   Array.prototype.forEach.call(blocks, hljs.highlightBlock);
});

Vue.config.productionTip = false;

new Vue({
   render: (h) => h(App),
}).$mount('#app');
