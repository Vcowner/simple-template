/*
 * @Author: liaokt
 * @Description: Vite 构建配置文件
 * @Date: 2025-11-12 17:44:21
 * @LastEditors: liaokt
 * @LastEditTime: 2025-12-01 15:55:04
 */
import { defineConfig, loadEnv, type ConfigEnv, type ServerOptions, type UserConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import packageJson from './package.json'
import { getRootPath, wrapperEnv } from './vite/getEnv'
import { createVitePlugins } from './vite/plugins'
import { createProxy } from './vite/proxy'
import { pick } from './vite/util'

/**
 * 从 package.json 中提取的包信息
 * 用于在代码中通过 packageInfo_VITE 访问
 */
const packageInfo = pick(packageJson, [
  'name',
  'version',
  'description',
  'dependencies',
  'devDependencies'
])

/**
 * Vite 配置函数
 * @param command - 命令类型（serve/build）
 * @param mode - 环境模式（development/production）
 * @returns Vite 配置对象
 */
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  // 获取项目根目录
  const root = getRootPath()

  // 加载环境变量
  const rawEnv = loadEnv(mode, root)

  // 包装环境变量（类型转换）
  const viteEnv = wrapperEnv(rawEnv)

  // 判断是否为开发环境
  const isDev = command === 'serve'

  // 是否移除 console（生产环境）
  const shouldDropConsole =
    rawEnv.VITE_DROP_CONSOLE === 'true' || viteEnv.VITE_DROP_CONSOLE === true

  // 压缩选项：terser | esbuild | false
  const minifyOption =
    rawEnv.VITE_MINIFY === 'terser' ? 'terser' : rawEnv.VITE_MINIFY === 'false' ? false : 'esbuild'

  /**
   * 开发服务器配置
   */
  const serverOptions: ServerOptions & { warmup?: { clientFiles: string[] } } = {
    cors: true, // 启用 CORS
    host: '0.0.0.0', // 允许外部访问
    port: Number(viteEnv.VITE_PORT) || 8080, // 端口号
    open: viteEnv.VITE_OPEN, // 是否自动打开浏览器
    proxy: createProxy(viteEnv.VITE_PROXY), // 代理配置（从环境变量读取）
    warmup: {
      // 预热文件，提升首次访问速度
      clientFiles: ['./index.html', './src/{views,components}/*']
    }
  }

  return {
    // 项目根目录
    root,

    // 公共基础路径（部署时的子路径）
    // 开发环境使用根路径 `/`，生产环境使用相对路径 `./`
    // 注意：VITE_API_BASE_URL 用于 API 请求的 baseURL，不影响 Vite 的 base 配置
    base: isDev ? '/' : './',

    // 全局常量定义
    define: {
      packageInfo_VITE: packageInfo, // 包信息，可在代码中使用
      DEPLOY_VITE: null // 部署信息占位符
    },

    // 路径别名配置
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // @ 指向 src 目录
        '~': getRootPath('src') // ~ 也指向 src 目录（备用）
      }
    },

    // 插件配置（统一在 vite/plugins.ts 中管理）
    plugins: createVitePlugins(viteEnv, mode),

    // CSS 预处理器配置
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // 使用现代编译器
        }
      }
    },

    // 开发服务器配置
    server: serverOptions,

    // 预览服务器配置（pnpm preview）
    preview: {
      host: '0.0.0.0', // 允许外部访问
      port: Number(rawEnv.VITE_PREVIEW_PORT) || 4173 // 预览端口
    },

    // 依赖预构建配置
    optimizeDeps: {
      // 预构建的依赖列表（提升开发启动速度）
      include: [
        'vue',
        'vue-router',
        'pinia',
        'ant-design-vue',
        '@ant-design/icons-vue',
        'axios',
        'dayjs',
        'lodash-es'
      ],
      // 排除有问题的依赖，让 Vite 单独处理
      exclude: []
    },

    // 生产构建配置
    build: {
      outDir: 'dist', // 输出目录
      assetsDir: 'assets', // 静态资源目录
      sourcemap: isDev, // 仅在开发环境生成 sourcemap
      reportCompressedSize: false, // 不报告压缩后大小（提升构建速度）
      chunkSizeWarningLimit: 1000, // chunk 大小警告阈值（KB）
      assetsInlineLimit: 4096, // 小于 4KB 的资源内联为 base64
      cssCodeSplit: true, // CSS 代码分割
      target: ['es2015'], // 构建目标（兼容 ES2015）
      cssTarget: ['chrome68'], // CSS 目标浏览器

      // Rollup 配置
      rollupOptions: {
        // 入口文件
        input: {
          index: getRootPath('index.html')
        },
        // 输出配置
        output: {
          // chunk 文件命名（带 hash）
          chunkFileNames: 'assets/js/[name]-[hash].js',
          // 入口文件命名（带 hash）
          entryFileNames: 'assets/js/[name]-[hash].js',
          // 静态资源文件命名（带 hash）
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // 手动代码分割（优化缓存策略）
          // 使用函数形式，让 Rollup 自动处理模块依赖
          manualChunks: id => {
            // vue-types 与 antd 一起打包
            if (id.includes('vue-types')) {
              return 'antd'
            }
            // Vue 核心库
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
                return 'vue'
              }
              if (id.includes('ant-design-vue') || id.includes('@ant-design')) {
                return 'antd'
              }
              return 'vendor'
            }
          }
        }
      },

      // CommonJS 选项（处理 CommonJS 模块转换）
      // 修复 vue-types 的构建问题：排除 vue-types，避免与 h 函数冲突
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
        strictRequires: true,
        // 排除 vue-types，让它保持原样（避免与自动导入的 h 函数冲突）
        exclude: [/vue-types/]
      },

      // 压缩配置
      minify: minifyOption, // 压缩工具：terser | esbuild | false

      // Terser 压缩选项（仅当 minify 为 terser 时生效）
      ...(minifyOption === 'terser' && {
        terserOptions: {
          compress: {
            drop_console: shouldDropConsole, // 移除 console
            drop_debugger: true // 移除 debugger
          }
        }
      })
    },

    // ESBuild 配置（用于转换和压缩）
    esbuild: shouldDropConsole ? { drop: ['console', 'debugger'] } : undefined,

    // 作为静态资源处理的文件类型
    assetsInclude: ['**/*.zip', '**/*.mov']
  }
})
