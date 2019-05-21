/**
 * Created by chan on 2017/8/8.
 * @des：权限信息
 */

import Vue from 'vue'
import * as types from '../mutation-types'

// initial state
const state = {
  adminId: null,
  hotelId: null,
  roleId: null,
  hotelName:"",
  alu: null
}

// getters
const getters = {
  adminId: state => state.adminId,
  hotelId: state => state.hotelId,
  roleId: state => state.roleId,
  hotelName: state => state.hotelName
}

// actions
const actions = {}

// mutations
const mutations = {
  [types.AUTH_SETADMIN](state,val){
    state.adminId = val;
    // console.log("adminId:",state.adminId)
  },
  [types.AUTH_SETHOTEL](state,val){
    state.hotelId = val;
    // console.log("hotelId",state.hotelId)
  },
  [types.AUTH_ROLEID](state,val){
    state.roleId = val;
    // console.log("roleId",state.roleId)
  },
  [types.AUTH_HOTELNAME](state,val){
    state.hotelName = val;
    // console.log("hotelName",state.hotelName)
  },
  [types.AUTH_ALU](state,val){
    state.alu = val;
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}
