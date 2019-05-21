<template>
  <div class="hz-full-page">
    <div class="main-page">
      <slot name="main"></slot>
    </div>
    <!-- <div class="sub-page-list" :class="{'show': isShow,
    'from-top': options.from === 'top' ? true : false,
    'from-left': options.from === 'left' ? true : false,
    'from-right': options.from === 'right' ? true : false,
    'from-bottom': options.from === 'bottom' ? true : false}">
      <div :class="{'sub-page': true, 'active': true}">
        <slot name="sub"></slot>
      </div>
    </div> -->
    <div class="sub-page-list" :class="{'show': isShow}"  :style="styles">
      <div :class="{'sub-page': true, 'active': true}">
        <slot name="sub"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    },
    /* type is input-start */

    /* type is input-end */
  },
  data() {
    return {
      isShow: false,
      styles: {

      }
    }
  },
  created() {
  },
  beforeMount() {
    this.changeDirection()
  },
  mounted() {
  },
  beforeUpdate() {
    this.changeDirection()
  },
  methods: {
    show() {
      this.isShow = true
    },
    toggle() {
      this.isShow = !this.isShow
    },
    changeDirection() {
      let direction = this.isShow ? 0 : '-100%'
      if (['top', 'right', 'left'].indexOf(this.options.from) > -1) {
        this.styles[this.options.from] = direction
      } else { // bottom
        this.styles.top = direction
      }
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
  .hz-full-page {
    height: 100%;
    .main-page {
      height: 100%;
    }
    .sub-page-list {
      position: fixed;
      top: 0;
      z-index: 1000;
      width: 100%;
      height: 100%;

      &.show {
        right: 0;
      }
      &.from-top {
        top: -100%;
      }
      &.from-right {
        right: -100%;
      }
      &.from-bottom {
        bottom: -100%;
      }
      &.from-left {
        left: -100%;
      }
      transition: all 0.3s ease;
      transition-property: top, right, bottom, left;
      .sub-page {
        display: none;
        height: 100%;
        &.active {
          display: block;
        }
      }
    }
  }
</style>
