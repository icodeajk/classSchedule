<template>
    <div class="filter-container" v-show="show" @click="dismiss">
      <transition name="filter-bar">
      <div class="filter-body" v-show="show" @click.stop="">
        <ul class="filter-ul">
          <li class="filter-li" v-for="(item,index) in actions" :key="index">
            <div class="filter-li-title">{{item.title}}</div>
            <div class="filter-li-cont">
              <span v-for="(subItem,subIndex) in item.list"
                    :key="subIndex"
                    class="filter-li-span"
                    :class="subItem.active ? 'active' : ''"
                    @click.stop="changeActive(subItem,index,subIndex)"
                   >
                {{subItem.name}}
              </span>
            </div>
          </li>
        </ul>
        <div class="bottom-cont">
          <div class="bottom-btn reset-btn" @click.stop="resetClick">重置</div>
          <div class="bottom-btn enter-btn" @click.stop="enterClick">完成</div>
        </div>
      </div>
      </transition>
    </div>
</template>

<script>
  export default {
    props:{
      actions:{
        default: ()=> {
          []
        }
      },
      value: {
        default: false
      }
    },
    data () {
      return {
        show: false
      }
    },
    watch: {
      show(val) {
        this.$emit('input', val);
      },
      value(val) {
        this.show = val;
      }
    },
    methods:{
      changeActive(item,index,subIndex){
        this.$emit('changeBarActive',item,index,subIndex)
      },
      resetClick(){
        this.$emit('resetClick')
      },
      enterClick(){
        this.$emit('enterClick')
      },
      dismiss(){
        this.show = false
        // this.resetClick()
      }
    }
  }
</script>

<style scoped lang="less">
  .filter-container{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    z-index: 10; // 处理华为畅5兼容性问题
    transition: all 0.3s ease;
    .filter-body{
      position: relative;
      left: 20%;
      width: 80%;
      height: 100%;
      border-left: 1px solid #eee;/*no*/
      background: #fff;
      z-index: 2;
      transition: all 0.3s ease;
      .filter-ul{
        height:calc(100% - 40px);
        padding-left: 10px;
        padding-bottom: 40px;
        overflow-y: auto;
        overflow-x: hidden;
        .filter-li{
          padding: 10px 0;
          border-bottom: 1px solid #e3e3e3;/*no*/
          &:last-child{
            border-bottom:none;
          }
          .filter-li-title{
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            color: #999;
            text-align: left;
          }
          .filter-li-cont{
            text-align: left;
            margin-right: -10px;
            .filter-li-span{
              display: inline-block;
              box-sizing: border-box;
              min-width: 90px;
              height: 32px;
              line-height: 32px;
              margin: 0 6px 6px 0;
              padding: 0 6px;
              font-size: 12px;
              border-radius: 5px;
              background: #f7f7f7;
              color: #333;
              text-align: center;
              &.active{
                background: #d24545;
                color: #fff;
              }
            }
          }
        }
      }

      .bottom-cont{
        position: absolute;
        width: 100%;
        bottom: 0px;
        text-align: center;
        font-size: 0;
        .bottom-btn{
          display: inline-block;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
        }
        .reset-btn{
          width: 30%;
          background: #f7f7f7;
          color: #d24545;
        }
        .enter-btn{
          width: 70%;
          background: #d24545;
          color: #fff;
        }
      }
    }
  }

  .filter-bar-enter,
  .filter-bar-leave-active {
    transform: translate3d(100%, 0, 0);
  }
</style>
