import './assets/main.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import { createStore } from 'vuex'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createMyRouter } from './router'

import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'
import { registerServiceWorker } from './useServiceWorker'
import ToastPlugin from '@/components/plugins/toast.js'
// import { useRegisterSW } from 'virtual:pwa-register/vue';
//引入 Web Component
// import {} from './main.ce.js'


// 引入 registerSW
// import { registerSW } from 'virtual:pwa-register'

// const updateSW = registerSW({
//   onNeedRefresh() {
//     // 這裡你可以改成彈窗或通知 UI
//     console.log('有新版本可用，請刷新頁面')
//     // 例如觸發彈窗顯示按鈕讓使用者手動更新
//   },
//   onOfflineReady() {
//     console.log('離線功能已就緒')
//   }
// })




function initApp() {
    const app = createApp(App)
    const router = createMyRouter();
    // useRegisterSW();
    // app.use(createPinia())
    app.use(VeeValidatePlugin)
    app.use(ToastPlugin, { position: 'bottom-left' }) // 可自訂位置
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
}

if ('serviceWorker' in navigator) {
    registerServiceWorker().finally(() => {
        initApp()
    })
} else {
    initApp()
}


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