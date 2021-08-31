<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-08-31 10:57:15
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 15:26:33
-->

本插件仿照[Angular 的 color-picker]("http://zhangbobell.github.io/color-picker/)写来

```html
<template>
   <shzlColorPicker v-model="color" />
</template>
```

```js
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

你可以通过在所在的元素上设置以下属性来配置 shzl-color-picker

| <div style="width: 120px;">属性 </div> | <div style="width: 287px;">说明</div> |
| :------------------------------------: | :-----------------------------------: |
|              defaultColor              |  默认颜色，如 defaultColor="#ff0000"  |
|                disabled                |      禁用状态，如 disabled=true       |

| <div style="width: 120px;">事件 </div> | <div style="width: 287px;">说明</div> |
| :------------------------------------: | :-----------------------------------: |
|                 change                 |         颜色值改变的时候触发          |

```js
<shzlColorPicker v-model='color' v-on:change='headleChangeColor'></shzlColorPicker>
```
