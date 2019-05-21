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
        <div class="container-sub" v-for="(item,index) in  data" :key="index">
          <div class="base-cont">
            <div class="base-cont-title">
              一致行动人
            </div>
            <div class="base-cont-val"  :class='item.person.name ? "color-red":""' @click='routerJump(item.person.name)'>
              {{item.person.name}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              一致行动对象
            </div>
            <div class="base-cont-val" :class='(item.target.name&&item.target.name!=="all") ?"color-red":""' @click='routerJump(item.target.name)'>
              {{item.target.name ==='all' ? '全部企业' : item.target.name}}
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

export default {
  data() {
    return {
      title: '一致行动人',
      scrollSize: 5,
      scrollOffset: 0,
      getMoreText: '',
      loading: false,
      total: 0,
      data: []
    }
  },
  mounted() {
    this.getConcertList()
  },
  methods: {
    getConcertList(loadMore = false) {
      if(!loadMore){
        this.loading = true
      }
      let postParams = {
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        size: this.scrollSize,
        name: this.$route.query.company,
        type: 'associated_relation',
        sub_type: 'concert',
        count: 5,
        only_count: 0
      }
      customerSrv.companyConcert(postParams).then(res => {
        this.total = res.data.concert.total_count
        if (loadMore) {
          this.data = this.data.concat(res.data.concert.data)
        }
        else {
          this.data = res.data.concert.data
        }
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
      if(this.scrollSize * (this.scrollOffset + 1) >= this.total){
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getConcertList(true)
    },
    filterConcert(graphData) {
      let result = []
      let edges = graphData.edges || []
      let vertexes = graphData.vertexes || []
      for (let i_v = 0; i_v < vertexes.length; i_v++) {
        let vertex = vertexes[i_v]
        for (let i_e = 0; i_e < edges.length; i_e++) {
          let edge = edges[i_e]
          if (edge._from.indexOf(vertex._key) !== -1) {
            // console.log(i)
            let target = ''
            if(''.toLowerCase.apply(edge.target) == 'all'){
              target = '全部企业'
            }
            else{
              target = edge.target.name
            }
            let item={target,name:vertex.name};
            if(item.target && item.target.length>4 && item.target.indexOf('公司')!=-1){
                 item.targetFlag=true
            }else{
              item.targetFlag=false
            }

             if(item.name && item.name.length>4 && item.name.indexOf('公司')!=-1){
                 item.nameFlag=true
            }else{
              item.nameFlag=false
            }
            result.push(item)

          }
        }
      }
      return result
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
  position: relative;
  height: calc(100% - 80px);
  overflow: hidden;
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
