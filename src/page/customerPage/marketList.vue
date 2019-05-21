<template>
  <div class="template-cont">

    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
        <router-link to="/marketSetup" slot="right" class="a-link">
          <img src="../../assets/img/icon-setup.png" alt="" class="icon-img">
        </router-link>
      </header-switch>
      <filter-list :total="total" :total_before="'共'" :total_after="'条机会'" :filterBarShow="filterBarShow" :showFilter="true" @toggle="toggle($event)">
      </filter-list>

      <filter-bar v-model="filterBarShow" :actions="filterBarArr" @changeBarActive="changeBarActive" @resetClick="resetBar" @enterClick="enterBar"></filter-bar>
    </div>
    <keep-alive>
    <scroll-view :class="'container '" :data="data" :pullup="true" @scrollToEnd="onPullingUp" >
      <div>
        <market-card :title="''" :data="data" :company="company" :eventType="'marketing'"></market-card>
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
import monitorCard from '@/components/monitorCard.vue'
import headerSwitch from '@/components/headerSwitch.vue'
import filterList from '@/components/filterList.vue'
import filterBar from '@/components/filterBar.vue'
import marketCard from '@/components/marketCard.vue'
import cache from '@/storeEvent.js'

export default {
  data() {
    return {
      cache: cache,
      title: '营销机会',
      loading: false,
      scrollSize: 10,
      scrollOffset: 0,
      data: [],
      total: 0,
      searchVal: '',
      filter: {},
      // navActive: true,
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
              { name: '企业中标', key: [104], active: false },
              { name: '企业为A级纳税人', key: ['tax_payer_level_a'], active: false },
              { name: '企业新增分支机构', key: [105], active: false },
              // { name: '企业新增对外投资', key: [106], active: false },
              { name: '企业股东中新出现上市企业', key: ['new_listed_shareholder'], active: false },
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
        filter: this.filter,
        subType: this.subType,
        type: 'marketing',
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
  height: calc(100% - 40px);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 40px);
  }
}
</style>
