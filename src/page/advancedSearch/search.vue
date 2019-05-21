<template>
  <full-page ref="fullPage" :options="fullPageOptions">
    <div class="cortainer" slot="main">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>
      <div class="search-body"  ref="scrollDom">
        <div>
          <hz-cell
            title="基本信息"
            type="accordion"
            class="inner-padding"
            >
            <hz-cell
              :type="index > 0 ? 'swiper' : 'normal'"
              :btn-config="btnConfig"
              :remove-item="removeSelectionItem.bind(this, 'area', index)"
              title="区域"
              :value="item.label"
              :key="genUniqueKey(item)"
              @click.native="showPicker('area', index)"
              v-for="(item, index) in pickers.area.selectedItems"
            ></hz-cell>
            <div v-if="pickers.area.selectedItems[0].label !== '全部'" @click="addSelectionItem('area', ...arguments)" class="icon-search-add"><img class="img-inlineb" src="../../assets/img/icon-red-add.png" width="12px"/></div>
            <hz-cell
              :type="index > 0 ? 'swiper' : 'normal'"
              :btn-config="btnConfig"
              title="行业"
              :value="item.label"
              :key="genUniqueKey(item)"
              :remove-item="removeSelectionItem.bind(this, 'industry', index)"
              @click.native="showPicker('industry', index)"
              v-for="(item, index) in pickers.industry.selectedItems"
            ></hz-cell>
            <div v-if="pickers.industry.selectedItems[0].label !== '全部'" @click="addSelectionItem('industry',  ...arguments)" class="icon-search-add"><img class="img-inlineb" src="../../assets/img/icon-red-add.png" width="12px"/></div>
            <hz-cell
              :type="index > 0 ? 'swiper' : 'normal'"
              :btn-config="btnConfig"
              title="经营状态"
              :value="item.label"
              :key="genUniqueKey(item)"
              :remove-item="removeSelectionItem.bind(this, 'marketStatu', index)"
              @click.native="showPicker('marketStatu', index)"
              v-for="(item, index) in pickers.marketStatu.selectedItems"
            ></hz-cell>
            <div v-if="pickers.marketStatu.selectedItems[0].label !== '全部'" @click="addSelectionItem('marketStatu',  ...arguments)" class="icon-search-add"><img class="img-inlineb" src="../../assets/img/icon-red-add.png" width="12px"/></div>
            <number-option :number-option="numberFilterOptions.basic"/>
            <boolean-option :boolean-option="numberFilterOptions.basic_boolean" @islisted="islisted"/>
            <hz-cell
              v-if="isexpand"
              :type="index > 0 ? 'swiper' : 'normal'"
              :btn-config="btnConfig"
              :remove-item="removeSelectionItem.bind(this, 'listedStatu', index)"
              title="上市状态"
              :value="item.label"
              :key="genUniqueKey(item)"
              @click.native="showPicker('listedStatu', index)"
              v-for="(item, index) in pickers.listedStatu.selectedItems"
            ></hz-cell>
            <div v-if="pickers.listedStatu.selectedItems[0].label !== '全部'" @click="addSelectionItem('listedStatu', ...arguments)" class="icon-search-add"><img class="img-inlineb" src="../../assets/img/icon-red-add.png" width="12px"/></div>
            <hz-cell
              v-if="isexpand"
              :type="index > 0 ? 'swiper' : 'normal'"
              :btn-config="btnConfig"
              :remove-item="removeSelectionItem.bind(this, 'listedPlate', index)"
              title="上市板块"
              :value="item.label"
              :key="genUniqueKey(item)"
              @click.native="showPicker('listedPlate', index)"
              v-for="(item, index) in pickers.listedPlate.selectedItems"
            ></hz-cell>
            <div v-if="pickers.listedPlate.selectedItems[0].label !== '全部'" @click="addSelectionItem('listedPlate', ...arguments)" class="icon-search-add"><img class="img-inlineb" src="../../assets/img/icon-red-add.png" width="12px"/></div>
            <number-option :number-option="numberFilterOptions.basic_listedtime" v-if="isexpand"/>
          </hz-cell>
          <hz-cell
            title="经营特征"
            type="accordion"
          >
            <number-option :number-option="numberFilterOptions.businessCharacteristics"/>
            <boolean-option :boolean-option="numberFilterOptions.businessCharacteristics_boolean"/>
          </hz-cell>
          <hz-cell
            title="涉诉处罚"
            type="accordion"
          >
            <number-option :number-option="numberFilterOptions.prosecutionPenalty"/>
          </hz-cell>
          <div class="btn search-btn" @click="search">搜索</div>
          <div class="btn reset-btn" @click="reset">重置</div>
        </div>
        <div @touchmove.prevent>
          <vue-pickers
            :show="pickers.area.show"
            :link="pickers.area.link"
            :columns="pickers.area.columns"
            :selectData="pickers.area.pickData"
            @cancel="closePicker('area')"
            @confirm="confirmSelection('area', ...arguments)">
          </vue-pickers>
        </div>
        <div @touchmove.prevent>
          <vue-pickers
            :show="pickers.industry.show"
            :link="pickers.industry.link"
            :columns="pickers.industry.columns"
            :selectData="pickers.industry.pickData"
            @cancel="closePicker('industry')"
            @confirm="confirmSelection('industry', ...arguments)">
          </vue-pickers>
        </div>
        <div @touchmove.prevent>
          <vue-pickers
            :show="pickers.marketStatu.show"
            :link="pickers.marketStatu.link"
            :columns="pickers.marketStatu.columns"
            :selectData="pickers.marketStatu.pickData"
            @cancel="closePicker('marketStatu')"
            @confirm="confirmSelection('marketStatu', ...arguments)">
          </vue-pickers>
        </div>
        <div @touchmove.prevent>
          <vue-pickers
            :show="pickers.listedStatu.show"
            :link="pickers.listedStatu.link"
            :columns="pickers.listedStatu.columns"
            :selectData="pickers.listedStatu.pickData"
            @cancel="closePicker('listedStatu')"
            @confirm="confirmSelection('listedStatu', ...arguments)">
          </vue-pickers>
        </div>
        <div @touchmove.prevent>
          <vue-pickers
            :show="pickers.listedPlate.show"
            :link="pickers.listedPlate.link"
            :columns="pickers.listedPlate.columns"
            :selectData="pickers.listedPlate.pickData"
            @cancel="closePicker('listedPlate')"
            @confirm="confirmSelection('listedPlate', ...arguments)">
          </vue-pickers>
        </div>
      </div>
    </div>
    <div class="full-page" slot="sub">
      <div class="template-cont">
        <loading-view :showLoading="loading"></loading-view>
        <div class="title">
          <header-switch :title="title">
            <a slot="left">
              <mt-button icon="back" @click="togggleSearchPage"></mt-button>
            </a>
          </header-switch>
          <filter-list :total="total" :total_before="'搜索到'" :total_after="'条结果'" :actions='filterListArr' :activeSelect="filterListActive" @changeActive="changActive($event)">
          </filter-list>
        </div>
        <keep-alive>
          <scroll-view :class="'container '" :data="data" :pullup="true" @scrollToEnd="onPullingUp" >
            <div>
              <search-card :title="''" :data="data"></search-card>
              <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
            </div>
          </scroll-view>
        </keep-alive>
      </div>
    </div>
  </full-page>
</template>
<script>
import findRelation from '@/api/findRelation'
import monitorCard from '@/components/monitorCard.vue'
import headerSwitch from '@/components/headerSwitch.vue'
import businessSrv from '@/api/businessSrv'
import customerSrv from '@/api/customerSrv'
import filterList from '@/components/filterList.vue'
import searchCard from '@/components/searchCard.vue'
import hzCell from '@/components/hz/Cell.vue'
import NumberOption from '@/components/hz/NumberOption.vue'
import BooleanOption from '@/components/hz/BooleanOption.vue'
import vuePickers from 'vue-pickers'
// import vuePickers from '@/components/vue-pickers'
import { province, city } from './metaData/area'
import { industries,twoIndustries } from './metaData/industry'
import { marketStatu } from './metaData/marketStatus'
import { listedStatu } from '@/page/advancedSearch/metaData/listedStatus'
import { listedPlate } from '@/page/advancedSearch/metaData/listedPlates'
import { Toast } from 'mint-ui'
import BScroll from 'better-scroll'
import fullPage from '@/components/hz/FullPage.vue'
import { registered_capital,
  registered_time,
  is_listed,
  list_time,
  branch_num,
  investment_num,
  shareholders_num,
  shareholder_listed,
  shareholders_change,
  company_name_change,
  legal_man_change,
  address_change,
  member_change,
  rule_change,
  scope_change,
  pattern_num,
  win_bid_num,
  acting_bid_num,
  bid_num,
  a_tax_num,
  plaintiff_num,
  defendant_num,
  executed_money,
  executed_count,
  tax_arrears,
  tax_arrears_num,
  punish_num,
  } from './metaData/numberOptions'
export default {
  props: {

  },
  data() {
    return {
      scrollSize: 10,
      scrollOffset: 0,
      total: 0,
      searchVal: '',
      filter: {},
      sign: 0,
      data: [],
      isexpand: false,
      loading: false,
      // navActive: true,
      subType: [],
      company: this.$route.query.company,
      getMoreText: '',
      filterBarShow: true,
      savedFilterBarArr: [],
      fullPageOptions: {
        type: 'toggle',
        from: 'right'
      },
      filterListArr: [
        {
          name: '默认',
          key: ''
        },
        {
          name: '最大注册资本',
          key: 'MAX_CAPITAL'
        },
        {
          name: '最小注册资本',
          key: 'MIN_CAPITAL'
        },
        {
          name: '最早成立企业',
          key: 'MIN_REGISTER_DATE'
        },
        {
          name: '最新成立企业',
          key: 'MAX_REGISTER_DATE'
        }
      ],
      filterListActive: {
        name: '默认',
        key: ''
      },
      btnConfig: {
        btns: [
          {style: {background: '#D24545', color: '#fff'}, text: '删除', clickFn: (type, index) => {
            this.removeSelectionItem(type, index, event)
          }}
        ]
      },
      pickers: {
        area: {
          show: false,
          columns: 2,
          link: true,
          pickData: {
            data1: province,
            data2: city,
            // data3: area
          },
          selectedIndex: 0,
          selectedItems: [{label:'全部', value: null}]
        },
        industry: {
          show: false,
          columns: 2,
          link: true,
          pickData: {
            data1: industries,
            data2: twoIndustries
          },
          selectedIndex: 0,
          selectedItems: [{label:'全部', value: null}]
        },
        marketStatu: {
          show: false,
          columns: 1,
          link: false,
          pickData: {
            data1: marketStatu,
          },
          selectedIndex: 0,
          selectedItems: [{label:'全部', value: null}]
        },
        listedStatu: {
          show: false,
          columns: 1,
          link: false,
          pickData: {
            data1: listedStatu,
          },
          selectedIndex: 0,
          selectedItems: [{label:'全部', value: null}]
        },
        listedPlate: {
          show: false,
          columns: 1,
          link: false,
          pickData: {
            data1: listedPlate,
          },
          selectedIndex: 0,
          selectedItems: [{label:'全部', value: null}]
        },
      },
      title: '高级搜索',
      numberFilterOptions: {

        // 基本信息下
        basic: {
          registered_capital: {
            metaData: registered_capital,
            value: registered_capital[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '注册资本',
              label: '全部',
              placeholder1: '最低',
              placeholder2: '最高',
              unit: '万'
            }
          },
          registered_time: {
            metaData: registered_time,
            value: registered_time[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '注册时间',
              label: '全部',
              placeholder1: '最低',
              placeholder2: '最高',
              unit: '年'
            }
          },
        },

        // 基本信息-boolean类型
        basic_boolean: {
          is_listed: {
            metaData: is_listed,
            value: is_listed[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '是否上市',
              label: '全部',
              placeholder1: 'boolean',
              placeholder2: 'boolean',
              unit: 'boolean'
            }
          },
        },

        // 基本信息-上市时间
        basic_listedtime: {
          list_time: {
            metaData: list_time,
            value: list_time[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '上市时间',
              label: '全部',
              placeholder1: '最低',
              placeholder2: '最高',
              unit: '年'
            }
          }
        },

        // 经营特征
        businessCharacteristics: {
          branch_num: {
            metaData: branch_num,
            value: branch_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '分支机构总数',
              label: '全部',
              placeholder1: '最低数目',
              placeholder2: '最高数目',
              unit: '个'
            }
          },
          investment_num: {
            metaData: investment_num,
            value: investment_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '对外投资企业数目',
              label: '全部',
              placeholder1: '最低数目',
              placeholder2: '最高数目',
              unit: '个'
            }
          },
          shareholders_num: {
            metaData: shareholders_num,
            value: shareholders_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '股东数目',
              label: '全部',
              placeholder1: '最低数目',
              placeholder2: '最高数目',
              unit: '个'
            }
          },
          shareholders_change: {
            metaData: shareholders_change,
            value: shareholders_change[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '股东变更',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          company_name_change: {
            metaData: company_name_change,
            value: company_name_change[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '公司名变更',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          legal_man_change: {
            metaData: legal_man_change,
            value: legal_man_change[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '法定代表人变更',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          address_change: {
            metaData: address_change,
            value: address_change[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '地址变更',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          member_change: {
            metaData: member_change,
            value: member_change[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '成员变更',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          rule_change: {
            metaData: rule_change,
            value: rule_change[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '章程变更',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          scope_change: {
            metaData: scope_change,
            value: scope_change[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '经营范围变更',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          pattern_num: {
            metaData: pattern_num,
            value: pattern_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '专利总数',
              label: '全部',
              placeholder1: '最低数目',
              placeholder2: '最高数目',
              unit: '个'
            }
          },
          win_bid_num: {
            metaData: win_bid_num,
            value: win_bid_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年中标次数',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          acting_bid_num: {
            metaData: acting_bid_num,
            value: acting_bid_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年代理招标次数',
              label: '全部',
              placeholder1: '最低数目',
              placeholder2: '最高数目',
              unit: '个'
            }
          },
          bid_num: {
            metaData: bid_num,
            value: bid_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年发布招标次数',
              label: '全部',
              placeholder1: '最低数目',
              placeholder2: '最高数目',
              unit: '个'
            }
          },
          a_tax_num: {
            metaData: a_tax_num,
            value: a_tax_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近三年纳税等级为A的次数',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },

        },
        //经营特征-boolean类型
        businessCharacteristics_boolean: {
          shareholder_listed: {
            metaData: shareholder_listed,
            value: shareholder_listed[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '股东是否有上市公司',
              label: '全部',
              placeholder1: 'boolean',
              placeholder2: 'boolean',
              unit: 'boolean'
            }
          },
        },
        // 涉诉处罚
        prosecutionPenalty: {
          plaintiff_num: {
            metaData: plaintiff_num,
            value: plaintiff_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年作为原告的涉案次数',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          defendant_num: {
            metaData: defendant_num,
            value: defendant_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年作为被告的涉诉次数',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          executed_money: {
            metaData: executed_money,
            value: executed_money[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年失信被执行金额',
              label: '全部',
              placeholder1: '最低',
              placeholder2: '最高',
              unit: '万'
            }
          },
          executed_count: {
            metaData: executed_count,
            value: executed_count[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年失信被执行次数',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          tax_arrears: {
            metaData: tax_arrears,
            value: tax_arrears[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年欠税金额',
              label: '全部',
              placeholder1: '最低',
              placeholder2: '最高',
              unit: '万'
            }
          },
          tax_arrears_num: {
            metaData: tax_arrears_num,
            value: tax_arrears_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年欠税次数',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
          punish_num: {
            metaData: punish_num,
            value: punish_num[0],
            valueIndex: 0,
            diyItem: {
              from: '',
              to: '',
              name: '近一年被行政处罚的次数',
              label: '全部',
              placeholder1: '最低次数',
              placeholder2: '最高次数',
              unit: '次'
            }
          },
        }
      },

      queryConfig: {
        offset: 0,
        count: 10,
        market_sort: 0,
        risk_sork: 0,
        is_listed: null,
        location_map: {},
        industries: [],
        shareholder_listed: null,
        registered_time: null,
        /* 数值区间类的参数 start */
        registered_capital: null,
        branch_num: null,
        investment_num: null,
        shareholders_num: null,
        shareholders_change: null,
        company_name_change: null,
        legal_man_change: null,
        address_change: null,
        member_change: null,
        rule_change: null,
        scope_change: null,
        pattern_num: null,
        win_bid_num: null,
        acting_bid_num: null,
        bid_num: null,
        a_tax_num: null,
        plaintiff_num: null,
        defendant_num: null,
        executed_money: null,
        executed_count: null,
        tax_arrears: null,
        tax_arrears_num: null,
        industries: null,
        punish_num: null
        /* 数值区间类的参数 end */

      },
    }
  },
  mounted(){
    let wrapper = this.$refs.scrollDom
    this.$nextTick(() => {
      this.scroll = new BScroll(wrapper, {click: true})
    })
  },
  computed: {
    type() {
      return this.navActive ? 'insider' : 'newregister'
    },
    // selectedregistered_capital() {
    //   if (this.queryConfig.registered_capital.from === null &&
    //       this.queryConfig.registered_capital.to === null
    //   ) {
    //     return '全部'
    //   } else {
    //     return this.queryConfig.registered_capital.from + '-'
    //           + this.queryConfig.registered_capital.to + unit
    //      }
    //   }

  },
  watch: {
    filterListActive:{
      handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollSize = 10,
        this.sign = 0,
        this.scrollOffset = 0,
        this.getMoreText = '',
        this.getSearchList()
      },
      deep: true
    }
  },
  methods: {
    textgo() {
      window.history.go(-1)
    },
    togggleSearchPage() {
      this.scrollSize = 10,
      this.scrollOffset = 0,
      this.total = 0,
      this.getMoreText = '',
      this.$refs.fullPage.toggle()
    },
    addSelectionItem(type) {
      let selectedItems = this.pickers[type].selectedItems
      if (selectedItems[selectedItems.length - 1].value === null) {
        Toast({
          message: '请先完成选择',
          iconClass: 'icon icon-error',
          duration: 1000
        })
      }
      else if(selectedItems.length > 4) {
        Toast({
          message: '最多支持5个多选项',
          iconClass: 'icon icon-error',
          duration: 1000
        })
      }
      else {
        selectedItems.push(
          {label:'未选择', value: null}
        )
      }
    },
    removeSelectionItem(type, index, event) {
      this.pickers[type].selectedItems.splice(index, 1)
        event.preventDefault()
        event.stopPropagation()
    },
    closePicker(type) {
      this.pickers[type].show = false
    },
    confirmSelection(type, val) {
      let pickerConfig = this.pickers[type]
      pickerConfig.show = false
      let selectedItem = pickerConfig.selectedItems[pickerConfig.selectedIndex]
      let selectedLabels = []
      let newLabel = ''
      for(let i = 1, l = pickerConfig.columns; i <= l; i++) {

        // 行业的一级分类不显示
        if (type === 'industry' && i === 1) {
          continue
        }
        selectedLabels.push(val['select' + i].text)
      }

      newLabel =  selectedLabels.join(' ')

      for (var i = 0, l = pickerConfig.selectedItems.length; i < l; i++) {
        if (newLabel === pickerConfig.selectedItems[i].label &&
          pickerConfig.selectedIndex !== i) {
          Toast({
            message: '选择重复，请重新选择',
            iconClass: 'icon icon-error',
            duration: 1000
          })
          return
        }
      }
      selectedItem.label =  newLabel
      selectedItem.value = val
    },
    showPicker(type, index) {
      if (type === 'area') {
        this.pickers.industry.show = false
        this.pickers.marketStatu.show = false
        this.pickers.listedStatu.show = false
        this.pickers.listedPlate.show = false
      } else if (type === 'industry') {
        this.pickers.area.show = false
        this.pickers.marketStatu.show = false
        this.pickers.listedStatu.show = false
        this.pickers.listedPlate.show = false
      } else if (type === 'marketStatu') {
        this.pickers.area.show = false
        this.pickers.industry.show = false
        this.pickers.listedStatu.show = false
        this.pickers.listedPlate.show = false
      } else if (type === 'listedStatu') {
        this.pickers.area.show = false
        this.pickers.industry.show = false
        this.pickers.marketStatu.show = false
        this.pickers.listedPlate.show = false
      } else if (type === 'listedPlate') {
        this.pickers.area.show = false
        this.pickers.industry.show = false
        this.pickers.marketStatu.show = false
        this.pickers.listedStatu.show = false
      }
      this.pickers[type].selectedIndex = index
      this.pickers[type].show = true
    },
    search() {
      var i
      var j
      var queryParamObj = ''
      var temp_location_map = {}
      var location_map = {}
      var industries = []
      var marketStatu = []
      var listedPlate = []
      var listedStatu = []
      // /* 生成 {"山西": [], "内蒙古": [{"赤峰市": ["阿鲁科尔沁旗", "松山区", "巴林左旗"]}]} start */
      // this.pickers.area.selectedItems.forEach(item => {
      //   if (item.label === '全部') return
      //   else {
      //     let province = item.value.select1.text
      //     let city = item.value.select2.text
      //     let area = item.value.select3.text
      //     let cityIndex = -1
      //     // 先生成这样的数据{'广东': {'深圳': {'南山区': true, ...}, ...}, ...}
      //     if (!temp_location_map[province]) {
      //       temp_location_map[province] = {}
      //     }
      //     if (!temp_location_map[province][city]) {
      //       temp_location_map[province][city] = {}
      //     }
      //     temp_location_map[province][city][area] = true
      //   }
      // })
      // for (var province in temp_location_map) {
      //   location_map[province] = []
      //   for (var city in temp_location_map[province]) {
      //     let cityObj = {[city]: []}
      //     for (var area in temp_location_map[province][city]) {
      //       cityObj[city].push(area)
      //     }
      //     location_map[province].push(cityObj)
      //   }
      // }
      // this.queryConfig.location_map = location_map
      // console.log(JSON.stringify(location_map))
      // /* 生成 {"山西": [], "内蒙古": [{"赤峰市": ["阿鲁科尔沁旗", "松山区", "巴林左旗"]}]} end */

      /* 生成 {"山西": [], "内蒙古": [{"赤峰市": ["阿鲁科尔沁旗", "松山区", "巴林左旗"]}]} start */
      this.pickers.area.selectedItems.forEach(item => {

        // 对应 '全部' || '未选择'
        if (item.value === null) return
        else {
          let province = item.value.select1.text
          let city = item.value.select2.text
          let cityIndex = -1
          // 先生成这样的数据{'广东': {'深圳': {'南山区': true, ...}, ...}, ...}
          if (!temp_location_map[province]) {
            temp_location_map[province] = {}
          }
          temp_location_map[province][city] = true
        }
      })
      for (var province in temp_location_map) {
        location_map[province] = []
        for (var city in temp_location_map[province]) {
          let cityObj = {[city]: []}
          // for (var area in temp_location_map[province][city]) {
          //   cityObj[city].push(area)
          // }
          location_map[province].push(cityObj)
        }
      }
      this.queryConfig.location_map = location_map
      console.log(JSON.stringify(location_map))
      /* 生成 {"山西": [], "内蒙古": [{"赤峰市": ["阿鲁科尔沁旗", "松山区", "巴林左旗"]}]} end */

      /* 获取industry数据 start */
      this.pickers.industry.selectedItems.forEach(item => {

        // 对应 '全部' || '未选择'
        if (item.value === null) return
        else industries.push(item.value.select2.text)
      })
      this.queryConfig.industries = industries
      /* 获取industry数据 end */

      /* 获取marketStatus数据 start */
      this.pickers.marketStatu.selectedItems.forEach(item => {

        // 对应 '全部' || '未选择'
        if (item.value === null) return
        else if (item.value.select1.value === '营业中') {
          let tempArr = ["在业", "存续", "在册", "开业", "在营"]
          marketStatu = marketStatu.concat(tempArr)
        } else marketStatu.push(item.value.select1.value)
      })
      this.queryConfig.business_status = marketStatu
      /* 获取marketStatus数据 end */

      /* 获取上市状态，上市板块数据 start */
      this.pickers.listedStatu.selectedItems.forEach(item => {

        // 对应 '全部' || '未选择'
        if (item.value === null) return
        listedStatu.push(item.value.select1.text)
      })
      this.queryConfig.list_status = listedStatu

      this.pickers.listedPlate.selectedItems.forEach(item => {

        // 对应 '全部' || '未选择'
        if (item.value === null) return
        listedPlate.push(item.value.select1.text)
      })
      this.queryConfig.list_sector = listedPlate
      /* 获取上市状态，上市板块数据 end */

      // 整合数值区间和boolean区间类的查询参数
      for (var i in this.numberFilterOptions) {
        for(var j in this.numberFilterOptions[i]) {
          queryParamObj = this.numberFilterOptions[i][j].value
          if(queryParamObj.label === '是' || queryParamObj.label === '否'){
            var booleannum = false
            if (queryParamObj.label === '是')
            booleannum = true
            this.queryConfig[j] = booleannum
          }
          else{
            if (!queryParamObj.from && queryParamObj.from !== 0) {
              delete queryParamObj.from
            } else {
              queryParamObj.from = parseFloat(queryParamObj.from)
            }
            if (!queryParamObj.to && queryParamObj.to !== 0) {
              delete queryParamObj.to
            } else {
              queryParamObj.to = parseFloat(queryParamObj.to)
            }

            // delete queryParamObj.unit
            // delete queryParamObj.name
            // delete queryParamObj.label
            // delete queryParamObj.placeholder1
            // delete queryParamObj.placeholder2

            if (!queryParamObj.from && !queryParamObj.to && queryParamObj.from !== 0) {
              delete this.queryConfig[j]
            } else {
              this.queryConfig[j] = queryParamObj
            }
          }
        }
      }
      // let test = {"offset":0,"count":10,"shareholder_listed":["是"],"market_sort":0,"risk_sork":0}
      // localStorage.setItem('queryConfig', JSON.stringify(this.queryConfig))
      // window.location.href = '/#/advancedSearch/searchPage'
      console.log(this.queryConfig)
      this.getSearchList()
      this.togggleSearchPage()
    },
    reset() {
      var i
      var j
      var queryParamConfig = ''
      for (var i in this.numberFilterOptions) {
        for(var j in this.numberFilterOptions[i]) {
          queryParamConfig = this.numberFilterOptions[i][j]
          queryParamConfig.value = queryParamConfig.metaData[0]
          queryParamConfig.valueIndex = 0
          queryParamConfig.placeholder1 = '最低'
          queryParamConfig.placeholder2 = '最高'
        }
      }

      // to-do 实现地域和行业的重置
      this.pickers.area.selectedIndex = 0
      this.pickers.area.selectedItems = [{label:'全部', value: null}]
      this.pickers.industry.selectedIndex = 0
      this.pickers.industry.selectedItems = [{label:'全部', value: null}]
      this.pickers.marketStatu.selectedIndex = 0
      this.pickers.marketStatu.selectedItems = [{label:'全部', value: null}]
      this.pickers.listedStatu.selectedIndex = 0
      this.pickers.listedStatu.selectedItems = [{label:'全部', value: null}]
      this.pickers.listedPlate.selectedIndex = 0
      this.pickers.listedPlate.selectedItems = [{label:'全部', value: null}]
    },
    changActive(item) {
      this.filterListActive = item
    },
    getSearchList(loadMore = false) {
      if(!loadMore){ this.loading = true}
      let searchParams = this.queryConfig
      searchParams.sort_field = this.filterListActive.key ? this.filterListActive.key : ''
      searchParams.offset = loadMore ? this.scrollSize * ++this.scrollOffset : 0
      /* 处理以万为单位的数据 */

      for(let item in searchParams) {
        if(searchParams[item].unit && searchParams[item].unit === '万') {
          if (searchParams[item].from) {
            searchParams[item].from *= 10000
          }
          if (searchParams[item].to) {
            searchParams[item].to *= 10000
          }
          searchParams[item].unit = ''
        }
      }

      customerSrv.getSearchList(searchParams).then(res => {
        if (loadMore) {
          this.data = this.data.concat(res.data.data)
        } else {
          this.data = res.data.data
        }
        this.total = res.data.total_count
        this.loading = false
        this.sign = 0
      }).catch(err => {
        this.loading = false
        this.sign = 0
      })
    },
    // 从是否上市子组件传过来的值
    islisted: function(islisted) {
      this.isexpand = islisted
    },
    onPullingUp() {
      this.sign += 1 // 防止请求连续重发，防抖还不熟悉，先这样后面再改
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }
      this.getMoreText = '加载中...'
      if (this.sign === 1)
      this.getSearchList(true)
    }
  },
  components: {
    monitorCard,
    hzCell,
    NumberOption,
    vuePickers,
    headerSwitch,
    BooleanOption,
    fullPage,
    searchCard,
    filterList,
    businessSrv,
    businessSrv
  }
}
</script>

<style scoped lang="less">
  .cortainer {
    position: relative;
    height: 100%;
    overflow: hidden;
    .btn {
      width: 85%;
      height: 45px;
      border-radius: 10px;
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
      border: 1px solid rgb(156, 155, 155);/*no*/
      color: #767676;
    }
    .search-body {
      position: relative;
      height: calc(100% - 1.5rem);
      overflow: hidden;
    }
    .img-inlineb {
      display: inline-block;
    }
    .icon-search-add {
      text-align: right;
      padding: 14px 15px 14px 0;
      >img {
        width: 16px;
        vertical-align: bottom;
      }
    }
  }
  .full-page {
    position: relative;
    height: 100%;
    overflow: hidden;
    .container {
      height: calc(100% - 80px);
      overflow: hidden;
      position:relative;
      .get-more{
        font-size: 20px;
      }
    }
  }
</style>
