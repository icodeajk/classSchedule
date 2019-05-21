<template>
    <div class="empty-page">
        <img :src="emptyImg" alt="" width="170" height="139">
        <div class="tip">
            <!-- <p>没有找到相关的结果</p> -->
            <!-- <p>请输入准确的关键字，重新搜索</p> -->
            <p>{{topMessage ? topMessage : '没有找到相关的结果'}}</p>
            <p>{{bottomMessage ? bottomMessage : '请输入准确的关键字，重新搜索'}}</p>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      emptyImg: require('assets/img/empty.png')
    }
  },
  props: {
    topMessage: {
      type: String,
      default: function() {
        return ''
      }
    },
    bottomMessage: {
      type: String,
      default: function() {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.empty-page {
    margin-top: 50px;
  .tip {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.35);
    line-height: 2;
  }
}
</style>
