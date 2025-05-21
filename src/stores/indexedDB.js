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
    // 刪除特定 key
    function deleteStore(storeName, version = null) {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(dbName);


            req.onerror = (e) => {
                console.error('第一次 openDB 失敗', e);
                reject(e.target.error);
            };

            req.onblocked = (e) => {
                console.warn('資料庫連線被阻塞', e);
            };


            req.onsuccess = (e) => {
                const currentDB = e.target.result;
                const newVersion = version || currentDB.version + 1;
                currentDB.close();

                const deleteReq = indexedDB.open(dbName, newVersion);

                deleteReq.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (db.objectStoreNames.contains(storeName)) {
                        db.deleteObjectStore(storeName);
                        console.log(`🗑️ 已刪除整個 store：${storeName}`);
                    } else {
                        console.warn(`⚠️ 找不到要刪除的 store：${storeName}`);
                    }
                };

                deleteReq.onsuccess = (e) => {
                    db = e.target.result;
                    resolve(db);
                };

                deleteReq.onerror = () => {
                    console.error('onerror', deleteReq);
                    reject(deleteReq.error)
                };
            };
        });
    }
    // 清空某個 store
    function clearStore(storeName) {
        return new Promise((resolve, reject) => {
            try {
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const req = store.clear();
                req.onsuccess = () => resolve(true);
                req.onerror = () => reject(req.error);
            } catch (err) {
                reject(err);
            }
        });
    }

    return {
        db,
        openDB,
        save,
        get,
        getAll,
        deleteStore,
        clearStore
    }
}
