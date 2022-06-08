import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { //全局状态
    isLogin: false,
  },
  getters: {
  },
  mutations: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
    },

  },
  actions: {
  },
  modules: {
  }
})


// Store.state.count

// Store.commit('increment')
