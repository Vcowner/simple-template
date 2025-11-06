/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-06 10:04:14
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-06 10:04:57
 */
/**
 * Commitlint 配置
 * 使用 Conventional Commits 规范
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档变更
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不增加新功能，也不是修复bug）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
        'ci' // 持续集成修改
      ]
    ],
    // subject 大小写不做校验
    'subject-case': [0]
  }
}
