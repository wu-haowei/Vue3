import { createStore } from 'vuex';

export default createStore({
  state: {
    // Your state variables go here
    count: 0,
    token: '',
    isLogin: false, //是否登入
    account: "", //帳號
    userName: "", //姓名
  },
  mutations: {
    // Your mutations go here
    increment(state) {
      state.count++;
    },
    setLogIn(state, options)  {
      state.isLogin = true;
      state.token = options.token;
      state.account = options.account;
      state.userName = options.userName;
    },
  },
  actions: {
    // Your actions go here
    asyncIncrement({ commit }) {
      // You can perform asynchronous operations here
      setTimeout(() => {
        commit('increment');
      }, 1000);
    },
    logIn(context, options) {
      context.commit("setLogIn", { options });
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

  }
});