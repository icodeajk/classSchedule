<template>

  <div class="customer-cont template-cont edit-class-template" style="height: 100%">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <i class="add-class-icon iconfont icon-return" @click="togglePage"></i>
      </a>
      <a slot="right">
        <i class="add-class-icon iconfont icon-delete1" @click="addClassHandler"></i>
        <i class="add-class-icon iconfont icon-select" @click="addClassHandler"></i>
      </a>
    </header-switch>
    <scroll-view :class=" 'container '">
      <div>
        <div class="class-form">
          <div class="form-item">
            <span>课程名称：</span>
            <input v-model="className"/>
          </div>
          <div class="form-item">
            <span>任课老师：</span>
            <input v-model="teacherName"/>
          </div>
        </div>
        <div v-for="(item, index) in itemArr" :key="index">
          <div class="time-form">
            <div class="form-item">
              <span>时间：</span>
              <span class="time-around">{{item.classTime}}</span>
            </div>
            <div class="form-item">
              <span>地点：</span>
              <input v-model="item.address"/>
            </div>
            <div class="form-item">
              <span>备注：</span>
              <input v-model="item.remark"/>
            </div>

          </div>
        </div>
        <el-button class="add-time-btn" @click="addTimeForm">添加时间段</el-button>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import editSrv from '@/api/editSrv.js'
import headerSwitch from '@/components/headerSwitch.vue'
import emptyPage from '@/components/emptyPage.vue'

export default {
  name: 'edit-class',
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
      title: '编辑课程',
      className: '',
      teacherName: '',
      itemArr: [
        {
          weekNum: '',
          classTime: '',
          address: '',
          remark: '',
        }
      ]
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
    addTimeForm() {
      let item = {
        weekNum: '1-17 周',
        classTime: '周一 1-1 节',
        address: ''
      }
      this.itemArr.push(item)
    },
    addClassHandler() {
      // debugger
      let self = this
      let queryOption = {
        className: self.className,
        teacherName: self.teacherName,
        itemArr: self.itemArr,
      }
      editSrv.addClass(queryOption).then((data)=>{
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
.edit-class-template {
  .add-class-icon {
    font-size: 25px;
  }
  .container {
    position: relative;
    background: #FFF;
    padding: 15px;
    height: calc(100% - 85px);
    overflow: hidden;
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
</style>
