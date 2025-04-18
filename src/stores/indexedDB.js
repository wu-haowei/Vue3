const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;



export const useIndexedDB = () => {
    const dbName = 'ttl-grafanaDB'
    // var dbVersion = 1
    var db = null

    // 開啟或建立資料庫
    function openDB(storeName, keyPath = {}, version = 0) {
        return new Promise((resolve, reject) => {

            if (db) {
                const oldDb = db;
                oldDb.close();
            }
            const request = version == 0
                ? indexedDB.open(dbName)
                : indexedDB.open(dbName, version);
            // const request = indexedDB.open(dbName, version)

            request.onerror = (event) => {
                // console.error('開啟 IndexedDB 錯誤', event)
                reject(event)
            }

            request.onsuccess = (event) => {
                db = event.target.result
                resolve(db)
            }

            request.onupgradeneeded = (event) => {
                db = event.target.result
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { ...keyPath })
                }
                const storesToDelete = getStoresToDelete(db, storeName);
                storesToDelete.forEach((storeName) => {
                    db.deleteObjectStore(storeName);
                    console.log(`🗑️ 已刪除過期 store：${storeName}`);
                });
            }
        })
    }

    function getStoresToDelete(db, today) {
        return Array.from(db.objectStoreNames).filter(
            (name) => name !== today
        );
    }

    // 新增或更新資料
    function save(storeName, data) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction([storeName], 'readwrite')
            const store = tx.objectStore(storeName)
            const request = store.put(data)

            request.onsuccess = () => resolve(true)
            request.onerror = (e) => reject(e)
        })
    }

    // 讀取單筆資料
    function get(storeName, key) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction([storeName], 'readonly')
            const store = tx.objectStore(storeName)
            const request = store.get(key)

            request.onsuccess = () => resolve(request.result)
            request.onerror = (e) => reject(e)
        })
    }

    // 讀取全部資料
    function getAll(storeName) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction([storeName], 'readonly')
            const store = tx.objectStore(storeName)
            const request = store.getAll()

            request.onsuccess = () => resolve(request.result)
            request.onerror = (e) => reject(e)
        })
    }

    // 刪除資料
    function remove(storeName, key) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction([storeName], 'readwrite')
            const store = tx.objectStore(storeName)
            const request = store.delete(key)

            request.onsuccess = () => resolve(true)
            request.onerror = (e) => reject(e)
        })
    }

    return {
        db,
        openDB,
        save,
        get,
        getAll,
        remove,
    }
}
