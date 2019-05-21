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
            <div class="base-cont-title">
              身份
            </div>
            <div class="base-cont-val" :data-company="item.litigant_role_dict[company]">
              {{item.litigant_role_dict[company][0]||'未公示'}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              案件名称
            </div>
            <div class="base-cont-val">
              {{item.case_name||'未公示'}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              案由
            </div>
            <div class="base-cont-val">
              {{item.case_cause||'未公示'}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              案件日期
            </div>
            <div class="base-cont-val">
              {{item.case_date||'未公示'}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              原告名单
            </div>
            <div class="base-cont-val" v-for="(v, i) in item.plaintiff_list" :key="i">
              {{v}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              被告名单
            </div>
            <div class="base-cont-val" v-for="(v, i) in item.defendant_list" :key="i">
              {{v}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              判决结果
            </div>
            <div class="base-cont-val">
              {{item.judge_content||'未公示'}}
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
      title: '裁判文书',
      loading: false,
      total: 0,
      data: [],
      hasmore: false,
      getMoreText: '',
      company: this.$route.query.name
    }
  },
  mounted() {
    this.getReferee()
  },
  methods: {
    getReferee(loadMore = false) {
      if(!loadMore){ this.loading = true}
      let postParams = {
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        size: this.scrollSize,
        name: this.$route.query.name,
        type: 'risk_info',
        sub_type: 'judgement_wenshu',
        count: 5,
        only_count: 0
      }
      customerSrv.companyReferee(postParams).then(res => {
        this.total = res.data.judgement_wenshu.total_count
        if (loadMore) {
          this.data = this.data.concat(res.data.judgement_wenshu.data)
        }else{
          this.data = res.data.judgement_wenshu.data
        }
        this.loading = false;
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
      this.getReferee(true)
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
      line-height: 30px;
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
