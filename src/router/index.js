import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "@/stores/stores";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),//形式
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/twse',
      name: 'twse',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TwseView.vue')
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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Validate.vue'),
    },
    {
      path: '/Router',
      name: 'Router',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Router.vue'),
      // beforeEnter: (to, from, next) => {
      //   next();
      // }
    }
    ,
    {
      path: '/Vuex',
      name: 'Vuex',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Vuex.vue'),
      // beforeEnter: (to, from, next) => {
      //   next();
      // }
    }
    ,
    {
      path: '/Suspense',
      name: 'Suspense',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Suspense.vue'),
      // beforeEnter: (to, from, next) => {
      //   next();
      // }
    }
  ]
})

//to:進入
//from:來源
//next:是否允許
router.beforeEach((to, from, next) => {
  console.log(store.getters["isLogin"]);
  // console.log(from);
  console.log(to.path);
  if (to.path != '/Vuex' && to.path != '/') {

    if (!store.getters["isLogin"]) {
      next(false);
      router.push("/Vuex");
    } else {
      next(true);
    }
  }else{
  console.log(2);
    next(true);
  }
})
export default router
