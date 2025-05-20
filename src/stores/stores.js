import { createStore } from 'vuex';

import { LoginService } from "@/services/LoginService";
const loginService = new LoginService();


export default createStore({
  state: {
    count: 0,
    token: '',
    isLogin: false, //是否登入
    account: "", //帳號
    userName: "", //姓名
    jwtToken: "",
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    setLogIn(state, options) {
      state.isLogin = options.result.success;
      state.jwtToken = options.data || '';
      // state.token = options.token;
      // state.account = options.account;
      // state.userName = options.userName;
    },
  },
  actions: {
    asyncIncrement({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    },
    async logIn(context, options) {
      return new Promise((resolve, reject) => {
        debugger;
        loginService.login(options.account, options.password)
          .then(async (res) => {
            context.commit('setLogIn', res);
            resolve(res.result.success);
          })
          .catch((error) => {
            reject(false);
          });
      });
    }
  },
  getters: {
    isLogin: (state) => {
      return state.isLogin;
    },
    token: (state) => {
      return state.token;
    },
    account: (state) => {
      return state.account;
    },
    getToken: (state) => {
      return state.jwtToken;
    },
  }
});

async function hashSHA256(str) {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(str));
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}