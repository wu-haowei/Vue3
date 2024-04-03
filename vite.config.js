import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(
      // treat all tags with a dash as custom elements
      {
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes('-')
          }
        }
      }),

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
    lib: {
      // Could also be a dictionary or array of multiple entry points
      // entry: resolve(__dirname, 'lib/main.js'),
      entry: './src/main.ce.js',
      name: 'CustomElements',
      // the proper extensions will be added
      fileName: (format) => `custom-elements.${format}.js`,
    },
    // rollupOptions: {
    //   // make sure to externalize deps that shouldn't be bundled
    //   // into your library
    //   external: ['vue'],
    //   output: {
    //     // Provide global variables to use in the UMD build
    //     // for externalized deps
    //     globals: {
    //       vue: 'Vue',
    //     },
    //   },
    // },
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
