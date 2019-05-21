<template>

  <full-page ref="fullPage" :options="fullPageOptions">
    <div class="container" slot="main">
      <loading-view :showLoading="loading"></loading-view>
      <div class="title">
        <header-switch :title="title">
          <a slot="left">
            <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
          </a>
        </header-switch>
      </div>
      <div class="search-body">
        <hz-cell
          title="起点企业"
          :value="placeholder1"
          class="inner-padding"
          @click.native="togggleSearchPage(placeholder1)"
        ></hz-cell>
        <hz-cell
          title="终点企业"
          :value="placeholder2"
          class="inner-padding"
          @click.native="togggleSearchPage(placeholder2)"
        ></hz-cell>
        <hz-cell
          type="swiper"
          title="查找范围"
          class="inner-padding"
          :value="item.label"
          :key="genUniqueKey(item)"
          @click.native="showPicker('number', index)"
          v-for="(item, index) in pickers.number.selectedItems"
        >
        </hz-cell>
        <div class="btn search-btn" @click="search">搜索</div>
        <div class="btn reset-btn" @click="reset">重置</div>
      </div>
      <vue-pickers
        :show="pickers.number.show"
        :link="pickers.number.link"
        :columns="pickers.number.columns"
        :selectData="pickers.number.pickData"
        @cancel="closePicker('number')"
        @confirm="confirmSelection('number', ...arguments)"></vue-pickers>
    </div>
    <div class="full-page" slot="sub">
      <div class="title">
        <header-switch>
          <a slot="left">
            <mt-button icon="back" @click="togggleSearchPage"></mt-button>
          </a>
          <mt-search :autofocus="isfocus" v-model="searchVal" slot="center" class="inner-search" cancel-text="取消" placeholder="请输入企业名">
          </mt-search>
        </header-switch>
      </div>
      <filter-list :total="total" :total_before="'共'" :total_after="'个企业'">
      </filter-list>
      <scroll-view class="container" :data="searchResultList" :pullup="true" @scrollToEnd="onPullingUp">
        <div>
          <search-relate :actions="searchResultList" @company="company"></search-relate>
          <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
        </div>
      </scroll-view>
    </div>
  </full-page>
</template>

<script>
import store from '@/store'
import {SAVE_CURRENT,CHANGESCROLLTOFLAG} from '@/store/mutation-types'
import homeSrv from '@/api/homeSrv'
import businessSrv from '@/api/businessSrv'
import customerSrv from '@/api/customerSrv'
import vuePickers from '@/components/vue-pickers'
import { numbers } from './metaData/number'
import filterList from '@/components/filterList.vue'
import searchRelate from '@/components/searchRelate.vue'
import headerSwitch from '@/components/headerSwitch.vue'
import hzCell from '@/components/hz/Cell.vue'
import fullPage from '@/components/hz/FullPage.vue'
import vSelect from 'vue-select'
import { Toast } from 'mint-ui'

export default {
  data() {
    return {
      title: '找关系',
      loading: false,
      total: 0,
      isfocus: false,
      getMoreText: '',
      isnormal: true,
      inputfocus: true,
      placeholder1: '请输入起点企业名称',
      placeholder2: '请输入终点企业名称',
      searchVal: '',
      whichinput: '',
      scrollOffset: 0,
      scrollSize: 10,
      searchResultList: [],
      data: [],
      fullPageOptions: {
        type: 'toggle',
        from: 'right'
      },
      pickers: {
        number: {
          show: false,
          columns: 1,
          link: false,
          pickData: {
            data1: numbers
          },
          selectedIndex: 0,
          selectedItems: [{label:'10 层内关联', value: '10'}]
        }
      },
      options: {
        edges: [
          {
            class: "invest",
            visible: true,
            trace_depth: 1,
            cn_name: "投资"
          },
          {
            class: "shareholder",
            visible: true,
            trace_depth: 1,
            cn_name: "股东"
          },
          {
            class: "officer",
            visible: true,
            trace_depth: 1,
            cn_name: "高管"
          },
          {
            class: "family",
            visible: true,
            trace_depth: 1,
            cn_name: "亲属"
          },
          {
            class: "concert",
            visible: true,
            trace_depth: 1,
            cn_name: "一致行动人"
          },
          {
            class: "control_shareholder",
            visible: true,
            trace_depth: 1,
            cn_name: "控股股东"
          },
          {
            class: "actual_controller",
            visible: true,
            trace_depth: 1,
            cn_name: "实际控制人"
          },
          {
            class: "person_merge",
            visible: true,
            trace_depth: 1,
            cn_name: "可融合"
          },
          {
            class: "tradable_share",
            visible: true,
            trace_depth: 1,
            cn_name: "股东"
          },
          {
            class: "party_bid_from",
            visible: false,
            trace_depth: 1,
            cn_name: "甲方"
          },
          {
            class: "party_bid_to",
            visible: false,
            trace_depth: 1,
            cn_name: "乙方"
          },
          {
            class: "sue_relate_from",
            visible: false,
            trace_depth: 1,
            cn_name: "起诉"
          },
          {
            class: "sue_relate_to",
            visible: false,
            trace_depth: 1,
            cn_name: "被起诉"
          },
          {
            class: "plaintiff_relate",
            visible: false,
            trace_depth: 1,
            cn_name: "同为原告"
          },
          {
            class: "defendant_relate",
            visible: false,
            trace_depth: 1,
            cn_name: "同为被告"
          },
          {
            class: "guarantee",
            visible: false,
            traceDepth: 1
          },
          {
            class: "money_flow",
            visible: false,
            traceDepth: 1
          }
        ],
        min_weight: 0,
        max_length: 10,
        filter: {
          edge: {
            invest: {
              invest_amount: {},
              invest_ratio: {}
            },
            shareholder: {
              shareholder_ratio: {},
              shareholder_type: [
                "Person",
                "Company"
              ]
            },
            tradable_share: {
              tradable_type: [
                "Person",
                "Company"
              ]
            },
            officer: {
              position: [
                "董事",
                "监事",
                "法定代表人",
                "其他高管"
              ]
            },
            sue: {
              type: []
            },
            guarantee: {
              guarantee_date: {},
              guarantee_amount: {}
            },
            money_flow: {
              money_flow_date: {},
              money_flow_amount: {}
            }
          },
          vertex: {
            Company: {
              capital: {},
              company_type: [],
              operation_startdate: {}
            },
            Bid_detail: {
              publish_time: {}
            },
            Judgement_wenshu: {
              case_date: {}
            },
            Court_bulletin_doc: {
              court_time: {}
            },
            Judge_process: {
              filing_date: {}
            },
            Court_announcement_doc: {
              bulletin_date: {}
            }
          }
        },
        expand: [],
        exclude: []
      }
    }
  },
  mounted() {
  },
  created() {
    this.$watch('searchVal', this.debounce((newSearchText) => {
      if (newSearchText) {
        this.getMoreText = ''
        this.scrollOffset = 0;
        this.seachHttp()
      } else {
        this.searchResultList = []
        this.getMoreText = ''
        this.scrollOffset = 0;
        this.total = 0;
        this.data = [];
      }
    }, 500))
  },
  watch: {
    // searchVal(val) {
    //   if (val) {
    //     this.getMoreText = ''
    //     this.seachHttp()
    //     this.scrollOffset = 0;
    //   } else {
    //     this.searchResultList = []
    //     this.getMoreText = ''
    //     this.scrollOffset = 0;
    //     this.total = 0;
    //     this.data = [];
    //   }
    // }
  },
  methods: {
    togggleSearchPage(text = '') {
      this.closePicker('number')
      this.searchVal = ''
      this.getMoreText = ''
      if(text)
      this.isfocus = true
      else this.isfocus = false
      this.$refs.fullPage.toggle()
      if(text === this.placeholder1) {
        this.whichinput = 'first'
      }
      else if(text === this.placeholder2) {
        this.whichinput = 'two'
      }
    },
    search() {
      this.closePicker('number')
      this.loading = true
      let optionsParam = {}
      let queryParamsObj = {}
      queryParamsObj.company1 = this.placeholder1
      queryParamsObj.company2 = this.placeholder2
      if(queryParamsObj.company1 == '请输入起点企业名称' || queryParamsObj.company2 == '请输入终点企业名称') {
        Toast({
          message: '公司名不能为空',
          iconClass: 'icon icon-error',
          duration: 1000
        })
        this.loading = false
        return
      }
      optionsParam.options = this.options
      let p1 = customerSrv.findRelation(queryParamsObj, optionsParam).then(res => {
        if(typeof(res) === "undefined"){
          localStorage.setItem('relate', JSON.stringify(''))
        }
        else{
          localStorage.setItem('relate', JSON.stringify(res.data))
        }
      })
      let p2 = customerSrv.findRelationCom1(queryParamsObj, optionsParam).then(res => {
        // console.log(res.data)
        if(res.data){
          localStorage.setItem('relate01', JSON.stringify(res.data))
        }
      })
      let p3 = customerSrv.findRelationCom2(queryParamsObj, optionsParam).then(res => {
        // console.log(res.data)
        if(res.data){
          localStorage.setItem('relate02', JSON.stringify(res.data))
        }
      })
      Promise.all([p1,p2,p3]).then(() => {
        if(this.isnormal){
          this.loading = false
          // window.location.href = "/#/findRelation/result"
          this.$router.push({
            name: 'findRelationResult'
          })
        }
      }).catch((error) => {
        this.loading = false
        console.log(error)
      })
    },
    reset() {
      this.placeholder1 = '请输入起点企业名称'
      this.placeholder2 = '请输入终点企业名称'
      this.pickers.number.selectedIndex = 0
      this.pickers.number.selectedItems = [{label:'10 层内关联', value: '10'}]
      this.options.max_length = 10
    },
    closePicker(type) {
      this.pickers[type].show = false
    },
    confirmSelection(type, val) {
      let pickerConfig = this.pickers[type]
      pickerConfig.show = false
      let selectedItem = pickerConfig.selectedItems[pickerConfig.selectedIndex]
      let selectedLabels = []
      for(let i = 1, l = pickerConfig.columns; i <= l; i++) {
        selectedLabels.push(val['select' + i].text)
      }
      selectedItem.label =  selectedLabels.join(' ')
      selectedItem.value = val
      this.options.max_length = val.select1.value
    },
    showPicker(type, index) {
      // debugger
      this.pickers[type].selectedIndex = index
      this.pickers[type].show = true
    },
    seachHttp(callback, loadMore = false) {
      if(loadMore==false){
        this.loading = true
      }
      homeSrv.search({
        keyword: this.searchVal,
        offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
        size: this.scrollSize
      })
      .then(res => {
        if (loadMore) {
          this.searchResultList = this.searchResultList.concat(
            res.data.results
          )
        } else {
          this.searchResultList = res.data.results
        }
        this.total = res.data.total
        this.loading = false
        if (callback && typeof callback == 'function') {
          callback()
        }
      })
      .catch(err => {
        this.loading = false;
      })
    },
    company(company) {
      if(this.whichinput === 'first') {
        this.placeholder1 = company
      }
      else if(this.whichinput === 'two') {
        this.placeholder2 = company
      }
      this.togggleSearchPage()
    },
    onPullingUp() {
      var scrollFresh = () => {}
      if(this.scrollSize * (this.scrollOffset+1) >= this.total){
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      this.seachHttp(scrollFresh, true)
    },
  },
  components: {
    headerSwitch,
    hzCell,
    vSelect,
    vuePickers,
    filterList,
    searchRelate,
    fullPage
  }
}
</script>

<style scoped lang="less">
.container {
  background: #eee;
  height: calc(100%);
  overflow: hidden;
  position:relative
}

.icon-img {
  display: inline-block;
  line-height: 40px;
  height: 16px;
  margin-right: 6px;
}

.mint-search{
  height: auto;
}
.search-body{
  padding-top: 10px;
  .inner-padding {
    margin-top: 0;
    border-top: 0.025rem solid #F0F2F3;
  }
  .btn {
    width: 85%;
    height: 45px;
    border-radius: 10px;
    font-size: 14px;
    margin: 0px auto;
    text-align: center;
    line-height: 40px;
  }
  .search-btn {
    position: relative;
    margin-top: 30px;
    background-color: #D24545;
    color: #fff;
  }
  .reset-btn {
    position: relative;
    margin-top: 20px;
    border: 1px solid #D1D1D1;/*no*/
    color: #767676;
  }
}
.full-page {
    position: relative;
    height: 100%;
    overflow: hidden;
    .container {
      position: relative;
      height: calc(100% - 2rem);
      overflow: hidden;
      &.bigger {
        height: calc(100% - 140px);
      }
      .container {
        height: calc(100% - 140px);
        overflow: hidden;
        position:relative;
        .get-more{
          font-size: 24px;
        }
      }
    }
  }
</style>
