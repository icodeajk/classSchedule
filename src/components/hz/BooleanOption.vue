<template>
<div>
  <hz-cell
    type="accordion"
    v-for="(filterItem, key) in booleanOption"
    :title="filterItem.value.name"
    key="genUniqueKey(filterItem)"
    :value="filterItem.value.label"
    >
    <!-- <div slot-scope="props">{{ props.text }}</div> -->
    <div class="money-board">
      <ul class="tag-list">
        <li class="tag"
          v-for="(item, index) in booleanOption[key].metaData"
          @click="selectTag(filterItem, item, index)"
          :class="['tag', {selected: index === filterItem.valueIndex}]"
        >{{ item.label }}</li>
      </ul>
    </div>
  </hz-cell>
</div>
</template>

<script>
import hzCell from '@/components/hz/Cell.vue'

export default {
  props: {
    booleanOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      toastInstance: null,
      iconArrowType: '',
    }
  },
  methods: {
    // valueChange(filterItem) {
    //   let diyItem = filterItem.diyItem
    //   filterItem.valueIndex = -1
    //   if (diyItem.from === '' && diyItem.to === '') {
    //     diyItem.label = '全部'
    //   } else {
    //     diyItem.label = diyItem.from + '-' + diyItem.to + diyItem.unit
    //   }
    //   filterItem.value = diyItem
    //   this.$forceUpdate()
    // },
    selectTag(filterItem, value, index) {
      filterItem.diyItem.from = ''
      filterItem.diyItem.to = ''
      filterItem.diyItem.label = '全部'
      filterItem.value = value
      filterItem.valueIndex = index
      let islisted = false
      if (filterItem.value.name === '是否上市') {
        if (filterItem.value.label === '是') {
          islisted = true
        }
        else islisted = false
        this.$emit('islisted', islisted)
      }
      console.log(islisted)
      this.$forceUpdate()
    }
  },

  components: {
    hzCell
  }
}
</script>

<style scoped lang="less">
  .input-shape-ellipse {
    box-sizing: border-box;
    width: 163px;
    height: 34px;
    border: 1px solid #979797;/*no*/
    border-radius: 17px;

    font-size: 14px;
    text-align: center;
  }
  .money-board {
    padding: 0 16px;
    .diy-area {
    }
    .tag-list {
      margin-top: 10px;
      overflow: auto;
      .tag {
        float: left;
        padding: 10px;
        border: 1px solid #E3E3E3;/*no*/
        border-radius: 17px;
        margin: 0 10px 10px 0;
        &.selected {
          color: #E25555;
          border-color: #E25555;
        }
      }
    }
  }
  .img-inlineb {
    display: inline-block;
  }
  .icon-add {
    text-align: right;
    padding: 14px 15px 14px 0;
    >img {
      width: 16px;
      vertical-align: bottom;
    }
  }
</style>
