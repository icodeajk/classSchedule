import Vue from 'vue'
import Vuex from 'vuex'

// import * as actions from './actions'   //根级别的 action
// import * as getters from './getters'   //根级别

import auth from './modules/auth'
import cart from './modules/cart'
// import guestRoom from './modules/guestRoom'
// import modal from './modules/modal'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    cart
    // guestRoom,
    // modal
  },
  strict: debug,
})
