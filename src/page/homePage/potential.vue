<template>

  <div class="customer-cont template-cont potential-block">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
    </header-switch>

    <!-- <div class="navbar">
      <div class="navbar-nav" :class="navActive ? 'active' : ''" @click="navActive = true">我行客户关联行外企业</div>
      <div class="navbar-nav" :class="navActive ? '' : 'active'" @click="navActive = false">新注册企业</div>
    </div> -->
    <mt-search v-model="searchVal" cancel-text="取消" placeholder="请输入企业名称">
    </mt-search>
    <filter-list v-show="searchListShow" :total="total" :actions="filterListArr" :activeSelect="filterListActive" :filterBarShow="filterBarShow" :showFilter="true" @toggle="toggleBar($event)" @changeActive="changActive($event)" v-model="filterListShow">
    </filter-list>
    <filter-bar v-model="filterBarShow" :actions="filterBarArr" @changeBarActive="changeBarActive" @resetClick="resetBar" @enterClick="enterBar">
    </filter-bar>
    <scroll-view :class=" navActive? 'container ':'container bigger'" :data="data" :pullup="true" @scrollToEnd="onPullingUp" :navActive="navActive">
      <div>
        <potential-card :data="data" v-if="!loading&&data.length>0" :navActive="navActive"></potential-card>
        <empty-page v-else></empty-page>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import customerSrv from '@/api/customerSrv'
import potentialCard from '@/components/potentialCard.vue'
import headerSwitch from '@/components/headerSwitch.vue'
import filterList from '@/components/filterList.vue'
import filterBar from '@/components/filterBar.vue'
import emptyPage from '@/components/emptyPage.vue'
import address from './filterListArea'

export default {
  data() {
    return {
      loading: false,
      scroll: null,
      scrollSize: 10,
      sign: 0,
      scrollOffset: 0,
      title: '潜在客户',
      total: 0,
      navActive: false,
      scrollbar:false,
      data: [],
      searchVal: '',
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
      searchListShow: true,
      filterListShow: false,
      filterBarShow: false,
      filter: {},
      savedFilterBarArr: [],
      filterBarArr: [],
      province: [
        { name: '全部', key: 'all', children: 'none', active: true },
        { name: '江苏', key: '江苏', value: "320000", children: 'city', active: false },
        { name: '上海', key: '上海', value: "310000", children: 'city', active: false },
      ]
    }
  },
  mounted() {
    this.filterBarInit()
    this.getCustomerList(this.type)
  },
  computed: {
    type() {
      return this.navActive ? 'insider' : 'newregister'
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
      this.getCustomerList(this.type)
    },
    filterListActive:{
        handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollSize = 10,
        this.sign = 0,
        this.scrollOffset = 0,
        this.getMoreText = '',
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

    getCustomerList(type, loadMore = false) {
      if(!loadMore){ this.loading = true}
      let keyword = this.searchVal ? this.searchVal : ''
      if (type == 'insider') {
        let postData = {
          key_word: keyword,
          offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
          sort_field: this.filterListActive.key ? this.filterListActive.key : null,
          size: this.scrollSize,
          dateType: 'ALL',
          count: 10,
        }

        customerSrv.innerLinkList(postData).then(res => {
          // if (loadMore) {
          //   this.data = this.data.concat(res.data.data)
          // } else {
          //   // this.data =[].concat(res.data.results)
          //   this.data=res.data.data
          // }
          this.total = res.data.total_count

          if(Array.isArray(res.data.data)){
            // this.getMoreBrief(res.data.data,loadMore)
            this.getMoreBrief(res.data.data,loadMore)
          }else{
            this.loading=false;
            this.total=0;
          }
        }).catch(err => {
          this.loading = false;
        })
      } else {
        let queryData = {
          key_word: keyword,
          offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
          sort_field: this.filterListActive.key ? this.filterListActive.key : null,
          location_map: this.filter,
          limit: this.scrollSize,
          dateType: 'ALL',
          count: 10,
          type: 0,
        }
        customerSrv.newRegistedList(queryData).then(res => {
          this.total=res.data.total_count;
          if(Array.isArray(res.data.data)){
            this.getMoreBrief(res.data.data,loadMore)
          }else{
            this.total=0;
            this.loading=false;
          }
          // if (loadMore) {
          //   this.data = this.data.concat(res.data.data)
          // } else {
          //   // this.data =[].concat(res.data.results)
          //   this.data=res.data.data
          // }
        }).catch(err => {
          this.loading = false;
        })
      }
    },
    getMoreBrief(data,loadMore) {
      if (Array.isArray(data) && data.length !== 0) {
        let companys = []
        for (let index = 0; index < data.length; index++) {
          companys.push(data[index].company)
        }
        customerSrv.companyBrief({companys,notSort: 1, shortBrief: 1}).then(res => {
          if(loadMore){
            this.data = this.data.concat(res.data)
          }else{
            this.data=res.data
          }
          this.loading = false
          this.sign = 0
        }).catch(err => {
          this.loading = false;
        })
      }
      else {
        this.data = []  // 当getCustomerList数据为0时，清空列表数据
        this.loading = false
      }
    },

    // filterBar Init
    filterBarInit() {
      this.searchListShow = true
      this.filterListShow = false
      this.filterBarShow = false
      this.savedFilterBarArr = []
      this.filterBarArr = [
        {
          title: '省份选择（单选）',
          key: 'province',
          list: this.province.concat()
        }
      ]
      // this.area = [
      //   {
      //     title: '城市选择',
      //     key: 'city',
      //     type: 'multi', // 多选
      //     list: [
      //       { name: '全部', key: '', active: true },
      //       { name: '上海市', key: '上海市', active: false },
      //     ]
      //   },
      // ]
    },
    //filterBar-event
    toggleBar(val) {
      this.filterBarShow = val
      if(this.savedFilterBarArr.length > 0){
        this.filterBarArr = this.savedFilterBarArr.concat();
      }
    },
    changActive(item) {

      this.filterListActive = item
    },
    changeBarActive(item, index, subIndex) {
      // 切换省份时，初始化存储
      if(index === 0) {
        this.filter = {}
      }

      //涉及联动，裁剪数组
      this.filterBarArr.splice(index+1)
      console.log(this.filterBarArr.length)

      let activeBar = JSON.parse(JSON.stringify(this.filterBarArr[index]))
      let subActive = JSON.parse(JSON.stringify(this.filterBarArr[index]['list'][subIndex]))

      // 多选
      if(this.filterBarArr[index].type !== 'multi'){
        for (let i = 0; i < activeBar.list.length; i++) {
          activeBar.list[i].active = false;
        }
      }
      activeBar.list[subIndex].active = true
      //层级操作
      let temp;
      switch(index){
        case 0:
        case 1:
          if(activeBar.children){
            //不需精确到list
            if(activeBar.children !== 'none'){
              temp = [{
                title: index === 0 ? '城市选择（单选）' : '地区选择（多选）',
                key: index === 0 ? 'city' : 'area',
                children: activeBar.children === 'area' ? 'none' : 'area',
                type: activeBar.children === 'area' ? 'multi' : '',
                list: address[activeBar.children][subActive.value].concat()
              }]
              this.filterBarArr = (this.filterBarArr).concat(temp)
            }
          }else{
            if(subActive.children && subActive.children !== 'none'){
              temp = [{
                title: index === 0 ? '城市选择（单选）' : '地区选择（多选）',
                key: index === 0 ? 'city' : 'area',
                children: subActive.children === 'area' ? 'none' : 'area',
                type: subActive.children === 'area' ? 'multi' : '',
                list: address[subActive.children][subActive.value].concat()
              }]
              this.filterBarArr = (this.filterBarArr).concat(temp)
            }
          }
          break;
        case 2:
          break;
      }
      this.$set(this.filterBarArr, index, activeBar)
    },

    // 重置
    resetBar() {
      this.filterBarInit()
    },

    // 确认
    // filter: {江苏: [{南通市: ["港闸区", "如东县"]}]}  省份，市区单选，地区多选
    enterBar() {
      this.savedFilterBarArr = JSON.parse(JSON.stringify(this.filterBarArr));
      this.scrollOffset=0;
      let that = this
      let province = ''
      let city = ''
      let area = ''
      let cityArray = []
      for (let index = 0; index < that.filterBarArr.length; index++) {
        let keyArray = {}
        let areaArray = []
        that.filterBarArr[index].list.forEach(element => {

          // 获取选中的值
          if (element.active) {
            if(index === 0) {
              province = element.name   // 江苏
            } else if(index === 1) {
              city = element.name   // 南通市
            } else {
              areaArray.push(element.name) // ["港闸区", "如东县"]
            }
          }
        })
        if(index === 2) {
          keyArray[city] = areaArray   // {南通市: ["港闸区", "如东县"]}
          cityArray.push(keyArray)   // [{南通市: ["港闸区", "如东县"]}]
        }
        that.filter[province] = cityArray  // {江苏: [{南通市: ["港闸区", "如东县"]}]}

        // 省份为全部时，传空值
        if(province === '全部') {
          that.filter = {}
        }
      }
      this.getCustomerList(this.type)
      this.filterBarShow = false
    },
    onPullingUp() {
      this.sign += 1 // 防止请求连续重发，防抖还不熟悉，先这样后面再改
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }

      this.getMoreText = '加载中...'
      if(this.sign === 1)
      this.getCustomerList(this.type, true)
    }
  },
  components: {
    potentialCard,
    headerSwitch,
    filterList,
    emptyPage,
    filterBar
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: calc(100% - 3.5rem);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 2rem);
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
</style>
