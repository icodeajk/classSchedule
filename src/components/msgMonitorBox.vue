<template>
  <div v-if="show" class="overlayer">
    <transition name="msgMonitorBox">
      <div class="msgbox-container" :class="className">
        <header>{{title}}</header>
        <div class="content-body">
          <div>
            <div class="groupList">
              <input type="checkbox" name="checkbox" v-model="risk" id="1"/><label :for="1">风险事件</label>
              <input type="checkbox" name="checkbox" v-model="marketing" id="2"/><label :for="2">营销机会</label>
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
      title: '选择监控事项',
      content: '',
      confirm: '确定',
      cancel:'',
      className:'',
      option: [],
      idList:[],
      company: '',
      risk: 0,
      marketing: 0,
    }
  },
  // props:{
  //   company:{
  //     type: String,
  //     default: function() {
  //       return ''
  //     }
  //   }
  // },
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
  beforeMount() {
    //如果已经存在，则阻止出现第二次
    let node = document.querySelector('.overlayer')
    if (node && node.parentNode) {
      node.parentNode.removeChild(node)
    }
  },
  methods: {
    editGroupMore(){
      let postParams = {
        risk_notify: this.risk ? true : false,
        marketing_notify: this.marketing ? true : false,
        closely_risk_notify: this.risk ? true : false,
        closely_marketing_notify: this.marketing ? true : false,
        company: this.company,
      }
      customerSrv.toggleMonitor(postParams).then(res => {
        console.log(postParams)
        if(!this.risk && !this.marketing) {
          let instance = Toast({
            message: '取消监控成功',
            iconClass: 'icon icon-normal',
            duration: 1000
          })
          setTimeout(() => {
            instance.close()
            // window.location.reload()
            bus.$emit('is_monitored', false)
          }, 500)
        }
        else {
          let instance = Toast({
            message: '设置成功',
            iconClass: 'icon icon-normal',
            duration: 1000
          })
          setTimeout(() => {
            instance.close()
            // window.location.reload()
            bus.$emit('is_monitored', true)
          }, 500)
        }
      })
    },
    editList() {
      for(var index in this.option){
        var item = this.option[index]
        if(item.checked){
          this.idList.push(item.id)
        }
      }
      // if(this.idList.length === 0) {
      //   Toast({
      //     message: '取消监控成功',
      //     duration: 1000,
      //     className: 'icon icon-normal'
      //   })
      // }
    },
    successBtn () {
      this.editList()
      this.show = false
      bus.$emit('monitor_status', {risk: this.risk, marketing: this.marketing})
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
        console.log(res)
        // window.location.reload();
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
</style>
