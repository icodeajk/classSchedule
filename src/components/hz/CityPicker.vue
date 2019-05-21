<template>
  <input type="text" id='city-picker'/>
</template>
<script type="text/javascript" src="//g.alicdn.com/msui/sm/0.6.2/js/sm-city-picker.min.js" charset="utf-8"></script>
<script>
import $ from 'zepto'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'normal'
    },
    value: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'expand'
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    config: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      toastInstance: null
    }
  },
  methods: {
    toggleStatus () {
      this._isExpand = !this._isExpand
      this.$forceUpdate()
    }

  },

  components: {

  },
  mounted() {
    $(this.$el).cityPicker({
      toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">确定</button>\
      <h1 class="title">选择收货地址</h1>\
      </header>'
    })
  }
}
</script>

<style scoped lang="less">

</style>
