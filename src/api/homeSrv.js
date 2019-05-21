import Vue from 'vue'
import catchFail from './catchFail'
import store from '../store'

export default {
  search (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/search',
      method: 'post',
      data: {
        username: store.state.auth.alu,
        ...body
      }
    }).then(rep => {
      const {status, data} = rep
      if (status === 200 && data.status === 0) {
        return data
      } else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
    })
  },
  getHistoryList (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/history',
      method: 'get',
      params: {
        username: store.state.auth.alu,
        ...query
      }
    }).then(rep => {
      const {status, data} = rep
      if (status === 200 && data.status === 0) {
        return data
      } else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
    })
  },
  loginByjiangnan (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/account/user/login/mobile',
      method: 'post',
      data: {
        username: store.state.auth.alu,
        ...body
      }
    }).then(rep => {
      const {status, data} = rep
      if (status === 200) {
        return data
      } else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
    })
  }
}
