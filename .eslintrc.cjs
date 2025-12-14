/*
 * @Author: liaokt
 * @Description: ESLint 配置文件 - Vue 3 + TypeScript 项目代码检查配置
 * @Date: 2025-11-27
 * @LastEditors: liaokt
 */

/* eslint-env node */
require('@vue/eslint-config-prettier')

module.exports = {
  // 标识为根配置文件，停止向上查找其他配置文件
  root: true,

  // 环境配置：定义代码运行的环境
  env: {
    browser: true, // 浏览器环境（window, document 等全局变量）
    es2021: true, // ES2021 语法支持
    node: true // Node.js 环境（process, __dirname 等全局变量）
  },

  // 继承的规则配置（按优先级从低到高排列）
  extends: [
    'eslint:recommended', // ESLint 推荐规则
    'plugin:vue/vue3-essential', // Vue 3 必需规则
    'plugin:vue/vue3-strongly-recommended', // Vue 3 强烈推荐规则
    'plugin:vue/vue3-recommended', // Vue 3 推荐规则
    '@vue/eslint-config-typescript', // Vue TypeScript 配置
    '@vue/eslint-config-prettier' // Prettier 兼容配置（必须放在最后）
  ],

  // 解析器配置
  parserOptions: {
    parser: '@typescript-eslint/parser', // 使用 TypeScript 解析器
    ecmaVersion: 'latest', // 支持最新的 ECMAScript 版本
    sourceType: 'module', // 使用 ES 模块
    jsxPragma: 'React', // JSX 转换函数（虽然是 Vue 项目，但为了兼容）
    ecmaFeatures: {
      jsx: true // 启用 JSX 语法支持
    }
  },

  /**
   * 自定义规则配置
   *
   * 规则级别说明：
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    // ===== ESLint 基础规则 (http://eslint.cn/docs/rules) =====
    'no-var': 'error', // 要求使用 let 或 const 而不是 var
    'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
    'prefer-const': 'off', // 使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    'no-use-before-define': 'off', // 禁止在函数/类/变量定义之前使用它们

    // ===== TypeScript 规则 (https://typescript-eslint.io/rules) =====
    '@typescript-eslint/no-unused-vars': 'off', // 禁止定义未使用的变量
    '@typescript-eslint/prefer-ts-expect-error': 'warn', // 禁止使用 @ts-ignore
    '@typescript-eslint/ban-ts-comment': 'off', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    '@typescript-eslint/no-inferrable-types': 'off', // 可以轻松推断的显式类型可能会增加不必要的冗长
    '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
    '@typescript-eslint/no-empty-object-type': 'off', // 禁止使用空对象类型
    '@typescript-eslint/no-empty-interface': 'off', // 禁止使用空接口
    '@typescript-eslint/no-empty-function': 'off', // 禁止使用空函数

    // ===== Vue 规则 (https://eslint.vuejs.org/rules) =====
    'vue/multi-word-component-names': 'off', // 允许单词组件名（如：Button, Modal）
    'vue/no-v-html': 'off', // 允许使用 v-html（在可信内容中使用）
    'vue/script-setup-uses-vars': 'error', // 防止 <script setup> 使用的变量在 <template> 中被标记为未使用
    'vue/v-slot-style': 'error', // 强制执行 v-slot 指令样式
    'vue/no-mutating-props': 'error', // 不允许改变组件 prop
    'vue/custom-event-name-casing': 'error', // 为自定义事件名称强制使用特定大小写
    'vue/html-closing-bracket-newline': 'error', // 在标签的右括号之前要求或禁止换行
    'vue/attribute-hyphenation': 'error', // 对模板中的自定义组件强制执行属性命名样式：my-prop="prop"
    'vue/attributes-order': 'off', // 关闭属性顺序检查
    'vue/require-default-prop': 'off' // 关闭 prop 默认值要求
  }
}
