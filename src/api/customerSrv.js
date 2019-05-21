import Vue from 'vue'
import catchFail from './catchFail'
import store from '../store'
import { Toast } from 'mint-ui'

export default {
  // 搜索客户列表
  companySearch (post = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/customer/search',
      method: 'post',
      data: {
        username: store.state.auth.alu,
        ...post
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        return data
      } else if (status === 200) {
        if (typeof (data) === 'string') {
          console.log(data)
          var results = JSON.parse(data)
          console.log(results)
          return results
        }
      } else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
    })
  },
  // 监控企业列表
  monitorList (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/notification/getMonitorCardList',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 行内客户关联行外企业列表
  innerLinkList (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/inner-company-link-outer',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 新注册企业列表
  newRegistedList (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/new-registered-company',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // message
  monitorEventList (post = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/notification/getMsgs',
      method: 'post',
      data: {
        username: store.state.auth.alu,
        ...post
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200) {
        return data
      } else {
      }
    }, respond => { // 错误处理
      catchFail(respond.response)
      // window.location.href = '/'
    })
  },
  // 获取关注的分组
  getFollowGroup (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: 'api/follow/follow_list',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 编辑分组
  editGroup (post = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: 'api/follow/follow_list',
      method: 'put',
      data: {
        username: store.state.auth.alu,
        ...post
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        let instance = Toast({
          message: '修改成功',
          iconClass: 'icon icon-normal',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
        }, 1000)
        return data
      } else {
        let instance = Toast({
          message: rep.data.msg,
          iconClass: 'icon icon-error',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
        }, 1000)
        catchFail(rep)
      }
    }, respond => { // 错误处理
      let instance = Toast({
        message: respond.data.msg,
        iconClass: 'icon icon-error',
        duration: 1000
      })
      setTimeout(() => {
        instance.close()
      }, 1000)
    })
  },
  // 新增分组
  addGroup (post = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: 'api/follow/follow_list',
      method: 'post',
      data: {
        username: store.state.auth.alu,
        ...post
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        let instance = Toast({
          message: '新建成功',
          iconClass: 'icon icon-normal',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
          // window.location.reload()
        }, 1000)
        return data
      } else {
        let instance = Toast({
          message: rep.data.msg,
          iconClass: 'icon icon-normal',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
        }, 1000)
        catchFail(rep)
      }
    }, respond => { // 错误处理
      let instance = Toast({
        message: respond.data.msg,
        iconClass: 'icon icon-error',
        duration: 1000
      })
      setTimeout(() => {
        instance.close()
      }, 1000)
    })
  },
  // 删除分组
  deleteGroup (post = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: 'api/follow/follow_list/' + post.list_id,
      method: 'delete',
      data: {
        username: store.state.auth.alu,
        ...post
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        let instance = Toast({
          message: '删除成功',
          iconClass: 'icon icon-normal',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
        }, 1000)
        return data
      } else {
        let instance = Toast({
          message: rep.data.msg,
          iconClass: 'icon icon-error',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
        }, 1000)
        catchFail(rep)
      }
    }, respond => { // 错误处理
      let instance = Toast({
        message: respond.data.msg,
        iconClass: 'icon icon-error',
        duration: 1000
      })
      setTimeout(() => {
        instance.close()
      }, 1000)
    })
  },
  // 获取各个分组的列表
  getFollowList (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: 'api/follow/follow_list/items/' + query.list_id,
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 批量编辑分组
  editGroupMore (post = {}, idList = [], context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: 'api/follow/batch_modify_follow?company_name=' + post.company_name,
      method: 'post',
      data: idList
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        if (idList.length === 0) {
          let instance = Toast({
            message: '取消关注成功',
            iconClass: 'icon icon-normal',
            duration: 1000
          })
          setTimeout(() => {
            instance.close()
            // window.location.reload()
          }, 1000)
        } else {
          let instance = Toast({
            message: '设置成功',
            iconClass: 'icon icon-normal',
            duration: 1000
          })
          setTimeout(() => {
            instance.close()
            // window.location.reload()
          }, 1000)
        }
        return data
      } else {
        let instance = Toast({
          message: rep.data.msg,
          iconClass: 'icon icon-error',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
        }, 1000)
        catchFail(rep)
      }
    }, respond => { // 错误处理
      let instance = Toast({
        message: respond.data.msg,
        iconClass: 'icon icon-error',
        duration: 1000
      })
      setTimeout(() => {
        instance.close()
      }, 1000)
    })
  },
  // 获取某个企业的关注列表
  comFollowList (query = {}, index = null, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: 'api/follow/follow_list',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 关注、取消监控客户
  toggleMonitor (body = {}, index = null, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/follow/setMonitorConfig',
      method: 'put',
      data: {
        username: store.state.auth.alu,
        'closely_rule': '01,02,03,04,05,06,07,08,09', // 关联企业的规则（这个rule好像PC的前端是根据某个条件写死的）
        ...body
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        // let instance = Toast({
        //   message: '设置成功',
        //   iconClass: 'icon icon-normal',
        //   duration: 1000
        // })
        // setTimeout(() => {
        //   instance.close()
        // }, 1000)
        return data
      } else {
        let instance = Toast({
          message: rep.data.msg,
          iconClass: 'icon icon-error',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
        }, 1000)
        return false
      }
    }, respond => { // 错误处理
      let instance = Toast({
        message: respond.data.msg,
        iconClass: 'icon icon-error',
        duration: 1000
      })
      setTimeout(() => {
        instance.close()
      }, 1000)
      catchFail(respond.response)
    })
  },
  // 公司简介
  companyBrief (post = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/enterprise/brief',
      method: 'post',
      data: {
        username: store.state.auth.alu,
        ...post
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
      console.log(JSON.stringify(respond))
      catchFail(respond.response)
    })
  },
  // 公司标签
  companyTags (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      // url: 'api/search/tag',
      url: '/api/search/company-tags',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 股东信息
  companyShareholder (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/v2',
      query: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 公司核心高管
  companyOfficer (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/enterprise/officer',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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
  // 公司对外投资
  companyInvest (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/relation/invest',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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
  // 公司资金往来
  companyMoneyFlow (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/relation/moneyFlow',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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
  // 公司关联担保
  companyGuarantee (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/relation/guarantee',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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
  // 公司上下游企业
  companyUpDownStream (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/relation/upDownStream',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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
  // 公司一致行动人
  companyConcert (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/v2',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 公司招中标信息
  companyBid (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/relation/bid',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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
  // 公司失信信息
  companyDishonest (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: ' /api/mobile/risk/dishonest',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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
  // 公司被执行人
  companyExecuted (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/v2',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 裁判文书
  companyReferee (query = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      // api/search/v2
      url: 'api/search/v2',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },
  // 取消关注客户
  cancleFollow (query = {}, index = null, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: 'api/follow/follow_list/items' + '?follow_list_id=0' + '&company_name=' + query.company_name,
      method: 'DELETE',
      data: {
        username: store.state.auth.alu,
        follow_list_id: 0,
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
  },

  // 关注企业列表
  followeesList (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/customer/followees',
      // url: '/api/follow/follow_list/items/1' + '?count=10&offset=0',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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

  // 企业详情
  companyInfo (post = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/mobile/customer/company',
      method: 'post',
      data: {
        username: store.state.auth.alu,
        ...post
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
      console.log(JSON.stringify(respond.response.status))
      catchFail(respond.response)
    })
  },

  // 高级搜索列表
  getSearchList (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/advanced',
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

  // 找关系
  findRelation (body = {}, options = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/graph/relation?company1=' + body.company1 + '&company2=' + body.company2,
      method: 'post',
      data: options
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        return data
      }
      // else if (status === 200) {
      //   return {'status': 0, 'msg': 'OK', 'data': {'edges': [], 'found': false, 'length': -1, 'vertexes': []}}
      // }
      else {
        catchFail(rep)
      }
    }, respond => { // 错误处理
      // Toast({
      //   message: '服务器异常',
      //   iconClass: 'icon icon-error',
      //   duration: 1000
      // })
    })
  },

  // 找关系
  findRelationCom1 (body = {}, options = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/graph/relation?company1=' + body.company1,
      method: 'post',
      data: options
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

  // 找关系
  findRelationCom2 (body = {}, options = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/graph/relation?company1=' + body.company2,
      method: 'post',
      data: options
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

  // 专项搜索（经营范围，联系方式，股东高管）
  specialSearch (query = {}, options = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/es_search',
      method: 'get',
      params: {
        username: store.state.auth.alu,
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
  },

  // 专项搜索 招中标
  winBidSearch (body = {}, options = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/search/advanced/bid',
      method: 'post',
      data: {
        username: store.state.auth.alu,
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
  }
}
