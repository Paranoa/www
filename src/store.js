import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    proxyedElement: null,
    proxyContainer: null
  },
  mutations: {
    setProxyElement (state, el) {
      state.proxyedElement = el
    },
    setProxyContainer (state, el) {
      state.proxyContainer = el
    }
  }
})
