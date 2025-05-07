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
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    setLogIn(state, options) {
      state.isLogin = options;
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
        loginService.login(options.account, options.password)
          .then(async (res) => {
            if (res) {
              context.commit('setLogIn', true);
            } else {
              context.commit('setLogIn', false);
            }
            resolve(res);
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
    }
  }
});

async function hashSHA256(str) {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(str));
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}