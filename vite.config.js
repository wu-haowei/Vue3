import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import VueDevTools from 'vite-plugin-vue-devtools'

// import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/

const isLib = process.env.BUILD_LIB === 'true';

export default defineConfig({
  base: "/Vue3",
  plugins: [
    vue(
      // treat all tags with a dash as custom elements
      {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes('-')
          }
        }
      }
    ),
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
    // ...(isLib ? {
    //   lib: {
    //     // Could also be a dictionary or array of multiple entry points
    //     // entry: resolve(__dirname, 'lib/main.js'),
    //     entry: './src/main.ce.js',
    //     name: 'CustomElements',
    //     // the proper extensions will be added
    //     fileName: (format) => `custom-elements.${format}.js`,
    //   },
    //   // rollupOptions: {
    //   //   // make sure to externalize deps that shouldn't be bundled
    //   //   // into your library
    //   //   external: ['vue'],
    //   //   output: {
    //   //     // Provide global variables to use in the UMD build
    //   //     // for externalized deps
    //   //     globals: {
    //   //       vue: 'Vue',
    //   //     },
    //   //   },
    //   // },
    // } : {
    //   outDir: 'dist-app', // 应用程序构建的输出目录
    //   rollupOptions: {
    //     input: 'index.html',
    //   }
    // })
  },
  server: {
    proxy: {
      '/api': {
        // target: 'https://openapi.twse.com.tw/',
        target: 'https://api.notion.com/v1/pages/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
})
