import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface Size {
  width: number
  height: number
}

export interface UseSizeOptions {
  /**
   * 是否立即获取初始尺寸
   * @default true
   */
  immediate?: boolean
  /**
   * 是否监听窗口大小变化
   * @default false
   */
  listenWindowResize?: boolean
}

/**
 * 监听 DOM 元素尺寸变化的 Hook
 * @param target DOM 元素或 ref
 * @param options 配置选项
 * @returns 包含 width 和 height 的响应式对象
 */
export function useSize(
  target: Ref<HTMLElement | null> | HTMLElement | null,
  options: UseSizeOptions = {}
): Ref<Size> {
  const { immediate = true, listenWindowResize = false } = options

  const size = ref<Size>({ width: 0, height: 0 })

  let resizeObserver: ResizeObserver | null = null
  let windowResizeHandler: (() => void) | null = null

  // 获取元素尺寸
  const getSize = (element: HTMLElement): Size => {
    const rect = element.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height
    }
  }

  // 更新尺寸
  const updateSize = () => {
    const element = getElement()
    if (element) {
      size.value = getSize(element)
    }
  }

  // 获取目标元素
  const getElement = (): HTMLElement | null => {
    if (!target) return null

    // 如果是 ref
    if ('value' in target) {
      return target.value
    }

    // 如果是 DOM 元素
    return target
  }

  // 设置 ResizeObserver
  const setupResizeObserver = () => {
    const element = getElement()
    if (!element) return

    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        size.value = { width, height }
      }
    })

    resizeObserver.observe(element)
  }

  // 设置窗口大小监听
  const setupWindowResize = () => {
    if (!listenWindowResize) return

    windowResizeHandler = () => {
      updateSize()
    }

    window.addEventListener('resize', windowResizeHandler)
  }

  // 清理监听器
  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    if (windowResizeHandler) {
      window.removeEventListener('resize', windowResizeHandler)
      windowResizeHandler = null
    }
  }

  // 初始化
  const init = () => {
    const element = getElement()
    if (!element) return

    // 立即获取尺寸
    if (immediate) {
      updateSize()
    }

    // 设置监听器
    setupResizeObserver()
    setupWindowResize()
  }

  // 组件挂载时初始化
  onMounted(() => {
    init()
  })

  // 组件卸载时清理
  onUnmounted(() => {
    cleanup()
  })

  return size
}

/**
 * 监听窗口尺寸变化的 Hook
 * @returns 包含窗口 width 和 height 的响应式对象
 */
export function useWindowSize(): Ref<Size> {
  const size = ref<Size>({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const updateSize = () => {
    size.value = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  onMounted(() => {
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return size
}

/**
 * 监听容器尺寸变化的 Hook（简化版）
 * @param target DOM 元素或 ref
 * @returns 包含 width 和 height 的响应式对象
 */
export function useElementSize(target: Ref<HTMLElement | null> | HTMLElement | null): Ref<Size> {
  return useSize(target, { immediate: true, listenWindowResize: false })
}
