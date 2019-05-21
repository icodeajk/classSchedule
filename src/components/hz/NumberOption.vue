<template>
<div>
  <hz-cell
    type="accordion"
    v-for="(filterItem, key) in numberOption"
    :title="filterItem.value.name"
    :key="genUniqueKey(filterItem)"
    :value="filterItem.value.label"
    >
    <!-- <div slot-scope="props">{{ props.text }}</div> -->
    <div class="money-board">
      <div class="diy-area">
        <input class="input-shape-ellipse" :placeholder="filterItem.value.placeholder1" v-model="filterItem.diyItem.from" @keyup="valueChange(filterItem)"/>
        <span>--</span>
        <input class="input-shape-ellipse" :placeholder="filterItem.value.placeholder2" v-model="filterItem.diyItem.to" @keyup="valueChange(filterItem)"/>
      </div>
      <ul class="tag-list">
        <li class="tag"
          v-for="(item, index) in numberOption[key].metaData"
          :key="index"
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
    numberOption: {
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
    valueChange(filterItem) {
      let diyItem = filterItem.diyItem
      filterItem.valueIndex = -1
      if (diyItem.from === '' && diyItem.to === '') {
        diyItem.label = '全部'
      } else {
        diyItem.label = diyItem.from + '-' + diyItem.to + diyItem.unit
      }
      filterItem.value = diyItem
      this.$forceUpdate()
    },
    selectTag(filterItem, value, index) {
      filterItem.diyItem.from = ''
      filterItem.diyItem.to = ''
      filterItem.diyItem.label = '全部'
      filterItem.value = value
      filterItem.valueIndex = index
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
</style>
