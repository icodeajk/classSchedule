<template>
  <div class="template-cont">

    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
        <router-link to="/riskSetup" slot="right" class="a-link">
          <img src="../../assets/img/icon-setup.png" alt="" class="icon-img">
        </router-link>
      </header-switch>
      <filter-list :total="total" :total_before="'共'" :total_after="'条事件'" :filterBarShow="filterBarShow" :showFilter="true" @toggle="toggle($event)">
      </filter-list>

      <filter-bar v-model="filterBarShow" :actions="filterBarArr" @changeBarActive="changeBarActive" @resetClick="resetBar" @enterClick="enterBar"></filter-bar>
    </div>
    <keep-alive>
    <scroll-view :class="'container bigger'" :data="data" :pullup="true" @scrollToEnd="onPullingUp" >
      <div>
        <market-card :title="''" :data="data" :company="company" :eventType="'risk'"></market-card>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>
    </keep-alive>
  </div>
</template>

<script>
import store from '@/store'
import {SAVE_CURRENT,CHANGESCROLLTOFLAG} from '@/store/mutation-types'
import businessSrv from '@/api/businessSrv'
import customerSrv from '@/api/customerSrv'

import headerSwitch from '@/components/headerSwitch.vue'
import filterList from '@/components/filterList.vue'
import filterBar from '@/components/filterBar.vue'
import marketCard from '@/components/marketCard.vue'
import cache from '@/storeEvent.js'

export default {
  data() {
    return {
      cache: cache,
      title: '风险事件',
      loading: false,
      scrollSize: 10,
      scrollOffset: 0,
      data: [],
      total: 0,
      searchVal: '',
      filter: {},
      subType: [],
      company: this.$route.query.company,
      getMoreText: '',
      filterBarShow: true,
      savedFilterBarArr: [],
      filterBarArr: [
        {
          title: '类型选择',
          list: [
              { name: '全部', key: [], active: true },
              { name: '负面舆情', key: [222], active: false },
              { name: '企业关联判决结果', key: ['judgement_wenshu'], active: false },
              { name: '企业关联开庭公告', key: ['court_ktgg'], active: false },
              { name: '企业关联案件审判流程', key: ['judge_process'], active: false },
              { name: '企业关联法院公告', key: ['bulletin'], active: false },
              { name: '企业失信被执行', key: ['shixin_info'], active: false },
              { name: '企业法定代表人频繁变更', key: ['legal_man_change'], active: false },
              { name: '企业的经营状态变为异常状态', key: ['business_status_change'], active: false },
              { name: '企业经营地址频繁变更', key: ['place_change'], active: false },
              { name: '企业股东频繁变更', key: ['shareholder_change'], active: false },
              { name: '企业被行政处罚', key: ['penalty'], active: false },
              { name: '企业高管频繁变更', key: ['senior_executive_change'], active: false },
            ]
        }
      ]
    }
  },
  mounted() {
    this.getMarketList()
    // store.commit(SAVE_CURRENT,{enterMarket:true,enterDetail:false})

  },
  beforeRouteEnter(to,from,next){
    if(store.state.cart.saveCurrent.enterMarket){
      store.commit(CHANGESCROLLTOFLAG,store.state.cart.scrollToFlag+1)
    }
    next()
  },
  created() {
    this.$watch('searchVal', this.debounce((newSearchText) => {
      this.getMoreText = ''
      this.scrollOffset = 0;
      this.getMarketList()
    }, 500))
  },
  watch: {
    // searchVal(val) {
    //   this.getMoreText = ''
    //   this.scrollOffset = 0
    //   this.getMarketList()
    // },
  },
  methods: {
    getMarketList(loadMore = false) {
      if(!loadMore){ this.loading = true}
      let searchParams = {
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        count: this.scrollSize,
        company: this.company,
        filter:this.filter,
        subType: this.subType,
        type: 'risk'
      }

      businessSrv.businessSearch(searchParams).then(res => {
        if (loadMore) {
          this.data = this.data.concat(res.data.data)
        } else {
          // this.data =[].concat(res.data.results)
          this.data=res.data.data
        }
        this.total = res.data.total_count
        this.cache[searchParams.type] = this.data
        this.loading = false
      }).catch(err => {
        this.loading = false;
      })
    },
    //bar事件
    changeBarActive(item, index, subIndex) {
      let activeBar = Object.assign({}, this.filterBarArr[index])
      if(activeBar.list[subIndex].name === '全部' && activeBar.list[subIndex].active === false)
      this.resetBar()
      else if(activeBar.list[subIndex].name !== '全部'){
        activeBar.list[0].active = false
        activeBar.list[subIndex].active = !item.active
      }
      this.$set(this.filterBarArr, index, activeBar)
    },
    resetBar() {
      for (let i_b = 0; i_b < this.filterBarArr.length; i_b++) {
        let list = this.filterBarArr[i_b].list
        for (let i_l = 0; i_l < list.length; i_l++) {
          if(list[i_l].name === '全部')
          list[i_l].active = true
          else
          list[i_l].active = false
        }
      }
    },
    enterBar() {
      this.savedFilterBarArr = JSON.parse(JSON.stringify(this.filterBarArr));
      for (let index = 0; index < this.filterBarArr.length; index++) {
        let keyArray = []
        this.filterBarArr[index].list.forEach(element => {
          if (element.active) {
            keyArray = keyArray.concat(element.key)
          }
        })
        this.subType = keyArray
      }
      this.getMarketList()
      this.subType = []
      this.filterBarShow = false
    },
    onPullingUp() {
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getMarketList(null, true)
    },
    toggle() {
      this.filterBarShow = !this.filterBarShow
      if(this.savedFilterBarArr.length > 0){
        this.filterBarArr = JSON.parse(JSON.stringify(this.savedFilterBarArr));
      }
    }
  },
  components: {
    filterList,
    filterBar,
    headerSwitch,
    marketCard,
    cache
  }
}
</script>

<style scoped lang="less">
.container {
  background: #eee;
  height: calc(100% - 76px);
  overflow: hidden;
  position:relative
}
.a-link {
  display: inline-block;
}
.icon-img {
  display: inline-block;
  vertical-align: middle;
  line-height: 20px;
  height: 20px;
  margin-right: 6px;
}

.mint-search{
  height: auto;
}
.container {
  position: relative;
  height: calc(100% - 180px);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 40px);
  }
}
</style>
