<template>
  <div id="app" :class="{'hide-tabbar': hideTabbar}">
    <div class="app-content">
        <!-- <router-view/> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
  //路由列表
  let homeList = [
    '/Home',
  ]
  let customerList = [
    '/Customer',
    '/bidingInfo',
    '/capitalInfo',
    '/concertInfo',
    '/connectCompany',
    '/connectInfo',
    '/customerDetail',
    '/executiveInfo',
    '/industryInfo',
    '/investInfo',
    '/labelList',
    '/shareholdersInfo',
    '/shixinInfo',
    '/zhixinInfo',
    '/followList',
    '/followCard',
    '/referee'
  ]
  let marketList = [
    '/Market',
    '/marketDetail',
    '/marketSetup',
    '/newSource',
    '/eventDetail'
  ]

import store from './store'
import { AUTH_ALU,SAVE_CURRENT,CHANGESCROLLTOFLAG} from './store/mutation-types'

export default {
  name: 'App',
  data(){
    return {
      HOMEPAGE: '/',
      CUSTOMERPAGE: '/Customer',
      MARKETPAGE: '/Market',

      activePage: this.$route.path,
      hideTabbar: false
    }
  },
  watch: {
    $route() {
      let path = this.$route.path;
      if(this.$route.query.hideTabbar) {
        this.hideTabbar = true
      }
      else{
        this.hideTabbar = false
      }
      if(path=='/Market'){
         store.commit(SAVE_CURRENT,{val:1})
      }else if(path=='/eventDetail'){
        store.commit(SAVE_CURRENT,{val:2})
        //  console.log(store.state.cart.saveCurrent)
      }else{
         store.commit(SAVE_CURRENT,{val:3})
         store.commit(CHANGESCROLLTOFLAG,0)
      }
      // console.log(store.state.auth.lazyLoad)
      // let path = this.$route.path;
      console.log("path:", path);
      // alu 如果有改变
      this.setAlu()
      if(marketList.indexOf(path) > -1){
        this.activePage = this.MARKETPAGE;
      }else if(customerList.indexOf(path) > -1){
        this.activePage = this.CUSTOMERPAGE;
      }else{
        this.activePage = this.HOMEPAGE;
      }
    }
  },
  methods:{
    changePage(page){
      if(page === this.activePage)return;
      this.$router.push(page);
    },
    setAlu () {
      // alu保存起来, 因为跳转页面会丢失
      const arr = window.location.href.match(/login_name\=([^&]*)/)
      let alu
      if (arr && arr[1]) {
        // alu = arr[1].replace(/(#\/)/,'')
        alu=arr[1]
      } else {
        alu = sessionStorage.getItem('alu')
      }
      if (alu) {
        store.commit(AUTH_ALU, alu)
        sessionStorage.setItem('alu', alu)
      }
    }
  },
  mounted () {
    this.setAlu()
  }
}
</script>

<style lang="less">
  @import "./assets/css/common.less";
  body,html{
    height: 100%;
    width: 100%;
    background: rgb(245,245,245);
    overflow: hidden;
    padding:0;
    margin:0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    box-sizing: border-box;
    text-align: center;
    color: #2c3e50;
    &.hide-tabbar {
      padding-bottom: 0;
    }
    height: 100%;
    overflow: hidden;



    .app-content{
      position: relative;
      overflow: hidden;
      height: 100%;
    }

    .tabbar{
      position: absolute;
      // display:flex;
      // align-items:center;
      box-sizing: border-box;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      padding: 6px 0;
      background: #fff;
      border-top: 1px solid #e3e3e3;/*no*/
      font-size: 0;
      .tabbar-nav{
        display: inline-block;
        width: 33.3%;
        text-align: center;

        &.tabbar-nav-center{
          width: 33.4%;
        }
        .tabbar-img{
          width: 24px;
          height: 24px;
        }
        .tabbar-text{
          margin-top: 4px;
          font-size: 12px;
          color: #333;
        }
      }

    }
  }

  .template-cont{
    height: 100%;
  }

  .high-light {
    line-height: 20px;
    em {
      color: #D24545;
    }
  }
  .zan-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
  }

  .zan-ellipsis--l2 {
    max-height: 40px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  // [data-dpr='1'] #app{
  //   font-size: 14px;
  // }
  // [data-dpr='2'] #app{
  //   font-size: 28px;
  // }
  // [data-dpr='3'] #app{
  //   font-size: 48px;
  // }
</style>
