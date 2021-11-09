<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-08-31 14:54:29
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 15:21:33
-->

# shzl-bpmn

## 如何使用？

```html
<shzl-bpmn @save="btnSave" :modelData="modelData" ref="bpmn" class="content" />
```

```js 初始化配置
data: {
   return {
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
methods:{
   btnSave(modelData) {
     //获取到工作流信息
      console.log(modelData);

    }
}
```

| <div style="width: 120px;">参数 </div> | <div style="width: 287px;">说明</div> | <div style="width: 100px;">默认值</div> |
| :------------------------------------: | :-----------------------------------: | :-------------------------------------: |
|                 isView                 |        控制 bpmn 是否是可操作         |                  false                  |
|               modelData                |              初始化数据               |           object（如上 data）           |

| <div style="width: 120px;">事件 </div> | <div style="width: 287px;">说明</div> |
| :------------------------------------: | :-----------------------------------: |
|            createNewDiagram            |           设置 bpmn 工作流            |
|              handleClear               |              清除工作流               |
|                btnSave                 |              获取工作流               |

#### 设置 bpmn 工作流

this.\$refs.bpmn.createNewDiagram(res.data);

#### 清除工作流

this.\$refs.bpmn.handleClear();

#### 事件

btnSave 获取工作流
