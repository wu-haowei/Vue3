import { APIService } from "@/services/APIService";
const apiService = new APIService();

export class AIService {

    async GetAIModelLog(model) {
        return apiService.GET(`api/AI/GetAIModelLog/${model}`)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
    /**
    * 
    * @param {相關資訊} message
    * 
    */
    async MessageSave(message) {
        return apiService.POST(`api/AI/MessageSave`, message)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return Promise.reject(err);
            });

    }
   
}