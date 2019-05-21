<template>
<div>
  <div class="card-container" v-if="actions.length>0" ref='searchlistDom'>
    <ul class="list-ul">
      <li class="list-li" v-for="(item,index) in actions" :key="index">
        <mt-cell-swipe class="no-title-cell">
          <card-container :item="item"></card-container>
        </mt-cell-swipe>
      </li>
    </ul>
  </div>
  <empty-page v-else></empty-page>
</div>
</template>

<script>
import { Cell } from 'mint-ui'
import { CellSwipe } from 'mint-ui'

import emptyPage from '../components/emptyPage.vue'
import cardContainer from '@/components/cardContainer.vue'

export default {
  props: {
    actions: {
      type: Array,
      default: function() {
        return []
      }
    }

  },
  data() {
    return {
    }
  },
  mounted() {
    // this.$nextTick(function(){
    //     console.log(this.$refs.searchlistDom.offsetParent.offsetParent,this.$refs.searchlistDom.offsetHeight)
    //   if(this.actions.length>0 && (this.$refs.searchlistDom.offsetHeight>=this.$refs.searchlistDom.offsetParent.offsetParent.offsetHeight) ){

    //   this.$emit('scrollbarShow',1)
    // }

    // console.log(this.$refs.searchlistDom.offsetHeight)
    // console.log(window.innerHeight)
  },
  components: {
    emptyPage,
    cardContainer,
    Cell,
    CellSwipe
  },
  methods: {},
  watch:{}
}
</script>

<style scoped lang="less">
.card-container {
  padding-left: 16px;
  margin-bottom: 10px;
  background: #fff;
  .list-ul {
    .list-li {
      display: block;
      box-sizing: border-box;
      height: 120px;
      padding: 10px 0px;
      text-align: left;
      font-size: 12px;
      border-bottom: 1px solid #e3e3e3;/*no*/
      &:last-child {
        border-bottom: none;
      }
      .list-left {
        display: inline-block;
        float: left;
        height: 100%;
        width: 54px;
        vertical-align: middle;
        text-align: left;
        img{
          width:40px;
          height:40px
        }
      }
      .list-right {
        display: inline-block;
        width: calc(100% - 54px);
        font-size: 14px;
        color: #bdbdbd;
        .list-cont {
          .bigbottom {
            margin-bottom: 10px;
          }
          .company {
            line-height: 30px;
            font-size: 16px;
            color: #333;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            .next-line {
              display: block;
            }
          }
        }
        .tag-list{
          margin-top: 5px;
          .list-label {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            padding: 0 6px;
            margin-right: 6px;
            font-size: 12px;
            border-radius: 5px;
          }
          .list-label-green {
            color: #97ca6a;
            background: #eaf4e1;
            border: 1px solid #97ca6a;/*no*/
          }
          .list-label-blue {
            color: #60a0f0;
            background: #dfecfc;
            border: 1px solid #60a0f0;/*no*/
          }
        }
        .bigtop {
          // margin-top: 15px;
        }
      }
    }
  }
}

</style>
