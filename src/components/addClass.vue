<template>

  <div class="customer-cont template-cont add-class-template" style="height: 100%">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <i class="add-class-icon iconfont icon-return" @click="togglePage"></i>
      </a>
      <a slot="right">
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
              <span class="time-around" @click="toggleTimePicker(index)">{{item.classTime}}</span>
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
    <mt-popup v-model="regionVisible" position="bottom" class="region-popup">
      <mt-picker :slots="slots" @change="onValuesChange" :itemHeight="60"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import classTableSrc from '@/api/classTableSrc.js'
import headerSwitch from '@/components/headerSwitch.vue'
import emptyPage from '@/components/emptyPage.vue'
import { Picker, Popup } from 'mint-ui'
import Vue from 'Vue'
Vue.component(Picker.name, Picker)
Vue.component(Popup.name, Popup)

export default {
  name: 'add-class',
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
      title: '添加课程',
      className: '',
      teacherName: '',
      regionVisible: false,
      index: 0,
      itemArr: [
        {
          weekNum: '',
          classTime: '周一 1-1 节',
          address: '',
          remark: '',
          weekDay: '',
          startTime: '',
          endTime: ''
        }
      ],
      slots: [
        {
          flex: 1,
          values: ['周一', '周二', '周三', '周四', '周五'],
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '第',
          className: 'slot2'
        },
        {
          flex: 1,
          values: ['1', '2', '3', '4', '5', '6','7','8','9','10'],
          className: 'slot3',
          textAlign: 'center'
        }, {
          divider: true,
          content: '至',
          className: 'slot4'
        }, {
          flex: 1,
          values: ['1', '2', '3', '4', '5', '6','7','8','9','10'],
          className: 'slot5',
          textAlign: 'center'
        }
      ],
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
    onValuesChange(picker, values) {
      if (values[1] > values[2]) {
        picker.setSlotValue(2, values[1]);
      }
      this.itemArr[this.index].classTime = values[0]+' '+values[1]+'-'+values[2]+' 节'
      this.itemArr[this.index].weekDay = values[0],
      this.itemArr[this.index].startTime = values[1],
      this.itemArr[this.index].endTime = values[2]
    },
    toggleTimePicker(index) {
      this.index = index
      this.regionVisible = !this.regionVisible
    },
    addTimeForm() {
      let item = {
        weekNum: '',
        classTime: '周一 1-1 节',
        address: '',
        remark: ''
      }
      this.itemArr.push(item)
    },
    addClassHandler() {
      // debugger
      let self = this
      for(let i = 0; i<self.itemArr.length; i++) {
        let queryOption = {
          tableId: localStorage.getItem('tableId'),
          name: self.className,
          teacher: self.teacherName,
          weekDay: self.itemArr[i].weekDay,
          startTime: self.itemArr[i].startTime,
          endTime: self.itemArr[i].endTime,
          address: self.itemArr[i].address,
          remark: self.itemArr[i].remark,
        }
        classTableSrc.addClass(queryOption).then((data)=>{
          this.togglePage()
        })
      }
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
  .region-popup {
    width: 100%;
  }
}
</style>
