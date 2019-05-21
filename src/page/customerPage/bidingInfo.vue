<template>
  <div class="template-cont">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
    </header-switch>

    <filter-list :total="total" :total_before="'共'" :total_after="'个'" :actions="filterListArr" :activeSelect="filterListActive" @changeActive="changActive($event)">
    </filter-list>

    <scroll-view class="container" :data="data" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="container-sub" v-for="(item,index) in data" :key="index">
          <div class="base-cont">
            <div class="base-cont-val">
              {{item.title||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half">
            <div class="base-cont-title">
              项目分类
            </div>
            <div class="base-cont-val">
              {{item.type||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half line-left">
            <div class="base-cont-title">
              所属城市
            </div>
            <div class="base-cont-val">
              {{item.city||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half" >
            <div class="base-cont-title"  >
             {{item.type=='中标'?'招':'中'}}标公司
            </div>
            <div class="base-cont-val" :class='(item.company&&item.company.length>3) ? "color-red":""' @click='routerJump(item.company)'>
              {{item.company || '未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half line-left">
            <div class="base-cont-title">
              发布日期
            </div>
            <div class="base-cont-val">
              {{item.time||'未公示'}}
            </div>
          </div>

        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import filterList from '@/components/filterList.vue'
import headerSwitch from '@/components/headerSwitch.vue'

import customerSrv from '@/api/customerSrv'

export default {
  data() {
    return {
      title: '招中标信息',
      scrollSize: 5,
      scrollOffset: 0,
      loading: false,
      total: 0,
      data: [],
      filterListArr: [
        {
          name: '全部',
          key: 'ALL'
        },
        {
          name: '招标',
          key: 'IN'
        },
        {
          name: '中标',
          key: 'OUT'
        }
      ],
      filterListActive: {
        name: '全部',
        key: 'ALL'
      }
    }
  },
  mounted() {
    this.getBidList()
  },
  watch: {
    filterListActive: {
      handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollOffset = 0
        this.getBidList()
      }
    }
  },
  methods: {
    getBidList(loadMore=false) {
      if(!loadMore){ this.loading = true}
      let postParams = {
        keyword: this.$route.query.company,
        direction: this.filterListActive.key,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        size: this.scrollSize,
        count: this.scrollSize
      }
      customerSrv.companyBid(postParams).then(res => {
        if(loadMore){
          this.data = this.data.concat(this.filterBid(res.data.results))
          // this.data=
        }
        else{
          this.data = this.filterBid(res.data.results)
          // this.data=res.data.results;
          // let index= this.filterBid(res.data.results)
        }
        this.total = res.data.total
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    routerJump(item){
      if(item && item.length>3){
      this.$router.push({path:'/customerDetail',query:{company:item}})
      }
    },
    onPullingUp() {
      if(this.scrollSize * (this.scrollOffset+1) >= this.total){
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getBidList(true)
    },
    filterBid(graphData) {
      // let result = []
      // let edges = graphData.edges || []
      // let vertexes = graphData.vertexes || []
      // for (let i_v = 1; i_v < vertexes.length; i_v++) {
      //   let vertex = vertexes[i_v]
      //   for (let i_e = 0; i_e < edges.length; i_e++) {
      //     let edge = edges[i_e]
      //     if (
      //       edge._to.indexOf(vertex._key) !== -1 ||
      //       edge._from.indexOf(vertex._key) !== -1
      //     ) {
      //       result.push({
      //         title: edge.title,
      //         type: edge.type,
      //         city: vertex.city,
      //         company: vertex.name,
      //         time: edge.publish_time
      //       })
      //       break
      //     }
      //   }
      // }
      let result=[];
      for(let i=0;i<graphData.length;i++){
        let item={
          title:graphData[i].title,
          type:graphData[i].public_bid_company ? (!graphData[i].public_bid_company[0]?'中标':(graphData[i].public_bid_company[0].indexOf(this.$route.query.company)==-1?'中标':'招标')) : '',
          city:graphData[i].city,
          time:graphData[i].publish_time
        }
        item.company='';
        if(item.type=='中标'){
          item.company=graphData[i].public_bid_company[0]

        }else{
          // console.log(graphData[i])
          // if(graphData[i].win_bid_company.length>=1){
        //     let win_companys=graphData[i].win_bid_company
        //     for(let j=0;j<win_companys.length;i++){
        //       item.company+=win_companys
        //       if(j!=win_companys.length-1){
        //         item.company+='\n'
        //       }
        //     }
        //  }else{
        //    item.company=graphData[i].candicate_win_bid_company[0];
        //  }
            // if(graphData[i].candicate_win_bid_company.length!==0){
            //     item.company=graphData[i].candicate_win_bid_company[0]
            // }
            // else if(graphData[i].win_bid_company.length!==0){
            //     item.company=graphData[i].win_bid_company[0]
            // }
          // console.log(graphData[i].win_bid_company)

          if(graphData[i].candicate_win_bid_company && graphData[i].candicate_win_bid_company.length==1){
              item.company=graphData[i].candicate_win_bid_company[0]

          }else if(graphData[i].win_bid_company && graphData[i].win_bid_company.length>=1){
            item.company= graphData[i].win_bid_company[0]
          }
        }
          result.push(item)

      }

      return result
    },
    changActive(item) {
      //筛选项
      // console.log(item)
      this.filterListActive = item
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
  position:relative
}
.container-sub {
  margin-bottom: 10px;
  background: #fff;
  padding: 0 16px 6px;
  text-align: left;
  .base-cont {
    padding: 16px 0 10px;
    font-size: 14px;
    .base-cont-title {
      margin-bottom: 6px;
      color: #999;
    }
    .base-cont-val {
      color: #333;
      word-break: break-all;

    }
    .color-red {
      color: #d24545;
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
