<template>
  <div class="container" id="container">
    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
      </header-switch>
    </div>
    <svg ref="graph" id="graph"></svg>
    <ul class="tag-desc-list">
      <!-- <li class="tag-desc-item">
        <i class="tag-bar tag-belong" data-key="belong"></i>
        行内客户
      </li>
      <li class="tag-desc-item">
        <i class="tag-bar tag-listed" data-key="listed"></i>
        上市公司
      </li>
      <li class="tag-desc-item">
        <i class="tag-bar tag-blacklist" data-key="blacklist"></i>
        黑名单
      </li>
      <li class="tag-desc-item">
        <i class="tag-bar tag-greylist" data-key="greylist"></i>
        灰名单
      </li> -->
      <li class="tag-desc-item">
        <i class="tag-bar tag-abnormal" data-key="abnormal"></i>
        异常经营状态
      </li>
      <!-- <li class="tag-desc-item" data-show-tab="structure">
        <i class="tag-bar tag-control-shareholder" data-key="control-shareholder"></i>
        控股股东
      </li>
      <li class="tag-desc-item" data-show-tab="structure">
        <i class="tag-bar tag-actual-controller" data-key="actual-controller"></i>
        实际控制人
      </li> -->
    </ul>
  </div>
</template>

<script>
import Force from '@/components/d3.force/d3.force'
import headerSwitch from '@/components/headerSwitch.vue'
import graphService from '@/api/relationGraph'
import '@/components/d3.force/d3.force.less'
export default {
  data() {
    return {
      title: '企业概览',
      loading: false,
      isGraphPage: true,
      name: this.$route.query.name
    }
  },

  mounted() {
    this.loading = true
    graphService.getOverviewRelation({name: this.name}).then(res => {
      this.loading = false
      let treeGraphData = res.data
      this.initGraph(treeGraphData)
    }).catch(err => {
      this.loading = false;
    })
  },
  methods: {
    initGraph(treeGraphData) {
      // const tree = new TreeGraph(this.$refs.graph, {
      //   data: treeGraphData
      // })
      // tree.init()
      const force = new Force(this.$refs.graph, {
        data: treeGraphData
      })
      force.init()
    }
  },
  components: {
    headerSwitch
  }
}
</script>

<style scoped lang="less">
  #app {
    padding-bottom: 0;
    background: #fff;
  }
  .container {
    position:relative;
    background: #eee;
    height: 100%;
    overflow: hidden;

    .tag-desc-list {
      position: fixed;
      padding: 10px;
      bottom: 10px;
      right: 10px;
      font-size: 12px;
      text-align: left;
      color: #BDBDBD;
      .tag-bar {
          display: inline-block;
          width: 10px;
          height: 10px;
      }
      .tag-desc-item {
        line-height: 1.2;
      }
      .tag-belong {
          background: #98CB6A;
      }
      .tag-listed {
          background: #5f8def;
      }
      .tag-blacklist {
          background: #000;
      }
      .tag-greylist {
          background: #bdbdbd;
      }
      .tag-abnormal {
          background: #f00;
      }
      .tag-control-shareholder {
          background: #A66EB2;
      }
      .tag-actual-controller {
          background: #FF9647;
      }
    }

    #container { display:block; }
    @media only screen and (orientation:portrait){
      #container {
        height: 100vw;
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg);
      }
    }
    @media only screen and (orientation:landscape){
      #container {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
      }
    }
  }
</style>
