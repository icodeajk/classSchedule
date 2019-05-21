<template>
  <div class="template-cont">
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
            <div class="base-cont-title">
              担保方
            </div>
            <div class="base-cont-val" :class="item.srcLink?'color-red':''"  @click='jumpRouter(item,true)'>
              {{item.srcName||'未公示'}}
            </div>
          </div>
          <div class="base-cont">
            <div class="base-cont-title">
              被担保方
            </div>
            <div class="base-cont-val" :class="item.srcLink?'color-red':''"  @click='jumpRouter(item,false)'>
              {{item.dstName||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half">
            <div class="base-cont-title">
              担保类型
            </div>
            <div class="base-cont-val">
              {{item.type||'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half line-left">
            <div class="base-cont-title">
              担保金额
            </div>
            <div class="base-cont-val">
              ￥{{item.money|formatMoney(2,1)}}
            </div>
          </div>
          <div class="base-cont base-cont-half">
            <div class="base-cont-title">
              担保起始日期
            </div>
            <div class="base-cont-val" v-if='item.start_date'>
              {{item.start_date|dateFormat}}
            </div>
            <div class="base-cont-val" v-else>
              {{'未公示'}}
            </div>
          </div>
          <div class="base-cont base-cont-half line-left">
            <div class="base-cont-title">
              担保终止日期
            </div>
            <div class="base-cont-val" v-if='item.end_date'>
              {{item.end_date|dateFormat}}
            </div>
            <div v-else>
              {{'未公示'}}
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
      title: '关联担保',
      scrollSize: 5,
      scrollOffset: 0,
      total: 0,
      data: [],
      filterListShow: false,
      filterListArr: [
        {
          name: '全部',
          key: 'ALL'
        },
        {
          name: '担保记录',
          key: 'OUT'
        },
        {
          name: '被担保记录',
          key: 'IN'
        }
      ],
      filterListActive: {
        name: '全部',
        key: 'ALL'
      }
    }
  },
  mounted() {
    this.getGuaranteeList()
  },
  watch: {
    filterListActive: {
      handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollOffset = 0
        this.getGuaranteeList()
      }
    }
  },
  methods: {
    jumpRouter(item,flag){

      if(flag && item.srcName){
          this.$router.push({path:'/customerDetail',query:{company:item.srcName}})
      }else if(item.dstName){

        this.$router.push({path:'/customerDetail',query:{company:item.dstName}})
      }
    },
    getGuaranteeList(loadMore = false) {
      let postParams = {
        keyword: this.$route.query.company,
        direction: this.filterListActive.key,
        size:5,
        offset:loadMore?this.scrollSize* ++this.scrollOffset:0
      }

      customerSrv.companyGuarantee(postParams).then(res => {
        this.total = res.data.total
        if (loadMore) {
          this.data = this.data.concat(this.filterGuarantee(res.data.results))
        } else {
          this.data = this.filterGuarantee(res.data.results)

        }
      })
    },
    onPullingUp() {

      if(this.scrollSize * (this.scrollOffset+1) >= this.total){
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getGuaranteeList(true)
    },
    filterGuarantee(graphData) {
      let result = []
      let edges = graphData.edges || []
      let vertexes = graphData.vertexes || []
      for (let i_e = 0; i_e < edges.length; i_e++) {
        let edge = edges[i_e]
        let combineObj = {}
        for (let i_v = 0; i_v < vertexes.length; i_v++) {
          let vertex = vertexes[i_v]
          if (edge._from.indexOf(vertex._id) !== -1) {
            combineObj = { srcName: vertex.name, ...combineObj }
          }
          if (edge._to.indexOf(vertex._id) !== -1) {
            combineObj = { dstName: vertex.name, ...combineObj }
          }
        }
        let item={
          type: edge.type,
          start_date: edge.begin_date,
          end_date: edge.end_date,
          money: edge.value,
          srcLink:false,
          dstLink:false,
          ...combineObj
        };

        if(item.srcName && item.srcName.indexOf('公司')!=-1 && item.srcName.length>3){
          item.srcLink=true
        }
        if(item.dstName && item.dstName.indexOf('公司')!=-1 && item.dstName.length>3){
          item.dstLink=true
        }
        result.push(item)
      }
      return result
    },
    changActive(item) {
      //筛选项
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
