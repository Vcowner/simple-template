import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { viteMockServe } from 'vite-plugin-mock'
import type { Plugin } from 'vite'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  return {
    plugins: [
      vue(),
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
