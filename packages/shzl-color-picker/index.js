/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-30 15:46:00
 */
// 导入组件
import shzlColorPicker from './src/shzl-color-picker.vue';

// 为组件提供 install 安装方法，供按需引入
shzlColorPicker.install = function(Vue) {
   Vue.component(shzlColorPicker.name, shzlColorPicker);
};

// 默认导出组件
export default shzlColorPicker;
