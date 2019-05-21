<template>
  <div class="template-cont">
    <div class="title">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>
    </div>
    <scroll-view class="container">
      <div>
        <div v-if="['winbid'].includes(eventType)">

          <div class="content-div">
            <div class="content-title">
              {{eventTitle}}
            </div>
            <div class="content-title">
              项目名称
            </div>
            <div class="content-text">
              {{commonDetail.title||'未公示'}}
            </div>
            <div v-if="type === 'win'">
              <div class="content-title">
                中标编号
              </div>
              <div class="content-text">
                {{commonDetail.bid_id||'未公示'}}
              </div>
            </div>
            <div v-else>
              <div class="content-title">
                招标编号
              </div>
              <div class="content-text">
                {{commonDetail.bid_id||'未公示'}}
              </div>
            </div>
            <div class="content-title">
              所属城市
            </div>
            <div class="content-text">
              {{commonDetail.city||commonDetail.province||'未公示'}}
            </div>
            <div v-if="type === 'win'">
              <div class="content-title">
                中标金额
              </div>
              <div class="content-text">
                {{commonDetail.bid_budget || '未公示'}}
              </div>
            </div>
            <div v-else>
              <div class="content-title">
                招标金额
              </div>
              <div class="content-text">
                {{commonDetail.bid_budget || '未公示'}}
              </div>
            </div>
            <div v-if="commonDetail.publish_time">
              <div class="content-title">
                发布日期
              </div>
              <div class="content-text">
                {{commonDetail.publish_time|dateFormat}}
              </div>
            </div>
          </div>

          <div class="content-div">
            <div class="content-title">
              招标公司
            </div>
            <div class="content-text red"  @click='jumpRouter(0,commonDetail.public_bid_company)' v-for='company_bid in commonDetail.public_bid_company' :key="company_bid">
              {{company_bid+'' || '未公示'}}
            </div>
            <div class="content-title">
              中标公司
            </div>
            <div class="content-text red" @click='jumpRouter(1,commonDetail.win_bid_company)' v-for='company_win in commonDetail.win_bid_company' :key="company_win">
              {{company_win+'' || '未公示'}}
            </div>
          </div>

          <div class="content-div">
            <div v-if="type === 'win'">
              <div class="content-title">
                中标详情
              </div>
              <div class="content-text">
                {{commonDetail.win_bid}}
              </div>
            </div>
            <div v-else>
              <div class="content-title">
                招标详情
              </div>
              <div class="content-text">
                {{commonDetail.publish_bid}}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="['judgeInfo'].includes(eventType)">
          <div class="event-title">{{eventTitle}}</div>
          <div class="event-time"><span>裁判日期：</span>{{commonDetail.case_date}}</div>
          <div class="content-div">
            <div class="base-cont">
              <div class="content-title">
                原告
              </div>
              <div class="content-text" v-for="(v, i) in commonDetail.plaintiff_list" :key="i">
                {{v}}
              </div>
            </div>
            <div class="base-cont">
              <div class="content-title">
                被告
              </div>
              <div class="content-text" v-for="(v, i) in commonDetail.defendant_list" :key="i">
                {{v}}
              </div>
            </div>
          </div>
          <div class="content-div">
            <div v-if='case_id'>
              <div class='table-title'>
                案件编号
              </div>
              <div class='table-text'>
                {{case_id}}
              </div>
            </div>
            <div v-if='case_type'>
              <div class='table-title'>
                案件类型
              </div>
              <div class='table-text'>
                {{case_type}}
              </div>
            </div>
            <div v-if='case_cause'>
              <div class='table-title'>
                案由
              </div>
              <div class='table-text'>
                {{case_cause}}
              </div>
            </div>
            <div v-if='court'>
              <div class='table-title'>
                法院
              </div>
              <div class='table-text'>
                {{court}}
              </div>
            </div>
          </div>
          <div class="content-div">
            <div v-if='commonDetail.doc_content'>
              <div class='content-title'>
                文书详情
              </div>
              <div class='content-text'>
                {{commonDetail.doc_content}}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="['count'].includes(eventType)">
          <div class="event-title">{{eventTitle}}</div>
          <div class="event-time"><span>开庭日期：</span>{{commonDetail.case_date}}</div>
          <div class="content-div">
            <div class="base-cont">
              <div class="content-title">
                原告
              </div>
              <div class="content-text" v-for="(v, i) in commonDetail.plaintiff_list" :key="i">
                {{v}}
              </div>
            </div>
            <div class="base-cont">
              <div class="content-title">
                被告
              </div>
              <div class="content-text" v-for="(v, i) in commonDetail.defendant_list" :key="i">
                {{v}}
              </div>
            </div>
            <div class="base-cont">
              <div class="content-title">
                当事人
              </div>
              <div class="content-text" v-if="commonDetail.litigants">
                {{commonDetail.litigants}}
              </div>
            </div>
          </div>
          <div class="content-div">
            <div v-if='case_id'>
              <div class='table-title'>
                案件编号
              </div>
              <div class='table-text'>
                {{case_id}}
              </div>
            </div>
            <div v-if='commonDetail.court || commonDetail.court_place'>
              <div class='table-title'>
                法院/审判庭/法庭
              </div>
              <div class='table-text'>
                {{commonDetail.court | commonDetail.court_place }}
              </div>
            </div>
            <div v-if='commonDetail.court || commonDetail.court_place'>
              <div class='table-title'>
                审判长/主审人/法官
              </div>
              <div class='table-text'>
                {{commonDetail.court | commonDetail.court_place }}
              </div>
            </div>
            <div v-if='commonDetail.bulletin_date'>
              <div class='table-title'>
                公告日期
              </div>
              <div class='table-text'>
                {{commonDetail.bulletin_date }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="['shixin'].includes(eventType)">
          <div class="event-title">{{company}}</div>
          <div class="event-time"><span>发布日期：</span>{{commonDetail.publish_date}}</div>
          <div class="content-div">
            <div v-if='commonDetail.case_id'>
              <div class="content-title" >
              案件编号
              </div>
              <div class="content-text">
                {{commonDetail.case_id }}
              </div>
            </div>
            <div v-if='commonDetail.max_money'>
              <div class="content-title" >
              涉案金额(元)
              </div>
              <div class="content-text">
                {{commonDetail.max_money }}
              </div>
            </div>
          </div>
          <div class="content-div">
            <div v-if='commonDetail.gist_id'>
              <div class='table-title'>
                执行依据文号
              </div>
              <div class='table-text'>
                {{commonDetail.gist_id}}
              </div>
            </div>
            <div v-if='commonDetail.court'>
              <div class='table-title'>
                执行法院
              </div>
              <div class='table-text'>
                {{commonDetail.court}}
              </div>
            </div>
            <div v-if='commonDetail.city'>
              <div class='table-title'>
                省份地区
              </div>
              <div class='table-text'>
                {{commonDetail.city}}
              </div>
            </div>
            <div v-if='commonDetail.reg_date'>
              <div class='table-title'>
                立案时间
              </div>
              <div class='table-text'>
                {{commonDetail.reg_date.substr(0,10)}}
              </div>
            </div>
            <div v-if='court'>
              <div class='table-title'>
                做出执行依据单位
              </div>
              <div class='table-text'>
                {{court}}
              </div>
            </div>
            <div v-if='court'>
              <div class='table-title'>
                组织机构代码
              </div>
              <div class='table-text'>
                {{court}}
              </div>
            </div>
            <div v-if='court'>
              <div class='table-title'>
                法定代表人/负责人
              </div>
              <div class='table-text'>
                {{court}}
              </div>
            </div>
          </div>
          <div class="content-div">
            <div v-if='commonDetail.disrupt_type_name'>
              <div class="content-title" >
              生效法律文书确定的义务
              </div>
              <div class="content-text">
                {{commonDetail.disrupt_type_name}}
              </div>
            </div>
          </div>
          <div class="content-div">
            <div v-if='commonDetail.disrupt_type_name'>
              <div class="content-title" >
              失信被执行人行为具体情形
              </div>
              <div class="content-text">
                {{commonDetail.disrupt_type_name}}
              </div>
            </div>
          </div>
          <div class="content-div">
            <div v-if='commonDetail.performance'>
              <div class="content-title" >
              被执行人履行情况
              </div>
              <div class="content-text">
                {{commonDetail.performance}}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="['zhixing'].includes(eventType)">
          <div class="event-title">{{conpany}}</div>
          <div class="event-time"><span>立案日期：</span>{{commonDetail.case_date}}</div>
          <div class="content-div">
            <div v-if='case_id'>
              <div class='table-title'>
                案件编号
              </div>
              <div class='table-text'>
                {{case_id}}
              </div>
            </div>
            <div v-if='commonDetail.money'>
              <div class='table-title'>
                执行金额
              </div>
              <div class='table-text'>
                {{commonDetail.money }}
              </div>
            </div>
            <div v-if='commonDetail.court || commonDetail.court_place'>
              <div class='table-title'>
                法院/审判庭/法庭
              </div>
              <div class='table-text'>
                {{commonDetail.court | commonDetail.court_place }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="['zhuanli'].includes(eventType)">
          <div class="event-title">{{eventTitle}}</div>
          <div class="event-time"><span>公告日期：</span>{{commonDetail.publish_date}}</div>
          <div class="content-div">
            <div v-if='commonDetail.submitter'>
              <div class='table-title'>
                申请者
              </div>
              <div class='table-text'>
                {{commonDetail.submitter}}
              </div>
            </div>
            <div v-if='commonDetail.inventors'>
              <div class='table-title'>
                发明者
              </div>
              <div class='table-text' v-for="(item, index) in commonDetail.inventors" :key="index">
                {{item}}
              </div>
            </div>
            <div v-if='commonDetail.submit_id'>
              <div class='table-title'>
                申请号
              </div>
              <div class='table-text'>
                {{commonDetail.submit_id}}
              </div>
            </div>
            <div v-if='commonDetail.submit_date'>
              <div class='table-title'>
                申请时间
              </div>
              <div class='table-text'>
                {{commonDetail.submit_date}}
              </div>
            </div>
            <div v-if='commonDetail.publish_no'>
              <div class='table-title'>
                发布号
              </div>
              <div class='table-text'>
                {{commonDetail.publish_no}}
              </div>
            </div>
            <div v-if='commonDetail.agents'>
              <div class='table-title'>
                专利代理人
              </div>
              <div class='table-text' v-for="(item, index) in commonDetail.agents" :key="index">
                {{item}}
              </div>
            </div>
            <div v-if='commonDetail.agent_org'>
              <div class='table-title'>
                专利代理机构
              </div>
              <div class='table-text'>
                {{commonDetail.agent_org}}
              </div>
            </div>
            <div v-if='commonDetail.address'>
              <div class='table-title'>
                地址
              </div>
              <div class='table-text'>
                {{commonDetail.address}}
              </div>
            </div>
          </div>
          <div class="content-div">
            <div v-if='commonDetail.period'>
              <div class='content-title'>
                摘要
              </div>
              <div class='content-text'>
                {{commonDetail.abstract}}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="['qianshui'].includes(eventType)">
          <div class="event-title">{{company}}</div>
          <div class="content-div">
            <div class="content-title">
              欠税项目
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div class="content-title">
              纳税人登记号
            </div>
            <div class="content-text">
              {{commonDetail.publish_date}}
            </div>
            <div class="content-title" >
              法人
            </div>
            <div class="content-text" >
              {{commonDetail.content}}
            </div>
          </div>
        </div>

        <div v-else-if="['newSearch'].includes(eventType)">
          <div class="event-title">{{company}}<span></span></div>
          <div class="event-time"><span>中国证劵报</span>{{commonDetail.publish_date}}</div>
          <div class="content-div">
            <div class="content-title">
              关联企业
            </div>
            <div class="content-text">
              {{company}}
            </div>
          </div>
          <div class="content-div">
            <div class="content-title" >
              摘要
            </div>
            <div class="content-text" >
              {{commonDetail.content}}
            </div>
          </div>
        </div>
    </scroll-view>
  </div>
</template>

<script>
import headerSwitch from '@/components/headerSwitch.vue'
import store from '../../store'
import {SAVE_CURRENT} from '../../store/mutation-types'
import BScroll from 'better-scroll'

export default {
  data() {
    return {
      title: '事件详情',
      eventTitle: '',
      showIframe: false,
      bussiness_starttime:'',
      date: '',
      eventType: '',
      baseInfo: {
        title: '国投昔阳能源有限责任公司俩矿倔进机采购中标候选人',
        id: 'CCTC10171155',
        city: '山西省昔阳县',
        money: ''
      },
      companyInfo: {
        name: '国投昔阳能源有限责任公司',
        biding: '三一重工股份有限公司'
      },
      detailInfo: {
        first: '三一重工股份有限公司',
        second: '山西天地煤机装备有限公司',
        third: '山西美佳矿业有限公司',
        startDate: '2017-07-28',
        endDate: '2017-07-31',
        connectMan: '罗璇',
        phone: '010-84293590',
        detail:
          '各投标人或者其他利害关系人对中标候选人有异议的，可以在公示期内，以书面形式 (法定代表人签字并加盖单位公章)向中煤招标公司提出异议，并以接受确认日期作为受理时间。逾期或未按照要求提交的异议函将不予受理。',
        company: '中煤招标有限责任公司',
        date: '2017-07-28'
      },
      commonDetail: {}
    }
  },
  methods:{
    jumpRouter(flag,company){


      if(flag){
        if( (this.commonDetail.win_bid_company+'') && (this.commonDetail.win_bid_company.length+'')>3 && (this.commonDetail.win_bid_company+'').indexOf('公司')!=-1){
          this.$router.push({path:'/customerDetail',query:{company:this.companyInfo.win_bid_company+''}})
        }
      }else{

        if( (this.commonDetail.public_bid_company.length+'')>3 && (this.commonDetail.public_bid_company+'').indexOf('公司')!=-1){
          this.$router.push({path:'/customerDetail',query:{company:this.commonDetail.public_bid_company+''}})
        }
      }

    }
  },
  mounted() {
    this.eventType = this.$route.query.eventType
    let storeEventList = JSON.parse(sessionStorage.getItem('eventItem'))
    if (storeEventList) {
      let element = storeEventList
      this.commonDetail = element.detail
      this.title = element.cnname
      this.eventTitle = element.title
      this.date = element.date
    }
  },
  components: {
    headerSwitch
  }
}
</script>

<style scoped lang="less">
.container {
  padding-top: 10px;
  height: calc(100% - 50px);
  overflow: hidden;
  position:relative;
  .content-div {
    margin-bottom: 10px;
    padding: 12px 16px;
    background: #fff;
    font-size: 14px;
    text-align: left;
    .content-title {
      margin-top: 12px;
      height: 20px;
      line-height: 20px;
      color: #999;
      &:not(:first-child) {
        margin-top: 16px;
      }
    }
    .content-text {
      line-height: 20px;
      margin-top: 2px;
      color: #333;
      margin-bottom:20px;
      font-size: 12px;
      &.red {
        color: #d24545;
      }
    }
    .content-href {
      display: inline-block;
      margin-top: 20px;
      color: #d24545;
    }
    .content-left, .content-right {
      display: inline-block;
      width: 48%;
    }
  }
}
.inner-iframe {
  width: 100%;
  height: 100%;
}
</style>
