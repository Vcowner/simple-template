/*
 * @Author: liaokt
 * @Description: 角色模拟数据
 * @Date: 2025-12-05 17:13:43
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-14
 */
/**
 * 角色模拟数据
 * 用于开发环境，当后端 API 不可用时使用
 */
import type { Role } from '@/types/modules/role'
import { MOCK_PERMISSIONS } from './permission'

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

