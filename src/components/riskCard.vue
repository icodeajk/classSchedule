<template>
  <div class="card-container">
    <div class="title" v-if="title">
      <mt-cell :title="title" :to="{ path: 'riskList', query: company?{ company: company}:''}" is-link value="">
      </mt-cell>
    </div>
    <ul class="list-ul">
      <li class="list-li" v-for="(item,index) in data" :key="index">
        <router-link :to="{ path: 'eventDetail', query: { type: item.sub_type_en_name , id: index }}"  @click.native="storeEvent(eventType)">
          <div class="list-cont">
            <span class="name">{{item.title}}</span>
            <span class='time' v-if='item.date'>
              {{item.date | dateFormat}}
            </span>
            <span class='time' v-else-if='item.detail.publish_time'>
              {{item.detail.publish_time | dateFormat}}
            </span>
            <span class='time' v-else-if='item.detail.change_date'>
              {{item.detail.change_date| dateFormat}}
            </span>
            <span class='time' v-else-if='item.detail.market_time'>
              {{item.detail.market_time| dateFormat}}
            </span>
            <span class='time' v-else-if='item.detail._utime'>
              {{item.detail._utime| dateFormat}}
            </span>
            <span v-else class="time">{{'未公示'}}</span>
          </div>
          <div class="list-cont">
            <span class="event">{{item.type}}</span>
            <span class="company">{{company ? (company.length > 15 ? company.substr(0,15) + '...' : company) : '未公示'}}</span>
          </div>
        </router-link>
      </li>
    </ul>
    <p class="desc" v-if="data.length==0">暂无相关事件</p>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
import cache from '@/storeEvent.js'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: function() {
        return []
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
      cache: cache
    }
  },
  methods: {
    storeEvent(eventType) {
      localStorage.setItem('storeEventList',JSON.stringify(this.cache[eventType]))
    }
  },
  components: {
    Cell,
    cache
  }
}
</script>

<style scoped lang="less">
.card-container {
  margin-bottom: 10px;
  padding-left: 16px;
  background: #fff;
  .title {
    height: 44px;
    line-height: 44px;
  }
  .desc {
    padding: 16px 0 10px;
    text-align: center;
    color: #bdbdbd;
    font-size: 14px;
  }
  .list-ul {
    .list-li {
      display: block;
      padding: 6px;
      text-align: left;
      font-size: 12px;
      border-bottom: 1px solid #e3e3e3;/*no*/
      &:last-child {
        border-bottom: none;
      }
      .list-cont {
        height: 30px;
        line-height: 30px;
        .name {
          display: inline-block;
          max-width: 78%;
          color: #333;
          font-size: 16px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          /*font-weight: bold;*/
        }
        .time {
          float: right;
          margin-right: 10px;
          color: #bdbdbd;
          font-size: 12px;
        }
        .event {
          color: #5379e9;
          font-size: 14px;
          vertical-align: middle;
          &:after {
            content: ' | ';
            color: #bdbdbd;
          }
        }
        .company {
          display: inline-block;
          color: #bdbdbd;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          max-width: 75%;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
