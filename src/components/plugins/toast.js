import { createApp, h } from 'vue'
import Toast from '@/components/Toast.vue'

let toastApp = null
let toastRef = null

export default {
  install(app, options = {}) {
    const container = document.createElement('div')
    document.body.appendChild(container)

    toastApp = createApp({
      render() {
        return h(Toast, {
          ref: (el) => (toastRef = el),
          position: options.position || 'top-right',
        })
      },
    })

    toastApp.mount(container)

    // 將 $toast 註冊到全域
    app.config.globalProperties.$toast = {
      success(message, duration = 3000) {
        toastRef?.successToast(message, duration)
      },
      info(message, duration = 3000) {
        toastRef?.infoToast(message, duration)
      },
      error(message, duration = 3000) {
        toastRef?.errorToast(message, duration)
      },
      warning(message, duration = 3000) {
        toastRef?.warningToast(message, duration)
      },
    }


  },
}
