/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-08-31 10:56:45
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 10:57:13
 */
/*
 * @Author: your name
 * @Date: 2021-06-28 10:52:02
 * @LastEditTime: 2021-08-31 10:56:01
 * @LastEditors: 张鹏
 * @Description: In User Settings Edit
 * @FilePath: \sgup-web-front\docs\.vuepress\config.js
 */
module.exports = {
   title: 'shzl-ui说明文档',
   description: '社会治理',
   themeConfig: {
      nav: [
         { text: 'cui', link: 'http://10.12.102.194/cui/#/zh-CN/rate' },
         { text: 'npm仓库', link: 'http://10.12.102.194:4873/' },
      ],
      sidebar: [
         {
            title: '关于shzl-ui',
            path: '/',
            collapsable: false,
         },
         {
            title: '组件',

            children: [
               { title: '颜色选择器', path: '/components/shzl-color-picker' },
               { title: '自定义表单', path: '/components/shzl-genrator-form' },
            ],
         },
      ],
   },
   configureWebpack: {
      resolve: {
         alias: {
            assets: 'assets',
         },
      },
   },
};
