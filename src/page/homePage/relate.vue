<template>
  <div class="container">

    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>
    </div>
    <div class="search-body">
      <hz-cell
        title="起点企业"
        type="input"
        placeholder="请输入起点企业名称"
        class="inner-padding"
      ></hz-cell>
      <hz-cell
        title="终点企业"
        type="input"
        placeholder="请输入终点企业名称"
        class="inner-padding"
      ></hz-cell>
      <hz-cell
        title="查找范围"
        value="层内关联"
        type="input"
        placeholder="请输入数字"
        class="inner-padding"
      ></hz-cell>
      <div class="btn search-btn" @click="search">搜索</div>
      <div class="btn reset-btn" @click="reset">重置</div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import {SAVE_CURRENT,CHANGESCROLLTOFLAG} from '@/store/mutation-types'
import businessSrv from '@/api/businessSrv'
import customerSrv from '@/api/customerSrv'

import headerSwitch from '@/components/headerSwitch.vue'
import hzCell from '@/components/hz/Cell.vue'

export default {
  data() {
    return {
      title: '找关系',
      loading: false,
    }
  },
  mounted() {
  },
  methods: {
  },
  components: {
    headerSwitch,
    hzCell,
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
  height: calc(100% - 70px);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 124px);
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
