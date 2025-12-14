/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-12-05 17:13:43
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-09 09:27:39
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
  'M03', // 系统设置
  'M0301', // 角色管理（原 M02）
  'M0302', // SQL 生成工具（原 M0303）
  'M0303',
  // 操作权限（按钮权限）
  'A010101', // 新增用户
  'A010102', // 编辑用户
  'A010103', // 删除用户
  'A010104', // 查看用户
  'A010105', // 导出用户
  'A030101', // 新增角色（原 A020101）
  'A030102', // 编辑角色（原 A020102）
  'A030103', // 删除角色（原 A020103）
  'A030104', // 查看角色（原 A020104）
  'A030105', // 分配权限（原 A020105）
  'A030201', // 生成 SQL（原 A030301）
  'A030202' // 下载 SQL（原 A030302）
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
    permissions: ['M01', 'A010104'],
    isSystem: false
  },
  {
    code: 'guest',
    name: '访客',
    description: '访客用户，只读权限',
    permissions: ['A010104', 'A030104'],
    isSystem: false
  }
]
