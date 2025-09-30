import { APIService } from "@/services/APIService";
const apiService = new APIService();
import store from "@/stores/stores";
import axios from 'axios';



export class LoginService {
    /**
    * 
    * @param {帳號} userName
    * @param {密碼} userPassword
    * 
    */
    async login(userAccount, userPassword) {
        return apiService.POST(`api/Login/Login`, {
            "account": userAccount,
            "password": userPassword
        })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });

    }

    async SignUp(data) {
        return apiService.POST(`api/Login/SignUp`, data)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async ForgetPassword(account) {
        return apiService.GET(`api/Login/ForgetPassword/${account}`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    async getStlouisfed(type = 'DGS10') {
        return apiService.GET(`api/Toolbox/Stlouisfed/${type}`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async GetPublicKey() {
        return apiService.GET(`api/PWA/GetPublicKey`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async Subscribe(data) {
        return apiService.POST(`api/PWA/Subscribe`, data)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async UnSubscribe(data) {
        return apiService.POST(`api/PWA/UnSubscribe`, data)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async SendAll(data = {
        "Subject": "有一則新訊息",
        "body": "伺服器推播"
    }) {
        return apiService.POST(`api/PWA/SendAll`, data)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async ValidEmail(data) {
        return apiService.POST(`api/Login/ValidEmail`, data)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    async GetRegisterChallenge() {
        return axios.get(
            `${import.meta.env.VITE_API_URL}api/Login/Register/GetRegisterChallenge`,
            // `https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net/api/Login/Register/GetRegisterChallenge`,
            {
                headers: {
                    Authorization: `Bearer ${store.getters["getToken"]}`,
                    "ngrok-skip-browser-warning": "1231",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Origin": "https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net"
                },
                withCredentials: true
            }
        )
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    async VerifyRegister(data = {}) {
        return axios.post(
            `${import.meta.env.VITE_API_URL}api/Login/Register/VerifyRegister`,
            // `https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net/api/Login/Register/VerifyRegister`,
            data, // 放在 body
            {
                headers: {
                    Authorization: `Bearer ${store.getters["getToken"]}`,
                    "ngrok-skip-browser-warning": "1231",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Origin": "https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net"
                },
                withCredentials: true
            }
        )
            .then((result) => result.data)
            .catch((err) => Promise.reject(err));
    }
    async GetLoginChallenge(userId) {
        return axios.get(
            `${import.meta.env.VITE_API_URL}api/Login/GetLoginChallenge?userId=${userId}`,
            // `https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net/api/Login/GetLoginChallenge?userId=Henry`,
            {
                headers: {
                    Authorization: `Bearer ${store.getters["getToken"]}`,
                    "ngrok-skip-browser-warning": "1231",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Origin": "https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net"
                },
                withCredentials: true
            }
        )
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    async VerifyLogin(data = {}) {
        return axios.post(
            `${import.meta.env.VITE_API_URL}api/Login/VerifyLogin`,
            // `https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net/api/Login/VerifyLogin`,
            data, // 放在 body
            {
                headers: {
                    Authorization: `Bearer ${store.getters["getToken"]}`,
                    "ngrok-skip-browser-warning": "1231",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Origin": "https://h-web-api-a2gvavdbg9dggxa3.canadacentral-01.azurewebsites.net"
                },
                withCredentials: true
            }
        )
            .then((result) => result.data)
            .catch((err) => Promise.reject(err));
    }


    async getSession() {
        return apiService.GET(`api/Login/A`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async setSession() {
        return apiService.GET(`api/Login/B`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
}