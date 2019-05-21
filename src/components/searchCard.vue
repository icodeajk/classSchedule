<template>
  <div>
    <div class="card-container">
      <div class="title" v-if="title">
        <mt-cell :title="title" to="/Customer" is-link value="">
        </mt-cell>
      </div>
      <ul class="list-ul" v-if="data.length>0">
        <li class="list-li" v-for="(item,index) in data" :key="index">
          <mt-cell-swipe class="no-title-cell">
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
    }
  },
  methods: {
    jumpRouter(company) {

      this.$router.push({ path: '/customerDetail', query: { company: company } })
    },
  },
  components: {
    Cell,
    CellSwipe,
    Toast,
    emptyPage,
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
          height: 70px;
          padding-top: 2px;
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
          .event-time {
            float: right;
            margin-right: 10px;
            line-height: 34px;
          }
          .tag-list {
            margin:10px 0 10px 0;
            .status {
              color: #97ca6a;
              background: #eaf4e1;
              border: 0.025rem solid #97ca6a;
              border-radius: 5px;
              padding: 0 5px 0 5px;
              margin-right: 10px;
            }
            .stock {
              color: #60a0f0;
              background: #dfecfc;
              border: 0.025rem solid #60a0f0;
              border-radius: 3px;
              padding: 0 5px 0 5px;
            }
          }
        }
      }
    }
  }
}
</style>
