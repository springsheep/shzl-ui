<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-09-23 17:08:23
-->

[说明文档](http://42.192.129.26:8088/)

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
