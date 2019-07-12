<template>

  <div class="customer-cont template-cont add-class-template" style="height: 100%">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <i class="add-class-icon iconfont icon-return" @click="returnHandler"></i>
      </a>
      <a slot="right">
        <i class="add-class-icon iconfont icon-select" @click="addClass"></i>
      </a>
    </header-switch>
    <scroll-view :class=" 'container '">
      <div>
        <div class="class-form">
          <div class="form-item">
            <span>课表名称：</span>
            <input v-model="scheduleName"/>
          </div>
          <div class="form-item">
            <span>课程节数：</span>
            <input v-model="classNum"/>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import classTableSrc from '@/api/classTableSrc.js'
import headerSwitch from '@/components/headerSwitch.vue'
import emptyPage from '@/components/emptyPage.vue'

export default {
  name: 'add-class-table',
  props: {
    togglePage: {
      type: Function,
      default: ()=>{

      },
    }
  },
  data() {
    return {
      loading: false,
      title: '新建课表',
      scheduleName: '',
      classNum: '',
    }
  },
  mounted() {
  },
  computed: {
  },
  created() {
  },
  watch: {
  },
  methods: {
    returnHandler() {
      this.scheduleName = '',
      this.classNum = '',
      this.togglePage()
    },
    addClass() {
      // debugger
      let self = this
      let queryOption = {
        userId: localStorage.getItem('userId'),
        name: self.scheduleName,
        line: self.classNum,
      }
      classTableSrc.addClassTable(queryOption).then((data)=>{
        this.togglePage()
      })
    }
  },
  components: {
    headerSwitch,
    emptyPage,
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
      background: #409EFF;
      border-radius: 5px;
      padding: 10px 0;
      margin-bottom: 15px;
      box-shadow: 0 0 0.266667rem 0 rgba(0, 0, 0, 0.11);
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
    .add-time-btn {
      width: 100%;
      border-radius: 5px;
      margin-bottom: 130px;
      box-shadow: 0 0 0.1rem 0 rgba(0, 0, 0, 0.11);
      &:focus {
        color: #409EFF;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
      &:hover {
        color: #409EFF;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
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
