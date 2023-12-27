// 引入 VeeValidate 元件跟功能
import {
    Field, Form, ErrorMessage, defineRule, configure,
} from 'vee-validate';
// 引入 VeeValidate 的 i18n 功能
import { localize, setLocale } from '@vee-validate/i18n';
// 引入 VeeValidate 的驗證規則
import {required,email,min} from '@vee-validate/rules';
// 引入 VeeValidate 的繁體中文語系檔
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

export default (app) => {
    defineRule('自訂驗證', (value) => {
        if (value && value.trim()) return true;
        else 'This is required';
    })
    //https://firebase.google.com/docs/firestore/pricing?hl=zh-tw#taiwan
    //https://youtu.be/Ag52l67ggAE?si=ux0OTlgnSs7KMM1T&t=1490
    defineRule('required', required)
    defineRule('email', email)
    defineRule('min', min)



    // 參考 https://israynotarray.com/vue/20230208/3309208839/
    // 使用 Object.keys 將 AllRules 轉為陣列並使用 forEach 迴圈將驗證規則加入 VeeValidate
    // Object.keys(AllRules).forEach((rule) => {
    //     console.log(rule);
    //     //https://vee-validate.logaretm.com/v2/guide/rules.html#alpha
    //     defineRule(rule, AllRules[rule]);
    // });

    // 將當前 VeeValidate 的語系設定為繁體中文
    configure({
        // generateMessage: localize({ zh_TW: zhTW }),
        // validateOnInput: true,
        generateMessage: localize('zh_TW', {
            messages: {
                //自訂文字(不能用中文)
                required: '{field} 沒填',
                // email:'123'
            }
        }),
    });
    // setLocale('zh_TW');

    // 掛載 Global 的 VeeValidate 元件
    app.component('VField', Field);
    app.component('VForm', Form);
    app.component('ErrorMessage', ErrorMessage);
}