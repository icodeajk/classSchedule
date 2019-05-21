<template>
    <div class="template-cont">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>

      <filter-list
        :total="length"
        :total_before="'共'"
        :total_after="'个'"
        >
      </filter-list>

      <scroll-view class="container" :data="tagsData" :pullup="true" @scrollToEnd="onPullingUp">
        <div>
          <div class="label-cont" v-for="(item,index) in tagsData" :key="index">
            <mt-cell
              :title="item.category"
              value="">
            </mt-cell>
            <div class="label-list">
              <div class="label-list-label " v-for="(tag,index) in item.tags" :key="index" :class='tag.hasValue?"tagActive":""'>
                {{tag | formatTag}}
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
</template>

<script>
  import filterList from '@/components/filterList.vue'
  import headerSwitch from '@/components/headerSwitch.vue'
  import customerSrv from '@/api/customerSrv'

  import BScroll from 'better-scroll'
  export default {
    data () {
      return {
        title: '企业标签列表',
        tagsData:[],
        circleList:[
          '行内客户',
          '集团客户',
          '战略行业',
        ],
        qualityList:[
          '大型企业',
          '沪市',
        ],
        traitList:[
          '行内客户',
          '集团客户',
          '战略行业',
        ],
        length: 0
      }
    },
    mounted(){
    let queryParams = {
      company: this.$route.query.company
    }
      customerSrv.companyTags(queryParams).then(res => {
        console.log(res.data)
        //   this.tagsData = [
        //   {
        //     category: '企业特质',
        //     tags: [
        //       { tagName: '所属行业', tagValue: '金融业' },
        //       { tagName: '是否上市公司', tagValue: '上市公司', valueType: 2 },
        //                   { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
        //       { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 },
        //                   { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
        //       { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 },
        //                   { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
        //       { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 },
        //                   { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
        //       { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 }
        //     ]
        //   },
        //   {
        //     category: '圈子环境',
        //     tags: [
        //       { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
        //       { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 }
        //     ]
        //   },
        //   {
        //     category: '企业素质',
        //     tags: [
        //       { tagName: '潜在客户', tagValue: '潜在客户', valueType: 2 },
        //       { tagName: '绿色金融客户', tagValue: '绿色金融客户', valueType: 2 }
        //     ]
        //   }
        // ]
        this.tagsData = res.data
        this.length = res.length
    })
    },
    methods:{
      onPullingUp(){}
    },
    components:{
      filterList,
      headerSwitch
    }
  }
</script>

<style scoped lang="less">
  .container{
    height: calc(100% - 40px);
    overflow: hidden;
    position:relative
  }
  .label-cont{
    padding-left: 16px;
    margin-bottom: 10px;
    background: #fff;
    overflow: hidden;
    .label-list{
      padding: 16px 0 10px;
      text-align: left;
      margin-right: -6px;
      .label-list-label{
        display: inline-block;
        height: 20px;
        line-height: 20px;
        padding: 0 6px;
        margin: 0 6px 6px 0;
        border: 1px solid #999;/*no*/
        border-radius: 5px;
        font-size: 12px;
        color: #999;
        background: #ffeee5;
      }
      .tagActive{
        border:1px solid #d24545;/*no*/
        color:#d24545

      }
    }
  }
</style>
