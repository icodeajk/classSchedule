import Vue from 'vue'
import catchFail from './catchFail'
import store from '../store'

export default {
  search (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/graph/relation',
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

  findRelation (query = {}, context = '') {
    let filterOptions = {"options":{"edges":[{"class":"invest","visible":true,"trace_depth":1},{"class":"shareholder","visible":true,"trace_depth":1},{"class":"officer","visible":true,"trace_depth":1},{"class":"family","visible":true,"trace_depth":1},{"class":"concert","visible":true,"trace_depth":1},{"class":"control_shareholder","visible":true,"trace_depth":1},{"class":"actual_controller","visible":true,"trace_depth":1},{"class":"person_merge","visible":true,"trace_depth":1},{"class":"tradable_share","visible":true,"trace_depth":1},{"class":"guarantee","visible":false,"traceDepth":1},{"class":"money_flow","visible":false,"traceDepth":1}],"min_weight":0,"max_length":10,"filter":{"edge":{"invest":{"invest_amount":{},"invest_ratio":{}},"shareholder":{"shareholder_ratio":{},"shareholder_type":["Person","Company"]},"tradable_share":{"tradable_type":["Person","Company"]},"officer":{"position":["董事","监事","法定代表人","其他高管"]},"sue":{"type":[]},"guarantee":{"guarantee_date":{},"guarantee_amount":{}},"money_flow":{"money_flow_date":{},"money_flow_amount":{}}},"vertex":{"Company":{"capital":{},"company_type":[],"operation_startdate":{}},"Bid_detail":{"publish_time":{}},"Judgement_wenshu":{"case_date":{}},"Court_bulletin_doc":{"court_time":{}},"Judge_process":{"filing_date":{}},"Court_announcement_doc":{"bulletin_date":{}}}},"expand":[],"exclude":[]}}
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/graph/relation',
      method: 'post',
      params: {
        company1: query.company1,
        company2: query.company2
      },
      data: {
        ...filterOptions
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
