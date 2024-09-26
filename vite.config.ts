import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        // treat all tags with a dash as custom elements
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ],

  server: {
    proxy: {
      '/api': {
        target: 'https://app.m-itrust.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v2/public/claims')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
