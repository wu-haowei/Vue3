import { fileURLToPath, URL } from 'node:url'

import { defineConfig,loadEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'
//import VueDevTools from 'vite-plugin-vue-devtools'

// import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/

// const isLib = process.env.BUILD_LIB === 'true';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_BASE || '/',
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes('-')
          }
        }
      }),
      // VitePWA(),
      // VueDevTools(),
    ],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      // lib: {
      //   entry: './src/main.ce.js',
      //   name: 'CustomElements',
      //   fileName: (format) => `custom-elements.${format}.js`,
      // },
      // rollupOptions: {
      //   external: ['vue'],
      //   output: {
      //     globals: {
      //       vue: 'Vue',
      //     },
      //   },
      // },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          // target: 'https://openapi.twse.com.tw/',
          target: 'https://api.notion.com/v1/pages/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
    },
  }
})