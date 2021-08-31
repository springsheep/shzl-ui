<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-02-24 14:31:51
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 15:28:43
-->
<template>
   <div id="app" class="app">
      <!-- <shzlBpmn :modelData="modelData" ref="bpmn" class="content" />
      <shzl-making-form ref="makingform" style="height: 100%;" preview generate-code generate-json @getJson="getJson" @back="$router.back()">
         <template slot="action"> </template>
      </shzl-making-form> -->
      <div class="page-header">
         <h1>shzlUi</h1>
         <h2>基于 社会治理二部的 组件库</h2>
         <a href="https://www.npmjs.com/package/shzl-ui" class="btn" target="_blank">View on GitHub</a>
      </div>
      <!-- <div class="page-content" v-hljs>
         <h1>vColorPicker</h1>
         <p>
            本插件仿照<code>Angular</code>的<code><a href="http://zhangbobell.github.io/color-picker/" target="_blank">color-picker</a></code
            >插件制作
         </p>
         <h2>Demo</h2>
         <shzl-color-picker v-model="color" v-on:change="headleChangeColor"></shzl-color-picker>&nbsp; <br /><br />
         <shzl-color-picker v-model="color2"></shzl-color-picker>
         <h2>特点</h2>
         <ol>
            <li>简单易用，UI在原插件基础上优化增加了圆角和过渡动画</li>
            <li>提供以 npm 的形式安装提供全局组件</li>
            <li>在支持 html5 input[type='color'] 的浏览器实现了「更多颜色」的功能</li>
         </ol>
         <h2>安装</h2>
         <pre>$ npm install vcolorpicker -S</pre>
         <h2>使用</h2>
         <h3>在 `main.js` 文件中引入插件并注册</h3>
         <pre>
# main.js
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)
</pre
         >
         <h3>在项目中使用 vcolorpicker</h3>
         <pre>
&lt;template&gt;
  &lt;shzl-color-picker v-model=&quot;color&quot; /&gt;
&lt;/template&gt;
&lt;script&gt;
  export default {
    data () {
      return {
        color: &#x27;#ff0000&#x27;
      }
    }
  }
&lt;/script&gt;</pre
         >
         <h2>选项</h2>
         <p>你可以通过在所在的元素上设置以下属性来配置<code>color-picker</code></p>
         <ol>
            <li><code>defaultColor</code>：默认颜色，如<code>defaultColor="#ff0000"</code></li>
            <li><code>disabled</code>：禁用状态，如<code>disabled=true</code></li>
         </ol>
         <h2>事件</h2>
         <p><code>change</code>颜色值改变的时候触发</p>
         <pre>
&lt;shzl-color-picker v-model=&quot;color&quot; v-on:change=&quot;headleChangeColor&quot;&gt;&lt;/shzl-color-picker&gt;
</pre
         >
      </div> -->
      <!-- <div class="page-footer">Vue-color-picker 插件由<a href="http://www.rxshc.com/" target="_blank">猪不乐意</a>编写</div> -->
   </div>
</template>

<script>
export default {
   data() {
      return {
         color: '#ff0000',
         color2: '#000000',
         modelData: {
            id: undefined,
            editor: undefined,
            key: 'processId_1',
            name: 'processName_1',
            category: '',
            description: 'description_1',
            xml: '',
         },
      };
   },
   methods: {
      getJson(e) {
         elementPersonTypeput(
            {
               id: this.$route.query.id,
               templateJson: e,
            },
            this.$route.query.id
         ).then((res) => {
            if (res && res.success) {
               this.$message({ type: 'success', message: '更新成功' });
               this.$router.back();
            }
         });
      },
      headleChangeColor(color) {
         console.log(`颜色值改变事件：${color}`);
      },
   },
};
</script>

<style lang="sass">
@import "assets/style.scss";
</style>
<style lang="scss" scoped>
.app {
   background-color: #fff;
   border: 20px solid #f0f2f5 !important;
   padding: 20px;
   position: absolute;
   top: 0;
   right: 0;
   left: 0;
   bottom: 0;
   .fm-style {
      display: flex;
      flex-direction: column;
   }
}
</style>
