<template>
  <div>
    <div class="card-container">
      <div class="title" v-if="title">
        <mt-cell :title="title" to="/Customer" is-link value="">
        </mt-cell>
      </div>
      <ul class="list-ul" v-if="data.length>0">
        <li class="list-li" v-for="(item,index) in data" :key="index" v-if="item">
          <mt-cell-swipe class="no-title-cell" :right="[
              {
                content: '设置分组',
                style: { background: '#d1d1d1', color: '#fff' },
                handler: ()=>{showMsgbox(item.company, index)}
              },
              {
                content: '取消关注',
                style: { background: '#D24545', color: '#fff' },
                handler: ()=>{cancelFollow(item.company, index)}
              }
            ]" v-if="navActive">
            <card-container :item="item"></card-container>
          </mt-cell-swipe>
          <mt-cell-swipe class="no-title-cell" :right="[
              {
                content: '监控设置',
                style: { background: '#d1d1d1', color: '#fff' },
                handler: ()=>{showMsgMonitorBox(item.company,item.monitor_status.risk_notify,item.monitor_status.marketing_notify, index)}
              },
              {
                content: '取消监控',
                style: { background: '#8ABCF7', color: '#fff' },
                handler: ()=>{cancelMonitor(item.company, index)}
              }
            ]" v-else>
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
import customerSrv from '@/api/customerSrv'
import msgBoxComponent from '@/components/msgbox.vue'
import msgMonitorBoxComponent from '@/components/msgMonitorBox.vue'
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
      defalut: function() {
        return navActive
      }
    },
    total: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },
  data() {
    return {
      toastInstance: null,
      is_followed: true,
      is_monitored: true,
      data_index: 0
    }
  },
  mounted() {
    bus.$on('is_followed', (is_followed) => {
      console.log(is_followed)
      this.is_followed = is_followed
    })
    bus.$on('is_monitored', (is_monitored) => {
      console.log(is_monitored)
      this.is_monitored = is_monitored
    })
    bus.$on('monitor_status', (data) => {
      if(this.data.length !== 0 && this.data[this.data_index].monitor_status) {
        this.data[this.data_index].monitor_status.risk_notify = data.risk
        this.data[this.data_index].monitor_status.marketing_notify = data.marketing
      }
    })
  },
  watch: {
    is_followed(newvalue, oldvalue) {
      if(!newvalue) {
        this.data.splice(this.data_index, 1)
        let total_tmp = this.total - 1
        bus.$emit('total', total_tmp)
      }
      this.is_followed = true
    },
    is_monitored(newvalue, oldvalue) {
      if(!newvalue) {
        this.data.splice(this.data_index, 1)
        let total_tmp = this.total - 1
        bus.$emit('total', total_tmp)
      }
      this.is_monitored = true
    }
  },
  methods: {
    cancelMonitor(company, data_index) {
      let postParams = {
        company: company,
        marketing_notify: false, //是否监控该公司的营销事件（true：监控，false：取消）
        closely_marketing_notify: false, //是否监控该公司的风险事件（true：监控，false：取消）
        risk_notify: false, // 是否监控该公司的风险事件（true：监控，false：取消）
        closely_risk_notify: false, // 是否监控该公司的关联企业的风险事件（true：监控，false：取消）
        follow_list_id: 0,
      }
      this.data_index = data_index
      customerSrv.toggleMonitor(postParams, data_index).then(res => {
        let message = ''
        if (res.status == 0) {
          message = '取消监控成功'
        } else {
          message = res.msg
        }
        let instance = Toast({
          message: message,
          iconClass: 'icon icon-normal',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
          // window.location.reload()
          this.data.splice(this.data_index, 1)
          let total_tmp = this.total - 1
          bus.$emit('total', total_tmp)
        }, 1000)
      })
    },
    cancelFollow(company, data_index) {
      let postParams = {
        company_name: company,
        follow: false
      }
      let self = this;
      this.data_index = data_index
      customerSrv.cancleFollow(postParams, this.data_index).then(res => {
        let message = ''
        if (res.status == 0) {
          message = '取消关注成功'
        } else {
          message = res.msg
        }
        let instance = Toast({
          message: message,
          iconClass: 'icon icon-normal',
          duration: 1000
        })
        setTimeout(() => {
          instance.close()
          console.log(this.data)
          // window.location.reload()
          this.data.splice(this.data_index, 1)
          let total_tmp = this.total - 1
          bus.$emit('total', total_tmp)
        }, 1000)
      })
    },
    isActive(){

    },
    jumpRouter(company) {

      this.$router.push({ path: '/customerDetail', query: { company: company } })
    },
    msgBox(options={}){
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
    showMsgbox(company, data_index){
      let groupIdList = []
      let postParams = {
        company_name: company,
      }
      this.data_index = data_index
      customerSrv.comFollowList(postParams, this.data_index).then(res => {
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
            groupIdList: groupIdList, //
        }).catch((err)=>{
          console.log("error");
        })
      })

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
      }).catch((err)=>{
        console.log("error");
      })
    },
  },
  components: {
    Cell,
    CellSwipe,
    Toast,
    emptyPage,
    msgBoxComponent,
    msgMonitorBoxComponent,
    cardContainer,
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
          // padding-to: 2px;
          // &:not(:first-child) {
          //   border-top: 1px solid #e3e3e3;
          // }
          // &:not(:last-child) {
          //   padding-bottom: 10px;
          // }
          .bigbottom {
            margin-bottom: 10px;
          }
          .company {
            line-height: 20px;
            font-size: 16px;
            color: #333;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            .next-line {
              display: block;
            }
          }
          .item-list {
            display: block;
            height: 100%;
            margin: 10px 0;
          }
          // .time {
          //   display: block;
          //   margin-top: 5px;
          // }
        }
        .tag-list{
          margin-top: 5px;
          .list-label {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            padding: 0 6px;
            margin-right: 6px;
            font-size: 12px;
            border-radius: 5px;
          }
          .list-label-green {
            color: #97ca6a;
            background: #eaf4e1;
            border: 1px solid #97ca6a;/*no*/
          }
          .list-label-blue {
            color: #60a0f0;
            background: #dfecfc;
            border: 1px solid #60a0f0;/*no*/
          }
        }
        .bigtop {
          // margin-top: 15px;
        }
      }
    }
  }

}
</style>
