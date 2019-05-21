<template>
  <div class="error-page">
    <header-switch title="内测阶段">
      <a slot="left">
        <mt-button icon="back" @click="backToOa"></mt-button>
      </a>
    </header-switch>
    <scroll-view class="container">
      <div>
        <div style="margin-top: 60px; text-aligin: center;">暂时未开放</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>

import headerSwitch from '../components/headerSwitch.vue'

export default {
  methods: {
    backToOa () {
      let oaUrl = 'javascript:;'
      if (window.project_config && window.project_config.oaUrl) {
        oaUrl = window.project_config.oaUrl
      }
      window.location.href = oaUrl
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
  height: calc(100% - 40px);
  overflow: hidden;
}
.error-page {
  height: 100%;
  width: 100%;
  z-index: 999;
  position: fixed;
}
</style>
