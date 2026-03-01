import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler']
        }
      }),
      tailwindcss(),
      svgr()
    ],
    server: {
      // 开发时使用
      proxy: {
        '/common': {
          target: 'http://localhost:8080/api',
          changeOrigin: true
        },
        '/front': {
          target: 'http://localhost:8080/api',
          changeOrigin: true
        },
        '/auth': {
          target: 'http://localhost:8080/api',
          changeOrigin: true
        }
      }
    }
  }
})
