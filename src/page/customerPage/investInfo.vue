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
        <div class="container-sub" v-for="(item,index) in data" :key="index" @click='jumpRouter(item)'>
          <div class="baseInfo-cont">
            <div class="baseInfo-left">
              <img src="../../assets/company-logo.png" alt="" >
            </div>
            <div class="baseInfo-right">
              <div class="baseInfo-right-title" :class='item.isLink?"link":""'>
                {{item.name||'未公示'}}
              </div>
              <div class="baseInfo-right-desc">
                <p>{{item.address||'未公示'}}</p>
              </div>
            </div>
            <div class="baseInfo-bottom">
              <div class="baseInfo-bottom-list">
                <div class="baseInfo-list-div">
                  <div class="baseInfo-list-title">法定代表人</div>
                  <div class="baseInfo-list-text">{{item.legal_man}}</div>
                </div>
                <div class="baseInfo-list-div">
                  <div class="baseInfo-list-title">注册资本</div>
                  <div class="baseInfo-list-text">
                    {{(item.registered_capital ? item.registered_capital : item.capital) | formatMoney}}<span v-if="item.registered_capital && Number(item.registered_capital) !== 0">万{{item.registered_capital_unit  ? item.registered_capital_unit : '元'}}</span>
                  </div>
                </div>
                <div class="baseInfo-list-div">
                  <div class="baseInfo-list-title">成立时间</div>
                  <div class="baseInfo-list-text">{{item.ctime|dateFormat}}</div>
                </div>
              <!-- </div> -->
              <!-- <div class="baseInfo-bottom-list"> -->
                <div class="baseInfo-list-div">
                  <div class="baseInfo-list-title">投资金额</div>
                  <div class="baseInfo-list-text"> {{item.invest_amount|formatMoney}}<span v-if="item.invest_amount && Number(item.invest_amount) !== 0">万{{item.invest_amount_unit ? item.invest_amount_unit : '元'}}</span></div>
                </div>
                <div class="baseInfo-list-div">
                  <div class="baseInfo-list-title">对外投资占比</div>
                  <div class="baseInfo-list-text">{{item.percentage||'未公示'}}</div>
                </div>
              </div>
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

export default {
  data() {
    return {
      title: '对外投资',
      scrollSize: 5,
      scrollOffset: 0,
      total: 0,
      loading: false,
      data: [],
      hasmore: false,
      getMoreText: ''
    }
  },
  mounted() {
    this.getInvestList()
  },
  methods: {
     jumpRouter(item) {

       if(item.isLink){
          this.$router.push({path:'/customerDetail',query:{company:item.name}})
       }

    },
    getInvestList(loadMore = false) {
      if(!loadMore){
        this.loading = true
      }
      let postParams = {
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        keyword: this.$route.query.company,
        size: this.scrollSize
      }
      customerSrv.companyInvest(postParams).then(res => {
        this.total = res.data.total
        if (loadMore) {
          this.data = this.data.concat(this.filterInvest(res.data.results))
        }else{
          this.data = this.filterInvest(res.data.results)
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
      this.getInvestList(true)
    },
    filterInvest(graphData) {
      let result = []
      let edges = graphData.edges || []
      let vertexes = graphData.vertexes || []
      for (let i_v = 1; i_v < vertexes.length; i_v++) {
        let vertex = vertexes[i_v]
        for (let i_e = 0; i_e < edges.length; i_e++) {
          let edge = edges[i_e]
          if (edge._to.indexOf(vertex._key) !== -1) {
            let item={
              name: vertex.name,
              address: vertex.address,
              legal_man: vertex.legal_man,
              capital: vertex.capital,
              ctime: vertex.ctime,
              invest_amount: edge.invest_amount,
              percentage: edge.percentage
            }
            if(vertex.name.length>3 && vertex.name.indexOf('公司')!=-1){
              item.isLink=true
            }else{item.isLink=false}
            result.push(item)

            break
          }
        }
      }
      return result
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
  height: calc(100% - 80px);
  overflow: hidden;
  position:relative
}
.container-sub {
  margin-bottom: 10px;
  background: #fff;
  padding: 0 16px;
  text-align: left;
  .baseInfo-cont {
    padding: 16px;
    background: #fff;
    font-size: 0;
    .baseInfo-left {
      display: inline-block;
      width: 80px;
      height: 80px;
      vertical-align: top;
      line-height: 80px;
      border: 1px solid #F7F7F7;/*no*/
      text-align: center;
      box-sizing: border-box;
      overflow: hidden;
      img{
        vertical-align: middle;
        width:55px
      }
    }
    .baseInfo-right {
      display: inline-block;
      height: 80px;
      max-width: calc(100% - 80px);
      padding-left: 12px;
      text-align: left;
      box-sizing: border-box;
      .baseInfo-right-title {
        line-height: 20px;
        height: 20px;
        font-size: 16px;
        color:#333;
        > img {
          float: right;
        }
      }
      .link{
        color:#d24545
      }
      .baseInfo-right-desc {
        font-size: 14px;
        color: #999;
        margin-top: 20px;
        line-height: 20px;
      }
    }
    .baseInfo-bottom {
      margin-top: 10px;
      .baseInfo-bottom-list {
        box-sizing: border-box;
        // display:flex;
        height: 72px;
        vertical-align: middle;


        .baseInfo-list-div {
          text-align: center;
          vertical-align: top;
          display: inline-block;
          box-sizing: border-box;
          width: 20%;
          padding: 4px;
          height: 100%;
          font-size: 12px;
          .baseInfo-list-title {
            // white-space: nowrap;
            word-break: break-all;
            min-height: 24px;
            color: #999;
          }
          .baseInfo-list-text {
            color: #333;
            margin-top: 12px;
            font-size: 12px;


          }
        }
      }
    }
  }
}
</style>
