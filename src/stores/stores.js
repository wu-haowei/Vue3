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
    socket: null,
    connected: false,
    messages: [],
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
    },
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    SET_CONNECTED(state, connected) {
      state.connected = connected;
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
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
            if (res.result.success) {
              context.commit('setLogIn', res);
              resolve(res.result.success);
            } else
              resolve(false);
          })
          .catch((error) => {
            if (error.code == 401) {
              resolve(false);
            } else {
              reject(false);
            }
          });
      });
    },
    async logOut(context) {
      context.commit('RESET_STATE');
    },
    connect({ commit, dispatch }) {
      if (this.state.socket) return; // 已有連線，避免重複

      const socket = new WebSocket(`wss://localhost:7228/ws?userId=${'userId'}`);
      commit("SET_SOCKET", socket);

      socket.onopen = () => {
        console.log("WebSocket connected");
        commit("SET_CONNECTED", true);
        // 連線後你可以 dispatch 其他 actions
      };

      socket.onmessage = (event) => {
        console.log(event.data);
        commit("ADD_MESSAGE", event.data);
      };

      socket.onclose = () => {
        console.log("WebSocket closed");
        commit("SET_CONNECTED", false);
        commit("SET_SOCKET", null);
        // 需要可在這重連
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    },

    sendMessage({ state }, message) {
      if (state.connected && state.socket) {
        state.socket.send(message);
      } else {
        console.warn("WebSocket not connected.");
      }
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
    getMessages: (state) => {
      return state.messages;
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