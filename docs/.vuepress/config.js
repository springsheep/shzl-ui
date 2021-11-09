/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-08-31 10:56:45
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 15:31:48
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
         { text: 'cui', link: 'https://github.com/springsheep/shzl-ui' },
         { text: 'npm仓库', link: 'https://www.npmjs.com/package/shzl-ui' },
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
               { title: '工作流', path: '/components/shzl-bpmn' },
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
