<template>
  <full-page ref="fullPage" :options="fullPageOptions">
    <div style='height:100%' slot="main" class="cortainer">
      <loading-view :showLoading="loading"></loading-view>
      <div class="title">
        <header-switch :title="title">
          <i slot="left" class="head-icon iconfont icon-fenzumingcheng" @click="navTogglePage"></i>
          <i slot="right" class="head-icon iconfont icon-add"></i>
        </header-switch>
      </div>
      <scroll-view :class="(!searchListShow) ? 'container' : 'container bigger'" :data="searchResultList" :pullup="true" @scrollToEnd="onPullingUp" :searchToBar='searchToBar'>
        <div>
          <table class="class-table">
            <tr class="class-th">
              <th>
                <p>周一</p>
                <p>05-08</p>
              </th>
              <th>
                <p>周二</p>
                <p>05-08</p>
              </th>
              <th>
                <p>周三</p>
                <p>05-08</p>
              </th>
              <th>
                <p>周四</p>
                <p>05-08</p>
              </th>
              <th>
                <p>周五</p>
                <p>05-08</p>
              </th>
              <th>
                <p>周六</p>
                <p>05-08</p>
              </th>
              <th>
                <p>周日</p>
                <p>05-08</p>
              </th>
            </tr>
            <tr class="class-tr">
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
            </tr>
            <tr class="class-tr">
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
              <td>语文</td>
            </tr>
            <tr class="class-tr">
              <td>语文</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="class-tr">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="class-tr">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="class-tr">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
      </scroll-view>
    </div>
    <div class="full-page" slot="sub">
      <div class="fade-out" @click="navTogglePage">
      </div>
      <div class="nav-tab">
        <div class="nav-img">
          <p class="to-login">点击登录</p>
          <p class="bottom-text">发掘用户轻体验</p>
        </div>
        <div class="nav-items">
          <div class="nav-item">
            <i class="iconfont icon-schedule_icon"></i>
            <p class="item-name">每周课表</p>
          </div>
          <div class="nav-item">
            <i class="iconfont icon-class"></i>
            <p class="item-name">我的课表</p>
          </div>
          <div class="nav-item">
            <i class="iconfont icon-books"></i>
            <p class="item-name">我的课程</p>
          </div>
          <div class="nav-item">
            <i class="iconfont icon-download"></i>
            <p class="item-name">课表导入</p>
          </div>
          <div class="nav-item">
            <i class="iconfont icon-refresh"></i>
            <p class="item-name">备份课表</p>
          </div>
          <div class="nav-item">
            <i class="iconfont icon-paintBox"></i>
            <p class="item-name">个性化风格</p>
          </div>
          <div class="nav-item">
            <i class="iconfont icon-system"></i>
            <p class="item-name">设置</p>
          </div>
          <div class="nav-item">
            <i class="iconfont icon-about"></i>
            <p class="item-name">关于</p>
          </div>
          <div class="nav-item">
            <i class="iconfont icon-exit"></i>
            <p class="item-name">退出</p>
          </div>
        </div>
      </div>
    </div>
  </full-page>
</template>

<script>
import store from '@/store'
import { AUTH_ALU,SAVE_CURRENT,CHANGESCROLLTOFLAG} from '@/store/mutation-types'
import homeSrv from '../api/homeSrv'
import customerSrv from '../api/customerSrv'
import businessSrv from '../api/businessSrv'
import filterList from '../components/filterList.vue'
import filterBar from '../components/filterBar.vue'
import headerSwitch from '../components/headerSwitch.vue'
import Cookies from 'js-cookie'
import { Toast } from 'mint-ui'
import cache from '@/storeEvent.js'
import fullPage from '@/components/hz/FullPage.vue'
export default {
  data() {
    return {
      cache: cache,
      loading: false,
      list: [],
      scroll: '',
      scrollbar: false,
      scrollSize: 10,
      scrollOffset: 0,
      login_sign: false,
      historyList: [],
      showHistoryList: false,
      getMoreText: '',
      title: '课程表',
      filterBarShow: true,
      searchListShow: false,
      searchResultTotal: 0,
      savedFilterBarArr: [],
      searchToBar: false,
      sign: 0,
      fullPageOptions: {
        type: 'toggle',
        from: 'left'
      },
      filterBarArr: [
        {
          title: '搜索范围',
          key: 'ranges',
          list: [
            { name: '按主要人员查询', key: 'key_person', active: false },
            { name: '按产品/品牌查询', key: 'trademark', active: false },
            { name: '按联系方式查询', key: 'address', active: false },
            { name: '按经营范围查询', key: 'business_scope', active: false }
          ]
        },
        // {
        //   title: '企业类型',
        //   key: 'enterpriseTypes',
        //   list: [
        //     { name: '行内企业', key: 'INSIDE', active: false },
        //     { name: '行外企业', key: 'OUTSIDE', active: false }
        //   ]
        // },
        {
          title: '注册资本',
          key: 'capitals',
          list: [
            { name: '100万以下', key: 'ONE', active: false },
            { name: '100万-200万', key: 'TWO', active: false },
            { name: '200万-500万', key: 'FIVE', active: false },
            { name: '500万-1000万', key: 'TEN', active: false },
            { name: '1000万以上', key: 'MORE', active: false }
          ]
        },
        {
          title: '注册年限',
          key: 'years',
          list: [
            { name: '1年内', key: 'ONE', active: false },
            { name: '1-2年', key: 'TWO', active: false },
            { name: '2-3年', key: 'THREE', active: false },
            { name: '3-5年', key: 'FIVE', active: false },
            { name: '5-10年', key: 'TEN', active: false },
            { name: '10年以上', key: 'MORE', active: false }
          ]
        }
      ],

      filterListShow: false,
      filterListArr: [
        {
          name: '默认排序',
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
        name: '默认排序',
        key: ''
      },
      filter: {},
      customerList: [],
      marketList: [],
      monitorList: [],
      //搜索参数
      searchVal: '',
      searchResultList: [],
      customWatch: null
    }
  },
  mounted() {
    // 初始化，isonline为判断网络是否连接
    // localStorage.setItem('isonline', 'true')
    // localStorage.setItem('access_token', res.access_token)
    this.list = JSON.parse(JSON.stringify(list))
    if(window.navigator.onLine === true) {
      localStorage.setItem('isonline', 'true')
    } else {
      localStorage.setItem('isonline', 'false')
    }
    // this.getLoginName()
  },
  created() {
    this.customWatch = this.$watch('searchVal', this.debounce((newSearchText) => {
      if (newSearchText) {
        this.getMoreText = ''
        this.filter={};
        this.resetBar.call(this)
        this.savedFilterBarArr=[]
        this.seachHttp()
        this.searchListShow = true
        this.scrollOffset = 0;
        this.showHistoryList = false
      } else {
        this.searchResultList = []
        this.searchListShow = false
        this.scrollOffset = 0
        this.scrollbar=true
        this.showHistoryList = false
      }
    }, 500))
  },
  destroyed() {
    this.customWatch && this.customWatch()
  },
  watch: {
    filterListActive: {
      handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollSize = 10
        this.scrollOffset = 0
        this.sign = 0
        this.getMoreText = ''
        this.seachHttp()
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    scrollbarShow(flag){
      if(flag==1){
        this.scrollbar={
          fade:false,
          interactive:true
        }
      }else{
        this.scrollbar=true;
      }

    },
    navTogglePage() {
      this.$refs.fullPage.toggle()
    },
    tabClick(index, i) {
      this.list[index][i].isClick = true
    },
    changBg(val) {

    },
    blurSearch() {
      this.showHistoryList = false;
    },
    getHistoryList() {
      let query = {
        offest: 0,
        count: 5
      }
      homeSrv.getHistoryList(query).then(res => {
        this.historyList = res.data.data
        this.showHistoryList = true
        // for (item in res.data.data) {
        //   this.historyList.push(res.data.data[item].company)
        // }
      }).catch(err => {

      })
    },
    getMonitorList() {
      this.loading = true
      let postData = {
        offset: 0,
        count: 10,
        keyword: '',
        subType: []
      }
      customerSrv.monitorEventList(postData).then(res => {
          if(res.data.total_count > 10){
            this.monitorList = res.data.data.slice(0,10)
          }else{
            this.monitorList = res.data.data
          }
          this.cache['_all'] = this.monitorList
          this.loading = false
        }).catch(err => {
          this.loading = false;
        })
    },
    // getMoreBrief(data) {
    //   if (Array.isArray(data)) {
    //     let companys = []
    //     for (let index = 0; index < data.length; index++) {
    //       companys.push(data[index].company)
    //     }
    //     customerSrv.companyBrief({ companys }).then(res => {
    //       this.customerList = res.data
    //       this.loading = false
    //     })
    //   }
    // },
    seachHttp(callback, loadMore = false) {
      if(loadMore == false){
        this.loading = true
      }
      let filterRange = this.filter.ranges ? this.filter.ranges[0] : ''
      let filterCapital = this.filter.capitals ? this.filter.capitals[0] : ''
      let filterYear = this.filter.years ? this.filter.years[0] : ''
      // delete this.filter.ranges
      // delete this.filter.capitals
      // delete this.filter.years
      this.filter.range = filterRange
      this.filter.capital = filterCapital
      this.filter.year = filterYear

      homeSrv.search({
        keyword: this.searchVal,
        sort: this.filterListActive.key ? this.filterListActive.key : null,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        size: this.scrollSize,
        filter: this.filter
      })
      .then(res => {

        if (loadMore) {
          this.searchResultList = this.searchResultList.concat(
            res.data.results
          )
        } else {
          this.searchResultList = res.data.results
        }
        this.searchResultTotal = res.data.total
        this.loading = false
        if (callback && typeof callback == 'function') {
          callback()
        }
        this.searchToBar=true;
        this.sign = 0
      })
      .catch(err => {
        this.loading = false;
      })
    },
    //event
    onPullingUp() {
      var scrollFresh = () => {}
      if (this.searchListShow) {
        this.sign += 1 // 防止请求连续重发，防抖还不熟悉，先这样后面再改
        if(this.scrollSize * (this.scrollOffset+1) >= this.searchResultTotal){
          this.getMoreText = ''
          return
        }
        this.getMoreText = '加载中...'
        if (this.sign === 1)
        this.seachHttp(scrollFresh, true)
      }
    },
    //filterBar-event
    toggleBar(val) {
      this.filterBarShow = val
      if(this.savedFilterBarArr.length > 0){
        this.filterBarArr = JSON.parse(JSON.stringify(this.savedFilterBarArr));
      }
    },
    changActive(item) {

      this.filterListActive = item
    },
    changeBarActive(item, index, subIndex) {
      let activeBar = Object.assign({}, this.filterBarArr[index])
      if(this.filterBarArr[index].type !== 'multi'){
        for (let i = 0; i < activeBar.list.length; i++) {
          activeBar.list[i].active = false;
        }
      }
      activeBar.list[subIndex].active = !item.active
      this.$set(this.filterBarArr, index, activeBar)
    },
    resetBar() {
      for (let i_b = 0; i_b < this.filterBarArr.length; i_b++) {
        let list = this.filterBarArr[i_b].list
        for (let i_l = 0; i_l < list.length; i_l++) {
          list[i_l].active = false
        }
      }
    },
    enterBar() {
      this.savedFilterBarArr = JSON.parse(JSON.stringify(this.filterBarArr));
      this.scrollOffset=0;
      for (let index = 0; index < this.filterBarArr.length; index++) {
        let keyArray = []
        this.filterBarArr[index].list.forEach(element => {
          if (element.active) {
            keyArray.push(element.key)
          }
        })
        this.filter[this.filterBarArr[index].key] = keyArray
      }
      this.seachHttp(() => {
        this.filterBarShow = false
      })
    },
    backToOa () {
      let oaUrl = 'javascript:;'
      if (window.project_config && window.project_config.oaUrl) {
        oaUrl = window.project_config.oaUrl
      }
      window.location.href = oaUrl
    },
    login_jiangnan(login_name){
      let postParam = {
        username: login_name
      }
      homeSrv.loginByjiangnan(postParam).then(res => {
        console.log('1')
        if (!res.access_token) {
          // Toast({
          //   message: res.msg,
          //   iconClass: 'icon icon-error',
          //   duration: 2000
          // })
          // window.location.href = '/#/error'
          this.$router.push({
            name: 'error'
          })
          return
        }
        else{
          // localStorage.setItem('access_token', res.access_token)
          delete document.cookie
          Cookies.remove('access_token')
          Cookies.set('access_token', res.access_token)
          this.getMonitorList()
        }
        console.log(Cookies.get('access_token'))

      })
    },
    getLoginName(){
      // alu保存起来, 因为跳转页面会丢失
      const arr = window.location.href.match(/login_name\=([^&]*)/)
      let alu
      if (arr && arr[1]) {
        // alu = arr[1].replace(/(#\/)/,'')
        alu=arr[1]
        delete document.cookie
        Cookies.remove('access_token')
        localStorage.clear()
        this.login_jiangnan(alu);
      } else {
        alu = sessionStorage.getItem('alu')
        if(alu && Cookies.get('access_token') === undefined) {
          delete document.cookie
          Cookies.remove('access_token')
          localStorage.clear()
          this.login_jiangnan(alu);
        }
        this.getMonitorList()
      }
      if (alu) {
        store.commit(AUTH_ALU, alu)
        sessionStorage.setItem('alu', alu)
      }
      // if(alu){
      //   console.log(alu)
      //   if(Cookies.get('access_token') === undefined) {
      //     this.login_jiangnan(alu);
      //   }
      // }
    }
  },
  components: {
    filterList,
    filterBar,
    headerSwitch,
    Toast,
    cache,
    fullPage,

  }
}
</script>

<style scoped lang="less">
.container {
  z-index: 1;
  background: #FFF;
  height: calc(100%);
  // min-height:calc(100% - 50px);
  overflow: hidden;
  position:relative;
  &.bigger {
    z-index: 1;
    background: #FFF;
    height: calc(100% - 125px);
    // min-height:calc(100% - 50px);
    overflow: hidden;
    position:relative;
  }
  .get-more{
    font-size: 12px;
  }
  .class-table {
    width: 350px;
    height: 630px;
    // border: none;
    // border-collapse: collapse;
    .class-th {
      height: 30px;
      td {
        width: 30px;
        height: 30px;
      }
    }
    .class-tr {
      td {
        min-width: 30px;
        min-height: 20px;
        border: 1px solid #333; /*no*/
        border-radius: 5px;
        border-spacing: 5px;
      }
    }
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
.title{
  position:relative;
  z-index:2;
  font-size: 25px;
  .head-icon {
    font-size: 25px;
  }
}
.top-tabbar{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 90px;
  padding: 10px 0;
  margin-bottom: 10px;
  background: #fff;
  border-top: 1px solid #e3e3e3;/*no*/
  font-size: 0;
  .tabbar-nav{
    display: inline-block;
    width: 33.3%;
    text-align: center;
    &.tabbar-nav-center{
      width: 33.4%;
    }
    .tabbar-img{
      width: 40px;
      height: 40px;
    }
    .tabbar-text{
      margin-top: 10px;
      font-size: 12px;
      color: #333;
    }
  }
}
.search-tabbar {
  margin-bottom: 10px;
  height: 406px;
  width: 100%;
  background-color: #ffffff;
  .search-table {
    width: 100%;
    border: 0;
    border-collapse: collapse;
    .search-tr {
      height: 90px;
      width: 100%;
      border: 0;
      .search-td {
        width: 33.3%;
        vertical-align: middle;
        border: 1px solid #e3e3e3;
        border-top: 0;
        .tabbar-img{
          display: inline-block;
          width: 50px;
          height: 50px;
          background-size: 50px;
          background-repeat: no-repeat;
        }
        .tabbar-text{
          margin-top: 10px;
          font-size: 12px;
          color: #333;
        }
      }
    }
  }
}
.full-page {
  .fade-out {
    position: absolute;
    width: 100%;
    background-color: #000000;
    height: 100%;
    z-index: 1000;
    opacity: 0;
  }
  .nav-tab {
    position: absolute;
    width: 60%;
    height: 100%;
    z-index: 1001;
    background: #FFF;
    .nav-img {
      height: 150px;
      background-color: #0a4582;
      color: #FFF;
      overflow: hidden;
      text-align: left;
      .to-login {
        margin-top: 100px;
        margin-left: 20px;
        font-size: 20px;
      }
      .bottom-text {
        margin-top: 5px;
        margin-left: 20px;
        font-size: 10px;
      }
    }
    .nav-items {
      .nav-item {
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding-left: 20px;
        i {
          display: inline-block;
          font-size: 16px;
          margin-right: 15px;
        }
        .item-name {
          display: inline-block;
          font-size: 16px;
        }
      }
    }
  }
}
.mint-search.inner-search {
  width: calc(100% - 22px);
  height: auto
}
</style>
