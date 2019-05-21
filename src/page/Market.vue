<template>
  <div class="template-cont">

    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch>
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
        <mt-search class="inner-search" slot="center" v-model="searchVal" cancel-text="取消" placeholder="搜索事件">
        </mt-search>
        <router-link :to="navActive ? '/marketSetup' : '/riskSetup'" slot="right" :navActive="navActive" class="a-link">
          <img src="../assets/img/icon-setup.png" alt="" class="icon-img">
        </router-link>
      </header-switch>
      <div class="navbar">
        <div class="navbar-nav" :class="navActive ? 'active' : ''" @click="navActive = true">营销机会</div>
        <div class="navbar-nav" :class="navActive ? '' : 'active'" @click="navActive = false">风险事件</div>
      </div>
      <filter-list :total="total" :total_before="'共'" :total_after="navActive?'条机会':'条事件'" :filterBarShow="filterBarShow" :showFilter="true" @toggle="toggle($event)">
      </filter-list>

      <filter-bar v-model="filterBarShow" :actions="filterBarArr" @changeBarActive="changeBarActive" @resetClick="resetBar" @enterClick="enterBar"></filter-bar>
    </div>
    <keep-alive>
    <scroll-view :class="navActive? 'container ':'container bigger'" :data="data" :pullup="true" @scrollToEnd="onPullingUp" >
      <div>
        <monitor-card :title="''" :data="data" :navActive="navActive" :eventType="type"></monitor-card>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>
    </keep-alive>
  </div>
</template>

<script>
import store from '../store'
import {SAVE_CURRENT,CHANGESCROLLTOFLAG, NAVACTIVE} from '../store/mutation-types'
import businessSrv from '../api/businessSrv'
import customerSrv from '../api/customerSrv'
import monitorCard from '../components/monitorCard.vue'
import headerSwitch from '../components/headerSwitch.vue'
import filterList from '../components/filterList.vue'
import filterBar from '../components/filterBar.vue'
import marketCard from '../components/marketCard.vue'
import cache from '@/storeEvent.js'

export default {
  data() {
    return {
      cache: cache,
      title: '动态',
      loading: false,
      scrollSize: 10,
      scrollOffset: 0,
      data: [],
      total: 0,
      searchVal: '',
      temp_type: '',
      subType: [],
      navActive: true,
      getMoreText: '',
      filterBarShow: true,
      savedFilterBarArr: [],
      filterBarArr: []
    }
  },

  mounted() {
    this.init()
        // store.commit(SAVE_CURRENT,{enterMarket:true,enterDetail:false})
  },
  // beforeRouteEnter(to,from,next){
  //   if(store.state.cart.saveCurrent.enterMarket){
  //     store.commit(CHANGESCROLLTOFLAG,store.state.cart.scrollToFlag+1)
  //   }
  //   next()
  // },
  created() {
    this.$watch('searchVal', this.debounce((newSearchText) => {
      this.getMoreText = ''
      this.scrollOffset = 0;
      this.getMarketList(this.type)
    }, 500))
  },
  watch: {
    // searchVal(val) {
    //   this.getMoreText = ''
    //   this.scrollOffset = 0
    //   this.getMarketList(this.type)
    // },
    navActive(val) {
      this.scrollOffset = 0
      this.scrollSize = 10
      this.data = []
      this.getMoreText=''
      this.filterListActive= {
        name: '默认',
        key: ''
      }
      this.savedFilterBarArr = []
      this.filterBarArr = []
      this.subType = []
      sessionStorage.setItem('navActive', this.navActive)
      this.init()
    }
  },
  computed: {
    company(){
      return this.$route.query.company
    },
    type() {
      return this.navActive ? 'marketing' : 'risk'
    }
  },
  methods: {
    init() {
      this.navActive = sessionStorage.getItem('navActive') === 'false' ? false : true
      this.temp_type = this.navActive ? 'marketing' : 'risk'
      if (this.temp_type == 'marketing') {
        this.filterBarArr = [
          {
            title: '类型选择',
            list: [
              { name: '全部', key: [], active: true },
              { name: '企业中标', key: [104], active: false },
              { name: '企业为A级纳税人', key: [102], active: false },
              { name: '企业新增分支机构', key: [105], active: false },
              // { name: '企业新增对外投资', key: [106], active: false },
              { name: '企业股东中新出现上市企业', key: [101], active: false },
            ]
          }
        ]
      } else if(this.temp_type == 'risk') {
        this.filterBarArr = [
          {
            title: '类型选择',
            list: [
              { name: '全部', key: [], active: true },
              { name: '负面舆情', key: [222], active: false },
              { name: '企业关联判决结果', key: [204], active: false },
              { name: '企业关联开庭公告', key: [201], active: false },
              { name: '企业关联案件审判流程', key: [203], active: false },
              { name: '企业关联法院公告', key: [202], active: false },
              { name: '企业失信被执行', key: [205], active: false },
              { name: '企业法定代表人频繁变更', key: [209], active: false },
              { name: '企业的经营状态变为异常状态', key: [208], active: false },
              { name: '企业经营地址频繁变更', key: [213], active: false },
              { name: '企业股东频繁变更', key: [212], active: false },
              { name: '企业被行政处罚', key: [207], active: false },
              { name: '企业高管频繁变更', key: [210], active: false },
            ]
          }
        ]
      }
      this.getMarketList(this.temp_type)
    },

    getMarketList(type, loadMore = false) {
      if(!loadMore){ this.loading = true}
      let keyword = this.searchVal ? this.searchVal : ''
      let searchParams = {}
      if (type == 'marketing') {
        searchParams = {
          offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
          keyword: keyword,
          subType: this.subType,
          type: 'marketing',
          count: 10,
        }
      }else if(type == 'risk') {
        searchParams = {
          offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
          keyword: keyword,
          // companyNames: this.company?[this.company]:[],
          subType: this.subType,
          type: 'risk',
          count: 10,
        }
      }
      customerSrv.monitorEventList(searchParams).then(res => {
        if (loadMore) {
          this.data = this.data.concat(res.data.data)
        } else {
          // this.data =[].concat(res.data.results)
          this.data=res.data.data
        }
        this.cache[searchParams.type] = this.data
        this.total = res.data.total_count

        this.loading = false
      }).catch(err => {
        this.loading = false;
      })
      this.filterBarShow = false
    },
    //bar事件
    changeBarActive(item, index, subIndex) {
      // this.changeFilterBar()
      let activeBar = Object.assign({}, this.filterBarArr[index])
      if(activeBar.list[subIndex].name === '全部' && activeBar.list[subIndex].active === false)
      this.resetBar()
      else if(activeBar.list[subIndex].name !== '全部'){
        activeBar.list[0].active = false
        activeBar.list[subIndex].active = !item.active
      }
      this.$set(this.filterBarArr, index, activeBar)
    },
    changeFilterBar() {

      // 营销事件
      // 企业中标                       MARKETING_WIN_BID (104, "104", "中标公告")
      // 企业为A级纳税人				   MARKETING_TAX_PLAYER_LELVEL_A(102, "102", "纳税等级为A")
      // 企业新增分支机构			   MARKETING_NEW_AFFILIATE(105, "105", "新设立分支机构")
      // 企业新增对外投资			   MARKETING_NEW_INVESTED_COMPANY(106, "new_invested_company", "新增对外投资")   x
      // 企业股东中新出现上市企业	   MARKETING_NEW_LISTED_SHAREHOLDER(101, "new_listed_shareholder", "新增上市企业股东")   x

      // 风险事件
      // 负面舆情                        ENTERPRISE_FRONT_SENTIMENT(222,"222","负面舆情")       x
      // 企业关联判决结果				RISK_JUDGEMENT_WENSHU(204, "judgement_wenshu", "判决结果")       x
      // 企业关联开庭公告				RISK_COURT_ANNO(201, "court_ktgg", "开庭公告")                   x
      // 企业关联案件审批流程			RISK_JUDGE_PROCESS(203, "judge_process", "审判流程")            x
      // 企业关联法院公告				RISK_BULLETIN(202, "bulletin", "法院公告")                       x
      // 企业失信被执行					RISK_SHIXIN_INFO(205, "shixin_info", "失信被执行")               x
      // 企业法定代表人频繁变更			RISK_LEGAL_MAN_CHANGE(209, "legal_man_change", "法定代表人频繁变更")     x
      // 企业的经营状态变为异常			RISK_BUSSINESS_STATUS_CHANGE(208, "business_status_change", "经营状态变更")      x
      // 企业经营地址频繁变更			RISK_PLACE_CHANGE(213, "place_change", "经营地址频繁变更")                x
      // 企业股东频繁变更				RISK_SHAREHOLDER_CHANGE(212, "shareholder_change", "股东频繁变更")         x
      // 企业被行政处罚					RISK_PENALTY(207, "penalty", "行政处罚")                                  x
      // 企业高管频繁变更				RISK_SENIOR_EXECUTIVE_CHANGE(210, "senior_executive_change", "高管频繁变更")       x
      if (this.navActive) {
        this.filterBarArr = [
          {
            title: '类型选择',
            list: [
              { name: '全部', key: [], active: true },
              { name: '企业中标', key: [104], active: false },
              { name: '企业为A级纳税人', key: [102], active: false },
              { name: '企业新增分支机构', key: [105], active: false },
              // { name: '企业新增对外投资', key: [106], active: false },
              { name: '企业股东中新出现上市企业', key: [101], active: false },
            ]
          }
        ]
      }else {
        this.filterBarArr = [
          {
            title: '类型选择',
            list: [
              { name: '全部', key: [], active: true },
              { name: '负面舆情', key: [222], active: false },
              { name: '企业关联判决结果', key: [204], active: false },
              { name: '企业关联开庭公告', key: [201], active: false },
              { name: '企业关联案件审判流程', key: [203], active: false },
              { name: '企业关联法院公告', key: [202], active: false },
              { name: '企业失信被执行', key: [205], active: false },
              { name: '企业法定代表人频繁变更', key: [209], active: false },
              { name: '企业的经营状态变为异常状态', key: [208], active: false },
              { name: '企业经营地址频繁变更', key: [213], active: false },
              { name: '企业股东频繁变更', key: [212], active: false },
              { name: '企业被行政处罚', key: [207], active: false },
              { name: '企业高管频繁变更', key: [210], active: false },
            ]
          }
        ]
      }
    },
    resetBar() {
      for (let i_b = 0; i_b < this.filterBarArr.length; i_b++) {
        let list = this.filterBarArr[i_b].list
        for (let i_l = 0; i_l < list.length; i_l++) {
          if(list[i_l].name === '全部')
          list[i_l].active = true
          else
          list[i_l].active = false
          // this.filterBarArr[i_b].list[i_l].active = false
        }
        // console.log("list"+list)
        // console.log(this.filterBarArr)
      }
      // this.savedFilterBarArr = JSON.parse(JSON.stringify(this.filterBarArr));
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
      this.getMarketList(this.type)
      // this.subType = []
      this.filterBarArr = this.savedFilterBarArr
      this.scrollOffset = 0
      this.getMoreText = ''
    },
    onPullingUp() {
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getMarketList(this.type, true)
    },
    toggle() {
      this.filterBarShow = !this.filterBarShow
      // this.changeFilterBar()
      this.savedFilterBarArr = JSON.parse(JSON.stringify(this.filterBarArr));
      console.log(this.savedFilterBarArr[0].list[0].active)
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
    monitorCard,
    cache
  }
}
</script>

<style scoped lang="less">
.container {
  background: #eee;
  height: calc(100% - 76px);
  overflow: hidden;
  position:relative;
}
.a-link {
  display: inline-block;
}
.icon-img {
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
  height: calc(100% - 121px);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 124px);
  }
}
.navbar {
  position: relative;
  font-size: 0;
  .navbar-nav {
    position: relative;
    height: 48px;
    line-height: 48px;
    display: inline-block;
    width: 50%;
    font-size: 16px;
    background: #fff;
    &.active {
      color: #d24545;
    }
    &.active:after {
      position: absolute;
      content: '';
      border-bottom: 2px solid #d24545;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
    }
  }
}
.filter-container{
  .filter-li-span{
    margin-right: 36px;
  }
}
</style>




