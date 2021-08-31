/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 14:25:36
 */
// 导入组件
import shzlBpmn from './index.vue';

// 为组件提供 install 安装方法，供按需引入
shzlBpmn.install = function(Vue) {
   Vue.component(shzlBpmn.name, shzlBpmn);
};

// 默认导出组件
export default shzlBpmn;
