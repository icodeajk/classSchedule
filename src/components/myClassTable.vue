<template>

  <div class="customer-cont template-cont add-class-template" style="height: 100%">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <i class="add-class-icon iconfont icon-return" @click="togglePage"></i>
      </a>
      <a slot="right">
        <!-- <span class="switch-btn">切换</span> -->
      </a>
    </header-switch>
    <scroll-view :class=" 'container '">
      <div style="height: 100%">
        <div v-for="(item, index) in itemArr" :key="index">
          <div class="class-form">
            <div class="item-head">
              <div class="head-left">
                <div class="item-name">{{item.name}}</div>
                <div class="item-msg">
                  <span>节数：{{item.line}}</span>
                </div>
              </div>
              <i class="head-right iconfont icon-gengduo" @click="switchClassTable(item)"></i>
            </div>
            <div class="item-bottom">
              <div class="bottom-name" @click="editClassTable(item)">修改</div>
              <div class="bottom-name" @click="deleteClassTable(item.id)">删除</div>
            </div>
          </div>
        </div>
        <el-button  type="primary" class="add-btn" icon="iconfont icon-add" @click="addClassTableTogglePage" circle></el-button>
      </div>
    </scroll-view>
    <toggle-page from="bottom" ref="addClassTable">
      <add-class-table :togglePage="addClassTableTogglePage"></add-class-table>
    </toggle-page>
    <toggle-page from="bottom" ref="editClassTable">
      <edit-class-table :item="editItem" :togglePage="editClassTableTogglePage"></edit-class-table>
    </toggle-page>
    <toggle-page from="bottom" ref="myClass">
      <my-class :togglePage="myClassTogglePage"></my-class>
    </toggle-page>
  </div>
</template>

<script>
import classTableSrc from '@/api/classTableSrc.js'
import headerSwitch from '@/components/headerSwitch.vue'
import emptyPage from '@/components/emptyPage.vue'
import togglePage from '@/components/hz/togglePage.vue'
import addClassTable from '@/components/addClassTable.vue'
import editClassTable from '@/components/editClassTable.vue'
import myClass from '@/components/myClass.vue'
import {Toast} from 'mint-ui'
export default {
  name: 'my-class-table',
  props: {
    togglePage: {
      type: Function,
      default: () => {

      }
    }
  },
  data () {
    return {
      loading: false,
      title: '我的课表',
      className: '',
      teacherName: '',
      itemArr: [],
      editItem: {
        id: '',
        name: '',
        line: ''
      }
    }
  },
  mounted () {
    this.getClassTableList()
  },
  computed: {
  },
  created () {
  },
  watch: {
  },
  methods: {
    switchClassTable (item) {
      localStorage.setItem('tableId', item.id)
      localStorage.setItem('tableLine', item.line)
      Toast({
        message: '课表切换成功',
        iconClass: 'icon icon-normal',
        duration: 1000
      })
    },
    addTimeForm () {
      let item = {
        weekNum: '1-17 周',
        classTime: '周一 1-1 节',
        address: ''
      }
      this.itemArr.push(item)
    },
    addClassTableTogglePage () {
      this.getClassTableList()
      this.$refs.addClassTable.toggle()
    },
    editClassTable (item) {
      this.editItem = item
      this.editClassTableTogglePage()
    },
    editClassTableTogglePage () {
      this.getClassTableList()
      this.$refs.editClassTable.toggle()
    },
    myClassTogglePage () {
      this.$refs.myClass.toggle()
    },
    getClassTableList () {
      let self = this
      let queryOption = {
        userId: localStorage.getItem('userId')
      }
      classTableSrc.getClassTableList(queryOption).then((data) => {
        self.itemArr = data.payload
        localStorage.setItem('tableId', self.itemArr.length > 0 ? self.itemArr[0].id : '')
        localStorage.setItem('tableLine', self.itemArr.length > 0 ? self.itemArr[0].line : '')
        if (!localStorage.getItem('tableId') && !localStorage.getItem('tableLine')) {
          this.togglePage()
        }
      })
    },
    deleteClassTable (id) {
      let self = this
      let queryOption = {
        id: id
      }
      classTableSrc.deleteClassTable(queryOption).then((data) => {
        this.getClassTableList()
      })
    }
  },
  components: {
    headerSwitch,
    emptyPage,
    addClassTable,
    editClassTable,
    togglePage,
    myClass
  }
}
</script>

<style scoped lang="less">
.add-class-template {
  .add-class-icon {
    font-size: 25px;
  }
  .container {
    background: #FFF;
    padding: 15px;
    .class-form {
      width: 100%;
      border-radius: 5px;
      margin-bottom: 15px;
      box-shadow: 0 0 0.266667rem 0 rgba(0, 0, 0, 0.11);
      .item-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        height: 80px;
        background: #409EFF;
        color: #FFF;
        .head-left {
          text-align: left;
          font-size: 15px;
          .item-name {
            margin-bottom: 14px;
          }
        }
        .head-right {
          font-size: 30px;
        }
      }
      .item-bottom {
        // display: flex;
        // justify-content: space-around;
        // align-items: center;
        background: #fff;
        .bottom-name {
          display: inline-block;
          width: 48%;
          height: 40px;
          line-height: 40px;
          border-right: 1px solid #409EFF; /*no*/
          &:last-child {
            border-right: none;
          }
        }
      }
      .form-item {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        height: 40px;
        color: #FFF;
        margin: 10px auto;
        input {
          display: inline-block;
          font-size: 25px;
          color: #FFF;
          border: none;
          background: #409EFF;
          border-bottom: 1px solid #FFF; /*no*/
          &:focus {
            outline: none;
            border-bottom: 2px solid #FFF;
          }
        }
      }
    }
    .time-form {
      width: 100%;
      background: #FFF;
      border-radius: 5px;
      padding: 10px 0;
      margin-bottom: 15px;
      box-shadow: 0 0 0.266667rem 0 rgba(0, 0, 0, 0.11);
      .form-item {
        display: flex;
        align-items: center;
        font-size: 20px;
        height: 40px;
        color: #666;
        margin-left: 10px;
        .time-around {
          color: #409EFF;
        }
        input {
          display: inline-block;
          font-size: 25px;
          color: #409EFF;
          border: none;
          background: #FFF;
          border-bottom: 1px solid #666; /*no*/
          &:focus {
            outline: none;
            border-bottom: 2px solid #409EFF;
          }
        }
      }
    }
    .add-btn {
      position: fixed;
      bottom: 10px;
      left: calc(50% - 0.65rem);
      width: 50px;
      height: 50px;
      font-size: 20px;
      box-shadow: 0 0 0.1rem 0 rgba(0, 0, 0, 0.11);
    }
  }
}
.container {
  position: relative;
  background: #FFF;
  height: calc(100% - 85px);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 2rem);
  }
}
.navbar {
  position: relative;
  font-size: 0;
  .navbar-nav {
    position: relative;
    height: 48px;
    line-height: 48px;
    display: inline-block;
    width: 50%;
    font-size: 16px;
    background: #fff;
    &.active {
      color: #d24545;
    }
    &.active:after {
      position: absolute;
      content: '';
      border-bottom: 2px solid #d24545;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
