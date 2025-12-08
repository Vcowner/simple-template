/**
 * 权限 SQL 脚本生成工具
 * 将权限配置转换为数据库 INSERT 语句
 */

import { getBuiltPermissions } from './index'
import type { Permission } from './types'

/**
 * 生成权限表的 SQL INSERT 语句
 * @param tableName 权限表名，默认为 'permissions'
 * @returns SQL INSERT 语句数组
 */
export function generatePermissionSql(tableName: string = 'permissions'): string[] {
  const permissions = getBuiltPermissions()
  const sqlStatements: string[] = []

  // 添加注释
  sqlStatements.push(`-- 权限数据 SQL 脚本`)
  sqlStatements.push(`-- 生成时间: ${new Date().toLocaleString('zh-CN')}`)
  sqlStatements.push(`-- 表名: ${tableName}`)
  sqlStatements.push('')

  // 清空表数据（可选，如果需要重置数据）
  sqlStatements.push(`-- 清空表数据（可选）`)
  sqlStatements.push(`-- DELETE FROM ${tableName};`)
  sqlStatements.push('')

  // 生成 INSERT 语句
  sqlStatements.push(`-- 插入权限数据`)
  permissions.forEach(permission => {
    const values = [
      `'${escapeSql(permission.code)}'`, // code
      `'${escapeSql(permission.name)}'`, // name
      `'${escapeSql(permission.type)}'`, // type
      permission.parentCode ? `'${escapeSql(permission.parentCode)}'` : 'NULL', // parent_code
      permission.routeName ? `'${escapeSql(permission.routeName)}'` : 'NULL' // route_name
    ]

    const sql = `INSERT INTO ${tableName} (code, name, type, parent_code, route_name) VALUES (${values.join(', ')}) ON DUPLICATE KEY UPDATE name=VALUES(name), type=VALUES(type), parent_code=VALUES(parent_code), route_name=VALUES(route_name);`
    sqlStatements.push(sql)
  })

  return sqlStatements
}

/**
 * 生成只包含 INSERT 语句的 SQL 脚本
 * @param tableName 权限表名，默认为 'permissions'
 * @returns SQL 脚本字符串
 */
export function generateInsertSqlScript(tableName: string = 'permissions'): string {
  const sqlStatements = generatePermissionSql(tableName)
  return sqlStatements.join('\n')
}

/**
 * 生成完整的 SQL 脚本（包含建表语句）
 * @param tableName 权限表名，默认为 'permissions'
 * @returns 完整的 SQL 脚本
 */
export function generateFullSqlScript(tableName: string = 'permissions'): string {
  const sqlStatements: string[] = []

  // 添加注释
  sqlStatements.push(`-- ============================================`)
  sqlStatements.push(`-- 权限管理 SQL 脚本`)
  sqlStatements.push(`-- 生成时间: ${new Date().toLocaleString('zh-CN')}`)
  sqlStatements.push(`-- ============================================`)
  sqlStatements.push('')

  // 创建权限表
  sqlStatements.push(`-- 创建权限表`)
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS ${tableName} (`)
  sqlStatements.push(`  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',`)
  sqlStatements.push(`  code VARCHAR(50) NOT NULL UNIQUE COMMENT '权限编码',`)
  sqlStatements.push(`  name VARCHAR(100) NOT NULL COMMENT '权限名称',`)
  sqlStatements.push(
    `  type VARCHAR(20) NOT NULL COMMENT '权限类型: menu-菜单权限, button-按钮权限',`
  )
  sqlStatements.push(`  parent_code VARCHAR(50) NULL COMMENT '父权限编码',`)
  sqlStatements.push(`  route_name VARCHAR(100) NULL COMMENT '关联的路由名称',`)
  sqlStatements.push(`  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',`)
  sqlStatements.push(
    `  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',`
  )
  sqlStatements.push(`  INDEX idx_code (code),`)
  sqlStatements.push(`  INDEX idx_parent_code (parent_code),`)
  sqlStatements.push(`  INDEX idx_type (type)`)
  sqlStatements.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';`)
  sqlStatements.push('')

  // 创建角色表
  sqlStatements.push(`-- 创建角色表`)
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS roles (`)
  sqlStatements.push(`  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',`)
  sqlStatements.push(`  code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',`)
  sqlStatements.push(`  name VARCHAR(100) NOT NULL COMMENT '角色名称',`)
  sqlStatements.push(`  description VARCHAR(500) NULL COMMENT '角色描述',`)
  sqlStatements.push(`  is_system TINYINT(1) DEFAULT 0 COMMENT '是否系统角色: 0-否, 1-是',`)
  sqlStatements.push(`  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',`)
  sqlStatements.push(
    `  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',`
  )
  sqlStatements.push(`  INDEX idx_code (code)`)
  sqlStatements.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';`)
  sqlStatements.push('')

  // 创建角色权限关联表
  sqlStatements.push(`-- 创建角色权限关联表`)
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS role_permissions (`)
  sqlStatements.push(`  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',`)
  sqlStatements.push(`  role_code VARCHAR(50) NOT NULL COMMENT '角色编码',`)
  sqlStatements.push(`  permission_code VARCHAR(50) NOT NULL COMMENT '权限编码',`)
  sqlStatements.push(`  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',`)
  sqlStatements.push(`  UNIQUE KEY uk_role_permission (role_code, permission_code),`)
  sqlStatements.push(`  INDEX idx_role_code (role_code),`)
  sqlStatements.push(`  INDEX idx_permission_code (permission_code)`)
  sqlStatements.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';`)
  sqlStatements.push('')

  // 创建用户角色关联表
  sqlStatements.push(`-- 创建用户角色关联表`)
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS user_roles (`)
  sqlStatements.push(`  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',`)
  sqlStatements.push(`  user_id BIGINT NOT NULL COMMENT '用户ID',`)
  sqlStatements.push(`  role_code VARCHAR(50) NOT NULL COMMENT '角色编码',`)
  sqlStatements.push(`  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',`)
  sqlStatements.push(`  UNIQUE KEY uk_user_role (user_id, role_code),`)
  sqlStatements.push(`  INDEX idx_user_id (user_id),`)
  sqlStatements.push(`  INDEX idx_role_code (role_code)`)
  sqlStatements.push(`) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';`)
  sqlStatements.push('')

  // 添加权限数据
  sqlStatements.push(`-- ============================================`)
  sqlStatements.push(`-- 插入权限数据`)
  sqlStatements.push(`-- ============================================`)
  sqlStatements.push('')

  const permissions = getBuiltPermissions()
  permissions.forEach(permission => {
    const values = [
      `'${escapeSql(permission.code)}'`, // code
      `'${escapeSql(permission.name)}'`, // name
      `'${escapeSql(permission.type)}'`, // type
      permission.parentCode ? `'${escapeSql(permission.parentCode)}'` : 'NULL', // parent_code
      permission.routeName ? `'${escapeSql(permission.routeName)}'` : 'NULL' // route_name
    ]

    const sql = `INSERT INTO ${tableName} (code, name, type, parent_code, route_name) VALUES (${values.join(', ')}) ON DUPLICATE KEY UPDATE name=VALUES(name), type=VALUES(type), parent_code=VALUES(parent_code), route_name=VALUES(route_name);`
    sqlStatements.push(sql)
  })

  return sqlStatements.join('\n')
}

/**
 * 转义 SQL 字符串中的特殊字符
 */
function escapeSql(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\')
}

/**
 * 导出 SQL 脚本到文件（浏览器环境）
 * @param filename 文件名，默认为 'permissions.sql'
 * @param includeCreateTable 是否包含建表语句，默认为 false（只生成 INSERT 语句）
 */
export function downloadSqlScript(
  filename: string = 'permissions.sql',
  includeCreateTable: boolean = false
): void {
  const sql = includeCreateTable ? generateFullSqlScript() : generateInsertSqlScript()
  const blob = new Blob([sql], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 生成权限数据的 JSON 格式（用于 API 接口）
 */
export function generatePermissionJson(): Permission[] {
  return getBuiltPermissions().map(({ path, ...perm }) => perm)
}
