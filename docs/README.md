<!--
 * @Author: your name
 * @Date: 2021-06-28 16:49:43
 * @LastEditTime: 2021-08-31 10:47:14
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

# vColorPicker

> 基于 Vue 的颜色选择器插件

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

## 特点

1. 简单易用，UI 在原插件基础上优化增加了圆角和过渡动画
2. 提供以 `npm` 的形式安装提供全局组件
3. 在支持 html5 input[type='color'] 的浏览器实现了「更多颜色」的功能

## 选项

你可以通过在所在的元素上设置以下属性来配置`color-picker`

1. `defaultColor`：默认颜色，如`defaultColor="#ff0000"`
2. `disabled`：禁用状态，如`disabled=true`

## 事件

`change`颜色值改变的时候触发

```js
<colorPicker v-model='color' v-on:change='headleChangeColor' />
```
