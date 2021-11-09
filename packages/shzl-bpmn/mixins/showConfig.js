/*
 * @Author: your name
 * @Date: 2021-05-18 14:30:57
 * @LastEditTime: 2021-05-18 15:05:06
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /sgup-web-front/src/views/bpmn/compotents/VueBpmn/mixins/showConfig.js
 */
export default {
  'bpmn:StartEvent': {
    form: true,
    formKey: true,
    candidate: true,
    initiator: true
  },
  'bpmn:EndEvent': {
  },
  'bpmn:UserTask': {
    taskCategory: true,
    candidate: true,
    assignee: true,
    candidateUsers: true,
    candidateGroups: true,
    // async: true,
    // priority: true,
    // skipExpression: true,
    // dueDate: true,
    form: true,
    formKey: true,
    buttons: true,
    multiInstance: true,
    taskListener: true
  },
  'bpmn:ServiceTask': {
    // async: true,
    // skipExpression: true,
    // isForCompensation: true,
    // triggerable: true,
    // class: true,
  },
  'bpmn:ScriptTask': {
    // async: true,
    // isForCompensation: true,
    // autoStoreVariables: true,
  },
  'bpmn:ManualTask': {
    // async: true,
    // isForCompensation: true,
  },
  'bpmn:ReceiveTask': {
    // async: true,
    // isForCompensation: true,
  },
  'bpmn:SendTask': {
    // async: true,
    // isForCompensation: true
  },
  'bpmn:BusinessRuleTask': {
    // async: true,
    // isForCompensation: true,
    // ruleVariablesInput: true,
    // rules: true,
    // resultVariable: true,
    // exclude: true,
  },
  'bpmn:SubProcess': {
    // async: true,
    // isForCompensation: true,
    // ruleVariablesInput: true,
    // rules: true,
    // resultVariable: true,
    // exclude: true,
    multiInstance: true,
  },
  'bpmn2:intermediateThrowEvent': {
  },
  'bpmn:SequenceFlow': {
    conditionExpression: true
  }
}
