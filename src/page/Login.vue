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
          <el-input class="pass-input" v-model="password" minlength='6' maxlength='20' placeholder="密码" show-password></el-input>
          <el-input class="pass-input" v-if="type==='signUp'" v-model="repassword" minlength='6' maxlength='20' placeholder="确认密码" show-password></el-input>
          <div class="validation-tips">6-20位字符，区分大小写</div>
          <div class="sign-up-btn" @click="switchTypeHandler">{{type === 'login' ? '没有账号？点击注册' : '账号密码登录'}}</div>
          <el-button class="login-btn" type="primary" @click="submitHandler" :disabled="username && password ? false : true">{{this.type === 'login' ? '登录':'注册'}}</el-button>
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
      var repassword
      return {
        username: username,
        password: password,
        repassword: repassword,
        title: '轻课表',
        type: 'login',
      }
    },
    created() {
    },
    methods: {
      submitHandler () {
        if(this.password.length < 6) {
          Toast({
            message: '密码格式错误，请重新输入',
            iconClass: 'icon icon-error',
            duration: 1000
          })
        } else if(this.type === 'signUp' && this.password !== this.repassword) {
          Toast({
            message: '请确认密码输入正确',
            iconClass: 'icon icon-error',
            duration: 1000
          })
        } else {
          if(this.type === 'login') {
            this.login()
          } else {
            this.signUp()
          }
        }
      },
      switchTypeHandler() {
        this.type = this.type === 'login' ? 'signUp' : 'login'
      },
      login () {
        var self = this
        AccountService.login(self.username, self.password, function (data) {
          if (!data.access_token) {
            Toast({
              message: data.msg,
              iconClass: 'icon icon-error',
              duration: 2000
            })
            return
          }
          localStorage.clear()
          localStorage.setItem('username', self.username)
          localStorage.setItem('access_token', data.access_token)
          localStorage.setItem('userId', data.userid)
          Cookies.set('access_token', data.access_token)
          Toast({
            message: '登录成功',
            iconClass: 'icon icon-normal',
            duration: 2000
          })
          window.location.href = '/#/Home'
        })
      },
      signUp() {
        var self = this
        AccountService.signUp(self.username, self.password, function (data) {
          if(data.success == 'true') {
            let instance = Toast({
              message: '注册成功',
              iconClass: 'icon icon-normal',
              duration: 1000
            })
            self.type='login'
          }
        })
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
        .sign-up-btn {
          width: 100%;
          margin-top: 8px;
          font-size: 12px;
          color: #409EFF;
          text-align: right;
        }
        .hide {
          display: none;
        }
        .login-btn{
            width: 169px;
            height: 42px;
            font-size: 16px;
            margin-top: 30px;
        }
    }
</style>
