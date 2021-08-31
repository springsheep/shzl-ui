<!--
 * @Author: your name
 * @Date: 2021-06-28 16:49:43
 * @LastEditTime: 2021-08-31 15:42:45
 * @LastEditors: 张鹏
 * @Description: In User Settings Edit
 * @FilePath: \sgup-web-front\docs\README.md
-->

## 关于文档更新

请参考[vue-press](https://vuepress.vuejs.org/)

## 关于项目 UI 组件

请移步[cui](http://10.12.102.194/cui/#/zh-CN/rate)  
也可从右上角进入

## 关于 cp 的公司自建组件

请参考[内网 npm 仓库](http://10.12.102.194:4873/)  
也可从右上角进入  
或询问相关开发者

<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-30 16:27:52
-->

# shzl-ui

> 基于 Vue 和 element 的组件

<!-- [DEMO 演示](http://vue-color-picker.rxshc.com/) -->

## 安装

```bash
$ npm install @shzl/shzl-ui -S
```

## 使用

在 `main.js` 文件中引入插件并注册

```bash
# main.js
import shzlUi from 'shzl-ui';
Vue.use(shzlUi);

```

在项目中使用 vcolorpicker

```js
<template>
     <shzl-color-picker v-model="color" />
</template>
<script>
  export default {
    data () {
      return {
        color: '#ff0000'
      }
    }
  }
</script>
```
