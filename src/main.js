import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import 'mint-ui/lib/style.css'
import Mint from 'mint-ui'
import { Indicator, Toast } from 'mint-ui';
import VueTouch from 'vue-touch'
import "./assets/lib/reset.css"
import "./assets/css/mintCss.less"
import "./assets/lib/iconfont.css"

import Filters from './filters.js'
import scrollView from '@/components/scrollView.vue'
import loadingView from '@/components/loadingView.vue'
import { debounce } from '@/utils/util.js'
import '../static/js/flexible'
import lodash from "lodash"
Vue.config.productionTip = false

// axios.defaults.withCredentials = true
// let AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4a2ZOR0VyMXVpTSIsImV4cCI6MTgyNTMzNDU3OSwidWlkIjowfQ.sUQOL1iGcBr3JhHtLkMxiBOv9su1JRxq1uK-BtXtd9k'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
// axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true

const UNIQUE_KEY_PROP = '__unique_key_prop__'
const KEY_PREFIX = '__key_prefix__' + Date.now() + '_'
let uid = 0

const isObject = obj => obj !== null && typeof obj === 'object'
const genUniqueKey = obj => {
  if (isObject(obj)) {
    if (UNIQUE_KEY_PROP in obj) {
      return obj[UNIQUE_KEY_PROP]
    }
    const value = KEY_PREFIX + uid++
    Object.defineProperty(obj, UNIQUE_KEY_PROP, { value })
    console.log(value)
    return value
  }
  return obj
}

Vue.mixin({
  methods: { genUniqueKey }
})

Vue.prototype.$http = axios
Vue.prototype.debounce = debounce
Vue.prototype.$Toast = Toast
Vue.prototype.$Indicator = Indicator
Vue.use(Mint)
Vue.use(Filters)
Vue.use(debounce)
Vue.use(lodash)
Vue.use(VueTouch, { name: 'v-touch' })
Vue.component('scroll-view', scrollView)
Vue.component('loading-view', loadingView)

Vue.prototype.historyState = [
  {
    fullPath: "/",
    name: "App",
    query: {}
  }
]//缓存路由,兼容ios路由回退；做个hack处理，防止从非首页进入，之前为了全局替换，路由跳转没有封装成函数

//记录路由路径
router.beforeEach((to, from, next) => {
  var beforeState = Vue.prototype.historyState.slice(-2,-1)[0] ? Vue.prototype.historyState.slice(-2,-1)[0] : {};
  var lastState = Vue.prototype.historyState.slice(-1)[0] ? Vue.prototype.historyState.slice(-1)[0] : {};
  console.log(beforeState,lastState,to,from)
  if(beforeState.name === to.name && beforeState.fullPath === to.fullPath && lastState.name === from.name){
    Vue.prototype.historyState.pop()
  }else{
    let query = {}
    if(to.name !== 'App' && to.name !== 'Home'){
      query = to.query
    }
    Vue.prototype.historyState.push({
      name: to.name,
      query: query,
      fullPath: to.fullPath
    })
  }
  console.log(Vue.prototype.historyState)
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
