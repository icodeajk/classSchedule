<template>
  <div class="template-cont">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
    </header-switch>
    <scroll-view class="container" :data="data" :pullup="true" @scrollToEnd="onPullingUp">
      <div>
        <div class="label-cont">
          <mt-cell :title="'新建分组'" class="title" is-link value="" @click.native = "addBox">
          </mt-cell>
        </div>
        <div class="container-sub" id="container-sub" v-for="(item,index) in data" :key="index" :message="item.name">
          <mt-cell-swipe class="no-title-cell" :right="[
            {
              content: '删除',
              style: { background: '#D24545', color: '#fff' },
              handler: ()=>{deleteGroup(item.id)}
            }
          ]">
            <v-touch tag="a" v-on:tap="jumplink(item.id , item.name , item.count)">
            <!-- <div class="base-body" @click="jumplink(item.id , item.name , item.count)"> -->
              <div class="base-cont">
                <div class="base-cont-title">
                  {{item.name}}（{{item.count}}）
                </div>
              </div>
            <!-- </div> -->
            </v-touch>
          </mt-cell-swipe>
        </div>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>

  </div>
</template>

<script>
import headerSwitch from '@/components/headerSwitch.vue'
import filterList from '@/components/filterList.vue'
import customerSrv from '@/api/customerSrv'

import BScroll from 'better-scroll'
import { Cell } from 'mint-ui'
import { CellSwipe } from 'mint-ui'
import { Toast } from 'mint-ui'
import { MessageBox } from 'mint-ui';

export default {
  data() {
    return {
      scrollSize: 10,
      scrollOffset: 0,
      title: '我的关注分组',
      data: [],
      hasmore: false,
      loading: false,
      getMoreText: '',
      nextTitle: '',
      nextKey: 0,
      total: 0,
    }
  },
  mounted() {
    this.getFollowGroup()
  },
  methods: {
    getFollowGroup(loadMore = false) {
      if(!loadMore){ this.loading = true}
      let postParams = {
        follow_list_id: 0,
        count: 10,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
      }
      customerSrv.getFollowGroup(postParams).then(res => {
        if(loadMore){
          this.data = this.data.concat(res.data)
        }else{
          this.data=res.data
        }
        this.total = res.data.length
        this.loading = false
      }).catch(err => {
        this.loading = false;
      })
    },
    onPullingUp() {
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.getFollowGroup(true)
    },
    jumplink(index, name, count) {
      this.$router.push({ path: 'followCard', query: { list_id: index, name: name, count: count} })
    },
    addList(name){
      let postData = {
        name: name,
      }
      customerSrv.addGroup(postData).then(res => {
        console.log(res)
        // window.location.reload()
        this.getFollowGroup()
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
        confirmButtonText: '确定',
        // inputPlaceholder: '组名不能超过16个字符',
        cancelButtonText: '取消',
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
    deleteGroup(id){
      let postData = {
        list_id: id,
      }
      var self = this
      customerSrv.deleteGroup(postData).then(res => {
        // window.location.reload();
        self.getFollowGroup()
      })
    }
  },
  components: {
    headerSwitch,
    filterList,
    Cell,
    CellSwipe,
    Toast,
    MessageBox,
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: calc(100% - 45px);
  overflow: hidden;
  .label-cont{
    margin-bottom: 10px;
  }
}
.container-sub {
  background: #FFF;
  padding: 0 0 0 16px;
  text-align: left;
  .no-title-cell{
    border-bottom: 0.025rem solid #e3e3e3;
  }
  .base-body {
    position: relative;
    width: 100%;
    height: 100%;
    padding-right: 200px;
  }
  .base-cont {
    position: relative;
    padding: 0.4rem 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    .base-cont-title {
      color: #333;
    }
  }
  .base-cont-half {
    display: inline-block;
    width: 46%;
  }
  .line-left {
    border-left: 1px solid #e3e3e3;/*no*/
    padding-left: 16px;
    width: calc(48% - 16px);
  }
}
</style>
