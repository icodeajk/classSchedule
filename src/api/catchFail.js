import Vue from 'vue'
import store from '../store'
import { Toast } from 'mint-ui'

export default function (data) {
  const { status } = data
  const { code, msg } = data.data
  if (status === 802) {
    // window.location.href = '/#/error'
    this.$router.push({
      name: 'error'
    })
  } else if (status === 403) {
    Toast({
      message: '登录失效，请重新登录',
      iconClass: 'icon icon-error',
      duration: 1000
    })
  } else if (status === 504) {
    Toast({
      message: '加载超时',
      iconClass: 'icon icon-error',
      duration: 1000
    })
  } else if (msg) {
    Toast({
      message: msg,
      iconClass: 'icon icon-error',
      duration: 1000
    })
  } else {
    Toast({
      message: '服务器出错',
      iconClass: 'icon icon-error',
      duration: 1000
    })
  }
}
