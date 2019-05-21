<template>
  <div class="template-cont">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
    </header-switch>
    <filter-list :total="total" :total_before="'共'" :total_after="'个'">
    </filter-list>
    <scroll-view class="container" :data="data" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="container-sub" v-for="(item,index) in data" :key="index">
          <div class="base-cont">
            <div class="base-cont-val">
              {{item.case_id||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half">
            <div class="base-cont-title">
              涉案金额（元）
            </div>
            <div class="base-cont-val">
              {{item.sum_money||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half line-left">
            <div class="base-cont-title">
              发布日期
            </div>
            <div class="base-cont-val">
              {{item.publish_date||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half">
            <div class="base-cont-title">
              被执行人履行情况
            </div>
            <div class="base-cont-val">
              {{item.performance||'未公示'}}
            </div>
          </div>
        </div>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>

  </div>
</template>

<script>
import headerSwitch from '@/components/headerSwitch.vue'
import filterList from '@/components/filterList.vue'
import customerSrv from '@/api/customerSrv'

import BScroll from 'better-scroll'

export default {
  data() {
    return {
      scrollSize: 5,
      scrollOffset: 0,
      title: '失信信息',
      loading: false,
      total: 0,
      data: [],
      hasmore: false,
      getMoreText: ''
    }
  },
  mounted() {
    this.getDishonestList()
  },
  methods: {
    getDishonestList(loadMore = false) {
      if(!loadMore){
        this.loading = true
      }
      let postParams = {
        keyword: this.$route.query.company,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        size: this.scrollSize
      }
      customerSrv.companyDishonest(postParams).then(res => {
        this.total = res.data.total
        if (loadMore) {
          this.data = this.data.concat(res.data.results)
        }
        else {
          this.data = res.data.results
        }
        this.loading = false
      }).catch(err => {
        this.loading = false;
      })
    },
    onPullingUp() {
      if(this.scrollSize * (this.scrollOffset+1) >= this.total){
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getDishonestList(true)
    }
  },
  components: {
    headerSwitch,
    filterList
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: calc(100% - 80px);
  overflow: hidden;
}
.container-sub {
  margin-bottom: 10px;
  background: #fff;
  padding: 0 16px;
  text-align: left;
  .base-cont {
    padding: 16px 0;
    font-size: 14px;
    .base-cont-title {
      margin-bottom: 6px;
      color: #999;
    }
    .base-cont-val {
      color: #333;
      word-break: break-all;
    }
  }
  .base-cont-half {
    display: inline-block;
    width: 46%;
  }
  .line-left {
    border-left: 1px solid #e3e3e3;/*no*/
    padding-left: 16px;
    width: calc(48% - 16px);
  }
}
</style>
