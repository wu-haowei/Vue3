import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "@/stores/stores";

// function removeQueryParams(to) {
//   if (Object.keys(to.query).length)
//     return { path: to.path, query: {}, hash: to.hash }
// }

// function removeHash(to) {
//   if (to.hash) return { path: to.path, query: to.query, hash: '' }
// }

export const createMyRouter = function () {
  const router = createRouter({
    scrollBehavior(to, from, savedPosition) {

      //瀏覽器上一頁
      if (savedPosition) {
        return savedPosition
      }
      else if (to.hash) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              el: to.hash,
              behavior: 'smooth',//滾動行為
            })
          }, 500)
        })
      }
      else {
        return { top: 20 }
      }
    },
    //有servirc 配置
    // history: createWebHistory(import.meta.env.BASE_URL),//形式
    //無servirc 配置
    //在內部傳遞的實際 URL 之前使用了一個哈希字元（#）。由於這部分 URL 從未被傳送到伺服器，所以它不需要在伺服器層級上進行任何特殊處理。不過，它在 SEO 中確實有不好的影響。
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,//會都載入(小網站)
        meta: {
          requiresAuth: false,
          mode: 'out-in'
        }
      },
      {
        path: '/:filter',
        component: () => import('../views/ToDoList.vue'),
        meta: {
          requiresAuth: true,
          mode: 'out-in'
        }
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/AboutView.vue'),//會拆分頁面(大網站)
        meta: { transition: 'fade', mode: 'out-in', requiresAuth: true },
        props: true,
      },
      {
        path: '/Hash',
        name: 'Hash',
        // hash: 'start',
        component: () => import('../views/HashView.vue'),
        meta: {
          transition: 'moveUp',
          mode: 'out-in', requiresAuth: true
        },
      },
      {
        path: '/inputbar',
        name: 'inputbar',
        component: () => import('../views/InputBarView.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/validate',
        name: 'validate',
        component: () => import('../views/Validate.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/Router',
        name: 'Router',
        component: () => import('../views/Router.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
        // beforeEnter: (to, from, next) => {
        //   next();
        // }
      },
      {
        path: '/LogIn',
        name: 'LogIn',
        component: () => import('../views/LogIn.vue'),
        meta: {
          requiresAuth: false,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/Suspense',
        name: 'Suspense',
        component: () => import('../views/Suspense.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/Canvas',
        name: 'Canvas',
        component: () => import('../views/Canvas.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/Notion',
        name: 'Notion',
        component: () => import('../views/Notion.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/ToDoList',
        name: 'ToDoList',
        component: () => import('../views/ToDoList.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/KeepAlive',
        name: 'KeepAlive',
        component: () => import('../views/KeepAlive.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/KeepAliveNot',
        name: 'KeepAliveNot',
        component: () => import('../views/KeepAliveNot.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/ModelModifires',
        name: 'ModelModifires',
        component: () => import('../views/ModelModifires.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/Slot',
        name: 'Slot',
        component: () => import('../views/SlotView.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/SlotFancyList',
        name: 'SlotFancyList',
        component: () => import('../views/SlotFancyListView.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/Inject',
        name: 'Inject',
        component: () => import('../views/InjectView.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'

        }
      },
      {
        path: '/StaggeringListTransitions',
        name: 'StaggeringListTransitions',
        component: () => import('../views/StaggeringListTransitions.vue'),
        meta: { transition: 'fade', mode: 'out-in', requiresAuth: true },
        props: true

      },
      {
        path: '/TeleportView',
        name: 'TeleportView',
        component: () => import('../views/TeleportView.vue'),
        meta: {
          transition: 'moveUp', mode: 'out-in'
          , requiresAuth: true
        },
        props: true

      },
      {
        path: '/Draggable',
        name: 'Draggable',
        component: () => import('../views/Draggable.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'

        }
      },
      {
        path: '/USTreasurySecurities',
        name: 'USTreasurySecurities',
        component: () => import('../views/USTreasurySecurities.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'

        }
      },
      {
        path: '/IntersectionObserver',
        name: 'IntersectionObserver',
        component: () => import('../views/IntersectionObserver.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'

        }
      },
      {
        path: '/VueDragResize',
        name: 'VueDragResize',
        component: () => import('../views/VueDragResize.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in',
        }
      },
      {
        path: '/AdvancedChat',
        name: 'AdvancedChat',
        component: () => import('../views/AdvancedChat.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/AdvancedChatOpenAI',
        name: 'AdvancedChatOpenAI',
        component: () => import('../views/AdvancedChatOpenAI.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/IndexedDB',
        name: 'IndexedDB',
        component: () => import('../views/IndexedDB.vue'),
        meta: {
          requiresAuth: true,
          keepAlive: false,
          mode: 'out-in'
        }
      },
      {
        path: '/Badminton',
        name: 'Badminton',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/Badminton.vue'),//會拆分頁面(大網站)
        meta: { transition: 'fade', mode: 'out-in', requiresAuth: false },
        props: true,
      },
    ]
  })

  //(一)
  //to:進入
  //from:來源
  //next:是否允許

  router.beforeEach(async (to, from, next) => {
    if (to.path != '/home' && to.path != '/') {
      if (!store.getters["isLogin"] && to.meta.requiresAuth) {
        next({ name: 'home' })
        // next(false);
      } else {
        next(true);
      }
    } else {
      next(true);
    }
  })

  //(二)
  router.beforeResolve(() => {
    //可處理 進入頁面前初始化資料
    // console.log('beforeResolve');
  })

  //(三)
  router.afterEach(async (to, form, failure) => {
    //處理錯誤(官網說明)
  })

  // beforeRouteEnter 路由進入前
  // beforeRouteUpdate 路由更新前
  // beforeRouteLeave 路由離開前
  // 路由獨享守衛
  // beforeEnter 路由進入前 


  // router.beforeEach(async (to, from) => {
  //   console.log(store.getters["isLogin"]);
  //   // console.log(from);
  //   console.log(to.path);
  //   if (to.path != '/Vuex' && to.path != '/') {
  //     if (!store.getters["isLogin"]) {
  //       return { name: 'Vuex' }
  //     } else {
  //       next(true);
  //     }
  //   } else {
  //     console.log(2);
  //     next(true);
  //   }
  // })

  return router;
}


// export default router
