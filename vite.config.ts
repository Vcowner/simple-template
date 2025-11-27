/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-12 17:44:21
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-26 09:56:43
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'
import { viteMockServe } from 'vite-plugin-mock'
import type { Plugin } from 'vite'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  return {
    plugins: [
      vue(),
      vueJsx(),
      VueDevTools(),
      viteMockServe({
        mockPath: 'mock',
        enable: isDev
      }) as Plugin
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: 'http://172.16.12.60:8000',
          changeOrigin: true,
          secure: false
          // rewrite 不设置，保持路径不变
          // /api/packet-features/ -> http://172.16.12.60:8000/api/packet-features/
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true
    }
  }
})
