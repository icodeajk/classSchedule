<template>

  <div class="customer-cont template-cont my-class-template" style="height: 100%">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <i class="add-class-icon iconfont icon-return" @click="togglePage"></i>
      </a>
      <a slot="right">
        <i class="add-class-icon iconfont icon-delete1" @click="togglePage"></i>
      </a>
    </header-switch>
    <scroll-view :class=" 'container '">
      <div style="height: 100%">
        <div class="no-text" v-if="!itemArr.length">当前没有课程，请添加</div>
        <div v-for="(item, index) in itemArr" :key="index">
          <div class="class-form">
            <span class="color-border"></span>
            <div class="form-msg">
              <div class="head-left">
                <div class="item-name">{{item.name}}</div>
                <div class="item-msg">
                  <span>{{item.weekDay+' '+item.startTime+'-'+item.endTime+' 节'}}</span>
                  <span>{{item.address}}</span>
                </div>
              </div>
              <div class="head-right" @click="editClassTogglePage">
                <span class="teacher-name">{{item.teacher}}</span>
                <i class="iconfont icon-gengduo"></i>
              </div>
            </div>
          </div>
        </div>
        <el-button  type="primary" class="add-btn" icon="iconfont icon-add" @click="addClassTogglePage" circle></el-button>
      </div>
    </scroll-view>
    <toggle-page from="bottom" ref="addClass">
      <add-class :togglePage="addClassTogglePage"></add-class>
    </toggle-page>
    <!-- TODO: 可以和新建页面整合 -->
    <toggle-page from="bottom" ref="editClass">
      <edit-class :togglePage="editClassTogglePage"></edit-class>
    </toggle-page>
  </div>
</template>

<script>
import classTableSrc from '@/api/classTableSrc.js'
import headerSwitch from '@/components/headerSwitch.vue'
import togglePage from '@/components/hz/togglePage.vue'
import addClass from '@/components/addClass.vue'
import editClass from '@/components/editClass.vue'

export default {
  name: 'my-class',
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
      title: '我的课程',
      className: '',
      teacherName: '',
      itemArr: []
    }
  },
  mounted() {
    this.getClassList()
  },
  computed: {
  },
  created() {
  },
  watch: {
  },
  methods: {
    addClassTogglePage() {
      this.getClassList()
      this.$refs.addClass.toggle()
    },
    editClassTogglePage() {
      this.getClassList()
      this.$refs.editClass.toggle()
    },
    getClassList() {
      // debugger
      let self = this
      let queryOption = {
        tableId: localStorage.getItem('tableId'),
      }
      if(queryOption.tableId) {
        classTableSrc.getClassList(queryOption).then((data)=>{
          self.itemArr = data.payload
        })
      }
    }
  },
  components: {
    headerSwitch,
    addClass,
    togglePage,
    editClass,
  }
}
</script>

<style scoped lang="less">
.my-class-template {
  .add-class-icon {
    font-size: 25px;
  }
  .container {
    position: relative;
    background: #FFF;
    height: calc(100% - 45px);
    overflow: hidden;
    .no-text {
      margin-top: 300px;
      font-size: 20px;
      color: #666;
    }
    .class-form {
      display: flex;
      align-items: center;
      width: 100%;
      border-bottom: 1px solid #666; /*no*/
      background: #FFF;
      color: #333;
      .color-border {
        width: 5px;
        height: 30px;
        background: #409EFF;
      }
      .form-msg {
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        width: 100%;
        padding: 0 10px;
        .head-left {
          text-align: left;
          font-size: 15px;
          .item-name {
            margin-bottom: 14px;
          }
        }
        .head-right {
          .teacher-name {
            font-size: 15px;
            margin-right: 10px;
          }
        }
      }
    }
    .add-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      font-size: 20px;
      box-shadow: 0rem 0.1rem 0.1rem 0 rgba(0, 0, 0, 0.11);
    }
  }
}
</style>
