/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-06 09:43:57
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-06 09:45:03
 */
/**
 * 通用类型定义
 */

// 空对象类型
export type EmptyObject = Record<string, never>

// 任意对象类型
export type AnyObject = Record<string, any>

// 可空类型
export type Nullable<T> = T | null

// 可选类型
export type Optional<T> = T | undefined

// 可空且可选类型
export type NullableOptional<T> = T | null | undefined

// 函数类型
export type Fn<T = any, R = any> = (...args: T[]) => R

// Promise 函数类型
export type PromiseFn<T = any, R = any> = (...args: T[]) => Promise<R>

// 深度部分类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 深度只读类型
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 键值对类型
export type KeyValuePair<K = string, V = any> = {
  key: K
  value: V
}

// ID 类型
export type ID = string | number

// 时间戳类型
export type Timestamp = number | string
