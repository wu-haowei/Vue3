import './assets/main.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import { createStore } from 'vuex'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'
//引入 Web Component
import {} from './main.ce.js'

const app = createApp(App)
// app.use(createPinia())
app.use(VeeValidatePlugin)
app.use(createPinia())
app.use(router)

// app.use(createStore)


//https://ithelp.ithome.com.tw/m/articles/10334936
app.config.errorHandler = (err, vm, info) => {
    // 在此處理錯誤
    // `err` 是錯誤物件
    // `vm` 是出錯的 Vue instance
    // `info` 是 Vue 特定的錯誤資訊，例如錯誤所在的生命週期鉤子等
    // console.error(`Error occurred: ${err.toString()}`);
    // console.error(`Error source instance:`, vm);
    // console.error(`Vue-specific error info: ${info}`);

    // 可以將錯誤信息發送到後端日誌系統或第三方錯誤追踪工具
    // sendErrorToServer(err, vm, info);

    console.log(`err ${err}`);
    // console.log(`vm ${vm}`);
    // console.log(`info ${info}`);


};
app.config.warnHandler = function (err, vm, trace) {
    // console.log(`err ${err}`);
    // console.log(`vm ${vm}`);
    // console.log(`info ${info}`);
}
// myApp.config.productionTip=false; //預設true //https://zhuanlan.zhihu.com/p/359626196


app.mount('#app')


/*
如何防止localStorage和sessionStorage在開發者工具中被手動修改
https://blog.csdn.net/qq_41083105/article/details/121176159
*/
window.addEventListener('storage', function (e) {
    this.localStorage.setItem(e.key, e.oldValue);
})
window.addEventListener('storage', function (e) {
    this.sessionStorage.setItem(e.key, e.oldValue);
})