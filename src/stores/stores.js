import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'; //持久化
import { LoginService } from "@/services/LoginService";
const loginService = new LoginService();

const getDefaultState = () => {
  return {
    count: 0,
    token: '',
    isLogin: false, //是否登入
    account: "", //帳號
    userName: "", //姓名
    jwtToken: "",
  }
}

export default createStore({
  state: getDefaultState(),
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
    RESET_STATE(state) {
      Object.assign(state, getDefaultState()) // 將 state 重設為初始狀態
    }
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
            context.commit('setLogIn', res);
            resolve(res.result.success);
          })
          .catch((error) => {
            reject(false);
          });
      });
    },
    async logOut(context) {
      context.commit('RESET_STATE');
    },
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
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          //只儲存需要的資料
          token: val.token,
          isLogin: val.isLogin,
        };
      },
    }),
  ],
});

// async function hashSHA256(str) {
//   const encoder = new TextEncoder();
//   const hash = await crypto.subtle.digest('SHA-256', encoder.encode(str));
//   return [...new Uint8Array(hash)]
//     .map((b) => b.toString(16).padStart(2, '0'))
//     .join('');
// }