<template>
  <div class="filter-container">
    <div class="filter-title">
      <span class="filter-total">{{total_before}}<span class="filter-num"> {{total}} </span>{{total_after}}</span>
      <div class="filter-more" @click.stop="toggleFilter()" v-if="showFilter">
        筛选
        <img src="../assets/img/icon-filter.png" alt="" class="icon-img" >
      </div>
      <!-- <div class="filter-list" @click.stop="toggleShow()" v-if="actions.length !== 0"> -->
      <div class="filter-list">
        <slot name="other"></slot>
      </div>
      <div class="filter-list" @click.stop="toggleShow()" v-if="actions.length !==0">

        {{activeSelect.name}}
        <img src="../assets/img/icon-up.png" alt="" class="icon-img" v-if="currentValue">
        <img src="../assets/img/icon-down.png" alt="" class="icon-img" v-else>
      </div>
    </div>
    <transition name="actionsheet-float">
      <div v-show="currentValue" class="actionsheet">
        <ul class="actionsheet-list" >
          <li v-for="( item, index ) in actions"
              :key="index"
              class="mint-actionsheet-listitem"
              :class="activeSelect.name == item.name ? 'active' : '' "
              @click.stop="itemClick(item, index)">
            {{ item.name }}
          </li>
        </ul>
      </div>
    </transition>
    <div class="modal" v-show="currentValue" @click.stop="currentValue = false"></div>
  </div>
</template>

<style scoped lang="less">
  @title-height : 36px;

  .filter-container{
    position: relative;
    z-index: 2;
    .filter-title{
      position: relative;
      height: @title-height;
      line-height: @title-height;
      padding:0 16px;
      text-align: left;
      font-size: 14px;
      .filter-total{
        font-size: 12px;
        color: #bdbdbd;
        .filter-num{
          color: #d24545;
        }
      }
      .icon-img{
        display: inline-block;
        max-width: 12px;
        width: 10px;
        height: 10px;
      }
      .filter-list,.filter-more{
        float: right;
        margin-left: 24px;
      }
    }
    .filter-list{
      display: inline-block;
    }
    .filter-more{
      display: inline-block;
    }
  }

  .actionsheet{
    position: fixed;
    background: #e0e0e0;
    //top: calc(50% + @title-height/2);
    width: 100%;
    text-align: center;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    backface-visibility: hidden;
    transition: transform .3s ease-out;
    z-index: 2;
    .actionsheet-list {
      list-style: none;
      padding-left: 16px;
      margin: 0;
      background-color: #fff;
      .mint-actionsheet-listitem{
        display: block;
        width: 100%;
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        color: #333;
        text-align: left;
        &.active{
          color: #d24545;
        }
      }
    }
  }

  .modal{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0%;
    background: #000;
    opacity: 0.5;
  }

  .actionsheet-float-enter,
  .actionsheet-float-leave-active {
    transform: translate3d(-50%, 100%, 0);
  }


</style>

<script type="text/babel">

  export default {
    name: 'filterList',

    props: {
      total: {
        default: 0
      },
      total_before:{
        default: '共搜索到'
      },
      total_after:{
        default: '条结果'
      },

      //v-modal
      value: {
        default: false
      },

      //是否下拉
      filterBarShow:{
        default: false
      },

      //是否显示筛选
      showFilter: {
        default: false
      },

      activeSelect:{
        default: function () {
          return {
            name: '',
            key: ''
          }
        }
      },

      actions: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        currentValue: false
      };
    },

    watch: {
      currentValue(val) {
        this.$emit('input', val);

      },
      value(val) {
        this.currentValue = val;
      }
    },

    methods: {
      itemClick(item, index) {
        this.$emit('changeActive',item)

        this.currentValue = false;
      },
      toggleShow(){
        this.currentValue = !this.currentValue;
      },
      toggleFilter(){
        this.$emit('toggle',!this.filterBarShow)
      }
    },

    mounted() {
      if (this.value) {
        this.currentValue = true;

      }
    }
  };
</script>
