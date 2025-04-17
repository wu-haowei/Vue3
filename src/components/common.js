export default {
    data() {
        return {
        }
    },
    /**
    * 日期格式化
    * @param {資料} item
    */
    formatData(item) {
        if (item.value == null) {
            return "";
        } else {
            if (/^\d{4}-\d{2}-\d{2}$/.test(item.value)) {
                return item.value + " 00:00:00".replace(/-/g, "/").substr(0, item.value.length - 9);
            } else {
                return item.value.replace(/-/g, "/").substr(0, item.value.length - 9);

            }
        }
    },
    /**
    * 數字格式化
    * @param {資料} item
    */
    formatNumber(item) {
        if (item.value == undefined) {
            return "";
        } else {
            return new Intl.NumberFormat().format(item.value);
        }
    },
    /**
    * 取得自訂的樣板
    * @param {資料} item
    */
    getCellTemplate(item) {
        if (item.columnType == "Image") {
            return "cellTemplate";
        } else if (item.columnType == "Route") {
            return "routeCellTemplate";
        } else if (item.columnType == "Drill") {
            return "drillCellTemplate";
        } else if (item.columnType == "Date") {
            return "dateCellTemplate";
        } else if (item.columnType == "Dropdown" && item.isEditable == false) {
            return "dropdownCellTemplate";
        } else if (item.columnType == "Dropdown" && item.isEditable == true) {
            return "dropdownEditableCellTemplate";
        } else if (item.columnType == "Number") {
            return "numberCellTemplate";
        } else {
            return "";
        }
    },
    /**
    * 延遲
    */
    delay(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n);
        });
    },
    /**
     * 回傳唯一筆 陣列資料
     * @param {陣列資料} arr
     */
    singleOrNull(arr) {
        if (Array.isArray(arr)) {
            return arr.length == 1 ? arr[0] : null;
        } else {
            return null;
        }
    },
    /**
    * 物件回傳指定Key
    * @param {物件} obj
    * @param {找尋欄位} key
    * @param {找不到回傳} notfound
    * 
    */
    objToKey(obj, key, notfound = null) {

        if (typeof value === 'object' || Array.isArray(obj)) {
            return notfound == null ? null : notfound;
        }
        return obj[key] != null ? obj[key] : notfound == null ? null : notfound
    },
    arrToObjKey(arr, value = null) {//arr value to obj Key
        return arr.reduce((acc, currentValue) => {
            acc[currentValue] = value;
            return acc;
        }, {});
    },
    fieldComparisonArray(getArr, getObj) {//欄位比對 return arr
        let arr = [];

        getArr.forEach(af => {
            let setObj = getObj;
            Object.keys(setObj).forEach(of => {
                if (af[of] != undefined) {
                    setObj[of] = af[of];
                }
            })
            arr.push(JSON.parse(JSON.stringify(setObj)));
        })
        return arr;
    },
    /**
    * 欄位比對 執行API需傳資料
    * @param {全部欄位} getArr
    * @param {所需欄位名稱} getObj
    * 
    */
    getRequiredFieldValue(getArr, getObj) {
        Object.keys(getObj).forEach(f => getObj[f] = '');
        Object.keys(getArr).forEach(of => {

            if (getObj[of] != undefined) {
                getObj[of] = getArr[of];
            }
        })
        return getObj;
    },
    /**
    * 型別預設值轉型
    * @param {預設轉型} getArr
    * 
    */
    arrayTypeTransformation(getArr, vToDefault = undefined) {
        getArr.forEach(f => {
            switch (f.columnType) {
                case "Number":
                    if (parseInt(f.defaultValue) != "NaN")
                        f.defaultValue = parseInt(f.defaultValue);
                    else if (vToDefault != undefined)
                        f.defaultValue = vToDefault;
                    break;
                default:
                    break;
            }
        })
        return getArr;
    },
    /**
    * 型別預設值轉型(Obj)
    * @param {物件} obj
    * @param {傳入值} value
    * @param {預設值} vToDefault
    */
    objTypeTransformation(obj, value, vToDefault = undefined) {
        switch (obj.columnType) {
            case "Number":
                if (parseInt(value) != "NaN")
                    value = parseInt(value);
                else if (vToDefault != undefined)
                    value = vToDefault;
                break;
            default:
                break;
        }
        return value;
    },

    consolelog(e) {
        console.log(e)
    },

    /**
    * 字串轉日期 ios 通用
    * 
    */
    getStringToDate(date) {
        // return new Date(date);
        return new Date(date.replace(/-/g, '/')).getTime();
    },

    /**
    * 隨機日期
    * 
    */
    generateRandomDate() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30)); // Random date within 30 days
        return endDate.toISOString().split("T")[0];
    },
    /**
    * 隨機字串
    * 
    */
    randomString(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
    /**
    * GUID
    * 
    */
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    /**
    * 假資料
    * @param {範本(type)} obj
    * @param {數量} num
    * 
    */
    fakeInformation(obj, num = 10) {
        let data = [];
        for (let i = 1; i <= num; i++) {

            let newObj = Object.keys(obj).reduce((acc, key) => {
                acc[key] = obj[key];
                return acc;
            }, {});

            let array = ['待處理', '處理中', '已處理', '已出貨']
            Object.keys(newObj).forEach(f => {
                switch (newObj[f]) {
                    case 'id':
                        newObj[f] = this.generateGUID();
                        break;
                    case 'g_u_i_d':
                        newObj[f] = this.generateGUID();
                        break;
                    case 'day':
                        newObj[f] = this.generateRandomDate();
                        break;
                    case 'Number':
                        newObj[f] = Math.floor(Math.random() * 1000000000);
                        break;
                    case 'Array':
                        newObj[f] = array[Math.floor(Math.random() * 100) % array.length];
                        break;
                    default:
                        newObj[f] = this.randomString(10);
                        break;
                }

            })
            data.push(newObj);
        }
        return data;
    },
    /**
    * 排序
    * @param {資料} list
    * @param {排序物件 格式 "{sort:true,name:'',type:''}"}sortobj
    */
    sortedItems(list, sortobj) {
        let num = sortobj.sort ? 1 : -1;
        let dataSource = list.slice().sort((a, b) => {
            if (sortobj.type == "Number") {
                return num * (a[sortobj.name] - b[sortobj.name]);
            } else {
                return num * a[sortobj.name].localeCompare(b[sortobj.name], "zh-CN", { sensitivity: "variant" }); //* (a[id.name] - b[id.name]);
            }
        });
        sortobj.sort = !sortobj.sort;
        return dataSource;
    },
    copy(obj) {
        let copy_obj = JSON.parse(JSON.stringify(obj));
        return copy_obj;
    },

    /**
    * 判斷有無資料
    * @param {字串} str
    */
    isStringEmpty(str) {
        if (str === undefined || str === '') {
            return true;
        } else {
            return false;
        }

    },
    StringEmpty(str) {
        if (str == null || str == '') {
            return true;
        }
        return false;
    },
    StringEmptyDefault(str, Defaultstr = '') {
        if (this.StringEmpty(str)) {
            return Defaultstr;
        }
        return str;
    },
    /**
    * 首字轉大寫
    * @param {字串} string
    */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    /**
    * 複製文字
    *使用navigator.clipboard需要安全來源。因此，如果您的開發環境透過 HTTP 提供服務，則剪貼簿方法將不可用。
    * 可用 window.isSecureContext 判斷是否能用
    * @param {字串} string
    * @param {排除文字} replace
    * 
    */
    copyTexts(string, replace = '') {
        return new Promise((resolve, reject) => {
            try {
                navigator.clipboard.writeText(string.replace(replace, '').trim()).then(() => {
                    resolve({ result: true, msg: '已複製' });
                }).catch(err => {
                    // reject({ result: false, msg: err });
                    resolve({ result: false, msg: err });

                });
            } catch (e) {
                resolve({ result: false, msg: e?.toString() });
            }
        })
    },
    /**
    * 複製文字
    * @param {字串} string
    * @param {排除文字} replace
    * 
    */
    copyText(string, replace = '') {
        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            try {
                textarea.value = string.replace(replace, '').trim();
                document.body.appendChild(textarea);
                textarea.select();
                const successful = document.execCommand('copy');
                if (successful) {
                    resolve({ result: true, msg: '已複製' });
                } else {
                    resolve({ result: false, msg: '失敗' });
                }
            } catch (err) {
                resolve({ result: false, msg: err });
            } finally {
                document.body.removeChild(textarea);
            }
        })

    },
    /**
    * 全形轉半形
    * @param {字串} string
    * 
    */
    fullShapeToHalfShape(str = '') {
        str = this.StringEmpty(str) ? '' : str;
        return str.replace(/[\uff01-\uff5e]/g, function (ch) {
            return String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
        }).replace(/\u3000/g, ' ')
    },
    is_https() {
        return 'https:' == location.protocol ? true : false;
    },
    /**
    * 數字前面補 0 到固定長度
    * 
    */
    padStart(int, number) {
        return int.toString().padStart(number, "0");
    },
    //交集、差集
    /**
    * 交集
    * @param {全部資料} arr
    * @param {所需資料} comparisonArr
    * 
    */
    intersection(arr, comparisonArr) {
        return arr.filter((e) => {
            return comparisonArr.indexOf(e) > -1
        })
    },
    //物件排除指定Key
    deleteObjKet(allObj, deleteArrkey) {
        let data = JSON.parse(JSON.stringify(allObj));
        deleteArrkey.forEach(f => {
            delete data[f];
        })
        return data;
    },
    /**
    * 強制更新
    * @param {資料} data
    */
    forceUpdate(data = undefined) {
        if (data != undefined)
            return JSON.parse(JSON.stringify(data));
        else
            return data;
    },
    add(a, b) {
        a = a.toString();
        b = b.toString();

        let maxLength = Math.max(a.length, b.length);//取最大長度
        a = a.padStart(maxLength, 0);
        b = b.padStart(maxLength, 0);
        let t = 0;
        let f = 0;
        let sum = "";
        for (let i = maxLength - 1; i >= 0; i--) {
            t = parseInt(a[i]) + parseInt(b[i]) + f;
            f = Math.floor(t / 10);
            sum = t % 10 + sum;
        }
        if (f == 1) {
            sum = "1" + sum;
        }
        return parseInt(sum);
    },
    /**
    * 關閉 cache
    * @param {資料} data
    */
    closeCache(vnode, delkey) {

        var vn = vnode,
            p = vn && vn.parent
        if (!vn || !vn.data.keepAlive || !vn.componentOptions) return
        if (!p || !p.componentInstance || !p.componentInstance.cache) return
        var key = vn.key.replace(/-\/.*/, delkey.replace('#', '-'))

        // var key = vn.key ||
        // vn.componentOptions.Ctor.cid +
        // (vn.componentOptions.tag ? `::${vn.componentOptions.tag}` : "")
        var cache = p.componentInstance.cache
        var keys = p.componentInstance.keys
        if (cache[key]) {
            if (keys.length) {
                var index = keys.indexOf(key)
                if (index > -1) {
                    keys.splice(index, 1)
                }
            }
            // console.log('cache[key]',cache[key]);
            delete cache[key]
        }
        // this.$destroy();
    },

    /**
    * 取隨機整數亂數
    * @param {小} min
    * @param {大} max
    */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    formatDecimal(value, precision = 10) {
        const factor = Math.pow(10, precision);
        return Math.round((value + Number.EPSILON) * factor) / factor;
    },
    // convertToTaiwanTime(dateStr) {
    //     try {
    //         const date = new Date(dateStr);
    //         if (isNaN(date)) {
    //             console.error("無效的日期格式");
    //             return null;
    //         }
    //         return new Intl.DateTimeFormat("zh-TW", {
    //             timeZone: "Asia/Taipei",
    //             year: "numeric",
    //             month: "2-digit",
    //             day: "2-digit",
    //             hour: "2-digit",
    //             minute: "2-digit",
    //             second: "2-digit",
    //             hour12: false,
    //         }).format(date);
    //     } catch (e) {
    //         return null
    //     }
    // },
    removeAllSpaces(str, pick = '/\s+/g', rep = '') {
        return str.replace(pick, rep);
    },
    convertToTaiwanTime(dateStr, formatType = "YYYY/MM/DDHH:MM:SS") {
        try {
            formatType = this.removeAllSpaces(this.removeAllSpaces(formatType.toUpperCase()), '-', '/');
            const date = new Date(dateStr);
            if (isNaN(date)) {
                console.error("無效的日期格式:", dateStr);
                return null;
            }

            // 定義不同格式
            const dateFormat = new Intl.DateTimeFormat("zh-TW", {
                timeZone: "Asia/Taipei",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(date);

            const timeFormat = new Intl.DateTimeFormat("zh-TW", {
                timeZone: "Asia/Taipei",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }).format(date);

            // 根據 formatType 回傳不同結果
            if (formatType === "YYYY/MM/DD") {
                return dateFormat; // 只回傳日期
            } else if (formatType === "HH:MM:SS") {
                return timeFormat; // 只回傳時間
            } else {
                return `${dateFormat} ${timeFormat}`; // 預設回傳完整日期時間
            }
        } catch (e) {
            console.error("日期轉換錯誤:", e);
            return null;
        }
    },
    getStringLength(str) {
        let length = 0;
        for (let char of str) {
            const code = char.charCodeAt(0);
            if (
                (code >= 0x4E00 && code <= 0x9FFF) || // 中文
                (code >= 0x3040 && code <= 0x30FF) || // 日文假名
                (code >= 0xAC00 && code <= 0xD7AF) || // 韓文
                (code > 0xFF00 && code < 0xFFEF)     // 全形字符
            ) {
                length += 2;
            } else {
                length += 1;
            }
        }
        return length;
    },
    components: {
    },
};
