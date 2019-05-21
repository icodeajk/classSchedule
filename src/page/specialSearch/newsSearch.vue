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
        <mt-search v-model="searchVal" slot="center" class="inner-search" cancel-text="取消" placeholder="请输入企业名称、新闻标题">
        </mt-search>
      </header-switch>
    </div>
    <filter-list :total="total" v-show="searchListShow" :filterBarShow="filterBarShow" :showFilter="true" @toggle="toggleBar($event)" @changeActive="changActive($event)">
      <div slot="other" @click="dateSort">
        <span>发布日期</span>
        <img class="icon-img" :src="dateSortImg[dateSortValue]" alt="">
      </div>
    </filter-list>
    <filter-bar v-model="filterBarShow" :actions="filterBarArr" @changeBarActive="changeBarActive" @resetClick="resetBar" @enterClick="enterBar">
    </filter-bar>
    <scroll-view class="container" :data="data" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="card-container">
          <ul class="list-ul">
            <event-card v-for="(value, index) in data" :key="index" :item="value" :eventType="'newSearch'">
              <div slot="bottom" class="list-bottom">
                <div class="bottom-right">
                  <span>关联企业：</span>
                  <span class="high-light" v-if="value.city">{{value.city}}</span>
                  <span class="high-light" v-html="value._highlight.city[0]" v-else></span>
                </div>
                <div class="bottom-right">
                  <span>发布时间：</span>
                  <span class="high-light" v-if="value.city">{{value.city}}</span>
                  <span class="high-light" v-html="value._highlight.bidCompany[0]" v-else></span>
                </div>
                <div class="bottom-right">
                  <span>信息来源：</span>
                  <span class="high-light" v-if="value.city">{{value.city}}</span>
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
      sign: 0,
      filterListShow: false,
      filterBarShow: false,
      searchListShow: true,//是否展示搜索结果,默认false
      filter: {},
      savedFilterBarArr: [],
      filterBarArr: [],
      total: 0,//搜索的条数
      loading: false,
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
      this.getdata()
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
        this.getdata()
      }
    },
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
          title: '舆情属性',
          key: 'attribute',
          list: [
            { name: '负面', key: '负面', active: false },
            { name: '中性', key: '中性', active: false },
            { name: '正面', key: '正面', active: false },
          ]
        }
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
      activeBar.list[subIndex].active = !item.active
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
    // filter: {"province":["江苏"],"city":["淮安市","苏州市"]}
    enterBar() {
      //保存用户的筛选内容
      this.savedFilterBarArr = JSON.parse(JSON.stringify(this.filterBarArr));
      this.scrollOffset=0;
      let that = this
      for (let index = 0; index < that.filterBarArr.length; index++) {
        let keyArray = ''
        that.filterBarArr[index].list.forEach(element => {
          if (element.active) {
            keyArray = element.key
          }
        })
        that.filter = keyArray
      }
      this.getdata()
      this.filterBarShow = false
    },
    getdata(loadMore = false) {
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
      this.getdata(true)
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
    eventCard
  }
}
</script>
