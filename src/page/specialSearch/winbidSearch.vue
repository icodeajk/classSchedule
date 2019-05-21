<style scoped lang="less">
.container {
  position: relative;
  height: calc(100% - 2.1rem);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 2rem);
  }
}
.mint-search{
  height: auto;
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
.bottom-right {
  height: 100%;
  color: #999999;
  font-size: 14px;
  width: calc(100% - 15px);
}
</style>

<template>
  <div style='height:100%'>
    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch>
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
        <mt-search v-model="searchVal" slot="center" class="inner-search" cancel-text="取消" placeholder="请输入企业名、招中标名称">
        </mt-search>
      </header-switch>
    </div>
    <div class="navbar">
      <div class="navbar-nav" :class="navActive ? 'active' : ''" @click="navActive = true">招标信息</div>
      <div class="navbar-nav" :class="navActive ? '' : 'active'" @click="navActive = false">中标信息</div>
    </div>
    <filter-list :total="total" v-show="searchListShow" :filterBarShow="filterBarShow" :showFilter="true" @toggle="toggleBar($event)" @changeActive="changActive($event)">
      <div slot="other" @click="dateSort">
        <span>发布时间</span>
        <img class="icon-img" :src="dateSortImg[dateSortValue]" alt="">
      </div>
    </filter-list>
    <filter-bar v-model="filterBarShow" :actions="filterBarArr" @changeBarActive="changeBarActive" @resetClick="resetBar" @enterClick="enterBar">
    </filter-bar>
    <scroll-view class="container" :data="data" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="card-container">
          <ul class="list-ul">
            <event-card v-for="(value, index) in data" :key="index" :item="value" :eventType="'winbid'">
              <div slot="bottom" class="list-bottom">
                <div class="bottom-right">
                  <span>所属城市：</span>
                  <span class="high-light" v-if="value.city">{{value.city}}</span>
                  <span class="high-light" v-html="value._highlight.city[0]" v-else></span>
                </div>
                <div class="bottom-right" v-if="navActive">
                  <span>招标企业：</span>
                  <span class="high-light" v-if="value.pubBidCompany">{{value.pubBidCompany}}</span>
                  <span class="high-light" v-html="value._highlight.pubBidCompany[0]" v-else></span>
                </div>
                <div class="bottom-right" v-else>
                  <span>中标企业：</span>
                  <span class="high-light" v-if="value.winBidCompany">{{value.winBidCompany}}</span>
                  <span class="high-light" v-html="value._highlight.winBidCompany[0]" v-else></span>
                </div>
                <div class="bottom-right">
                  <span>发布时间：</span>
                  <span class="high-light" v-if="value.publish_time">{{value.publish_time}}</span>
                  <span class="high-light" v-html="value._highlight.publish_time[0]" v-else></span>
                </div>
              </div>
            </event-card>
          </ul>
        </div>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import homeSrv from '@/api/homeSrv'
import businessSrv from '@/api/businessSrv'
import customerSrv from '@/api/customerSrv'
import filterList from '@/components/filterList.vue'
import filterBar from '@/components/filterBar.vue'
import headerSwitch from '@/components/headerSwitch.vue'
import eventCard from '@/components/specialSearch/eventCard.vue'

export default {
  data() {
    return {
      data: [],
      searchVal: '',
      getMoreText: '',
      loading: false,
      scrollSize: 10,
      sign: 0,
      navActive: true,
      filterListArr: [
        {
          name: '最新发布',
          key: 'MIN_PUBLISH_DATE'
        },
        {
          name: '最早发布',
          key: 'MAX_PUBLISH_DATE'
        }
      ],
      filterListActive: {
        name: '最新发布',
        key: 'MIN_PUBLISH_DATE'
      },
      filterListShow: false,
      filterBarShow: false,
      searchListShow: true,//是否展示搜索结果,默认false
      filter: {},
      savedFilterBarArr: [],
      filterBarArr: [],
      total: 0,//搜索的条数
      scrollSize: 10,
      scrollOffset: 0,
      watchSign: null,
      //排序所需参数
      dateSortImg: {
        '': '/static/img/icon_sortNormal.png',
        'min_publish_time': '/static/img/icon_ascending.png',
        'max_publish_time': '/static/img/icon_descending.png'
      },
      dateSortValue: '',
      dateSortIndex: 0,
      dateSortList: ['', 'min_publish_time', 'max_publish_time']
    }
  },
  created() {
    this.watchSign = this.$watch('searchVal', this.debounce((newSearchText) => {
      this.getMoreText = ''
      this.scrollOffset = 0;
      if(newSearchText !== '')
      this.getdata(this.type)
    }, 500))
  },
  destroyed() {
    this.watchSign && this.watchSign()
  },
  watch: {
    dateSortValue: {
      handler: function(val, oldVal) {
        if (val === oldVal) return
        this.scrollSize = 10
        this.scrollOffset = 0
        this.sign = 0
        this.getMoreText = ''
        if(this.searchVal)
        this.getdata(this.type)
      }
    },
    navActive: {
      handler: function(val, oldVal) {
        if (val === oldVal) return
        this.scrollOffset = 0
        this.scrollSize = 10
        this.data = []
        this.getMoreText =''
        sessionStorage.setItem('navActive', this.navActive)
        if (this.searchVal)
          this.getdata(this.type)
      }
    }
  },
  mounted() {
    this.filterBarInit()
  },
  computed: {
    type() {
      return this.navActive ? 'win' : 'publish'
    }
  },
  methods: {
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
          list: [
            { name: '全部', key: 'all', active: true },
            { name: '江苏', key: '江苏', active: false },
            { name: '上海', key: '上海', active: false },
          ]
        },
      ]
      this.jiangsuCity = [
        {
          title: '城市选择（单选）',
          key: 'city',
          // type: 'multi', // 多选
          list: [
            { name: '全部', key: '', active: true },
            { name: '常州市', key: '常州市', active: false },
            { name: '淮安市', key: '淮安市', active: false },
            { name: '连云港市', key: '连云港市', active: false },
            { name: '南京市', key: '南京市', active: false },
            { name: '南通市', key: '南通市', active: false },
            { name: '宿迁市', key: '宿迁市', active: false },
            { name: '苏州市', key: '苏州市', active: false },
            { name: '泰州市', key: '泰州市', active: false },
            { name: '无锡市', key: '无锡市', active: false },
            { name: '徐州市', key: '徐州市', active: false },
            { name: '盐城市', key: '盐城市', active: false },
            { name: '扬州市', key: '扬州市', active: false },
            { name: '镇江市', key: '镇江市', active: false },
          ]
        },
      ]
      this.shanghaiCity = [
        {
          title: '城市选择（单选）',
          key: 'city',
          // type: 'multi', // 多选
          list: [
            { name: '全部', key: '', active: true },
            { name: '上海市', key: '上海市', active: false },
          ]
        },
      ]
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
      // 切换省份时，初始化存储
      if(index === 0) {
        this.filter = {}
      }

      let activeBar = Object.assign({}, this.filterBarArr[index])
      if(this.filterBarArr[index].type !== 'multi'){
        for (let i = 0; i < activeBar.list.length; i++) {
          activeBar.list[i].active = false;
        }
      }

      // 江苏上海 城市切换
      if(activeBar.list[subIndex].name === '江苏' && activeBar.list[subIndex].active === false) {
        if(this.filterBarArr.length !== 1) // 去掉第二层
          this.filterBarArr.splice(0,1)
        this.filterBarArr = (this.filterBarArr).concat(this.jiangsuCity)
      }else if(activeBar.list[subIndex].name === '上海' && activeBar.list[subIndex].active === false) {
        if(this.filterBarArr.length !== 1)
          this.filterBarArr.splice(0,1)
        this.filterBarArr = (this.filterBarArr).concat(this.shanghaiCity)
      }else if(activeBar.list[subIndex].key === 'all' && activeBar.list[subIndex].active === false){
        if(this.filterBarArr.length !== 1)
          this.filterBarArr.splice(0,1)
      }

      // 互斥
      if(activeBar.list[subIndex].name === '全部' && activeBar.list[subIndex].active === false) {
        for (let i = 0; i < activeBar.list.length; i++) {
          activeBar.list[i].active = false;
        }
        activeBar.list[0].active = true
      }else if(activeBar.list[subIndex].name !== '全部'){
        activeBar.list[0].active = false
        activeBar.list[subIndex].active = !item.active
      }

      this.$set(this.filterBarArr, index, activeBar)
    },

    // 重置
    resetBar() {
      for (let i_b = 0; i_b < this.filterBarArr.length; i_b++) {
        let list = this.filterBarArr[i_b].list
        for (let i_l = 0; i_l < list.length; i_l++) {
          list[i_l].active = false
        }
      }
    },

    // 确认
    // filter: {"江苏":[{"南京市":[]},{"徐州市":[]}]}  省份单选， 市区多选
    enterBar() {
      //保存用户的筛选内容
      this.savedFilterBarArr = JSON.parse(JSON.stringify(this.filterBarArr));
      this.scrollOffset=0;
      let that = this
      let province = ''
      for (let index = 0; index < that.filterBarArr.length; index++) {
        let keyArray = []
        that.filterBarArr[index].list.forEach(element => {
          if (element.active && element.name !== '全部') {
            if(index === 0) {
              province = element.name
            }
            let cityArray = {}
            cityArray[element.key] = []
            keyArray.push(cityArray)
          }
        })
        that.filter[province] = keyArray

        // 省份为全部时，传空值
        if(province === '全部' || province === '') {
          that.filter = {}
        }
      }
      this.getdata(this.type)
      this.filterBarShow = false
    },
    getdata(type = 'win', loadMore = false) {
      if(!this.searchVal) {return}
      if(!loadMore){ this.loading = true}
      let keyword = this.searchVal ? this.searchVal : ''
      let postData = {}
      postData = {
        key_word: keyword,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        sort_field: this.dateSortValue ? this.dateSortValue : null,
        location_map: this.filter,
        count: this.scrollSize,
      }
      postData.type = type
      customerSrv.winBidSearch(postData).then(res => {
        this.total = res.data.total_count
        if(Array.isArray(res.data.result) && loadMore){
          this.data = this.data.concat(res.data.result)
        }else{
          this.total = res.data.total_count;
          this.data = res.data.result;
        }
        this.loading=false;
        this.sign = 0
      }).catch(err => {
        this.loading = false
        this.sign = 0
      })
    },
    onPullingUp() {
      this.sign += 1 // 防止请求连续重发，防抖还不熟悉，先这样后面再改
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }

      this.getMoreText = '加载中...'
      if(this.sign === 1)
      this.getdata(this.type, true)
    },
    //用于排序
    dateSort(){
      if(++this.dateSortIndex > 2){
        this.dateSortIndex = 0
      }
      this.dateSortValue = this.dateSortList[this.dateSortIndex]
    }
  },
  components: {
    filterList,
    filterBar,
    headerSwitch,
    eventCard,
  }
}
</script>
