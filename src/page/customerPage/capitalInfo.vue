<template>
  <div class="template-cont">
    <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
    </header-switch>

    <filter-list :total="total" :total_before="'共'" :total_after="'个'" :actions="filterListArr" :activeSelect="filterListActive" @changeActive="changActive($event)">
    </filter-list>

    <scroll-view class="container" :data="data" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="container-sub" v-for="(item,index) in data" :key="index">
          <div class="base-cont">
            <div class="base-cont-title">
              转入方
            </div>
            <div class="base-cont-val color-red" @click='routerJump(item.dstName)'>
              {{item.dstName}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              转出方
            </div>
            <div class="base-cont-val color-red" @click='routerJump(item.srcName)'>
              {{item.srcName}}
            </div>
          </div>
          <div class="base-cont base-cont-half">
            <div class="base-cont-title">
              转账金额
            </div>
            <div class="base-cont-val">
              ￥{{item.money|formatMoney(2,1)}}
            </div>
          </div>
          <div class="base-cont base-cont-half line-left">
            <div class="base-cont-title">
              转账时间
            </div>
            <div class="base-cont-val">
              {{item.time}}
            </div>
          </div>

        </div>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>

  </div>
</template>

<script>
import filterList from '@/components/filterList.vue'
import headerSwitch from '@/components/headerSwitch.vue'
import customerSrv from '@/api/customerSrv'

import BScroll from 'better-scroll'

export default {
  data() {
    return {
      getMoreText:'',
      scrollSize: 10,
      scrollOffset: 0,
      title: '资金往来',
      total: 0,
      data: [],
      filterListShow: false,
      filterListArr: [
        {
          name: '全部',
          key: 'ALL'
        },
        {
          name: '转出记录',
          key: 'OUT'
        },
        {
          name: '转入记录',
          key: 'IN'
        }
      ],
      filterListActive: {
        name: '全部',
        key: 'ALL'
      }
    }
  },
  mounted() {
    this.getMoneyFlowList()
  },
  watch: {
    filterListActive: {
      handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollOffset = 0
        this.getMoneyFlowList()
      }
    }
  },
  methods: {
    routerJump(company){
      this.$router.push({path:'/customerDetail',query:{company:company}})
    },
    getMoneyFlowList(loadMore = false) {
      let postParams = {
        keyword: this.$route.query.company,
        direction: this.filterListActive.key,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        size: this.scrollSize
      }
      customerSrv.companyMoneyFlow(postParams).then(res => {
        this.total = res.data.total
        if (loadMore) {
          this.data = this.data.concat(this.filterMoneyFlow(res.data.results))
        } else {
          this.data = this.filterMoneyFlow(res.data.results)
        }
        this.hasmore = res.data.hasMore
      })
    },
    onPullingUp() {
      if(this.scrollSize * (this.scrollOffset+1) >= this.total){
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getMoneyFlowList(true)
    },

    changActive(item) {
      //筛选项
      this.filterListActive = item
    },
    filterMoneyFlow(graphData) {
      let result = []
      let edges = graphData.edges || []
      let vertexes = graphData.vertexes || []
      for (let i_e = 0; i_e < edges.length; i_e++) {
        let edge = edges[i_e]
        let combineObj = {}
        for (let i_v = 0; i_v < vertexes.length; i_v++) {
          let vertex = vertexes[i_v]
          if (edge._from.indexOf(vertex._key) !== -1) {
            combineObj = { srcName: vertex.name, ...combineObj }
          }
          if (edge._to.indexOf(vertex._key) !== -1) {
            combineObj = { dstName: vertex.name, ...combineObj }
          }
        }
        result.push({ money: edge.value, time: edge.time, ...combineObj })
      }
      return result
    }
  },
  components: {
    filterList,
    headerSwitch
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: calc(100% - 80px);
  overflow: hidden;
}
.container-sub {
  margin-bottom: 10px;
  background: #fff;
  padding: 0 16px 6px;
  text-align: left;
  .base-cont {
    padding: 16px 0 10px;
    font-size: 14px;
    .base-cont-title {
      margin-bottom: 6px;
      color: #999;
    }
    .base-cont-val {
      color: #333;
      word-break: break-all;
    }
    .color-red {
      color: #d24545;
    }
  }
  .base-cont-half {
    display: inline-block;
    width: 46%;
  }
  .line-left {
    border-left: 1px solid #e3e3e3;/*no*/
    padding-left: 16px;
    width: calc(48% - 16px);
  }
}
</style>
