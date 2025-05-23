import { APIService } from "@/services/APIService";
const apiService = new APIService();

export class LoginService {
    /**
    * 
    * @param {帳號} userName
    * @param {密碼} userPassword
    * 
    */
    async login(userAccount, userPassword) {
        return apiService.POST(`api/WeatherForecast/Login`, {
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

    async getStlouisfed(type = 'DGS10') {
        return apiService.GET(`api/WeatherForecast/Stlouisfed/${type}`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async GetPublicKey() {
        return apiService.GET(`api/WeatherForecast/GetPublicKey`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    async Subscribe(data) {
        return apiService.POST(`api/WeatherForecast/Subscribe`, data)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
        async SendAll() {
        return apiService.GET(`api/WeatherForecast/SendAll`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
}