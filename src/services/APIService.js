import axios from 'axios';
import common from '@/components/common';
import store from "@/stores/stores";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // baseURL: 'http://192.168.0.167:8787/',
    timeout: 10000,
     withCredentials: true // 🔑 讓瀏覽器攜帶 Cookie
    // headers: {
    //     'Content-Type': 'application/json;charset=UTF-8'
    // }
});

//request 新增請求攔截器
instance.interceptors.request.use(function (config) {
    config.headers['ngrok-skip-browser-warning'] = '1231';
    config.headers.Authorization = `Bearer ${store.getters["getToken"]}`;
    return config;
}, function (error) {
    return Promise.reject(error);
});

//response 新增響應攔截器
instance.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const { default: router } = await import('../router/index');
        if (!window.navigator.onLine) {
            alert("請重新連線後重整網頁");
            router.push({ path: '/Home' });
            return;
        }
        else if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.log(error.message);
                    break;
                case 404:
                    console.log(error.message);
                    break;
                case 419://JWT失效
                    alert("JWT失效");
                    router.push({ path: '/Login' });
                    break;
                case 500:
                    console.log(error.message);
                    break;
                default:
                    console.log(error.message);
            }
        }
        // downloadTxt(error);
        return Promise.reject(error);
    },
);

export class APIService {
    /**
    * GET
    * @param {路徑} url
    * @param {參數} params
    */
    async GET(url, params) {
        try {
            const res = await instance.get(`${import.meta.env.VITE_API_URL}${url}`, {
                params,
            });
            return res.data;
        } catch (res) {
            return Promise.reject(res.message);
        }
    }
    async GETBlob(url) {
        try {
            const res = await instance.get(`${import.meta.env.VITE_API_URL}${url}`, {
                responseType: 'blob'
            });
            return res.data;
        } catch (res) {
            return Promise.reject(res.message);
        }
    }
    /**
    * DELETE
    * @param {路徑} url
    * @param {參數} params
    */
    async DELETE(url, params) {
        try {
            const res = await instance.delete(`${import.meta.env.VITE_API_URL}${url}`, params);
            return res.data;
        } catch (res) {
            return Promise.reject(res.message);
        }
    }
    /**
    * POST
    * @param {路徑} url
    * @param {參數} params
    */
    async POST(url, params, config = null) {
        const start = Date.now();
        try {
            const res = await instance.post(`${import.meta.env.VITE_API_URL}${url}`, params);
            const remainingTime = 1000 - (Date.now() - start);
            if ((remainingTime) > 0) {
                await common.delay(remainingTime);
            }
            return res.data;
        } catch (res) {

            if (res.response) {
                // 伺服器有回應，但 status code 不在 2xx 範圍
                const { status, data } = res.response;
                return Promise.reject({
                    code: status,
                    message: data?.message || 'Request failed',
                    data: data
                });
            } else if (res.request) {
                // 沒有收到伺服器回應
                return Promise.reject({
                    code: 0,
                    message: 'No response from server'
                });
            } else {
                // 其他錯誤
                return Promise.reject({
                    code: -1,
                    message: res.message || 'Unknown error'
                });
            }
        }
    }
    /**
   * PUT
   * @param {路徑} url
   * @param {參數} params
   */
    async PUT(url, params, config = null) {
        try {
            const res = await instance.put(`${import.meta.env.VITE_API_URL}${url}`, params);
            return res.data;
        } catch (res) {
            return Promise.reject(res.message);
        }
    }
    async GETBLOBFile(url) {
        try {
            const response = await instance.get(`${import.meta.env.VITE_API_URL}${url}`, {
                responseType: 'blob'
            },
            );
            return new Promise((resolve, reject) => {
                let fileExtension = '';
                switch (response.headers['content-type']) {
                    case 'application/pdf':
                        fileExtension = '.pdf';
                        break;
                    case 'image/jpeg':
                        fileExtension = '.jpg';
                        break;
                    case 'image/png':
                        fileExtension = '.png';
                        break;
                    case 'application/msword':
                        fileExtension = '.doc';
                        break;
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        fileExtension = '.docx';
                        break;
                    case 'application/vnd.ms-excel':
                        fileExtension = '.xls';
                        break;
                    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        fileExtension = '.xlsx';
                        break;
                    case 'application/vnd.ms-powerpoint':
                        fileExtension = '.ppt';
                        break;
                    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        fileExtension = '.pptx';
                        break;
                    case 'text/plain':
                        fileExtension = '.txt';
                        break;
                    case 'text/csv':
                        fileExtension = '.csv';
                        break;
                    case 'application/rtf':
                        fileExtension = '.rtf';
                        break;
                    case 'application/xml':
                        fileExtension = '.xml';
                        break;
                    case 'application/zip':
                        fileExtension = '.zip';
                        break;
                    default:
                        fileExtension = '';
                }
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;


                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'defaultFilename';

                if (contentDisposition) {
                    const fileNameMatchUTF8 = contentDisposition.match(/filename\*=UTF-8''(.+)/);

                    if (fileNameMatchUTF8 && fileNameMatchUTF8.length > 1) {
                        fileName = decodeURIComponent(fileNameMatchUTF8[1]);
                    } else {
                        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                        if (fileNameMatch && fileNameMatch.length > 1) {
                            fileName = fileNameMatch[1];
                        }
                    }
                }

                link.setAttribute('download', `${fileName}${fileExtension}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
                resolve(true);
            });
        } catch (res) {
            return Promise.reject(res.message);
        }
    }
}