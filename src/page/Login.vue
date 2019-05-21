<template>
  <div style='height:100%; background:#FFF;'>
    <loading-view></loading-view>
    <div class="title">
      <header-switch :title="title">
      </header-switch>
      <scroll-view class="container">
        <div class="login-page">
          <div class="logo-area"></div>
          <el-input class="username-input" v-model="username" placeholder="用户名"></el-input>
          <el-input class="pass-input" v-model="password" placeholder="密码" show-password></el-input>
          <div class="validation-tips">6-20位字符，区分大小写</div>
          <el-button class="login-btn" type="primary" @click="login" :disabled="username && password ? false : true">登录</el-button>
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
  import { Toast } from 'mint-ui'
  import { ACCOUNT_ADD, ACCOUNT_DELETE } from '../store/mutation-types'
  import homeSrv from '../api/homeSrv'
  import customerSrv from '../api/customerSrv'
  import businessSrv from '../api/businessSrv'
  import headerSwitch from '../components/headerSwitch.vue'
  import AccountService from '../assets/js/account.js'
  import Cookies from 'js-cookie'
  export default{
    data () {
      var username
      var password
      return {
        username: username,
        password: password,
        title: '轻课表'
      }
    },
    created() {
    },
    methods: {
      login () {
        var self = this
        AccountService.login(self.username, self.password, function (data) {
          if (!data.access_token) {
            // Toast({
            //   message: data.msg,
            //   iconClass: 'icon icon-error',
            //   duration: 2000
            // })
            return
          }
          localStorage.setItem('access_token', data.access_token)
          Cookies.set('access_token', data.access_token)
          Toast({
            message: '登录成功',
            iconClass: 'icon icon-normal',
            duration: 2000
          })
          window.location.href = './#/Home'
        })
      },
      login_jiangnan (login_name) {
        var self = this
        AccountService.loginByjiangnan(login_name, function (data) {
          if (!data.access_token) {
            // Toast({
            //   message: data.msg,
            //   iconClass: 'icon icon-error',
            //   duration: 2000
            // })
            window.location.href = '/#/error'
            return
          }
          localStorage.setItem('access_token', data.access_token)
          Cookies.set('access_token', data.access_token)
          Toast({
            message: '登录成功',
            iconClass: 'icon icon-normal',
            duration: 2000
          })
          window.location.href = './#/Home'
        })
      },
      getLoginName(){
        var login_name = this.$route.query.login_name
        console.log(login_name);
        if(login_name){
          this.login_jiangnan(login_name);
        }
      }
    },
    components: {
      headerSwitch
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .login-page{
        width: 309px;
        margin: 0 auto;
        text-align: center;
        .logo-area{
            display: inline-block;
            // background: url(../assets/img/bank_logo.png);
            background-size: 169px auto;
            width: 169px;
            height: 20px;
            margin-top: 62px;
        }
        .username-input, .pass-input{

        }
        .username-input{
            margin-top: 110px;
        }
        .pass-input{
            margin-top: 20px;
        }
        .validation-tips{
            width: 100%;
            margin-top: 8px;
            font-size: 12px;
            color: #BDBDBD;
            text-align: right;
        }
        .login-btn{
            width: 169px;
            height: 42px;
            font-size: 16px;
            margin-top: 10px;
        }
    }
</style>
