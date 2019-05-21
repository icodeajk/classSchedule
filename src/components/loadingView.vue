<template>
    <div class="mask" v-if="isonline && showLoading">
        <mt-spinner color="#D24545" type="fading-circle" :size="60"></mt-spinner>
    </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  props: {
    showLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isonline: localStorage.getItem('isonline') ? JSON.parse(localStorage.getItem('isonline')) : true
    }
  },
  watch: {
    // // 超时设置
    // showLoading: {
    //   handler: function(val) {
    //     if (val && !this.isonline && window.navigator.onLine === false) {
    //       Toast({
    //         message:'网络链接不可用',
    //         iconClass: 'icon icon-error',
    //         duration:1000
    //       })
    //     }
    //   }
    // }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 处理网络故障
    init() {
      this.isonline = localStorage.getItem('isonline') ? JSON.parse(localStorage.getItem('isonline')) : true
      window.addEventListener('online',  function(){
        Toast({
          message:'网络重新连接，请刷新',
          iconClass: 'icon icon-error',
          duration:1000
        })
        this.isonline = true
        localStorage.setItem('isonline', JSON.stringify(this.isonline))
      });
      window.addEventListener('offline', function(){
        Toast({
          message:'网络链接不可用',
          iconClass: 'icon icon-error',
          duration:1000
        })
        this.isonline = false
        localStorage.setItem('isonline', JSON.stringify(this.isonline))
      });
    }
  }
}
</script>

<style  lang="less">
.mask {
  position: absolute;
  z-index: 9999;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.mint-spinner-fading-circle-circle{
  width:60px;
  height:60px
}
</style>
