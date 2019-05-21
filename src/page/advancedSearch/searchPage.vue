<template>
  <div class="template-cont">
    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>
      <filter-list :total="total" :total_before="'搜索到'" :total_after="'条结果'" :actions='filterListArr' :activeSelect="filterListActive" @changeActive="changActive($event)">
      </filter-list>
    </div>
    <keep-alive>
    <scroll-view :class="'container '" :data="data" :pullup="true" @scrollToEnd="onPullingUp" >
      <div>
        <search-card :title="''" :data="data"></search-card>
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
import searchCard from '@/components/searchCard.vue'

export default {
  data() {
    return {
      title: '搜索结果',
      loading: false,
      scrollSize: 10,
      scrollOffset: 0,
      total: 0,
      searchVal: '',
      filter: {},
      data: [],
      // navActive: true,
      subType: [],
      company: this.$route.query.company,
      getMoreText: '',
      filterBarShow: true,
      savedFilterBarArr: [],
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
      }
    }
  },
  mounted() {
    this.getSearchList()
  },
  watch: {
    filterListActive:{
        handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollSize = 10,
        this.sign = 0,
        this.scrollOffset = 0,
        this.getMoreText = '',
        this.getSearchList()
      },
      deep: true
    }
  },
  methods: {
    changActive(item) {
      this.filterListActive = item
    },
    getSearchList(loadMore = false) {
      if(!loadMore){ this.loading = true}
      var searchParams = JSON.parse(localStorage.getItem('queryConfig'))
      searchParams.sort_field = this.filterListActive.key ? this.filterListActive.key : null
      searchParams.offset = loadMore ? this.scrollSize * ++this.scrollOffset : 0
      customerSrv.getSearchList(searchParams).then(res => {
        if (loadMore) {
          this.data = this.data.concat(res.data.data)
        } else {
          this.data = res.data.data
        }
        this.total = res.data.total_count
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    onPullingUp() {
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getSearchList(true)
    }
  },
  components: {
    filterList,
    headerSwitch,
    searchCard
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

.icon-img {
  display: inline-block;
  line-height: 40px;
  height: 16px;
  margin-right: 6px;
}

.mint-search{
  height: auto;
}
.container {
  position: relative;
  height: calc(100% - 70px);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 124px);
  }
}
</style>
