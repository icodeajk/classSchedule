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
        <mt-search v-model="searchVal" slot="center" class="inner-search" cancel-text="取消" placeholder="请输入被执行人名称">
        </mt-search>
      </header-switch>
    </div>
    <filter-list :total="total" v-show="searchListShow" :actions="filterListArr" :activeSelect="filterListActive" :filterBarShow="filterBarShow" :showFilter="false" @toggle="toggleBar($event)" @changeActive="changActive($event)">
    </filter-list>
    <scroll-view class="container" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="card-container">
          <ul class="list-ul">
            <event-card v-for="(value, index) in data" :key="index" :item="value" :eventType="'zhixing'">
              <div slot="bottom" class="list-bottom">
                <div class="bottom-right">
                  <span>案件编号：</span>
                  <span class="high-light" v-if="value.city">{{value.city}}</span>
                  <span class="high-light" v-html="value._highlight.city[0]" v-else></span>
                </div>
                <div class="bottom-right">
                  <span>执行金额：</span>
                  <span class="high-light" v-if="value.city">{{value.city}}</span>
                  <span class="high-light" v-html="value._highlight.publish_time[0]" v-else></span>
                </div>
                <div class="bottom-right">
                  <span>立案日期：</span>
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
      filterListArr: [
        {
          name: '最近立案日期',
          key: 'MIN_PUBLISH_DATE'
        },
        {
          name: '最远立案日期',
          key: 'MAX_PUBLISH_DATE'
        },
        {
          name: '最大执行金额',
          key: 'MAX_CAPITAL'
        },
        {
          name: '最小执行金额',
          key: 'MIX_CAPITAL'
        }
      ],
      filterListActive: {
        name: '最近立案日期',
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
      loading: false,
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
  },
  methods: {
    changActive(item) {
      this.filterListActive = item
    },
    getdata(loadMore = false) {
      if(!this.searchVal) {return}
      if(!loadMore){ this.loading = true}
      let keyword = this.searchVal ? this.searchVal : ''
      let postData = {}
      postData = {
        key_word: keyword,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        sort_field: this.filterListActive.key ? this.filterListActive.key : null,
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
    }
  },
  components: {
    filterList,
    filterBar,
    headerSwitch
  }
}
</script>
