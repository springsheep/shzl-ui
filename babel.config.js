/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 14:21:27
 */
module.exports = {
   presets: ['@vue/app'],
   plugins: [
      ['@babel/plugin-proposal-optional-chaining'], //解析 可选链式语法
      ['@babel/plugin-proposal-nullish-coalescing-operator'],
   ],
};
