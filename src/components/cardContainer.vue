<template>
  <div class="card-content">
    <v-touch tag="a" v-on:tap="jumpRouter(item.company)">
      <div class="list-left">
        <img src="../assets/company-logo.png"  alt="" class="list-logo">
      </div>
      <div class="list-right">
        <div class="list-cont">
          <div :class="(item.company && item.company.length > 16) ? 'company' : 'bigbottom company'">
            <span>{{item.company ? item.company.substr(0,16) : '未公示'}}</span>
            <span class="next-line">{{(item.company && item.company.length > 16) ? item.company.substr(16,30) : ''}}</span>
          </div>
          <div class="item-list">
            <span class="name afterLine">{{item.legal_man||'未公示'}}</span>
            <span class="money">{{item.registered_capital| formatMoney}}</span><span v-if="item.registered_capital && Number(item.registered_capital) !== 0">万{{item.registered_capital_unit ? item.registered_capital_unit : '元'}}</span>
            <span class="time beforeLine">{{item.registered_date ? item.registered_date.substr(0,10) :'未公示'}}</span>
          </div>
        </div>
        <div :class="(item.company && item.company.length > 16) ? 'tag-list' : 'bigtop tag-list'">
          <span v-if="item.business_status" class="list-label list-label-green">{{item.business_status||'未公示'}}</span>
          <span v-if="item.stock" class="list-label list-label-blue">{{item.stock||'未公示'}}</span>
        </div>
      </div>
    </v-touch>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
import { CellSwipe } from 'mint-ui'
import Vue from 'vue'

export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    jumpRouter(company) {
      this.$router.push({ path: '/customerDetail', query: { company: company } })
    }
  }
}
</script>

<style lang="less" scoped>
  .card-content {
    position: relative;
    display: block;
    box-sizing: border-box;

    text-align: left;
    font-size: 12px;
    width: 100%;

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
</style>

