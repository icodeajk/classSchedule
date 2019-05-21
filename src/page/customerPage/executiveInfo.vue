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
      <div class='flex'>
      <div class="label-cont" v-for="(item,index) in data" :key="index">
        <div class="label-cont-name">
          {{item.name}}
        </div>
        <div class="label-cont-val">
          {{item.job}}
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
import BScroll from 'better-scroll'

export default {
  data() {
    return {
      scrollSize: 20,
      scrollOffset: 0,
      getMoreText: '',
      loading: false,
      title: '核心高管',
      total: 0,
      data: [
      ]
    }
  },
  components: {
    filterList,
    headerSwitch
  },
  mounted() {
    this.getexecutivelist()
  },
  methods: {
    filterOfficer(graphData) {
      let result = graphData.data || []
      // let edges = graphData.edges || []
      // let vertexes = graphData.vertexes || []
      // for (let i_v = 1; i_v < vertexes.length; i_v++) {
      //   let vertex = vertexes[i_v]
      //   for (let i_e = 0; i_e < edges.length; i_e++) {
      //     let edge = edges[i_e]
      //     if (edge._from.indexOf(vertex._key) !== -1) {
      //       result.push({
      //         name: vertex.name,
      //         position: edge.position
      //       })
      //       break
      //     }
      //   }
      // }
       result.sort(function(val1,val2){
        var sortOrder = ['法定代表人','董事长','副董事长','总经理','副总经理','执行董事','董事','监事']
                var val1_job = val1.job
                var val2_job = val2.job
                if(val1.job.indexOf('兼')!==-1){
                    var val1Array = val1.job.split('兼')
                    val1_job = sortOrder.indexOf(val1Array[0]) < sortOrder.indexOf(val1Array[1]) ? val1Array[0] : val1Array[1]
                }
                if(val2.job.indexOf('兼')!==-1){
                    var val2Array = val2.job.split('兼')
                    val2_job = sortOrder.indexOf(val2Array[0]) < sortOrder.indexOf(val2Array[1]) ? val2Array[0] : val2Array[1]
                }
                var val1Order = sortOrder.indexOf(val1_job)!==-1 ? sortOrder.indexOf(val1_job):Number.MAX_VALUE
                var val2Order = sortOrder.indexOf(val2_job)!==-1 ? sortOrder.indexOf(val2_job):Number.MAX_VALUE
                return val1Order - val2Order
            })
      return result
    },
    getexecutivelist(loadMore = false) {
      if(!loadMore){
        this.loading = true
      }
      let postParams = {
      keyword: this.$route.query.company,
      offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
      size: this.scrollSize
      }
      customerSrv.companyOfficer(postParams).then(res => {
        this.total = res.data.total
        if (loadMore) {
          this.data = this.data.concat(this.filterOfficer(res.data.results))
        }else{
          this.data = this.filterOfficer(res.data.results)
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    },
    onPullingUp(){

    }
  }
}
</script>

<style scoped lang="less">
.container {
  height: calc(100% - 80px);
  overflow: hidden;
  padding: 0 16px;
  text-align: center;
  position:relative;
  .flex{
    display:flex;
    flex-wrap: wrap
  }
  .label-cont {
    // display: inline-block;
    box-sizing: border-box;
    width: calc(50% - 13px);
    padding: 12px 16px;
    margin-bottom: 10px;
    background: #fff;
    text-align: left;
    &:nth-child(n) {
      margin-right: 10px;
    }
    .label-cont-name {
      color: #333;
      font-size: 14px;
    }
    .label-cont-val {
      margin-top: 10px;
      color: #999;
      font-size: 12px;
    }
  }
}
</style>
