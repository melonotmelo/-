import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeIndex: '/home',
  },
  getters: {
  },
  mutations: {
    setActiveIndex(state, key){
      state.activeIndex = key;
    }
  },
  actions: {
  },
  modules: {
  }
})
