import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "@/stores/stores";

function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}


const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    console.log(to);

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
  history: createWebHistory(import.meta.env.BASE_URL),//形式
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:filter',
      component: () => import('../views/ToDoList.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { transition: 'fade', mode: 'out-in' },
      props: true

    },
    {
      path: '/Hash',
      name: 'Hash',
      // hash: 'start',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/HashView.vue'),
      meta: { transition: 'moveUp', mode: '' },
    },
    {
      path: '/inputbar',
      name: 'inputbar',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/InputBarView.vue')
    },
    {
      path: '/validate',
      name: 'validate',
      component: () => import('../views/Validate.vue'),
    },
    {
      path: '/Router',
      name: 'Router',
      component: () => import('../views/Router.vue'),
      // beforeEnter: (to, from, next) => {
      //   next();
      // }
    }
    ,
    {
      path: '/Vuex',
      name: 'Vuex',
      component: () => import('../views/Vuex.vue'),
    }
    ,
    {
      path: '/Suspense',
      name: 'Suspense',
      component: () => import('../views/Suspense.vue'),

    },
    {
      path: '/Canvas',
      name: 'Canvas',
      component: () => import('../views/Canvas.vue'),
    },
    {
      path: '/Notion',
      name: 'Notion',
      component: () => import('../views/Notion.vue'),
    },
    {
      path: '/ToDoList',
      name: 'ToDoList',
      component: () => import('../views/ToDoList.vue')
    },
    {
      path: '/KeepAlive',
      name: 'KeepAlive',
      component: () => import('../views/KeepAlive.vue'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/KeepAliveNot',
      name: 'KeepAliveNot',
      component: () => import('../views/KeepAliveNot.vue'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/ModelModifires',
      name: 'ModelModifires',
      component: () => import('../views/ModelModifires.vue'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/Slot',
      name: 'Slot',
      component: () => import('../views/SlotView.vue'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/SlotFancyList',
      name: 'SlotFancyList',
      component: () => import('../views/SlotFancyListView.vue'),
      meta: {
        keepAlive: false
      }
    }
    ,
    {
      path: '/Inject',
      name: 'Inject',
      component: () => import('../views/InjectView.vue'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/StaggeringListTransitions',
      name: 'StaggeringListTransitions',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/StaggeringListTransitions.vue'),
      meta: { transition: 'fade', mode: 'out-in' },
      props: true

    },
    {
      path: '/TeleportView',
      name: 'TeleportView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TeleportView.vue'),
      meta: { transition: 'moveUp', mode: '' },
      props: true

    }
  ]
})

//(一)
//to:進入
//from:來源
//next:是否允許

router.beforeEach(async (to, from, next) => {
  // console.log('beforeEach');

  // console.log(store.getters["isLogin"]);
  // console.log(from);
  // console.log(to.path);
  if (to.path != '/Vuex' && to.path != '/') {
    if (!store.getters["isLogin"]) {
      // return { name: 'Vuex' }
      next({ name: 'Vuex' })
      // next(false);
    } else {
      next(true);
    }
  } else {
    console.log(2);
    next(true);
  }
})
//(二)
router.beforeResolve((to, from, next) => {
  // console.log('beforeResolve');
  next();
})
//(三)
router.afterEach(async (to, from) => {
  // console.log('afterEach');
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

export default router
