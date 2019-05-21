<template>
    <div class="baseIcon-cont">
        <mt-cell :title="title" value="">
        </mt-cell>
        <div class="baseIcon-list">
            <a :href="isEmpty(item.total)?'javascript:void(0)':item.href" class="baseInfo-list-link" v-for="(item,index) in data" :key="index">
                <div class="baseIcon-logo">
                    <img :src="isEmpty(item.total)?item.imgDisabledUrl:item.imgActiveUrl" alt="" >
                </div>
                <div class="baseIcon-describe">
                    <div class="baseIcon-describe-title">
                        {{item.title}}
                    </div>
                    <div class="baseIcon-describe-sub" v-if="isArray(item.total)">
                        {{item.preDesc[0]}}{{item.total[0]}},{{item.preDesc[1]}}{{item.total[1]}}
                    </div>
                    <div class="baseIcon-describe-sub" v-else>
                        {{item.preDesc}}{{item.total}}{{item.endDesc}}
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>
<script>
import { Cell } from 'mint-ui'

export default {
  name: 'baseSubCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  components: {
    Cell
  },
  data() {
    return {}
  },

  methods: {
    isArray(total){
      return Array.isArray(total)
    },
    isEmpty(total){
      if(Array.isArray(total)){
        return total.every((element)=>element==0)
      }
      return total == 0
    }
  }
}
</script>
<style lang="less">
.baseIcon-cont {
  margin-top: 10px;
  padding-left: 10px;
  background: #fff;
  text-align: left;
  .baseInfo-list-link {
    display: inline-block;
    display:flex;
    width: 48%;
    padding: 16px 0;
    vertical-align: top;

    .baseIcon-logo {
      display: inline-block;
      margin-right: 6px;
      img{
        width:40px;
        height:40px
      }

    }
    .baseIcon-describe {
      display: inline-block;
      vertical-align: top;

      .baseIcon-describe-title {
        font-size: 14px;
        color: #333;

      }
      .baseIcon-describe-sub {
        font-size: 12px;
        color: #999;
        margin-top: 14px;
      }
    }
  }
}
.baseIcon-list{
  display:flex;
  flex-wrap:wrap
}
</style>
