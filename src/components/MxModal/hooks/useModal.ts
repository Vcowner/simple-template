/*
 * @Author: liaokt
 * @Description: useModal Hook - 管理单个 Modal 的状态
 * @Date: 2025-11-13 11:30:00
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-02 09:11:10
 */
import { ref, toRaw, nextTick, type Ref, type Component } from 'vue'

// 从 modalRegistry 导入，避免循环依赖
import { modalRegistry, register, show, hide, remove } from '../modalRegistry'

export interface UseModalReturn {
  /** Modal 是否可见 */
  visible: Ref<boolean>
  /** Modal 参数 */
  args: Ref<Record<string, any>>
  /** 显示 Modal */
  show: (args?: Record<string, any>) => void
  /** 隐藏 Modal */
  hide: () => void
  /** 移除 Modal（从 DOM 中移除） */
  remove: () => void
  /** 更新参数 */
  update: (args: Partial<Record<string, any>>) => void
  /** 解析 Promise（用于命令式调用） */
  resolve: (value: any) => void
  /** 拒绝 Promise（用于命令式调用） */
  reject: (reason?: any) => void
  /** 获取业务数据（排除 a-modal 的常用参数） */
  getFormData: <T = Record<string, any>>(keys?: string[]) => T
  /** 获取 a-modal 的参数 */
  getModalProps: () => Record<string, any>
}

export interface UseModalController<
  TResult = any,
  TArgs extends Record<string, any> = Record<string, any>
> {
  /** 显示 Modal */
  show: (args?: TArgs) => Promise<TResult | null>
  /** 隐藏 Modal */
  hide: () => void
  /** 移除 Modal */
  remove: () => void
}

/**
 * useModal Hook - 用于在 Modal 组件内部管理状态
 *
 * @example
 * ```vue
 * <template>
 *   <a-modal
 *     :open="modal.visible.value"
 *     @cancel="modal.hide()"
 *     @after-close="modal.remove()"
 *   >
 *     <h1>这是一个 Modal</h1>
 *   </a-modal>
 * </template>
 *
 * <script setup lang="ts">
 * import { useModal } from '@/components/MxModal'
 *
 * const modal = useModal()
 * </script>
 * ```
 */
export function useModal(): UseModalReturn {
  const visible = ref(false)
  const args = ref<Record<string, any>>({})
  let resolveFn: ((value: any) => void) | null = null
  let rejectFn: ((reason?: any) => void) | null = null

  const show = async (newArgs?: Record<string, any>) => {
    if (newArgs) {
      args.value = { ...args.value, ...newArgs }
      // 确保 args 更新完成后再设置 visible
      await nextTick()
    }
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  const remove = () => {
    visible.value = false
    args.value = {}
    resolveFn = null
    rejectFn = null
  }

  const update = (newArgs: Partial<Record<string, any>>) => {
    args.value = { ...args.value, ...newArgs }
  }

  let modalInstance: any = null

  const resolve = (value: any) => {
    // 优先使用注入的 _resolve（来自 modalRegistry）
    // modalRegistry 会将 _resolve 注入到返回对象上
    if (modalInstance?._resolve) {
      modalInstance._resolve(value)
      return
    }
    // 否则使用本地的 resolveFn
    if (resolveFn) {
      resolveFn(value)
      resolveFn = null
    }
  }

  const reject = (reason?: any) => {
    if (rejectFn) {
      rejectFn(reason)
      rejectFn = null
    }
  }

  // a-modal 的常用参数列表（用于区分业务数据和 Modal 参数）
  // 使用 Set 提升查找性能
  const modalPropKeysSet = new Set([
    'title',
    'width',
    'okText',
    'cancelText',
    'maskClosable',
    'keyboard',
    'centered',
    'closable',
    'destroyOnClose',
    'footer',
    'okType',
    'cancelButtonProps',
    'okButtonProps',
    'confirmLoading',
    'zIndex',
    'wrapClassName',
    'getContainer',
    'mask',
    'maskStyle',
    'bodyStyle',
    'wrapStyle',
    'class',
    'style',
    'data' // data 用于包裹业务数据，不应该被包含在表单数据中
  ])

  /** 获取业务数据（排除 a-modal 的参数） */
  const getFormData = <T = Record<string, any>>(keys?: string[]): T => {
    // 使用 toRaw 避免响应式追踪导致的循环
    const allArgs = toRaw(args.value)
    if (keys) {
      // 如果指定了 keys，只返回这些字段
      const result: Record<string, any> = {}
      for (const key of keys) {
        if (key in allArgs) {
          result[key] = allArgs[key]
        }
      }
      return result as T
    }
    // 否则排除所有 a-modal 的参数
    const result: Record<string, any> = {}
    for (const key in allArgs) {
      if (!modalPropKeysSet.has(key)) {
        result[key] = allArgs[key]
      }
    }
    return result as T
  }

  /** 获取 a-modal 的参数 */
  const getModalProps = (): Record<string, any> => {
    // 使用 toRaw 避免响应式追踪导致的循环
    const allArgs = toRaw(args.value)
    const result: Record<string, any> = {}
    for (const key in allArgs) {
      if (modalPropKeysSet.has(key)) {
        result[key] = allArgs[key]
      }
    }
    return result
  }

  const result = {
    visible,
    args,
    show,
    hide,
    remove,
    update,
    resolve,
    reject,
    getFormData,
    getModalProps
  } as UseModalReturn & { _resolve?: (value: any) => void; _reject?: (reason?: any) => void }

  // 让 resolve 函数能够访问返回对象上的 _resolve
  modalInstance = result

  return result
}

/**
 * useModalController - 用于创建 Modal 控制器（命令式使用）
 *
 * @template TResult - Modal 返回值的类型（通过 modal.resolve(value) 返回）
 * @template TArgs - Modal 参数的类型（传递给 modal.show(args) 的参数）
 *
 * @example
 * ```ts
 * import { useModalController } from '@/components/MxModal'
 * import UserModal from './UserModal.vue'
 *
 * // 定义参数类型
 * interface UserModalArgs {
 *   id?: number
 *   name?: string
 *   age?: number
 *   title?: string
 *   width?: number
 * }
 *
 * // 定义返回值类型
 * interface UserModalResult {
 *   type: 'add' | 'edit'
 *   id?: number
 * }
 *
 * // 创建控制器（带类型）
 * const modal = useModalController<UserModalResult, UserModalArgs>(UserModal)
 *
 * // 显示 Modal（IDE 会提供完整的类型提示）
 * const result = await modal.show({
 *   id: 1,
 *   name: 'John',
 *   age: 20,
 *   title: '编辑用户',
 *   width: 800
 * })
 *
 * if (result) {
 *   console.log('提交的数据:', result)
 * }
 * ```
 */
// 获取模块函数
function getModalModule() {
  return {
    modalRegistry,
    register,
    show,
    hide,
    remove
  }
}

export function useModalController<
  TResult = any,
  TArgs extends Record<string, any> = Record<string, any>
>(component: Component): UseModalController<TResult, TArgs> {
  // 生成唯一 ID（使用组件名称或生成唯一 ID）
  const componentName =
    (component as any).__name ||
    (component as any).name ||
    `Modal${Date.now()}${Math.random().toString(36).substr(2, 9)}`
  const componentId = `modal-${componentName}`

  // 确保模块已加载并注册组件
  let isRegistered = false
  let registrationPromise: Promise<void> | null = null

  return {
    show: async (args?: TArgs) => {
      const module = getModalModule()
      if (!isRegistered) {
        if (!registrationPromise) {
          registrationPromise = (async () => {
            if (!module.modalRegistry.has(componentId)) {
              module.register(componentId, component)
            }
            isRegistered = true
          })()
        }
        await registrationPromise
      }
      return module.show(componentId, args) as Promise<TResult | null>
    },
    hide: () => {
      const module = getModalModule()
      module.hide(componentId)
    },
    remove: () => {
      const module = getModalModule()
      module.remove(componentId)
    }
  }
}
