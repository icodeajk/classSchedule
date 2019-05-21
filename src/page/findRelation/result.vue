<template>
  <div class="container">
    <div class="title">
      <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
      </header-switch>
    </div>
    <svg ref="graph" id="graph"></svg>

  </div>
</template>

<script>
import Force from '@/components/d3.force/d3.force'
import headerSwitch from '@/components/headerSwitch.vue'
import '@/components/d3.force/d3.force.less'

export default {
  data() {
    return {
      title: '找关系',
      loading: false,
    }
  },
  mounted() {
    this.initGraph()
  },
  methods: {
    initGraph() {
      let relate = JSON.parse(localStorage.getItem('relate'))
      let relate01 = JSON.parse(localStorage.getItem('relate01'))
      let relate02 = JSON.parse(localStorage.getItem('relate02'))
      let temprelate = {}
      temprelate = relate
      if(relate === '') {
        relate01.vertexes.push(relate02.vertexes[0])
        temprelate = relate01
      }
      const force = new Force(document.querySelector('#graph'), {
        data: temprelate
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
.container {
  background: #eee;
  height: calc(100% - 76px);
  overflow: hidden;
  position:relative
}

.icon-img {
  display: inline-block;
  line-height: 40px;
  height: 16px;
  margin-right: 6px;
}

.mint-search{
  height: auto;
}
.container {
  position: relative;
  height: calc(100%);
  overflow: hidden;
  &.bigger {
    height: calc(100%);
  }
}
.search-body{
  padding-top: 10px;
  .inner-padding {
    margin-top: 0;
    border-top: 0.025rem solid #F0F2F3;
  }
  .btn {
    width: 85%;
    height: 45px;
    border-radius: 10px;
    margin: 0px auto;
    text-align: center;
    line-height: 40px;
  }
  .search-btn {
    position: relative;
    margin-top: 30px;
    background-color: #D24545;
    color: #fff;
  }
  .reset-btn {
    position: relative;
    margin-top: 20px;
    border: 1px solid #D1D1D1;/*no*/
    color: #767676;
  }
}
</style>
