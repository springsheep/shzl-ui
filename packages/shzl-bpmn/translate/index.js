/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2021-08-31 14:02:10
 * @LastEditors: 张鹏
 * @LastEditTime: 2021-08-31 14:04:09
 */
import translations from './lang/zh';

export default function customTranslate(template, replacements) {
   replacements = replacements || {};

   // Translate
   template = translations[template] || template;

   // Replace
   return template.replace(/{([^}]+)}/g, function(_, key) {
      var str = replacements[key];
      if (translations[replacements[key]] !== null && translations[replacements[key]] !== 'undefined') {
         str = translations[replacements[key]];
      }
      return str || '{' + key + '}';
   });
}
