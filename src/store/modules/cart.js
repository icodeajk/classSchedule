import Vue from 'vue'
import * as types from '../mutation-types'

// initial state
const state = {
  account: 5,
  saveCurrent: {enterMarket: true, enterDetail: false, scroll: 0},
  scrollToFlag: 0
}

// getters
const getters = {
  account: state => state.account
}

// actions
const actions = {}

// mutations
const mutations = {
  [types.ACCOUNT_ADD](state, val){
    state.account = state.account + val;
  },
  [types.ACCOUNT_DELETE](state, val){
    state.account = state.account - val;
  },
  [types.SAVE_CURRENT](state,{val,y}){
    if(y){state.saveCurrent.scroll=y}
    if(val==1){
      state.saveCurrent.enterMarket=true
    }else if(val==2){
      state.saveCurrent.enterDetail=true
    }else if(val==3){
      state.saveCurrent.enterDetail=false
      state.saveCurrent.enterMarket=false
    }

  },
  [types.CHANGESCROLLTOFLAG](state,val){
    state.scrollToFlag=val
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
