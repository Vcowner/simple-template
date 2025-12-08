/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-05 17:13:43
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-08 15:42:46
 */
/**
 * 权限模拟数据
 * 用于开发环境，当后端 API 不可用时使用
 */
import type { Role } from './types'

/**
 * 模拟权限数据（开发环境使用）
 */
export const MOCK_PERMISSIONS: string[] = [
  'M01', // 用户管理
  'M0101', // 用户列表
  'M0102', // 用户角色
  'M02', // 角色管理
  'M0201', // 角色列表
  'M03', // 系统设置
  'M0301', // 基础设置
  'M0302', // 安全设置
  'M0303', // SQL 生成工具
  // 操作权限（按钮权限）
  'A010101', // 新增用户
  'A010102', // 编辑用户
  'A010103', // 删除用户
  'A010104', // 查看用户
  'A010105', // 导出用户
  'A020101', // 新增角色
  'A020102', // 编辑角色
  'A020103', // 删除角色
  'A020104', // 查看角色
  'A020105', // 分配权限
  'A030101', // 编辑设置
  'A030102', // 查看设置
  'A030201', // 修改密码
  'A030202' // 查看日志
]

/**
 * 模拟角色数据（开发环境使用）
 */
export const MOCK_ROLES: Role[] = [
  {
    code: 'admin',
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: MOCK_PERMISSIONS,
    isSystem: true
  },
  {
    code: 'user',
    name: '普通用户',
    description: '普通用户，拥有基础权限',
    permissions: ['M01', 'M0101', 'A010104'],
    isSystem: false
  },
  {
    code: 'guest',
    name: '访客',
    description: '访客用户，只读权限',
    permissions: ['A010104', 'A020104'],
    isSystem: false
  }
]
