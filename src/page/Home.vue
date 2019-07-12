<template>
  <div style="height: 100%">
    <full-page ref="fullPage" :options="navPageOptions">
      <div style='height:100%' slot="main">
        <loading-view :showLoading="loading"></loading-view>
        <div class="title">
          <header-switch :title="title">
            <i slot="left" class="head-icon iconfont icon-fenzumingcheng" @click="showNavPage"></i>
            <i slot="right" class="head-icon iconfont icon-add" @click="addClassTogglePage"></i>
          </header-switch>
        </div>
        <scroll-view :class="'container'">
          <div style="height: 100%">
            <table class="class-table">
              <thead>
                <tr class="class-th">
                  <th v-for="(item, index) in classTable.head" :key="index">
                    <p>{{item.week}}</p>
                    <p>{{item.data}}</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="class-tr" v-for="(item, index) in classTable.content" :key="index">
                  <td  v-for='(value, key) in item' :key="key" @click="clicka">
                    <p v-html='value'></p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </scroll-view>
      </div>
      <div class="full-page" slot="sub" v-if="type === 'nav' ? true : false">
        <div class="fade-out" @click="hideNavPage">
        </div>
        <div class="nav-tab">
          <div class="nav-img">
            <p class="to-login" @click="jumpLoginHandler">{{this.username ? this.username : '点击登录'}}</p>
            <p class="bottom-text">发掘用户轻体验</p>
          </div>
          <div class="nav-items">
            <div class="nav-item active">
              <i class="iconfont icon-schedule_icon"></i>
              <p class="item-name">每周课表</p>
            </div>
            <div class="nav-item" @click="myClassTableTogglePage">
              <i class="iconfont icon-class"></i>
              <p class="item-name">我的课表</p>
            </div>
            <div class="nav-item" @click="myClassTogglePage">
              <i class="iconfont icon-books"></i>
              <p class="item-name">我的课程</p>
            </div>
            <div class="nav-item">
              <i class="iconfont icon-download"></i>
              <p class="item-name">课表导入</p>
            </div>
            <div class="nav-item">
              <i class="iconfont icon-refresh"></i>
              <p class="item-name">备份课表</p>
            </div>
            <div class="nav-item">
              <i class="iconfont icon-paintBox"></i>
              <p class="item-name">个性化风格</p>
            </div>
            <div class="nav-item">
              <i class="iconfont icon-system"></i>
              <p class="item-name">设置</p>
            </div>
            <div class="nav-item">
              <i class="iconfont icon-about"></i>
              <p class="item-name">关于</p>
            </div>
            <div class="nav-item" @click="quitAccount">
              <i class="iconfont icon-exit"></i>
              <p class="item-name">退出</p>
            </div>
          </div>
        </div>
      </div>
    </full-page>
    <toggle-page from="bottom" ref="addClass">
      <add-class :togglePage="addClassTogglePage"></add-class>
    </toggle-page>
    <toggle-page from="bottom" ref="myClassTable">
      <my-class-table :togglePage="myClassTableTogglePage"></my-class-table>
    </toggle-page>
    <toggle-page from="bottom" ref="myClass">
      <my-class :togglePage="myClassTogglePage"></my-class>
    </toggle-page>
  </div>
</template>

<script>
import store from '@/store'
import { AUTH_ALU,SAVE_CURRENT,CHANGESCROLLTOFLAG} from '@/store/mutation-types'
import homeSrv from '../api/homeSrv'
import classTableSrc from '../api/classTableSrc'
import businessSrv from '../api/businessSrv'
import filterList from '../components/filterList.vue'
import filterBar from '../components/filterBar.vue'
import headerSwitch from '../components/headerSwitch.vue'
import Cookies from 'js-cookie'
import { Toast } from 'mint-ui'
import cache from '@/storeEvent.js'
import fullPage from '@/components/hz/FullPage.vue'
import addClass from '@/components/addClass.vue'
import togglePage from '@/components/hz/togglePage.vue'
import myClassTable from '@/components/myClassTable.vue'
import myClass from '@/components/myClass.vue'

export default {
  data() {
    return {
      cache: cache,
      loading: false,
      title: '课程表',
      type: 'nav',
      username: '',
      tableId: '',
      tableLine: '',
      navPageOptions: {
        type: 'toggle',
        from: 'left'
      },
      addClassPageOption: {
        type: 'toggle',
        from: 'right'
      },
      classTable: {
        head: [
          {
            week: '周一',
            data: '06-24',
          },
          {
            week: '周二',
            data: '06-25',
          },
          {
            week: '周三',
            data: '06-26',
          },
          {
            week: '周四',
            data: '06-27',
          },
          {
            week: '周五',
            data: '06-28',
          },
        ],
        content: []
      }
    }
  },
  mounted() {
    this.getClassList()
    // 初始化，isonline为判断网络是否连接
    // localStorage.setItem('isonline', 'true')
    // localStorage.setItem('access_token', res.access_token)
    if(window.navigator.onLine === true) {
      localStorage.setItem('isonline', 'true')
    } else {
      localStorage.setItem('isonline', 'false')
    }
    // this.getLoginName()
    this.username = localStorage.getItem('username')
    this.title = localStorage.getItem('classTableName') ? localStorage.getItem('classTableName') : '课程表'
    this.tableId = localStorage.getItem('tableId')
    this.tableLine = localStorage.getItem('tableLine')
  },
  created() {
  },
  watch: {
    // show (val) {
    //   if (val) {
    //     if(!this.hasClass(document.body,"pop-mask")){
    //       this.addClass(document.body,"pop-mask");
    //     }
    //   }else{
    //     this.removeClass(document.body,"pop-mask");
    //   }
    // }
  },
  computed: {},
  methods: {
    showNavPage() {
      this.type = 'nav'
      this.$refs.fullPage.show()
    },
    hideNavPage() {
      this.type = 'nav'
      this.$refs.fullPage.hide()
    },
    addClassTogglePage() {
      this.getClassList()
      this.$refs.addClass.toggle()
      this.$forceUpdate()
    },
    myClassTableTogglePage() {
      this.hideNavPage()
      this.getClassList()
      this.$refs.myClassTable.toggle()
    },
    myClassTogglePage() {
      this.hideNavPage()
      this.getClassList()
      this.$refs.myClass.toggle()
    },
    jumpLoginHandler() {
      if(!this.username) {
        quitAccount()
      }
    },
    quitAccount() {
      window.location.href = "/#/"
    },
    clicka(e){
      console.log(e.target.innerHTML)
    },
    getClassList() {
      // debugger
      let self = this
      let queryOption = {
        tableId: localStorage.getItem('tableId'),
      }
      if(queryOption.tableId) {
        classTableSrc.getClassList(queryOption).then((data)=>{
          let classArr = data.payload
          let contenty = []
          for(let i = 0; i<5; i++) {
            contenty[i] = ''
          }
          let contentx = []
          for(let i = 0; i<this.tableLine; i++) {
            contentx[i] = JSON.parse(JSON.stringify(contenty))
          }
          console.log(contentx)
          for(var k = 0; k<classArr.length; k++){
            switch (classArr[k].weekDay) {
              case '周一':
                for(let j = classArr[k].startTime; j<=classArr[k].endTime; j++) {
                  contentx[j-1][0] = classArr[k].name + '</br>@' + classArr[k].address
                  console.log(contentx)
                }
                break;
              case '周二':
                for(let j = classArr[k].startTime; j<=classArr[k].endTime; j++) {
                  contentx[j-1][1] = classArr[k].name + '</br>@' + classArr[k].address
                }
                break;
              case '周三':
                for(let j = classArr[k].startTime; j<=classArr[k].endTime; j++) {
                  contentx[j-1][2] = classArr[k].name + '</br>@' + classArr[k].address
                }
                break;
              case '周四':
                for(let j = classArr[k].startTime; j<=classArr[k].endTime; j++) {
                  contentx[j-1][3] = classArr[k].name + '</br>@' + classArr[k].address
                }
                break;
              case '周五':
                for(let j = classArr[k].startTime; j<=classArr[k].endTime; j++) {
                  contentx[j-1][4] = classArr[k].name + '</br>@' + classArr[k].address
                }
                break;
            }
          }
          this.classTable.content = contentx
        })
      }
    }
  },
  components: {
    headerSwitch,
    Toast,
    cache,
    fullPage,
    addClass,
    togglePage,
    myClassTable,
    myClass,
  }
}
</script>

<style scoped lang="less">
.container {
  z-index: 1;
  background: #FFF;
  height: calc(100%);
  // min-height:calc(100% - 50px);
  overflow: hidden;
  position:relative;
  .class-table {
    width: 350px;
    height: 630px;
    // border: none;
    // border-collapse: collapse;
    border-collapse: separate;
    border-spacing: 2px;
    margin: 0 auto;
    .class-th {
      height: 30px;
      td {
        width: 30px;
        height: 30px;
      }
    }
    .class-tr {
      td {
        min-width: 30px;
        max-width: 30px;
        min-height: 20px;
        border: 1px solid #c0c4cc; /*no*/
        border-radius: 5px;
        vertical-align: middle;
      }
    }
  }
}
.title{
  position:relative;
  z-index:2;
  font-size: 25px;
  .head-icon {
    font-size: 25px;
  }
}
.full-page {
  .fade-out {
    position: absolute;
    width: 100%;
    background-color: #000000;
    height: 100%;
    z-index: 1000;
    opacity: 0;
  }
  .nav-tab {
    position: absolute;
    width: 60%;
    height: 100%;
    z-index: 1001;
    background: #FFF;
    .nav-img {
      height: 150px;
      background-color: #0a4582;
      color: #FFF;
      overflow: hidden;
      text-align: left;
      margin-bottom: 1px;
      .to-login {
        margin-top: 100px;
        margin-left: 20px;
        font-size: 20px;
      }
      .bottom-text {
        margin-top: 5px;
        margin-left: 20px;
        font-size: 10px;
      }
    }
    .nav-items {
      .nav-item {
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding-left: 20px;
        i {
          display: inline-block;
          font-size: 16px;
          margin-right: 15px;
        }
        .item-name {
          display: inline-block;
          font-size: 16px;
        }
      }
      .active {
        background: #409EFF;
        i {
          color: #fff;
        }
        .item-name {
          color: #fff;
        }
      }
    }
  }
}
</style>
