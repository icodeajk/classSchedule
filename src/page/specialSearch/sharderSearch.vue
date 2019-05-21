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
.card-container {
  padding-left: 16px;
  margin-bottom: 10px;
  background: #fff;
  .list-ul {
    .bottom-left {
      display: flex;
      align-items: center;
      height: 100%;
      width: 10px;
      margin-right: 10px;
    }
    .bottom-right {
      height: 100%;
      width: calc(100% - 15px);
      color: #999999;
      font-size: 14px;
    }
    .bottom-img {
      display: inline-block;
      width: 0.8em;
      height: 0.8em;
    }
    .list-bottom {
      display: flex;
      align-items: center;
      border-top: 0.5px solid #E3E3E3;
      padding-top: 10px;
    }
    .sharder {
      display: inline-block;
    }
  }
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
        <mt-search v-model="searchVal" slot="center" class="inner-search" cancel-text="取消" placeholder="请输入请输入股东或高管名称">
        </mt-search>
      </header-switch>
      <filter-list :total="total" v-show="searchListShow" :actions="filterListArr" :activeSelect="filterListActive" :filterBarShow="filterBarShow" :showFilter="true" @toggle="toggleBar($event)" @changeActive="changActive($event)">
      </filter-list>
      <filter-bar v-model="filterBarShow" :actions="filterBarArr" @changeBarActive="changeBarActive" @resetClick="resetBar" @enterClick="enterBar">
      </filter-bar>
    </div>
    <scroll-view class="container" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="card-container">
          <ul class="list-ul">
            <baseinfo-card v-for="(value, index) in data" :key="index" :item="value">
              <div slot="bottom" v-if="value._highlight['key_person.key_person_name'] || value._highlight['shareholder_information.shareholder_name']" class="list-bottom">
                <div class="bottom-left">
                  <img src="@/assets/img/icon-sharder.png" class="bottom-img"/>
                </div>
                <div class="bottom-right">
                  <div v-if="value._highlight['key_person.key_person_name']" class="sharder">
                    <span>高管：</span>
                    <span class="high-light" v-for="(v ,i) in value._highlight['key_person.key_person_name']" :key="i" v-html="v+' '"></span>
                  </div>
                  <div v-if="value._highlight['shareholder_information.shareholder_name']" class="sharder">
                    <span class="beforeLine">股东：</span>
                    <span class="high-light" v-for="(v ,i) in value._highlight['shareholder_information.shareholder_name']" :key="i" v-html="v"></span>
                  </div>
                </div>
              </div>
            </baseinfo-card>
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
import baseinfoCard from '@/components/specialSearch/baseinfoCard.vue'


export default {
  data() {
    return {
      data: [],
      searchVal: '',
      getMoreText: '',
      loading: false,
      scrollSize: 10,
      sign: 0,
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
    }
  },
  created() {
    this.watchSign = this.$watch('searchVal', this.debounce((newSearchText) => {
      this.getMoreText = ''
      this.scrollOffset = 0;
      if(newSearchText !== '')
      this.getdata()
    }, 500))
  },
  destroyed() {
    this.watchSign && this.watchSign()
  },
  watch: {
    filterListActive: {
      handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollSize = 10
        this.scrollOffset = 0
        this.sign = 0
        this.getMoreText = ''
        if(this.searchVal)
        this.getdata()
      },
      deep: true
    }
  },
  mounted() {
    this.filterBarInit()
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
          title: '注册资本（单选）',
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
          title: '注册年限（单选）',
          key: 'years',
          list: [
            { name: '1年内', key: 'ONE', active: false },
            { name: '1-2年', key: 'TWO', active: false },
            { name: '2-3年', key: 'THREE', active: false },
            { name: '3-5年', key: 'FIVE', active: false },
            { name: '5-10年', key: 'TEN', active: false },
            { name: '10年以上', key: 'MORE', active: false }
          ]
        },
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
      let activeBar = Object.assign({}, this.filterBarArr[index])
      if(this.filterBarArr[index].type !== 'multi'){
        for (let i = 0; i < activeBar.list.length; i++) {
          activeBar.list[i].active = false;
        }
      }

      // 江苏上海 城市切换
      if(activeBar.list[subIndex].name === '江苏' && activeBar.list[subIndex].active === false) {
        if(this.filterBarArr.length === 4) // 去掉第二层
          this.filterBarArr.splice(3,1)
        this.filterBarArr = (this.filterBarArr).concat(this.jiangsuCity)
      }else if(activeBar.list[subIndex].name === '上海' && activeBar.list[subIndex].active === false) {
        if(this.filterBarArr.length === 4)
          this.filterBarArr.splice(3,1)
        this.filterBarArr = (this.filterBarArr).concat(this.shanghaiCity)
      }else if(activeBar.list[subIndex].key === 'all' && activeBar.list[subIndex].active === false){
        if(this.filterBarArr.length === 4)
          this.filterBarArr.splice(3,1)
      }

      activeBar.list[subIndex].active = true
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
    // filter: {"江苏":[{"南京市":[]},{"徐州市":[]}]}  省份单选， 市区单选
    enterBar() {
      //保存用户的筛选内容
      this.savedFilterBarArr = JSON.parse(JSON.stringify(this.filterBarArr));
      this.scrollOffset=0;
      let that = this
      for (let index = 0; index < that.filterBarArr.length; index++) {
        let keyArray = ''
        that.filterBarArr[index].list.forEach(element => {
          if (element.active && element.name !== '全部') {
            keyArray = element.key
          }
        })
        that.filter[that.filterBarArr[index].key] = keyArray
      }
      this.getdata()
      this.filterBarShow = false
    },
    getdata(loadMore = false) {
      if(!this.searchVal) {return}
      if(!loadMore){ this.loading = true}
      let keyword = this.searchVal
      let postData = {}
      postData = {
        key_word: keyword,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        sort: this.filterListActive.key ? this.filterListActive.key : null,
        filter: this.filter,
        province: this.filter.province,
        city: this.filter.city,
        count: this.scrollSize,
        type: 'key_person',

      }
      customerSrv.specialSearch(postData).then(res => {
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
      this.getdata(true)
    }
  },
  components: {
    filterList,
    filterBar,
    headerSwitch,
    baseinfoCard,
  }
}
</script>
