import Vue from 'vue'
import catchFail from './catchFail'

export default {
  // 添加课程表
  addClassTable (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/classtable/add',
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
  // 查询课程表
  getClassTableList (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/classtable/list',
      method: 'post',
      data: {
        ...body
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
    })
  },
  // 删除课程表
  deleteClassTable (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/classtable/del',
      method: 'post',
      data: {
        ...body
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
    })
  },
  // 编辑课程表
  editClassTable (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/classtable/edit',
      method: 'post',
      data: {
        ...body
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
    })
  },
  // 查询课程
  getClassList (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/class/list',
      method: 'post',
      data: {
        ...body
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
    })
  },
  // 添加课程
  addClass (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/class/add',
      method: 'post',
      data: {
        ...body
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
