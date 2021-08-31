/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 09:39:06
 */
module.exports = {
   lintOnSave: false,
   // 修改 src 为 examples
   pages: {
      index: {
         entry: 'examples/main.js',
         template: 'public/index.html',
         filename: 'index.html',
      },
   },
   // 强制内联CSS
   css: { extract: false },
};
