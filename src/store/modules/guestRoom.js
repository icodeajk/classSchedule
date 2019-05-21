/**
 * Created by chan on 2017/7/18.
 * des：客服管理请求参数-guest_param, 后端数据返回数据guest_status
 */
import Vue from 'vue'
import * as types from '../mutation-types'
//http api
import guestRoomSrv from "../../api/guestRoom"

// initial state
const state = {
  guest_param: {   //客房管理post参数
    pageno: 1,     //页数，从1开始
    pagesize: 10,  //每页显示数量
    totalcount:10,  //总条数
    roomName: null,   //房间名
    deviceStatus: null, //设备状态 1-已启动已绑定 2-已启动未绑定 3-未启动已绑定 4-未启动未绑定
    serviceStatus:null, //任务状态 1-已入睡 2-未入睡 3-生命特征异常
    userStatus: null,   //用户状态 1-提醒待确认 2-提醒已确认 3-待提醒服务 4-已过期服务
  },
  guest_status: {
    "code": -1,
    "customerRoomStatusBeans": []
  }
}

// getters
const getters = {
  guestParam: state => state.guest_param,
  guestStatus: state => state.guest_status
}


// actions
const actions = {
  guest_update({ commit, state },data){
    commit(types.GUEST_UPDATE,data);        //先更新post参数
    guestRoomSrv.getRoomStatus()            //后用更新后的post参数请求参数获取新的数据
      .then((res) =>{
        console.log(res);
        commit(types.GUEST_ROOMSTATUS, res);
      })
  }
}

// mutations
const mutations = {
  [types.GUEST_RESET](state){
    state.guest_param.roomName = null;
    state.guest_param.deviceStatus = null;
    state.guest_param.serviceStatus = null;
    state.guest_param.userStatus = null;
    // console.log(state.guest_param);
  },
  [types.GUEST_UPDATE](state, {attr, val}){
    state.guest_param[attr] = val
    // console.log(state.guest_param);
  },
  [types.GUEST_ROOMSTATUS](state, data){
    state.guest_status = data
    // console.log(state.guest_param);
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}
