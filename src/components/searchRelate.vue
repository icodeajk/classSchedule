<template>
<div>
  <div class="card-container" v-if="actions.length>0" ref='searchlistDom'>
    <ul class="list-ul" >
      <li class="list-li" v-for="(item,index) in actions" :key="index">
        <mt-cell-swipe class="no-title-cell" @click.native="sendcompany(item.company)">
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
                <span class="money">{{item.registered_capital| formatMoney}}</span><span v-if="item.registered_capital && Number(item.registered_capital) !== 0">万{{item.registered_capital_unit  ? item.registered_capital_unit : '元'}}</span>
                <span class="time beforeLine">{{item.registered_date ? item.registered_date.substr(0,10) :'未公示'}}</span>
              </div>
            </div>
            <div :class="(item.company && item.company.length > 16) ? 'tag-list' : 'bigtop tag-list'">
              <span v-if="item.business_status" class="list-label list-label-green">{{item.business_status||'未公示'}}</span>
              <span v-if="item.stock" class="list-label list-label-blue">{{item.stock||'未公示'}}</span>
            </div>
          </div>
        </mt-cell-swipe>
      </li>
    </ul>
  </div>
  <empty-page v-else></empty-page>
</div>
</template>

<script>
import { Cell } from 'mint-ui'
import { CellSwipe } from 'mint-ui'
import emptyPage from '../components/emptyPage.vue'

export default {
  props: {
    actions: {
      type: Array,
      default: function() {
        return []
      }
    }

  },
  data() {
    return {
    }
  },
  mounted() {
  },
  components: {
    emptyPage,
    Cell,
    CellSwipe
  },
  methods: {
    sendcompany(company) {
      this.$emit('company', company)
    }
  },
  watch:{}
}
</script>

<style scoped lang="less">
.card-container {
  padding-left: 16px;
  margin-bottom: 10px;
  background: #fff;
  .list-ul {
    .list-li {
      display: block;
      box-sizing: border-box;
      height: 120px;
      padding: 10px 0px;
      text-align: left;
      font-size: 12px;
      border-bottom: 1px solid #e3e3e3;/*no*/
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
  }

}

</style>
