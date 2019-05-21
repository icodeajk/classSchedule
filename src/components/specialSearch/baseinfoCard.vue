<template>
  <li class="list-li">
    <mt-cell-swipe class="no-title-cell">
      <v-touch tag="a" v-on:tap="jumpRouter(item.company)">
        <div class="list-left">
          <img src="@/assets/company-logo.png"  alt="" class="list-logo">
        </div>
        <div class="list-right">
          <div class="list-cont high-light">
            <div class="company zan-ellipsis">
              {{item.company}}
            </div>
            <span class="name afterLine" v-if="item._highlight.legal_man" v-html="item._highlight.legal_man[0]"></span>
            <span class="name afterLine" v-else>{{item.legal_man||'未公示'}}</span>
            <span class="money">{{item.registered_capital| formatMoney}}</span><span v-if="item.registered_capital && Number(item.registered_capital) !== 0">万{{item.registered_capital_unit ? item.registered_capital_unit : '元'}}</span>
            <span class="time beforeLine">
              {{item.registered_date ? item.registered_date.substr(0,10) :'未公示'}}
            </span>
          </div>
          <div :class="(item.company && item.company.length > 16) ? 'tag-list' : 'bigtop tag-list'">
            <span v-if="item.business_status" class="list-label list-label-green">{{item.business_status||'未公示'}}</span>
            <span v-if="item.stock" class="list-label list-label-blue">{{item.stock||'未公示'}}</span>
          </div>
        </div>
        <slot name="bottom"></slot>
      </v-touch>
    </mt-cell-swipe>
  </li>
</template>

<script>
import { Cell } from 'mint-ui'
import { CellSwipe } from 'mint-ui'
import { Toast } from 'mint-ui'

import emptyPage from '@/components/emptyPage.vue'
import Vue from 'vue'
import msgBoxComponent from '@/components/msgbox.vue'
import msgMonitorBoxComponent from '@/components/msgMonitorBox.vue'

import { MessageBox } from 'mint-ui'
import customerSrv from '@/api/customerSrv'
import bus from '@/bus.js'

export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    },
  },
  data() {
    return {
      toastInstance: null,
      groupIdList: [],
      data_index: 0,
    }
  },
  mounted() {

  },
  methods: {
    jumpRouter(company) {

      this.$router.push({ path: '/customerDetail', query: { company: company } })
    }
  },
  components: {
    Cell,
    CellSwipe,
    Toast,
    emptyPage,
  }
}
</script>

<style scoped lang="less">
.list-li {
  position: relative;
  display: block;
  box-sizing: border-box;
  /*height: 112px;*/
  padding: 16px 0px 10px;
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
        padding-bottom: 5px;
      }
      .company {
        font-size: 16px;
        margin-bottom: 4px;
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
    .tag-list{
        margin-bottom: 10px;
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
  }
}
</style>
