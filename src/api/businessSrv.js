import Vue from 'vue'
import catchFail from './catchFail'
import store from '../store'

export default {
  // 获取公司风险营销事件列表
  businessSearch (query = {}, userFlag = true, context = '') {
    // console.log(userFlag)
    let user = userFlag ? store.state.auth.alu : ''
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/dynamic_infos',
      method: 'get',
      params: {
        username: store.state.auth.alu,
        // username:user,
        ...query
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        return data
      } else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
      // window.location.href = '/'
    })
  },
  // 修改事件推送设置
  changeEventSetting (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/follow/config',
      method: 'post',
      data: {
        ...body
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        return data
      } else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
    })
  },
  // 获取事件推送设置
  getEventSetting (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/follow/config',
      method: 'get',
      params: {
        ...query
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        return data
      } else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
    })
  }
}
