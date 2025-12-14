/*
 * @Author: liaokt
 * @Description: Prettier 配置文件 - 代码格式化配置
 * @Date: 2025-11-27
 * @LastEditors: liaokt
 */

module.exports = {
  // ===== 基础格式配置 =====
  printWidth: 100,        // 每行最大字符数
  tabWidth: 2,           // 缩进宽度（空格数）
  useTabs: false,        // 使用空格而不是制表符
  semi: false,           // 不使用分号
  singleQuote: true,     // 使用单引号
  quoteProps: 'as-needed', // 属性名需要时加引号
  trailingComma: 'none', // 不使用尾随逗号
  bracketSpacing: true,  // 对象括号内加空格 { foo: bar }
  bracketSameLine: false, // 多行元素 > 单独一行
  arrowParens: 'avoid',  // 箭头函数单个参数省略括号
  endOfLine: 'lf',        // 换行符使用 LF

  // ===== JSX 相关配置 =====
  jsxSingleQuote: false, // JSX 使用双引号

  // ===== HTML/Vue 相关配置 =====
  htmlWhitespaceSensitivity: 'css',     // HTML 空格敏感度
  vueIndentScriptAndStyle: false,       // Vue 文件 script/style 标签不额外缩进

  // ===== 其他配置 =====
  proseWrap: 'preserve',    // 文本换行方式
  requirePragma: false,     // 不需要 @prettier 标记
  insertPragma: false,      // 不插入 @prettier 标记

  // ===== 范围格式化 =====
  rangeStart: 0,            // 格式化起始位置
  rangeEnd: Infinity        // 格式化结束位置
}
