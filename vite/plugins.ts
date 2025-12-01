/*
 * @Author: liaokt
 * @Description: Vite 插件集中管理
 * @Date: 2025-11-27
 */
import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'
// @ts-ignore - vite-plugin-eslint 类型定义问题
import eslintPlugin from 'vite-plugin-eslint'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import progress from 'vite-plugin-progress'

/**
 * 创建 vite 插件
 * @param viteEnv 环境变量配置
 */
export const createVitePlugins = (viteEnv: Record<string, any>): PluginOption[] => {
  const { VITE_USER_NODE_ENV, VITE_REPORT } = viteEnv
  const isDev = VITE_USER_NODE_ENV === 'development' || !VITE_USER_NODE_ENV
  const openAnalyze = VITE_REPORT === 'true'

  const plugins: PluginOption[] = [
    // 构建进度条
    progress(),
    vue(),
    vueJsx(),
    // 自动导入 Vue API（ref, computed, watch 等）
    // 注意：排除 h 函数，避免与 vue-types 内部的 h 变量冲突
    // vue-types 内部使用 h 作为 Number.isInteger 的 polyfill
    AutoImport({
      imports: [
        // 只导入需要的 Vue API，排除 h 函数
        {
          vue: [
            'ref',
            'reactive',
            'computed',
            'watch',
            'watchEffect',
            'onMounted',
            'onUnmounted',
            'onBeforeMount',
            'onBeforeUnmount',
            'onUpdated',
            'onBeforeUpdate',
            'onActivated',
            'onDeactivated',
            'provide',
            'inject',
            'nextTick',
            'defineProps',
            'defineEmits',
            'defineExpose',
            'withDefaults',
            'useSlots',
            'useAttrs',
            'toRef',
            'toRefs',
            'unref',
            'isRef',
            'readonly',
            'shallowRef',
            'shallowReactive',
            'shallowReadonly',
            'triggerRef',
            'customRef',
            'toRaw',
            'markRaw',
            'effectScope',
            'getCurrentScope',
            'onScopeDispose'
            // 注意：不包含 h 函数，避免与 vue-types 冲突
            // 如果需要在代码中使用 h 函数，请手动导入：import { h } from 'vue'
          ]
        },
        'vue-router',
        'pinia',
        // 常用工具库
        {
          dayjs: [['default', 'dayjs']] // dayjs 作为默认导出
        }
      ],
      dts: true, // 生成类型声明文件
      eslintrc: {
        enabled: true, // 生成 .eslintrc-auto-import.json
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      },
      // 自动导入目录下的工具函数（排除 request 目录，避免与 axios 自动导入冲突）
      dirs: ['src/utils/**'],
      exclude: ['src/utils/request/**'],
      // 解析器配置
      resolvers: []
    }),
    // 自动导入 Ant Design Vue 组件（按需导入，不影响性能）
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // 不自动导入样式，手动在 main.ts 中导入
          resolveIcons: true // 自动解析图标
        })
      ],
      // 只扫描 src 目录下的组件
      include: [/\.vue$/, /\.vue\?vue/],
      // 排除 node_modules
      exclude: [/[\\/]node_modules[\\/]/],
      dts: true, // 生成类型声明文件
      // 使用目录作为命名空间，避免组件名冲突
      directoryAsNamespace: false,
      // 深度扫描子目录
      deep: true
    })
  ]

  // 开发环境启用 ESLint（在浏览器中显示错误）
  if (isDev) {
    plugins.push(
      eslintPlugin({
        cache: true, // 启用缓存提升性能
        cacheLocation: 'node_modules/.cache/.eslintcache',
        include: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts', 'src/**/*.tsx'],
        exclude: ['node_modules', 'dist', 'build'],
        failOnError: false, // 不阻塞构建
        failOnWarning: false
      })
    )
  }

  // 开发环境启用 Vue DevTools
  if (isDev) {
    plugins.push(VueDevTools())
  }

  // Mock 服务（开发环境启用）
  plugins.push(
    viteMockServe({
      mockPath: 'mock',
      enable: isDev,
      watchFiles: isDev,
      logger: false
    })
  )

  // 生产环境启用压缩（gzip + brotli）
  if (!isDev) {
    // Gzip 压缩
    plugins.push(
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // 只压缩大于 10KB 的文件
        deleteOriginFile: false // 保留原文件
      })
    )
    // Brotli 压缩（更好的压缩率）
    plugins.push(
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false
      })
    )
  }

  // 打包分析工具（通过 VITE_REPORT=true 启用）
  if (openAnalyze) {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true
      }) as PluginOption
    )
  }

  return plugins
}
