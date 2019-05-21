import Vue from 'vue'
import Router from 'vue-router'

// 已用router懒加载替代
import Home from '@/page/Home.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Router)
Vue.use(ElementUI)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: resolve => { require(['@/page/Login.vue'], resolve) }
    },
    // {
    //   path: '/',
    //   redirect: '/?alu=admin'
    // },
    {
      path: '/Home',
      name: 'Home',
      component: resolve => { require(['@/page/Home.vue'], resolve) }
    },
    // {
    //   path: '/',
    //   name: 'App',
    //   // component: Home
    //   component: resolve => { require(['@/page/Home.vue'], resolve) }
    // },
    // {
    //   path: '/Home',
    //   name: 'Home',
    //   component: resolve => { require(['@/page/Home.vue'], resolve) }
    // },
    {
      path: '/potential',
      name: 'potential',
      component: resolve => { require(['@/page/homePage/potential.vue'], resolve) }
    },
    {
      path: '/relate',
      name: 'relate',
      component: resolve => { require(['@/page/homePage/relate.vue'], resolve) }
    },
    {
      path: '/advancedSearch/search',
      name: 'advancedSearch',
      component: resolve => { require(['@/page/advancedSearch/search.vue'], resolve) },
      meta: {keepAlive: true}
    },
    {
      path: '/advancedSearch/searchPage',
      name: 'searchPage',
      component: resolve => { require(['@/page/advancedSearch/searchPage.vue'], resolve) }
    },
    // 客户页
    {
      path: '/Customer',
      name: 'Customer',
      component: resolve => { require(['@/page/Customer.vue'], resolve) },
      meta: {keepAlive: false}
    },
    {
      path: '/customer/relationGraph/overview',
      name: 'relationOverview',
      component: resolve => { require(['@/page/customerPage/relationGraph/overview.vue'], resolve) }
    },
    {
      path: '/customerDetail',
      name: 'customerDetail',
      component: resolve => { require(['@/page/customerPage/customerDetail.vue'], resolve) }
    },
    {
      path: '/followList',
      name: 'followList',
      component: resolve => { require(['@/page/customerPage/followList.vue'], resolve) }
    },
    {
      path: '/followCard',
      name: 'followCard',
      component: resolve => { require(['@/page/customerPage/followCard.vue'], resolve) }
    },
    {
      path: '/marketList',
      name: 'marketList',
      component: resolve => { require(['@/page/customerPage/marketList.vue'], resolve) }
    },
    {
      path: '/riskList',
      name: 'riskList',
      component: resolve => { require(['@/page/customerPage/riskList.vue'], resolve) }
    },
    {
      path: '/bidingInfo',
      name: 'bidingInfo',
      component: resolve => { require(['@/page/customerPage/bidingInfo.vue'], resolve) }
    },
    {
      path: '/capitalInfo',
      name: 'capitalInfo',
      component: resolve => { require(['@/page/customerPage/capitalInfo.vue'], resolve) }
    },
    {
      path: '/concertInfo',
      name: 'concertInfo',
      component: resolve => { require(['@/page/customerPage/concertInfo.vue'], resolve) }
    },
    {
      path: '/connectCompany',
      name: 'connectCompany',
      component: resolve => { require(['@/page/customerPage/connectCompany.vue'], resolve) }
    },
    {
      path: '/connectInfo',
      name: 'connectInfo',
      component: resolve => { require(['@/page/customerPage/connectInfo.vue'], resolve) }
    },
    {
      path: '/executiveInfo',
      name: 'executiveInfo',
      component: resolve => { require(['@/page/customerPage/executiveInfo.vue'], resolve) }
    },
    {
      path: '/industryInfo',
      name: 'industryInfo',
      component: resolve => { require(['@/page/customerPage/industryInfo.vue'], resolve) }
    },
    {
      path: '/investInfo',
      name: 'investInfo',
      component: resolve => { require(['@/page/customerPage/investInfo.vue'], resolve) }
    },
    {
      path: '/labelList',
      name: 'labelList',
      component: resolve => { require(['@/page/customerPage/labelList.vue'], resolve) }
    },
    {
      path: '/shareholdersInfo',
      name: 'shareholdersInfo',
      component: resolve => { require(['@/page/customerPage/shareholdersInfo.vue'], resolve) }
    },
    {
      path: '/shixinInfo',
      name: 'shixinInfo',
      component: resolve => { require(['@/page/customerPage/shixinInfo.vue'], resolve) }
    },
    {
      path: '/zhixinInfo',
      name: 'zhixinInfo',
      component: resolve => { require(['@/page/customerPage/zhixinInfo.vue'], resolve) }
    },
    {
      path: '/findRelation/search',
      name: 'findRelationSearch',
      component: resolve => { require(['@/page/findRelation/search.vue'], resolve) }
    },
    {
      path: '/findRelation/result',
      name: 'findRelationResult',
      component: resolve => { require(['@/page/findRelation/result.vue'], resolve) }
    },
    {
      path: '/referee',
      name: 'referee',
      component: resolve => { require(['@/page/customerPage/referee.vue'], resolve) }
    },
    // 营销事件页
    {
      path: '/Market',
      name: 'Market',
      component: resolve => { require(['@/page/Market.vue'], resolve) }
      // meta: {keepAlive: true}
    },
    {
      path: '/marketDetail',
      name: 'marketDetail',
      component: resolve => { require(['@/page/marketPage/marketDetail.vue'], resolve) }
    },
    {
      path: '/marketSetup',
      name: 'marketSetup',
      component: resolve => { require(['@/page/marketPage/marketSetup.vue'], resolve) }
    },
    {
      path: '/riskSetup',
      name: 'riskSetup',
      component: resolve => { require(['@/page/marketPage/riskSetup.vue'], resolve) }
    },
    {
      path: '/newSource',
      name: 'newSource',
      component: resolve => { require(['@/page/marketPage/newSource.vue'], resolve) }
    },
    {
      path: '/eventDetail',
      name: 'eventDetail',
      component: resolve => { require(['@/page/marketPage/eventDetail.vue'], resolve) }
    },
    {
      path: '/error',
      name: 'error',
      component: resolve => { require(['@/page/Error.vue'], resolve) }
    },
    {
      path: '/specialSearch/businessSearch',
      name: 'businessSearch',
      component: resolve => { require(['@/page/specialSearch/businessSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/concatSearch',
      name: 'concatSearch',
      component: resolve => { require(['@/page/specialSearch/concatSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/sharderSearch',
      name: 'sharderSearch',
      component: resolve => { require(['@/page/specialSearch/sharderSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/winbidSearch',
      name: 'winbidSearch',
      component: resolve => { require(['@/page/specialSearch/winbidSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/judgeInfoSearch',
      name: 'judgeInfoSearch',
      component: resolve => { require(['@/page/specialSearch/judgeInfoSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/countSearch',
      name: 'countSearch',
      component: resolve => { require(['@/page/specialSearch/countSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/shixinSearch',
      name: 'shixinSearch',
      component: resolve => { require(['@/page/specialSearch/shixinSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/zhixingSearch',
      name: 'zhixingSearch',
      component: resolve => { require(['@/page/specialSearch/zhixingSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/zhuanliSearch',
      name: 'zhuanliSearch',
      component: resolve => { require(['@/page/specialSearch/zhuanliSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/qianshuiSearch',
      name: 'qianshuiSearch',
      component: resolve => { require(['@/page/specialSearch/qianshuiSearch.vue'], resolve) }
    },
    {
      path: '/specialSearch/newsSearch',
      name: 'newsSearch',
      component: resolve => { require(['@/page/specialSearch/newsSearch.vue'], resolve) }
    }
  ]
})
