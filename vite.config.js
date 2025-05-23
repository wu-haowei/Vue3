import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
//import VueDevTools from 'vite-plugin-vue-devtools'

// import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/

// const isLib = process.env.BUILD_LIB === 'true';

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd())

  return {
    base: '/Vue3',
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.includes('-')
          }
        }
      }),
      VitePWA({
        // manifestFilename:`manifest.[hash].webmanifest`,
        injectRegister: 'auto', // 自動掛載 <link rel="manifest">
        devOptions: {
          // enabled: false // 開發階段不啟用 SW
        },
        registerType: 'autoUpdate',  // 自動更新 service worker
        manifest: {
          name: 'My Vite PWA',
          short_name: 'VitePWA',
          description: 'A Vite project with PWA support',
          version: Date.now().toString(), // 強迫 SW 不同
          // id: `/manifest.webmanifest?v=[hash]`,
          theme_color: '#42b983',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true, // 清理舊 cache
          // 推播與快取策略可調整
          // runtimeCaching: [
          //   {
          //     urlPattern: /^https?.*/,
          //     handler: 'NetworkFirst',
          //     options: {
          //       cacheName: 'offline-cache',
          //       expiration: {
          //         maxEntries: 100,
          //         maxAgeSeconds: 60 * 10,
          //       }
          //     }
          //   }
          // ]

          // runtimeCaching: [
          //   {
          //     urlPattern: ({ request }) => ['script', 'style', 'image'].includes(request.destination),//表示攔截所有 CSS 檔案請求
          //     /*
          //     這是 Workbox 裡的快取策略（cache strategy）之一
          //     先回傳快取的內容（如果有的話）給使用者，快速呈現。
          //     同時背景會發出網路請求，抓取最新版本更新快取。
          //     下次請求時，就能拿到更新後的檔案。
          //     適合用於 JS、CSS 這類需要快速載入，但又要盡可能更新的資源。
          //     */
          //     handler: 'StaleWhileRevalidate',
          //     options: {
          //       //這表示這些快取會存到名為 static-resources 的 Cache Storage 裡，方便管理與清理。
          //       cacheName: 'static-resources',
          //       expiration: {
          //         //限制快取中最多存 50 筆資源，超過就會自動刪除較舊的條目，避免快取無限制膨脹。
          //         maxEntries: 100,
          //         //設定快取資源的存活時間，這裡是 30 天（60秒×60分鐘×24小時×30天）。
          //         maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
          //       },
          //     },
          //   },
          //   {
          //     urlPattern: ({ url }) => url.origin === self.origin && url.pathname.endsWith('.json'),
          //     handler: 'NetworkFirst', // 重要資料用網路優先
          //     options: {
          //       cacheName: 'json-data',
          //       expiration: {
          //         maxEntries: 20,
          //         maxAgeSeconds: 60 * 60 * 24, // 1 天
          //       },
          //     },
          //   },
          //   // {
          //   //   urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          //   //   handler: 'CacheFirst',
          //   //   options: {
          //   //     cacheName: 'google-fonts-stylesheets',
          //   //     expiration: {
          //   //       maxEntries: 10,
          //   //       maxAgeSeconds: 60 * 60 * 24 * 365,
          //   //     },
          //   //   },
          //   // },
          //   // // 你可以依需求加更多 runtimeCaching 規則
          // ],
        }
      })
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
      // https: false,
      https: {
        key: './localhost-key.pem',
        cert: './localhost.pem'
      },
      port: 3000,
      proxy: {
        '/api': {
          // target: 'https://openapi.twse.com.tw/',
          target: 'https://api.notion.com/v1/pages/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
        // '/api': {
        //   target: 'https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net',
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, '/api')
        // }
      },
    },
    //使用PWA 要注意dist 內是否為最新檔案
    preview: {
      port: 4174,
      open: true,         // 預覽時自動開啟瀏覽器（可選）
      host: '0.0.0.0'     // 區網可訪問（可選）
    }
  }
})