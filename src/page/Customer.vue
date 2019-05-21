<template>

  <div class="customer-cont template-cont customer-block">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
    </header-switch>

    <div class="navbar">
      <div class="navbar-nav" :class="navActive ? 'active' : ''" @click="navActive = true">我关注的企业</div>
      <div class="navbar-nav" :class="navActive ? '' : 'active'" @click="navActive = false">我监控的企业</div>
    </div>
    <mt-search v-model="searchVal" cancel-text="取消" placeholder="请输入企业名称">
    </mt-search>
    <div class="label-cont" v-if="navActive">
      <mt-cell :title="'我的关注分组'" class="title" :to="'/followList'" is-link value="">
      </mt-cell>
    </div>
    <filter-list :total="total" :total_before="'共'" :total_after="navActive?'个企业':'个企业'"  :actions='filterListArr' :activeSelect="filterListActive" @changeActive="changActive($event)">
    </filter-list>
    <keep-alive>
      <scroll-view :class=" navActive? 'container ':'container bigger'" :data="data" :pullup="true" @scrollToEnd="onPullingUp" :navActive="navActive">
        <div>
          <customer-list :data="data" :total="total" v-if="!loading&&data.length>0" :navActive="navActive"></customer-list>
          <empty-page v-else-if="navActive && !searchVal" :topMessage="followTopMessage" :bottomMessage="followBottomMessage"></empty-page>
          <empty-page v-else-if="!navActive && !searchVal" :topMessage="monitorTopMessage" :bottomMessage="monitorBottomMessage"></empty-page>
          <empty-page v-else></empty-page>
          <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
        </div>
      </scroll-view>
    </keep-alive>
  </div>
</template>

<script>
import store from '../store'
import {SAVE_CURRENT,CHANGESCROLLTOFLAG} from '../store/mutation-types'
import customerSrv from '@/api/customerSrv'
import customerList from '../components/customerCard.vue'
import headerSwitch from '../components/headerSwitch.vue'
import filterList from '@/components/filterList.vue'
import emptyPage from '@/components/emptyPage.vue'
import bus from '@/bus.js'

export default {
  data() {
    return {
      loading: false,
      scroll: null,
      scrollSize: 10,
      scrollOffset: 0,
      followTopMessage: '您还未添加关注的企业',
      followBottomMessage: '请选择企业，点击关注，添加入关注分组吧',
      monitorTopMessage: '您还未添加监控的企业',
      monitorBottomMessage: '请选择企业，打开监控，添加入监控企业吧',
      title: '客户列表',
      total: 0,
      navActive: true,
      scrollbar:false,
      data: [],
      searchVal: '',
      temp_type: '',
      sign: 0,
      getMoreText: '',
      filterListArr: [
        {
          name: '默认',
          key: ''
        },
        {
          name: '最大注册资本',
          key: 'MAX_CAPITAL'
        },
        {
          name: '最小注册资本',
          key: 'MIN_CAPITAL'
        },
        {
          name: '最早成立企业',
          key: 'MIN_REGISTER_DATE'
        },
        {
          name: '最新成立企业',
          key: 'MAX_REGISTER_DATE'
        }
      ],
      filterListActive: {
        name: '默认',
        key: ''
      },
    }
  },
  mounted() {
    this.init()
    console.log(this.historyState)
    bus.$on('total', (total) => {
      this.total = total
    })
  },
  computed: {
    type() {
      return this.navActive ? 'follows' : 'monitors'
    }
  },
  created() {
    this.$watch('searchVal', this.debounce((newSearchText) => {
      this.getMoreText = ''
      this.scrollOffset = 0;
      this.getCustomerList(this.type)
    }, 500))
  },
  watch: {
    // searchVal(val) {
    //   this.getMoreText = ''
    //   this.scrollOffset = 0
    //   this.getCustomerList(this.type)
    // },
    navActive() {

      this.scrollOffset = 0
      this.data = []
      this.getMoreText=''
      this.filterListActive= {
        name: '默认',
        key: ''
      }
      sessionStorage.setItem('customer-navActive', this.navActive),
      this.init()
    },
    filterListActive:{
        handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollSize = 10
        this.scrollOffset = 0
        this.sign = 0
        this.getCustomerList(this.type)
      },
      deep: true

    }
  },
  methods: {
    changActive(item) {
      this.filterListActive = item
      // this.getCustomerList()
    },
    init() {
      this.navActive = sessionStorage.getItem('customer-navActive') === 'false' ? false : true
      this.temp_type = this.navActive ? 'follows' : 'monitors'
      this.getCustomerList(this.temp_type)
    },
    getCustomerList(type, loadMore = false) {
      if(!loadMore){ this.loading = true}
      let keyword = this.searchVal ? this.searchVal : ''
      let postData = {}
      if (type == 'follows') {
        postData = {
          keyword: keyword,
          offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
          sort_field: this.filterListActive.key ? this.filterListActive.key : null,
          size: this.scrollSize,
          flag: 0,     //区分关注和监控   默认为0
          dateType: 'ALL',
        }
        customerSrv.companyInfo(postData).then(res => {
          this.total = res.data.total
          if(res.data.results.length!==0 && Array.isArray(res.data.results)){
            this.getMoreBrief(res.data.results,loadMore)
          }else{
            this.total=0;
            this.data = res.data.results;
            this.loading=false;
          }
        }).catch(err => {
          this.loading = false
        })
      } else if(type == 'monitors') {
        postData = {
          keyword: keyword,
          offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
          sort_field: this.filterListActive.key ? this.filterListActive.key : null,
          size: this.scrollSize,
          flag: 1,
          dateType: 'ALL',
        }
        customerSrv.companyInfo(postData).then(res => {
          this.total = res.data.total
          if(res.data.results.length!==0 && Array.isArray(res.data.results)){
            this.getMoreBrief(res.data.results,loadMore)
          }else{
            this.total=0;
            this.data = res.data.results;
            this.loading=false;
          }
        }).catch(err => {
          this.loading = false
        })
      }
    },
    getMoreBrief(data,loadMore) {
      if (Array.isArray(data)) {
        let companys = []
        for (let index = 0; index < data.length; index++) {
          companys.push(data[index].company)
        }
        customerSrv.companyBrief({companys, notSort: 1, shortBrief: 1 }).then(res => {
          if(loadMore){
            this.data = this.data.concat(res.data)
          }else{
            this.data=res.data
          }
          this.loading = false
          this.sign = 0
        }).catch(err => {
          this.loading = false
          this.sign = 0
        })
      }
    },
    textback() {
      window.history.back()
    },
    onPullingUp() {
      this.sign += 1 // 防止请求连续重发，防抖还不熟悉，先这样后面再改
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }

      this.getMoreText = '加载中...'
      if (this.sign === 1)
      this.getCustomerList(this.type, true)
    },
  },
  components: {
    customerList,
    headerSwitch,
    filterList,
    emptyPage
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: calc(100% - 218px);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 4.5rem);
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
.label-cont {
  padding-left: 16px;
  background: #fff;
  overflow: hidden;
  .label-list {
    padding: 16px 0 10px;
    text-align: left;
    margin-right: -6px;
    // max-height: 46px;
    .label-list-label {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      padding: 0 6px;
      margin: 0 6px 6px 0;
      border: 1px solid #d24545;/*no*/
      border-radius: 5px;
      font-size: 12px;
      color: #d24545;
      // background: #ffeee5;
    }
    .desc {
      text-align: center;
      color: #bdbdbd;
      font-size: 14px;
    }
  }
}
</style>
