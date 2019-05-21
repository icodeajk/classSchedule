<template>
  <div>
    <div class="card-container">
      <div class="title" v-if="title">
        <mt-cell :title="title" to="/Customer" is-link value="">
        </mt-cell>
      </div>
      <ul class="list-ul">
        <li class="list-li" v-for="(item,index) in data" :key="index">
          <mt-cell-swipe class="no-title-cell" :right="[
              {
                content: '设置监控',
                style: { background: '#8ABCF7', color: '#fff'},
                handler: ()=>{showMsgMonitorBox(item.company,item.monitor_status.risk_notify,item.monitor_status.marketing_notify, index)}
              },
              {
                content: '设置关注',
                style: { background: '#d1d1d1', color: '#fff'},
                handler: ()=>{showMsgbox(item.company)}
              }
            ]" >
            <card-container :item="item"></card-container>
          </mt-cell-swipe>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
import { CellSwipe } from 'mint-ui'
import { Toast } from 'mint-ui'

import emptyPage from '../components/emptyPage.vue'
import Vue from 'vue'
import msgBoxComponent from '@/components/msgbox.vue'
import msgMonitorBoxComponent from '@/components/msgMonitorBox.vue'

import { MessageBox } from 'mint-ui'
import customerSrv from '@/api/customerSrv'
import bus from '@/bus.js'
import cardContainer from '@/components/cardContainer.vue'

export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return ''
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    },
    navActive: {
      type: Boolean,
      defalut: function(){
        return navActive
      }
    }
  },
  data() {
    return {
      toastInstance: null,
      groupIdList: [],
      data_index: 0,
    }
  },
  mounted() {
    bus.$on('monitor_status', (data) => {
      if(this.data.length !== 0 && this.data[this.data_index].monitor_status) {
        this.data[this.data_index].monitor_status.risk_notify = data.risk
        this.data[this.data_index].monitor_status.marketing_notify = data.marketing
      }
    })
  },
  methods: {
    confirmMonitor(company) {
      let postParams = {
        company: company,
        marketing_notify: true, //是否监控该公司的营销事件（true：监控，false：取消）
        closely_marketing_notify: true, //是否监控该公司的风险事件（true：监控，false：取消
        risk_notify: true, // 是否监控该公司的风险事件（true：监控，false：取消）
        closely_risk_notify: true, // 是否监控该公司的关联企业的风险事件（true：监控，false：取消）
      }
      customerSrv.toggleMonitor(postParams).then(res => {
        let message = ''
        if (res.status == 0) {
          message = '监控成功'
        } else {
          message = res.msg
        }
        this.toastInstance = Toast({
          message: message,
          duration: 1000,
          className: 'normal-toast'
        })
        setTimeout(() => {
          this.toastInstance.close()
          // window.location.reload()
        }, 1000)
      })
    },
    confirmFollow(company) {
      let postParams = {
        company_name: company,
        follow: true,
        follow_list_id: 0,
      }
      customerSrv.addFollow(postParams).then(res => {
        let message = ''
        if (res.status == 0) {
          message = '关注成功'
        } else {
          message = res.msg
        }
        this.toastInstance = Toast({
          message: message,
          duration: 1000,
          className: 'normal-toast'
        })
        setTimeout(() => {
          this.toastInstance.close()
          // window.location.reload()
        }, 1000)
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
    showMsgbox(company){
      let groupIdList = []
      let postParams = {
        company_name: company
      }
      customerSrv.comFollowList(postParams).then(res => {
        for(var item in res.data){
          var index = res.data[item].id
          if(res.data[item].company_in)
          groupIdList[index] = true
        }
        this.msgBox({
          title:'选择分组',
          cancel:'取消',
          confirm:'确定',
          className:'pop-custom',
          company: company,
          groupIdList: groupIdList,
        }).then(()=>{
            console.log("我点击了确定按钮")
        }).catch((err)=>{
          console.log("error");
        })
      })
    },
    showMsgMonitorBox(company,risk,marketing, data_index){
      this.data_index = data_index
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
    comFollowList() {
      let postParams = {
        company_name: this.company
      }
      customerSrv.comFollowList(postParams).then(res => {
        for(var item in res.data){
          var index = res.data[item].id
          if(res.data[item].company_in)
          this.groupIdList[index] = true
        }
      })
    },
    isActive(){

    },
    jumpRouter(company) {

      this.$router.push({ path: '/customerDetail', query: { company: company } })
    }
  },
  components: {
    Cell,
    CellSwipe,
    Toast,
    emptyPage,
    msgBoxComponent,
    msgMonitorBoxComponent,
    cardContainer
  }
}
</script>

<style scoped lang="less">
.card-container {
  padding-left: 16px;
  margin-bottom: 10px;
  background: #fff;
  .list-ul {
    .list-li {
      position: relative;
      display: block;
      box-sizing: border-box;
      height: 120px;
      padding: 10px 0px;
      text-align: left;
      font-size: 12px;
      border-bottom: 1px solid #e3e3e3;/*no*/
      .mint-cell.mint-cell-swipe {
        position: static;
        .mint-cell-wrapper {
          position: static;
        }
      }

      &:last-child {
        border-bottom: none;
      }
      .list-left {
        display: inline-block;
        float: left;
        height: 100%;
        width: 54px;
        vertical-align: middle;
        text-align: left;
        img{
          width:40px;
          height:40px;
        }
      }
      .list-right {
        display: inline-block;
        width: calc(100% - 54px);
        font-size: 14px;
        color: #bdbdbd;
        .list-cont {
          padding-to: 2px;
          &:not(:first-child) {
            border-top: 1px solid #e3e3e3;/*no*/
          }
          &:not(:last-child) {
            padding-bottom: 10px;
          }
          .company {
            font-size: 16px;
            margin-bottom: 12px;
            color: #333;
          }
          .event {
            line-height: 34px;
            font-size: 14px;
            color: #bdbdbd;
          }
          .time {
            display: inline-block;
            margin-top: 5px;
          }
          .event-time {
            float: right;
            margin-right: 10px;
            line-height: 34px;
          }
        }
      }
    }
  }
}
</style>
