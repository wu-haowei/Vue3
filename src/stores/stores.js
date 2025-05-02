import { createStore } from 'vuex';

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
    async setLogIn(state, options) {
      state.isLogin = options.isLogin;
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
      const success = await hashSHA256(options.password) === "40a5c6add604c620ec93497530b89b2dc483e04e7812a6d9c89c879fc7c3a6c8";
      if (success) {
        context.commit('setLogIn', {
          isLogin: true,
        });
      } else {
        context.commit('setLogIn', { isLogin: false });
      }
      return success;
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