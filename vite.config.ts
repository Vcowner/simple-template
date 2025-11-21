/*
 * @Author: liaokt
 * @Description:
 * @Date: 2025-11-18 09:43:26
 * @LastEditors: liaokt
 * @LastEditTime: 2025-11-21 11:15:43
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
          api: 'modern-compiler', // or 'modern'
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },
    server: {
      port: 8080,
      open: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true
    }
  }
})
