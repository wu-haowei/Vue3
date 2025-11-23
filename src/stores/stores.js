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
    fido2User: null, // FIDO2 使用者資料
  }
}

export default createStore({
  state: getDefaultState(),
  mutations: {
    increment(state) {
      state.count++;
    },
    setLogIn(state, options) {
      state.isLogin = options.isLogin || false;
      state.jwtToken = options.jwtToken || '';
      state.account = options.account || null;
      state.fido2User = options.fido2User || null;
    },
    RESET_STATE(state) {
      const fido2User = state.fido2User
      Object.assign(state, getDefaultState())
      state.fido2User = fido2User;
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
    SET_FIDOUSER(state, user) {
      state.fido2User = user;
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
              context.commit('setLogIn', { isLogin: res.result.success, jwtToken: res.data, account: options.account, fido2User: null });
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
    async logInToFido(context, options) {
      return new Promise((resolve, reject) => {
        try {
          context.commit('setLogIn', { isLogin: options.result.success, jwtToken: options.data, account: options.account, fido2User: options.fido2User });
          resolve(options.result.success);
        } catch (error) {
          reject(false);
        }
      });

    },
    async logOut(context) {
      context.commit('RESET_STATE');
    },
    connect({ commit, dispatch }) {
      if (this.state.socket) return; // 已有連線，避免重複

      const socket = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}ws?userId=${crypto.randomUUID()}`);
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
    fidoUser({ commit, getters }, isOpen) {
      return new Promise((resolve, reject) => {
        if (isOpen) {
          if (getters.getAccount && getters.getAccount != '') {
            commit("SET_FIDOUSER", getters.getAccount);
            resolve({ success: true, message: "已開啟無密碼登入功能" });
          } else {
            reject({ success: false, message: "user not found." });
          }
        } else {
          commit("SET_FIDOUSER", null);
          resolve({ success: true, message: "已關閉無密碼登入功能" });
        }
      });
    },
  },
  getters: {
    isLogin: (state) => {
      return state.isLogin;
    },
    token: (state) => {
      return state.token;
    },
    getAccount: (state) => {
      return state.account;
    },
    getToken: (state) => {
      return state.jwtToken;
    },
    getMessages: (state) => {
      return state.messages;
    },
    getFido2User: (state) => {
      return state.fido2User;
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
          fido2User: val.fido2User,
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