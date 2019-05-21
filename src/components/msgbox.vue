<template>
  <div v-if="show" class="overlayer">
    <transition name="msgbox">
      <div class="msgbox-container" :class="className">
        <header>{{title}}</header>
        <div class="content-body">
          <div>
            <!-- <router-link class="addGroup" @click.native = "editBox" :to="'javascript:void(0);'">
              <p class="center">新建分组</p>
            </router-link> -->
            <div class="label-cont" @click = "addBox">
              <!-- <mt-cell :title="'新建分组'" class="title" is-link value="" @click.native = "addBox">
              </mt-cell> -->
              <p class="left">新建分组</p>
              <img src="../assets/img/icon-add.png" class="add-img"/>
            </div>
            <div v-for="(item,index) in option" :key="index" class="groupList">
              <input type="checkbox" name="checkbox" v-model="groupIdList[item.id]" :id="index"/>
              <label :for="index">{{item.name}}</label>
            </div>
          </div>
        </div>
        <footer>
          <a v-if="cancel" href="javascript:;" @click="cancelBtn" class="button">{{cancel}}</a>
          <a href="javascript:;" @click="successBtn" class="button">{{confirm}}</a>
        </footer>
      </div>
    </transition>
  </div>
</template>
<script>
import customerSrv from '@/api/customerSrv'
import businessSrv from '@/api/businessSrv'
import Vue from 'vue'
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui'
import bus from '@/bus.js'

export default {
  data () {
    return {
      show: false,
      title: '选择分组',
      content: '',
      confirm: '确定',
      cancel:'',
      className:'',
      option: [],
      idList: [],
      groupIdList: [],
      company: '',
    }
  },
  watch:{
    show (val) {
      if (val) {
        if(!this.hasClass(document.body,"pop-mask")){
          this.addClass(document.body,"pop-mask");
        }
      }else{
        this.removeClass(document.body,"pop-mask");
      }
    }
  },
  beforeMount () {
    //如果已经存在，则阻止出现第二次
    let node = document.querySelector('.overlayer')
    if (node && node.parentNode) {
      node.parentNode.removeChild(node)
    }
    this.getFollowList()
  },
  methods: {
    getFollowList() {
      //获取分组列表
      let queryParams = {
        follow_list_id: 0
      }
      customerSrv.getFollowGroup(queryParams).then(res => {
        this.option = []
        for(var item in res.data){
          this.option.push(res.data[item])
        }
      })
    },
    // 关注弹窗确认
    editGroupMore() {
      let postParams = {
        company_name: this.company,
      }
      customerSrv.editGroupMore(postParams,this.idList).then(res => {
        if (this.idList.length === 0) {
          bus.$emit('is_followed', false)
        } else {
          bus.$emit('is_followed', true)
        }
      })
    },
    editList() {
      for(var index in this.groupIdList) {
        var item = this.groupIdList[index]
        if(item) {
          this.idList.push(index)
        }
      }
      // if(this.idList.length === 0) {
      //   Toast({
      //     message: '取消关注成功',
      //     duration: 1000,
      //     className: 'icon icon-normal'
      //   })
      // }
    },
    successBtn () {
      this.editList()
      this.show = false
      this.editGroupMore()
    },
    cancelBtn () {
      this.show = false;
    },
    addClass(obj, cls){
      var obj_class = obj.className,
          blank = (obj_class != '') ? ' ' : '';
      var added = obj_class + blank + cls;
      obj.className = added;
    },
    removeClass(obj, cls){
      var obj_class = ' '+obj.className+' ';
      obj_class = obj_class.replace(/(\s+)/gi, ' ');
      var removed = obj_class.replace(' '+cls+' ', ' ');
      removed = removed.replace(/(^\s+)|(\s+$)/g, '');
      obj.className = removed;//替换原来的 class.
    },
    hasClass(obj, cls){
      var obj_class = obj.className,
          obj_class_lst = obj_class.split(/\s+/);
      var x = 0;
      for(x in obj_class_lst) {
        if(obj_class_lst[x] == cls) {
            return true;
        }
      }
      return false;
    },
    addList(name){
      let postData = {
        name: name,
      }
      customerSrv.addGroup(postData).then(res => {
        this.getFollowList()
      }).catch(err => {
          console.log(err)
        });
    },
    addBox(){
      let that = this;
      MessageBox.prompt('',{
        message: '新建分组',
        title: '',
        showConfirmButton:true,
        showCancelButton:true,
        showInput: true,
        cancelButtonClass: 'cancelButton',
        confirmButtonClass: 'msgBoxConfirmButton',
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        placeholder: '请输入分组名',
        inputValidator: (val) => {
          if (val === null) {
            return true;//初始化的值为null，不做处理的话，刚打开MessageBox就会校验出错，影响用户体验
          }
          return !(val.length > 16)
        }, inputErrorMessage: '组名必须小于16个字符'
      }).then(function(value, action){
        if(value.action == 'confirm'){
          if(value.value) {
            that.addList(value.value);
          }
          else {
            Toast({
              message: '组名不能为空',
              iconClass: 'icon icon-error',
              duration: 1000
            })
            return
          }
        }
      }).catch(err => {
        if (err == 'cancel') {
          console.log('cancel');
        }
      });
    },
  },
  components: {
    MessageBox,
    Toast,
  }
}
</script>
<style lang="less" scoped>

.overlayer{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 10;
}
.msgbox-container{
  position: fixed;
  top:50%;
  left:50%;
  width: 85%;
  background: #fff;
  color: #555;
  border-radius: 0.8rem;
  transform:translate(-50%,-50%) scale(1, 1);
  header{
    margin: 0;
    padding: 10px 0;
    text-align: center;
    color: #333;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    border-radius: 20px 20px 0 0;
    background: #fff;
    border-width: 0;
    border-bottom: 1px solid #ccc;/*no*/
  }
  .content-body{
    font-size: 14px;
    margin: 20px 10px;
    line-height: 2;
    max-height: 320px;
    overflow-y: auto;
    color: #666;
    text-align: center;
    input{
      display: none;
    }
    div{
      padding: 0 10px;
      text-align: justify;
      word-break: break-all;
    }
    .center{
      text-align: center;
    }
    label{
      width: 100%;
      height: 30px;
      display: inline-block;
      line-height: 30px;
      position: relative;
      text-align: left;
    }
    label:active{
      background: #EEEEEE;
    }
    label:after{
      content: "";
      width: 13px;
      height: 13px;
      display: inline-block;
      position: absolute;
      top: 6px;
      right: 10px;
      background: #FFF url(../assets/img/icon-non-check.png) no-repeat;
      background-size: 100% 100%;
    }
    input:checked+label:after{
      width: 13px;
      height: 13px;
      background: #FFF url(../assets/img/icon-checked.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  footer {
    width: 100%;
    text-align: center;
    display: block !important;
    border-width: 0;
    border-top: 1px solid #ccc;/*no*/
    overflow: hidden;
    background: transparent;
    border-radius: 0 0 20px 20px;
    .button{
      float: left;
      padding: 10px 0;
      width: 50%;
      color: #999;
      box-sizing: border-box;
      line-height: 30px;
      font-size: 16px;
      background: #f7f7f7;
      border-right: 1px solid #D5D7D6;/*no*/
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
    }
    .button:first-child:nth-last-child(1) {
        width: 100%;
    }
    .button:first-child:nth-last-child(2) ~ .button {
        width: 50%;
        color: #D24545;
    }
  }
}
.msgbox-enter,.msgbox-leave-to{
  -webkit-transform:  translate(-50%,-50%) scale(0,0);
}
.msgbox-enter-active,.msgbox-leave-active{
  -webkit-transition: all .3s;
  transition: all .3s;
}
.msgbox-enter-to,.msgbox-leave{
    -webkit-transform:  translate(-50%,-50%) scale(1,1);
}
.left{
  display: inline-block;
}
.add-img{
  position: relative;
  width: 13px;
  height: 13px;
  top: 3px;
  right: -4.92rem;
}
</style>
