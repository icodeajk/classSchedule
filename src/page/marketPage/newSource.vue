<template>
    <div class="template-cont">
      <div class="title">
        <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
        </header-switch>
      </div>
      <div class="container-sub">
        <iframe src="http://www.baidu.com" frameborder="0"></iframe>
      </div>
    </div>
</template>

<script>
  import headerSwitch from '@/components/headerSwitch.vue'

  export default {
    data () {
      return {
        title: '这是新闻舆论'
      }
    },
    components:{
      headerSwitch,
    }
  }
</script>

<style scoped lang="less">
  .container-sub{
    width: 100%;
    height: 100%;
  }
  iframe{
    height: calc(100% - 30px);
    width: 100%;
  }
</style>
