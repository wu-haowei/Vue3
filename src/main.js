import './assets/main.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import { createStore } from 'vuex'

import App from './App.vue'
import router from './router'

import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'

const app = createApp(App)
// app.use(createPinia())
app.use(router)
app.use(VeeValidatePlugin)
// app.use(createStore)
app.mount('#app')
