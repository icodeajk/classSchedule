<template>
  <div class="progress">
    <slot name="start"></slot>
    <div class="progress-content">
      <div class="progress-runway" :style="{ height: barHeight + 'px' }"></div>
      <div class="progress-progress" :style="{ width: value + '%', height: barHeight + 'px', lineHeight:  barHeight + 'px' }">{{value}}%</div>
    </div>
    <slot name="end"></slot>
  </div>
</template>

<style lang="less">
    .progress {
      position: relative;
      display: flex;
      height: 30px;
      line-height: 30px;

      & > * {
        display: flex;
        display: -webkit-box;
      }

      & *[slot="start"] {
        margin-right: 5px;
      }

      & *[slot="end"] {
        margin-left: 5px;
      }

      .progress-content {
        position: relative;
        flex: 1;
      }

      .progress-runway {
        position: absolute;
        transform: translate(0, -50%);
        top: 50%;
        left: 0;
        right: 0;
        background-color: #ebebeb;
        height: 3px;
        border-radius: 9999px;
      }

      .progress-progress {
        position: absolute;
        box-sizing: border-box;
        display: block;
        background-color: #d24545;
        top: 50%;
        transform: translate(0, -50%);
        width: 0;
        border-radius: 9999px;
        font-size: 12px;
        padding-right: 6px;
        color: #fff;
        text-align: right;
      }
    }
</style>

<script type="text/ecmascript-6">
  export default {
    name: 'myProgress',

    props: {
      value: Number,
      barHeight: {
        type: Number,
        default: 3
      }
    }
  };
</script>
