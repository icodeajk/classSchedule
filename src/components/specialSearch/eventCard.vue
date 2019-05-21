<template>
  <li class="list-li">
    <mt-cell-swipe class="no-title-cell">
      <v-touch tag="a" v-on:tap="jumpRouter()">
        <div class="list-right">
          <div class="list-cont high-light">
            <span class="company zan-ellipsis">
              {{item.title}}
            </span>
            <span v-if="item.tags" class="list-label list-label-blue">{{item.tags}}</span>
          </div>
          <slot name="bottom"></slot>
        </div>
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
    eventType: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {
    jumpRouter(company) {
      sessionStorage.setItem('eventItem', JSON.stringify(this.item))  //根据eventType来发不同请求，存储获取的详情数据
      this.$router.push({ path: '/searchDetail', query: { type: this.eventType } })  //根据eventType判断详情模版组件
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
  background-color: #FFF;
  .mint-cell.mint-cell-swipe {
    position: static;
    .mint-cell-wrapper {
      position: static;
    }
  }

  &:last-child {
    border-bottom: none;
  }
  .list-right {
    display: inline-block;
    width: 100%;
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
