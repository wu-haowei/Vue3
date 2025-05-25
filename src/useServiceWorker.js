let swRegistration = null

export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        if (!swRegistration) {
            try {
                swRegistration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}/sw.js`)
                console.log('✅ Service Worker 已註冊', swRegistration)
            } catch (err) {
                console.error('❌ Service Worker 註冊失敗', err)
            }
        }
        return swRegistration
    } else {
        console.warn('🚫 不支援 Service Worker')
        return null
    }
}

export function getServiceWorkerRegistration() {
    return swRegistration
}