<template>
  <div class="template-cont">
    <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
    </header-switch>

    <div class="navbar">
      <div class="navbar-nav" :class="navActive ? 'active' : ''" @click="navActive = true">上游企业</div>
      <div class="navbar-nav" :class="navActive ? '' : 'active'" @click="navActive = false">下游企业</div>
    </div>

    <filter-list :total="total" :total_before="'共'" :total_after="'个'">
    </filter-list>

    <scroll-view class="container" :data="data" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="card-container" v-for="(item,index) in data" :key="index">
          <ul class="list-ul">
            <li class="list-li">
              <div class="list-left">
                <img src="../../assets/company-logo.png" width="40" height="40" alt="" class="list-logo">
              </div>
              <div class="list-right">
                <div class="list-cont">
                  <div class="company">{{item.company||'未公示'}}</div>
                  <span class="name afterLine">{{item.legal_man||'未公示'}}</span>
                  <span class="money afterLine">{{item.registered_capital|formatMoney}}万元</span>
                  <span class="time" v-if="item.registered_date">{{item.registered_date | dateFormat}}</span>
                </div>
                <div class="list-cont">
                  <span class="list-label list-label-green" v-if="item.business_status">{{item.business_status}}</span>
                  <span class="list-label list-label-blue" v-if="item.stock">{{item.stock}}</span>
                </div>
              </div>
            </li>
          </ul>
          <div class="progress-cont">
            <div class="progress-label">
              置信度：
            </div>
            <div class="progress-component">
              <my-progress :value="item.confidence" :bar-height="18"></my-progress>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import headerSwitch from '@/components/headerSwitch.vue'
import filterList from '@/components/filterList.vue'
import searchList from '@/components/searchList.vue'
import myProgress from '@/components/progress.vue'

import customerSrv from '@/api/customerSrv'

export default {
  data() {
    return {
      title: '上下游企业',
      scrollSize: 5,
      scrollOffset: 0,
      getMoreText: '',
      total: 0,
      navActive: true,
      data: []
    }
  },
  mounted() {
    this.getUpDownList()
  },
  computed: {
    type() {
      return this.navActive ? 'IN' : 'OUT'
    }
  },
  watch: {
    navActive() {
      this.scrollOffset = 0
      this.data = []
      this.getUpDownList()
    }
  },
  methods: {
    getUpDownList(loadMore = false) {
      let keyword = this.$route.query.company
      let postData = {
        keyword: keyword,
        direction: this.type
      }
      customerSrv.companyUpDownStream(postData).then(res => {
        this.total = res.data.total
        if (loadMore) {
          this.data = this.data.concat(this.filterUpDown(res.data.results))
        } else {
          this.data = this.filterUpDown(res.data.results)
        }
      })
    },

    onPullingUp() {
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getUpDownList(true)
    },
    filterUpDown(graphData) {
      let result = []
      let edges = graphData.edges || []
      let vertexes = graphData.vertexes || []
      for (let i_e = 0; i_e < edges.length; i_e++) {
        let edge = edges[i_e]
        for (let i_v = 0; i_v < vertexes.length; i_v++) {
          let vertex = vertexes[i_v]
          if (
            (this.type == 'IN' && edge._from.indexOf(vertex._id) !== -1) ||
            (this.type == 'OUT' && edge._to.indexOf(vertex._id) !== -1)
          ) {
            result.push({
              company: vertex.name,
              legal_man: vertex.legal_man,
              registered_capital: vertex.registered_capital,
              registered_date: vertex.registered_date,
              stock: vertex.stock,
              business_status: vertex.business_status,
              confidence: Number(new Number(edge.confidence*100).toFixed(2))
            })
            break
          }
        }
      }
      return result
    }
  },
  components: {
    filterList,
    headerSwitch,
    searchList,
    myProgress
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: calc(100% - 80px);
  overflow: hidden;
}
.navbar {
  position: relative;
  font-size: 0;
  .navbar-nav {
    position: relative;
    height: 48px;
    line-height: 48px;
    display: inline-block;
    width: 50%;
    font-size: 16px;
    background: #fff;
    &.active {
      color: #d24545;
    }
    &.active:after {
      position: absolute;
      content: '';
      border-bottom: 2px solid #d24545;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
    }
  }
}

.card-container {
  padding-left: 16px;
  margin-bottom: 10px;
  background: #fff;
  .list-ul {
    .list-li {
      display: block;
      box-sizing: border-box;
      height: 106px;
      padding: 16px 0px;
      text-align: left;
      font-size: 12px;
      border-bottom: 1px solid #e3e3e3;/*no*/
      &:last-child {
        border-bottom: none;
      }
      .list-left {
        display: inline-block;
        float: left;
        height: 100%;
        width: 54px;
        vertical-align: middle;
        text-align: left;
      }
      .list-right {
        display: inline-block;
        width: calc(100% - 54px);
        font-size: 14px;
        color: #bdbdbd;
        .list-cont {
          padding-bottom: 10px;
          .company {
            line-height: 30px;
            font-size: 16px;
            color: #333;
          }
          .list-label {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            padding: 0 6px;
            margin-right: 6px;
            font-size: 12px;
            border-radius: 5px;
          }
          .list-label-green {
            color: #97ca6a;
            background: #eaf4e1;
            border: 1px solid #97ca6a;/*no*/
          }
          .list-label-blue {
            color: #60a0f0;
            background: #dfecfc;
            border: 1px solid #60a0f0;/*no*/
          }
        }
      }
    }
  }
}

.progress-cont {
  margin-top: 10px;
  padding-bottom: 10px;
  font-size: 0px;
  .progress-label {
    display: inline-block;
    width: 20%;
    line-height: 30px;
    font-size: 14px;
    color: #999;
  }
  .progress-component {
    display: inline-block;
    width: 74%;
    vertical-align: top;
  }
}
</style>
