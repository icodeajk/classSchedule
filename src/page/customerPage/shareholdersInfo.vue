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
          <div class="base-cont" >
            <div class="base-cont-val" @click='jumpRouter(item)' >
              <div class="nameColor" :class=" (item.shareholder_name.indexOf('公司') >= 2) ? 'link' : '' ">
                 {{item.shareholder_name||'未公示'}}
              </div>

            </div>
          </div>
          <div class="base-cont base-cont-half">
            <div class="base-cont-title">
              认缴持股比例
            </div>
            <div class="base-cont-val">
              {{item.shareholding_ratio ? (item.shareholding_ratio === '——' ? '未公示' : item.shareholding_ratio) : '未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half line-left">
            <div class="base-cont-title">
              股东类型
            </div>
            <div class="base-cont-val">
              {{item.shareholder_type||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half">
            <div class="base-cont-title ">
              认缴额（万元）
            </div>
            <div class="base-cont-val">
              {{item.paied_amount| formatMoney}}
            </div>
          </div>
          <div class="base-cont base-cont-half line-left">
            <div class="base-cont-title ">
              实缴额（万元）
            </div>
            <div class="base-cont-val">
              {{item.invest_amount| formatMoney}}
            </div>
          </div>
        </div>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import filterList from '@/components/filterList.vue'
import headerSwitch from '@/components/headerSwitch.vue'
import customerSrv from '@/api/customerSrv'

import BScroll from 'better-scroll'

export default {
  data() {
    return {
      scrollSize: 5,
      scrollOffset: 0,
      getMoreText: '',
      title: '股东信息',
      loading: false,
      data:[],
      total: 0
    }
  },
  mounted() {
    this.getshareholder()
  },
  methods: {
    filterShareholder(graphData) {
      let result = []
      let edges = graphData.edges || []
      let vertexes = graphData.vertexes || []
      for (let i_v = 1; i_v < vertexes.length; i_v++) {
        let vertex = vertexes[i_v]
        for (let i_e = 0; i_e < edges.length; i_e++) {
          let edge = edges[i_e]
          if (edge._from.indexOf(vertex._key) !== -1) {
            let item={
              name: vertex.name,
              shareholder_type: edge.shareholder_type,
              percentage: edge.percentage,
              paied_amount: edge.paied_amount,
              invest_amount: edge.invest_amount
            }
            // if(item.name.length>3 && item.name.indexOf('公司')!=-1 && !item.shareholder_type.indexOf('自然人股东')!=-1){
            if(item.name.length>3 &&  !item.shareholder_type.indexOf('自然人股东')!=-1){

              item.isLink=true
            }else{
              item.isLink=false
            }
            result.push(item)
            break
          }
        }
      }
      return result
    },
    getshareholder(loadMore = false) {
      if(!loadMore){ this.loading = true}
      let queryParams = {
      offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
      name: this.$route.query.company,
      type: 'profile_info',
      sub_type: 'associated_info',
      third_type: 'contributor_invest_office',
      count: 5,
      only_count: 0
      }
      customerSrv.companyShareholder(queryParams).then(res => {
        this.total = res.data.associated_info.contributor_invest_office.total_count
        if (loadMore) {
          this.data = this.data.concat(res.data.associated_info.contributor_invest_office.data)
        }
        else {
          this.data = res.data.associated_info.contributor_invest_office.data
        }
        this.loading = false
      }).catch(err => {
        this.loading = false;
      })
    },
    onPullingUp(){
      if(this.scrollSize * (this.scrollOffset + 1) >= this.total){
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getshareholder(true)
    },
    jumpRouter(item){
      if(item.shareholder_name.indexOf('公司') >= 2){
        let company=item.shareholder_name
        this.$router.push({ path: '/customerDetail', query: { company: company } })
      }
    }
  },
  components: {
    filterList,
    headerSwitch
  }
}
</script>

<style scoped lang="less">
.container {
  height: calc(100% - 80px);
  overflow: hidden;
  position:relative;
}
.container-sub {
  margin-bottom: 10px;
  background: #fff;
  padding: 0 16px 6px;
  text-align: left;
  .link{color:#d24545}
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
      :link{
        color:#d24545
      }
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
