<template>
  <div class="template-cont">
    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>
    </div>

    <scroll-view class="container">
      <div v-if="!isempty">
        <div class="baseInfo-cont">
          <div class="baseInfo-left">
            <img src="../../assets/company-logo.png" alt="">
          </div>
          <div class="baseInfo-right">
            <div class="baseInfo-right-title">
              <span>{{baseInfo.company ? baseInfo.company.substr(0,10) : '未公示'}}</span>
              <span v-if="baseInfo.company && baseInfo.company.length > 10" class="next-line">{{baseInfo.company.substr(10,20)}}</span>
              <!-- <img class="graph" src="../../assets/img/icon_graph.png" alt=""> -->
              <div class="follow-block" @click="showMsgbox(baseInfo.company)">
              <img class='follow' src="../../assets/img/icon-follow-active.png" alt=""  v-if="isFollow">
              <img class='follow' src="../../assets/img/icon-follow.png" alt=""  v-else id="msgbox">
              </div>
              <div class="monitor-block" @click="showMsgMonitorBox(baseInfo.company,baseInfo.monitor_status.risk_notify,baseInfo.monitor_status.marketing_notify)">
              <img class='monitor' src="../../assets/img/icon-monitor-active.png" alt=""  v-if="isMonitor">
              <img class='monitor' src="../../assets/img/icon-monitor.png" alt=""  v-else id="msgMonitorBox">
              </div>
            </div>
            <div class="baseInfo-right-desc">
              <p v-if="baseInfo.address"><span>地址:</span>{{baseInfo.address}}</p>
              <p v-if="baseInfo.contact"><span>联系方式:</span>{{baseInfo.contact}}</p>
              <p v-if="used_name_list && used_name_list.length !== 0"><span >曾用名:</span><span v-for="(value, index) in used_name_list" :key="index">{{value}}</span></p>
            </div>
          </div>
          <div class="baseInfo-bottom">
            <div class="baseInfo-bottom-list">
              <div class="baseInfo-list-div" @click="showLegalMan">
                <div class="baseInfo-list-title">法定代表人</div>
                <div class="baseInfo-list-text">{{legalManArray}}</div>
              </div>
              <div class="baseInfo-list-div">
                <div class="baseInfo-list-title">注册资本</div>
                <div class="baseInfo-list-text">{{baseInfo.registered_capital | formatMoney}}<span v-if="baseInfo.registered_capital && Number(baseInfo.registered_capital) !== 0">万{{baseInfo.registered_capital_unit  ? baseInfo.registered_capital_unit : '元'}}</span></div>
              </div>
            </div>
            <div class="baseInfo-bottom-list">
              <div class="baseInfo-list-div">
                <div class="baseInfo-list-title">成立时间</div>
                <div class="baseInfo-list-text">{{baseInfo.registered_date ? baseInfo.registered_date.substr(0,10) : '未公示'}}</div>
              </div>
              <div class="baseInfo-list-div" @click="showActualControllers">
                <div class="baseInfo-list-title">实际控制人</div>
                <div class="baseInfo-list-text">{{actualController}}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="label-cont">
          <mt-cell :title="'企业标签'" :to="'/labelList?company='+baseInfo.company" is-link value="">
          </mt-cell>
          <div class="label-list">
            <div class="label-list-label" v-for="(item,index) in labelList" :key=index>
              {{item|formatTag}}
            </div>
            <p class="desc" v-if="labelList.length==0">暂无相关标签</p>
          </div>
        </div> -->
        <div class="label-cont">
          <mt-cell :title="'企业概览'" :to="'/customer/relationGraph/overview?hideTabbar=true&name=' + this.$route.query.company" is-link value="">
          </mt-cell>
        </div>
        <market-card :title="'营销机会'" :company="title" :data="marketList" class="market-card" :eventType="'marketing'"></market-card>
        <risk-card :title="'风险事件'" :company="title" :data="riskList" class="risk-card" :eventType="'risk'"></risk-card>
        <base-sub-card :title="'基本信息'" :data="basicSub"></base-sub-card>
        <base-sub-card :title="'关联关系'" :data="relationSub"></base-sub-card>
        <base-sub-card :title="'风险信息'" :data="riskSub"></base-sub-card>
      </div>
      <empty-page :topMessage="topMessage" :bottomMessage="bottomMessage" v-else>
      </empty-page>
    </scroll-view>

  </div>
</template>

<script>
import customerSrv from '@/api/customerSrv'
import businessSrv from '@/api/businessSrv'

import headerSwitch from '@/components/headerSwitch.vue'
import marketCard from '@/components/marketCard.vue'
import riskCard from '@/components/riskCard.vue'
import baseSubCard from '@/components/baseSubCard.vue'
import Vue from 'vue'
import msgBoxComponent from '@/components/msgbox.vue'
import msgMonitorBoxComponent from '@/components/msgMonitorBox.vue'
import emptyPage from '@/components/emptyPage.vue'

import { Toast } from 'mint-ui'
import { MessageBox } from 'mint-ui'
import { Checklist } from 'mint-ui';
import bus from '@/bus.js'
import cache from '@/storeEvent.js'

export default {
  data() {
    return {
      toastInstance: null,
      baseInfo: {},
      labelList: [],
      isempty: false,
      topMessage: '在当前服务的数据范围内',
      bottomMessage: '未找到该企业',
      isMonitor: false,
      cache: cache,
      isFollow: false,
      loading: false,
      marketList: [],
      riskList: [],
      option: [],
      used_name_list: [],
      company: this.$route.query.company,
      groupIdList: [],
      basicSub: [
        {
          title: '工商信息',
          href: '#/industryInfo?company=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-industryInfo.png'),
          imgDisabledUrl: require('assets/img/icon-industryInfo-disabled.png'),
          preDesc: '企业工商数据'
        },
        {
          title: '股东信息',
          href: '#/shareholdersInfo?company=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-shareholdersInfo.png'),
          imgDisabledUrl: require('assets/img/icon-shareholdersInfo-disabled.png'),
          total: 0,
          preDesc: '共',
          endDesc: '个股东'
        },
        {
          title: '核心高管',
          href: '#/executiveInfo?company=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-executiveInfo.png'),
          imgDisabledUrl: require('assets/img/icon-executiveInfo-disabled.png'),
          total: 0,
          preDesc: '共',
          endDesc: '个高管'
        }
      ],
      relationSub: [
        {
          title: '对外投资',
          href: '#/investInfo?company=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-investInfo.png'),
          imgDisabledUrl: require('assets/img/icon-investInfo-disabled.png'),
          total: 0,
          endDesc: '条对外投资'
        },
        // {
        //   title: '资金往来',
        //   href: '#/capitalInfo?company=' + this.$route.query.company,
        //   imgActiveUrl: require('assets/img/icon-capitalInfo.png'),
        //   imgDisabledUrl: require('assets/img/icon-capitalInfo-disabled.png'),
        //   total: 0,
        //   preDesc: '共',
        //   endDesc: '条'
        // },
        // {
        //   title: '关联担保',
        //   href: '#/connectInfo?company=' + this.$route.query.company,
        //   imgActiveUrl: require('assets/img/icon-connectInfo.png'),
        //   imgDisabledUrl: require('assets/img/icon-connectInfo-disabled.png'),
        //   total: 0,
        //   preDesc: '共',
        //   endDesc: '条'
        // },
        // {
        //   title: '上下游企业',
        //   href: '#/connectCompany?company=' + this.$route.query.company,
        //   imgActiveUrl: require('assets/img/icon-connectCompany.png'),
        //   imgDisabledUrl: require('assets/img/icon-connectCompany-disabled.png'),
        //   total: [0, 0],
        //   preDesc: ['上游', '下游']
        // },
        {
          title: '一致行动人',
          href: '#/concertInfo?company=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-concertInfo.png'),
          imgDisabledUrl: require('assets/img/icon-concertInfo-disabled.png'),
          total: 0,
          preDesc: '共',
          endDesc: '条'
        },
        {
          title: '招中标信息',
          href: '#/bidingInfo?company=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-bidingInfo.png'),
          imgDisabledUrl: require('assets/img/icon-bidingInfo-disabled.png'),
          total: [0, 0],
          preDesc: ['招标', '中标']
        }
      ],
      riskSub: [
        {
          title: '失信信息',
          href: '#/shixinInfo?company=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-shixinInfo.png'),
          imgDisabledUrl: require('assets/img/icon-shixinInfo-disabled.png'),
          total: 0,
          preDesc: '共',
          endDesc: '条'
        },
        {
          title: '被执行人',
          href: '#/zhixinInfo?company=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-zhixinInfo.png'),
          imgDisabledUrl: require('assets/img/icon-zhixinInfo-disabled.png'),
          total: 0,
          preDesc: '共',
          endDesc: '个'
        },{
          title: '裁判文书',
          href: '#/referee?name=' + this.$route.query.company,
          imgActiveUrl: require('assets/img/icon-referee.png'),
          imgDisabledUrl: require('assets/img/icon-referee-disabled.png'),
          total: 0,
          preDesc: '共',
          endDesc: '条'
        }
      ]
    }
  },
  mounted() {
    this.getEventList()
    this.getAllTotal()
    this.comFollowList()
    bus.$on('is_followed', (data) => {
      this.isFollow = data
    })
    bus.$on('is_monitored', (data) => {
      this.isMonitor = data
    })
    bus.$on('monitor_status', (data) => {
      this.baseInfo.monitor_status.risk_notify = data.risk
      this.baseInfo.monitor_status.marketing_notify = data.marketing
    })
  },

  watch: {},
  computed: {
    title() {
      return this.$route.query.company
    },
    actualController() {
      var array = this.filterControllers(this.baseInfo.actualControllers)
      var result = array.length > 0 ? array[0] : '未公示'
      if (result.length > 21) {
        result = result.substr(0, 21) + '...'
      }
      return result
    },
    actualControllerArray() {
      return this.filterControllers(this.baseInfo.actualControllers)
    },
    legalManArray() {
      return this.baseInfo.legal_man ? this.baseInfo.legal_man : '未公示'
    }
  },
  methods: {
    // 获取公司营销风险事件列表
    getEventList() {
      let that = this;
      let self = []
      let searchParamsMarket = {
        offset: 0,
        count: 3,
        company: this.title ? this.title : '',
        type: 'marketing',
      }
      if(this.$route.query.item) {
        searchParamsMarket.temp = 1
      }
      businessSearch(searchParamsMarket,false).then(res => {
        self = res.data.data
        that.marketList = self
        that.cache[searchParamsMarket.type] = res.data.data
      })
      let searchParamsRisk = {
        offset: 0,
        count: 3,
        company: this.title ? this.title : '',
        type: 'risk',
      }
      if(this.$route.query.item) {
        searchParamsRisk.temp = 1
      }
      businessSrv.businessSearch(searchParamsRisk,false).then(res => {
        self = res.data.data
        that.riskList = self
        that.cache[searchParamsRisk.type] = res.data.data
      })
    },
    getAllTotal() {
      this.loading = true
      let queryParams = {
        offset: 0,
        name: this.$route.query.company,
        company: this.$route.query.company,
        type: 'risk_info',
        sub_type: 'judgement_wenshu',
        count: 5,
        only_count: 1
      }
      let consertParams = {
        offset: 0,
        name: this.$route.query.company,
        company: this.$route.query.company,
        type: 'associated_relation',
        sub_type: 'concert',
        count: 5,
        only_count: 1
      }
      let zhixinParams = {
        offset: 0,
        name: this.$route.query.company,
        company: this.$route.query.company,
        type: 'risk_info',
        sub_type: 'zhixing_info',
        count: 5,
        only_count: 1
      }
      let oldNameParams = {
        name: this.$route.query.company,
        type: 'basic_info',
        sub_type: 'company_info',
        third_type: 'gongshang_basic',
        only_count: 0
      }
      let shareholderParams = {
        offset: 0,
        name: this.$route.query.company,
        company: this.$route.query.company,
        type: 'profile_info',
        sub_type: 'associated_info',
        third_type: 'contributor_invest_office',
        count: 5,
        only_count: 1
      }
      let briefParams = {
        companys: [this.$route.query.company],
        shortBrief: 1
      }

      let totalPostParams = {
        keyword: this.$route.query.company,
        offset: 0,
        size: 1,
        only_count: 1
      }
      var that=this
      Vue.prototype.$http
        .all([
          customerSrv.companyBrief(briefParams).then(res => {
            if(res.data.length === 0){
              this.isempty = true
              this.loading = false
              // throw new Error('暂无该公司信息')


              // throw new Error('暂无该公司信息')

            }
            this.baseInfo = res.data[0]
            // console.log(this.baseInfo)
            this.isMonitor = this.baseInfo.monitor_status.marketing_notify ||this.baseInfo.monitor_status.risk_notify
            this.isFollow = this.baseInfo.is_follow
          }).catch(err => {
            this.loading = false
          }),
          customerSrv.companyExecuted(oldNameParams).then(res => {
            this.used_name_list = res.data.company_info.gongshang_basic.data.used_name_list
          }).catch(err => {
            console.log(err)
          }),
          // customerSrv.companyTags(queryParams).then(res => {
          //   var resData = [
          //     {
          //       category: '企业特质',
          //       tags: [
          //         { tagName: '所属行业', tagValue: '金融业' },
          //         { tagName: '是否上市公司', tagValue: '上市公司', valueType: 2 },
          //                     { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
          //         { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 },
          //                     { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
          //         { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 },
          //                     { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
          //         { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 },
          //                     { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
          //         { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 }
          //       ]
          //     },
          //     {
          //       category: '圈子环境',
          //       tags: [
          //         { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
          //         { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 }
          //       ]
          //     },
          //     {
          //       category: '企业素质',
          //       tags: [
          //         { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
          //         { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 }
          //       ]
          //     }
          //   ]
          //   this.labelList = this.filterTags(res.data)


          // }),
          /*
            子模块 信息总数获取
          */
          // 股东信息
          customerSrv.companyShareholder(shareholderParams).then(res => {
            this.basicSub[1].total = res.data.associated_info.contributor_invest_office.total_count
          }).catch(err => {
            console.log(err)
          }),
          //核心高管
          customerSrv.companyOfficer(totalPostParams).then(res => {
            this.basicSub[2].total = res.data.total<=0?0:res.data.total

          }).catch(err => {
            console.log(err)
          }),
          //对外投资
          customerSrv.companyInvest(totalPostParams).then(res => {
            this.relationSub[0].total = res.data.total
          }).catch(err => {
            console.log(err)
          }),
          // //资金往来
          // customerSrv
          //   .companyMoneyFlow({ direction: 'ALL', ...totalPostParams })
          //   .then(res => {
          //     this.relationSub[1].total = res.data.total
          //   }),
          // //关联担保
          // customerSrv
          //   .companyGuarantee({
          //     direction: 'ALL',
          //     keyword: totalPostParams.keyword
          //   })
          //   .then(res => {

          //     this.relationSub[2].total = res.data.total
          //   }),
          // //上下游企业
          // //上游
          // customerSrv
          //   .companyUpDownStream({
          //     direction: 'IN',
          //     keyword: totalPostParams.keyword
          //   })
          //   .then(res => {
          //     this.$set(this.relationSub[3].total, 0, res.data.total)
          //   }),
          // //下游
          // customerSrv
          // .companyUpDownStream({
          //   direction: 'OUT',
          //   keyword: totalPostParams.keyword
          // })
          // .then(res => {
          //   this.$set(this.relationSub[3].total, 1, res.data.total)
          // }),
          //一致行动人
          customerSrv.companyConcert(consertParams).then(res => {
            this.relationSub[1].total = res.data.concert.total_count
          }).catch(err => {
            console.log(err)
          }),
          //招中标信息
          //招标
          customerSrv
            .companyBid({ direction: 'IN', ...totalPostParams })
            .then(res => {
              this.$set(this.relationSub[2].total, 0, res.data.total)
            }).catch(err => {
            console.log(err)
          }),
          //中标
          customerSrv
            .companyBid({ direction: 'OUT', ...totalPostParams })
            .then(res => {
              this.$set(this.relationSub[2].total, 1, res.data.total)
            }).catch(err => {
            console.log(err)
          }),
          //失信信息
          customerSrv.companyDishonest(totalPostParams).then(res => {
            this.riskSub[0].total = res.data.total
          }).catch(err => {
            console.log(err)
          }),
          //被执行人
          customerSrv.companyExecuted(zhixinParams).then(res => {
            this.riskSub[1].total = res.data.zhixing_info.total_count
          }).catch(err => {
            console.log(err)
          }),
          //裁判文书
          customerSrv.companyReferee(queryParams).then(res => {
            this.riskSub[2].total = res.data.judgement_wenshu.total_count
            // console.log(res.data.judgement_wenshu.total_count)
          }).catch(err => {
            console.log(err)
          })
        ])
        .then(() => {
          this.loading = false
        }).catch((err) => {
          this.loading = false
        })
    },
    toggleMonitor(company, status) {
      let postParams = {
        company: company,
        marketing_notify: status, //是否监控该公司的营销事件（true：监控，false：取消）
        closely_marketing_notify: status, //是否监控该公司的风险事件（true：监控，false：取消
        risk_notify: status, // 是否监控该公司的风险事件（true：监控，false：取消）
        closely_risk_notify: status, // 是否监控该公司的关联企业的风险事件（true：监控，false：取消）
      }
      customerSrv.toggleMonitor(postParams).then(res => {

        let message = ''
        if (res.status == 0) {
          this.isMonitor = status
          message = status ? '监控成功' : '取消监控成功'
        } else {
          message = res.msg
        }
        Toast({
          message: message,
          duration: 1000,
          className: 'normal-toast'
        })
      })
    },
    cancleFollow(company) {
      let postParams = {
        company_name: company,
        follow_list_id: 0,
      }
      customerSrv.cancleFollow(postParams).then(res => {

        let message = ''
        if (res.status == 0) {
          this.isFollow = false;
          message = '取消关注成功'
        }
        Toast({
          message: message,
          duration: 1000,
          className: 'normal-toast'
        })
      })
    },
    addFollow(company) {
      let postParams = {
        company_name: company,
        follow_list_id: 1,
      }
      customerSrv.addFollow(postParams).then(res => {

        let message = ''
        if (res.status == 0) {
          this.isFollow = true;
          message = '关注成功'
        }
        Toast({
          message: message,
          duration: 1000,
          className: 'normal-toast'
        })
      })
    },
    msgBox(options={}) {
      let msgBoxConstructor = Vue.extend(msgBoxComponent);
      let instance= new msgBoxConstructor({
          el: document.createElement('div')
      });
      document.body.appendChild(instance.$el);
      // 将单个 confirm instance 的配置合并到默认值中
      Object.assign(instance.$data, options);
      return new Promise((resolve, reject)=>{
          instance.show = true;
          let successBtn = instance.successBtn;
          let cancelBtn = instance.cancelBtn;
          instance.successBtn = () => {
            resolve();
            successBtn();
          }
          instance.cancelBtn = () => {
            reject();
            cancelBtn();
          }
      });
    },
    msgMonitorBox(options={}){
      let msgBoxConstructor = Vue.extend(msgMonitorBoxComponent);
      let instance= new msgBoxConstructor({
          el: document.createElement('div')
      });
      document.body.appendChild(instance.$el);
      // 将单个 confirm instance 的配置合并到默认值中
      Object.assign(instance.$data, options);
      return new Promise((resolve, reject)=>{
          instance.show = true;
          let successBtn = instance.successBtn;
          let cancelBtn = instance.cancelBtn;
          instance.successBtn = () => {
            resolve();
            successBtn();
          }
          instance.cancelBtn = () => {
            reject();
            cancelBtn();
          }
      });
    },
    comFollowList() {
      let postParams = {
        company_name: this.company,
      }
      customerSrv.comFollowList(postParams).then(res => {
        for(var item in res.data){
          var index = res.data[item].id
          if(res.data[item].company_in)
          this.groupIdList[index] = true
        }
      })
    },
    showMsgbox(company){
      this.msgBox({
          title:'选择分组',
          cancel:'取消',
          confirm:'确定',
          className:'pop-custom',
          company: company,
          groupIdList: this.groupIdList,
      }).then(()=>{
          console.log("我点击了确定按钮")
      }).catch((err)=>{
        console.log("error");
      })
    },
    showMsgMonitorBox(company,risk,marketing){
      this.msgMonitorBox({
          title:'选择监控事项',
          cancel:'取消',
          confirm:'确定',
          className:'pop-custom',
          company: company,
          risk: risk,
          marketing: marketing,
      }).then(()=>{
          console.log("我点击了确定按钮")
      }).catch((err)=>{
        console.log("error");
      })
    },
    filterTags(tagsData) {

      if(!Array.isArray(tagsData) ||tagsData.length==0){return []}
      var result=[];
      var temp=[];
      var index1,index2,index3,index4,index5;
      // for(var i=0;i<tagsData.length;i++){
      //     if(tagsData[i].category=='企业银行属性标签'){
      //       var tags=tagsData[i].tags;
      //       for(var i=0;i<tags.length;i++){
      //         if(tags[i].hasValue==true){

      //               result.push(tags[i]);
      //               if(result.length >= 10){
      //                 return result
      //               }
      //         }else{
      //             temp.push(tags[i])
      //         }
      //       }
      //     }
      // }
      // for(var i=0;i<tagsData.length;i++){
      //     if(tagsData[i].category=='客户分群标签'){
      //       var tags=tagsData[i].tags;
      //       for(var i=0;i<tags.length;i++){
      //         if(tags[i].hasValue==true){
      //               result.push(tags[i]);
      //               if(result.length >= 10){
      //                 return result
      //               }
      //         }else{
      //             temp.push(tags[i])
      //         }
      //       }
      //     }
      // }
        for(var i=0;i<tagsData.length;i++){
          if(tagsData[i].category.indexOf('企业银行属性标签')!=-1){
             index1= i;
          }
          if(tagsData[i].category.indexOf('客户分群标签')!=-1){
             index2= i;
          }
          if(tagsData[i].category.indexOf('客户持有产品（一级特征）')!=-1){
             index3= i;
          }
          if(tagsData[i].category.indexOf('客户持有产品（二级特征）')!=-1){
             index4= i;
          }
          if(tagsData[i].category.indexOf('企业自然属性')!=-1){
             index5= i;
          }
        }


        // if(index1!=undefined){
        //   for(let i=0;i<tagsData[index1].tags.length;i++){
        //     var tag=tagsData[index1].tags[i];
        //       if(tag.hasValue==true){
        //         result.push(tag)
        //         if(result.length>10){return result}
        //       }else{
        //         temp.push(tag)
        //       }
        //   }
        // }

        //  if(index2!=undefined){
        //   for(let i=0;i<tagsData[index2].tags.length;i++){
        //     var tag=tagsData[index2].tags[i];
        //       if(tag.hasValue==true){
        //         result.push(tag)
        //         if(result.length>10){return result}
        //       }else{
        //         temp.push(tag)
        //       }
        //   }
        // }

        //  if(index2!=undefined){
        //   for(let i=0;i<tagsData[index2].tags.length;i++){
        //     var tag=tagsData[index2].tags[i];
        //       if(tag.hasValue==true){
        //         result.push(tag)
        //         if(result.length>10){return result}
        //       }else{
        //         temp.push(tag)
        //       }
        //   }
        // }


        // }

        // if(index1!=undefined){
        //   for(let i=0;i<tagsData[index1].tags.length;i++){
        //     var tag=tagsData[index1].tags[i];
        //       if(tag.hasValue==true){
        //         result.push(tag)
        //         if(result.length>10){return result}
        //       }else{
        //         temp.push(tag)
        //       }
        //   }
        // }

        //  if(index2!=undefined){
        //   for(let i=0;i<tagsData[index2].tags.length;i++){
        //     var tag=tagsData[index2].tags[i];
        //       if(tag.hasValue==true){
        //         result.push(tag)
        //         if(result.length>10){return result}
        //       }else{
        //         temp.push(tag)
        //       }
        //   }
        // }




        if(index1!=undefined){
          for(let i=0;i<tagsData[index1].tags.length;i++){
            var tag=tagsData[index1].tags[i];
              if(tag.hasValue==true){
                result.push(tag)
                if(result.length>10){return result}
              }else{
                temp.push(tag)
              }
          }
        }

         if(index2!=undefined){
          for(let i=0;i<tagsData[index2].tags.length;i++){
            var tag=tagsData[index2].tags[i];
              if(tag.hasValue==true){
                result.push(tag)
                if(result.length>10){return result}
              }else{
                temp.push(tag)
              }
          }
        }


         if(index3!=undefined){

          for(var i=0;i<tagsData[index3].tags.length;i++){
            var tag=tagsData[index3].tags[i];

              if(tag.hasValue==true){
                result.push(tag)

                if(result.length>10){

                  return result}
              }else{
                temp.push(tag)
              }
          }
        }
         if(index4!=undefined){
          for(let i=0;i<tagsData[index4].tags.length;i++){
            var tag=tagsData[index4].tags[i];
              if(tag.hasValue==true){
                result.push(tag)
                if(result.length>=10){

                  return result}
              }else{
                temp.push(tag)
              }
          }
        }

         if(index5!=undefined){

          for(let i=0;i<tagsData[index5].tags.length;i++){
            var tag=tagsData[index5].tags[i];
              if(tag.hasValue==true){
                result.push(tag)

                if(result.length>=10){

                  return result}
              }else{
                temp.push(tag)
              }
          }
        }
        if(result.length>0){
          return result.concat(temp).splice(0,10)
        }else if(result.length==0 && temp.length>0){
          return temp.splice(0,10)
        }else{
          return []
        }

      // let result = []
      // for (let index = 0; index < tagsData.length; index++) {
      //   const element = tagsData[index]
      //   switch (element.category) {
      //     case '企业银行属性标签':
      //       result = element.tags
      //       break
      //     case '圈子环境':
      //       result = element.tags
      //       break
      //     case '企业素质':
      //       result = element.tags
      //       break
      //     default:
      //       break
      //   }
      //   if (result.length > 0) {
      //     break
      //   }
      // }
      // return result
      // if(tagsData && tagsData.length>0){
      //     let result = []
      //     if(

      // }else{
      //   return []
      // }
    // return []

    },
    filterControllers(data) {
      let result = []
      if (Array.isArray(data)) {
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          result.push(element.controller.name)
        }
      }
      return result
    },
    showLegalMan() {
      if (this.legalManArray.length > 0) {
        MessageBox({
          title: '法定代表人',
          message: this.legalManArray
        })
      }
    },
    showActualControllers() {
      if (this.actualControllerArray.length > 0) {
        MessageBox({
          title: '实际控制人',
          message: this.actualControllerArray.join('</br>')
        })
      }
    }
  },
  components: {
    headerSwitch,
    marketCard,
    baseSubCard,
    riskCard,
    Checklist,
    msgBoxComponent,
    msgMonitorBoxComponent,
    emptyPage,
    cache
  }
}
</script>

<style scoped lang="less">
.container {
  height: calc(100% - 40px);
  overflow: hidden;
  position:relative
}
.title{

}
.baseInfo-cont {
  padding: 16px;
  background: #fff;
  font-size: 0;
  .baseInfo-left {
    display: inline-block;
    width: 80px;
    height: 80px;
    vertical-align: top;
    img{
      width:50px;
      height:50px;
    }
  }
  .baseInfo-right {
    display: inline-block;
    height: 80px;
    width: calc(100% - 80px);
    text-align: left;
    .baseInfo-right-title {
      // line-height: 20px;
      // height: 20px;
      font-size: 16px;
      color: #333;
      position:relative;
      margin-right:20px;
      word-break: break-all;
      // > img {
      //   // float: right;
      //   position: absolute;
      //   right:-20px;
      //   top:0;
      //   width:20px;
      //   height:20px;
      // }
      .follow-block{
        position: absolute;
        right: 0.5rem;
        top:0;
        width: 25px;
        height: 25px;
        margin-right: 10px;
        .follow {
          width: 16px;
          height: 16px;
        }
      }
      .next-line{
        display: block;
        margin-top: 5px;
      }
      .monitor-block{
        position: absolute;
        right:-10px;
        top:0;
        width: 25px;
        height: 25px;
        .monitor {
          width: 16px;
          height: 16px;
        }
      }
    }
    .baseInfo-right-desc {
      font-size: 14px;
      color: #999;
      margin-top: 10px;
      line-height: 20px;
    }
  }
  .baseInfo-bottom {
    margin-top: 10px;
    .baseInfo-bottom-list {
      box-sizing: border-box;
      height: 72px;
      vertical-align: middle;
      &:not(:first-child) {
        border-top: 1px solid #e3e3e3;/*no*/
      }
      .baseInfo-list-div {
        vertical-align: top;
        display: inline-block;
        box-sizing: border-box;
        width: 50%;
        height: 100%;
        padding: 16px;
        font-size: 14px;
        &:nth-child(2n) {
          border-left: 1px solid #e3e3e3;/*no*/
        }
        .baseInfo-list-title {
          white-space: nowrap;
          color: #999;
        }
        .baseInfo-list-text {
          color: #333;
          margin-top: 10px; /*no*/
          max-height: 41px;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}


.label-cont {
  padding-left: 16px;
  margin-top: 10px;
  background: #fff;
  overflow: hidden;
  .label-list {
    padding: 16px 0 10px;
    text-align: left;
    margin-right: -6px;
    // max-height: 46px;
    .label-list-label {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      padding: 0 6px;
      margin: 0 6px 6px 0;
      border: 1px solid #d24545;/*no*/
      border-radius: 5px;
      font-size: 12px;
      color: #d24545;
      // background: #ffeee5;
    }
    .desc {
      text-align: center;
      color: #bdbdbd;
      font-size: 14px;
    }
  }
}

.market-card {
  margin-top: 10px;
}
</style>
