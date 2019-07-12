<template>
  <div class="toggle-page" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    from: {
      type: String,
      default: ''
    }

    /* type is input-start */

    /* type is input-end */
  },
  data () {
    return {
      isShow: false
      // styles: {

      // },
    }
  },
  created () {
  },
  beforeMount () {
    // this.changeDirection()
  },
  mounted () {
  },
  computed: {
    styles () {
      let direction = this.isShow ? 0 : '-100%'
      let styles = {}
      if (['top', 'right', 'left'].indexOf(this.from) > -1) {
        styles[this.from] = direction
      } else { // bottom
        styles.top = this.isShow ? '0' : '100%'
      }
      return styles
    }
  },
  // watch: {
  //   options: {
  //     handler: function() {
  //       debugger
  //       this.changeDirection()
  //     },
  //     deep: true
  //   }
  // },
  beforeUpdate () {

  },
  methods: {
    toggle () {
      this.isShow = !this.isShow
    },
    changeDirection () {
      let direction = this.isShow ? 0 : '-100%'
      this.styles = {}
      if (['top', 'right', 'left'].indexOf(this.options.from) > -1) {
        this.styles[this.options.from] = direction
      } else { // bottom
        this.styles.top = this.isShow ? '0' : '100%'
      }
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
  .toggle-page {
    position: fixed;
    top: 0;
    z-index: 1000;
    background: #FFF;
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
</style>
