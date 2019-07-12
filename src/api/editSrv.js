import Vue from 'vue'
import catchFail from './catchFail'
import store from '../store'
export default {
  // 获取公司风险营销事件列表
  addClass (query = {}, userFlag = true, context = '') {
    // console.log(userFlag)
    let user = userFlag ? store.state.auth.alu : ''
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/edit/addClass',
      method: 'post',
      data: {
        username: store.state.auth.alu,
        // username:user,
        ...query
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200) {
        return data
      } else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
      // window.location.href = '/'
    })
  }
}
