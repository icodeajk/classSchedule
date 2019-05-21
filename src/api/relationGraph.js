import Vue from 'vue'
import catchFail from './catchFail'
import { Toast } from 'mint-ui'

export default {

  // 企业图谱
  getOverviewRelation (body = {}, context = '') {
    return (context ? context.$http : Vue.prototype.$http)({
      url: '/api/graph/company?read_cache=true',
      method: 'post',
      data: {
        company: body.name,
        options: {
          edges: [
            {
              class: "invest",
              visible: true,
              trace_depth: 1,
              cn_name: "投资"
            },
            {
              class: "shareholder",
              visible: true,
              trace_depth: 1,
              cn_name: "股东"
            },
            {
              class: "officer",
              visible: true,
              trace_depth: 1,
              cn_name: "高管"
            },
            {
              class: "family",
              visible: true,
              trace_depth: 1,
              cn_name: "亲属"
            },
            {
              class: "concert",
              visible: true,
              trace_depth: 1,
              cn_name: "一致行动人"
            },
            {
              class: "control_shareholder",
              visible: true,
              trace_depth: 1,
              cn_name: "控股股东"
            },
            {
              class: "actual_controller",
              visible: true,
              trace_depth: 1,
              cn_name: "实际控制人"
            },
            {
              class: "person_merge",
              visible: true,
              trace_depth: 1,
              cn_name: "可融合"
            },
            {
              class: "tradable_share",
              visible: true,
              trace_depth: 1,
              cn_name: "股东"
            },
            {
              class: "party_bid_from",
              visible: false,
              trace_depth: 1,
              cn_name: "甲方"
            },
            {
              class: "party_bid_to",
              visible: false,
              trace_depth: 1,
              cn_name: "乙方"
            },
            {
              class: "sue_relate_from",
              visible: false,
              trace_depth: 1,
              cn_name: "起诉"
            },
            {
              class: "sue_relate_to",
              visible: false,
              trace_depth: 1,
              cn_name: "被起诉"
            },
            {
              class: "plaintiff_relate",
              visible: false,
              trace_depth: 1,
              cn_name: "同为原告"
            },
            {
              class: "defendant_relate",
              visible: false,
              trace_depth: 1,
              cn_name: "同为被告"
            },
            {
              class: "guarantee",
              visible: false,
              traceDepth: 1
            },
            {
              class: "money_flow",
              visible: false,
              traceDepth: 1
            }
          ],
          min_weight: 0,
          max_length: 10,
          filter: {
            edge: {
              invest: {
                invest_amount: {},
                invest_ratio: {}
              },
              shareholder: {
                shareholder_ratio: {},
                shareholder_type: [
                  "Person",
                  "Company"
                ]
              },
              tradable_share: {
                tradable_type: [
                  "Person",
                  "Company"
                ]
              },
              officer: {
                position: [
                  "董事",
                  "监事",
                  "法定代表人",
                  "其他高管"
                ]
              },
              sue: {
                type: []
              },
              guarantee: {
                guarantee_date: {},
                guarantee_amount: {}
              },
              money_flow: {
                money_flow_date: {},
                money_flow_amount: {}
              }
            },
            vertex: {
              Company: {
                capital: {},
                company_type: [],
                operation_startdate: {}
              },
              Bid_detail: {
                publish_time: {}
              },
              Judgement_wenshu: {
                case_date: {}
              },
              Court_bulletin_doc: {
                court_time: {}
              },
              Judge_process: {
                filing_date: {}
              },
              Court_announcement_doc: {
                bulletin_date: {}
              }
            }
          },
          expand: [],
          exclude: []
        }
      }
    }).then(rep => {
      const {
        status,
        data
      } = rep
      if (status === 200 && data.status === 0) {
        // 去除担保、资金往来
        const chartData = data.data || {}
        if (chartData.children) {
          chartData.children = chartData.children.filter((c) => !['担保', '资金往来'].includes(c.properties.name))
        }
        return {
          data: chartData
        }
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
      catchFail(respond.response)
    })
  }
}
