<template>
  <div class="template-cont">
    <loading-view :showLoading="loading"></loading-view>
    <div class="title">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>
    </div>

    <scroll-view class="container" :data="data">
      <div>
      <div class="container-sub">
        <div class="base-cont">
          <div class="base-cont-title">
            法定代表人
          </div>
          <div class="base-cont-val">
            {{data.legal_man||'未公示'}}
          </div>
        </div>

        <div class="base-cont base-cont-half">
          <div class="base-cont-title">
            成立时间
          </div>
          <div class="base-cont-val">
            {{data.registered_date||'未公示'}}
          </div>
        </div>
        <div class="base-cont base-cont-half line-left">
          <div class="base-cont-title">
            注册资本
          </div>
          <div class="base-cont-val">
            {{data.registered_capital | formatMoney}}<span v-if="data.registered_capital && Number(data.registered_capital) !== 0">万{{data.registered_capital_unit ? data.registered_capital_unit : '元'}}</span>
          </div>
        </div>

        <div class="base-cont base-cont-half">
          <div class="base-cont-title">
            登记状态
          </div>
          <div class="base-cont-val">
            {{data.business_status||'未公示'}}
          </div>
        </div>
        <div class="base-cont base-cont-half line-left">
          <div class="base-cont-title">
            企业类型
          </div>
          <div class="base-cont-val">
            {{data.enterprise_type||'未公示'}}
          </div>
        </div>

        <div class="base-cont base-cont-half">
          <div class="base-cont-title">
            统一社会信用代码
          </div>
          <div class="base-cont-val">
            {{data.unified_social_credit_code||'未公示'}}
          </div>
        </div>
        <div class="base-cont base-cont-half line-left">
          <div class="base-cont-title">
            注册号
          </div>
          <div class="base-cont-val">
            {{data.registered_code||'未公示'}}
          </div>
        </div>

        <div class="base-cont">
          <div class="base-cont-title">
            企业地址
          </div>
          <div class="base-cont-val">
            {{data.address||'未公示'}}
          </div>
        </div>

        <div class="base-cont">
          <div class="base-cont-title">
            经营范围
          </div>
          <div class="base-cont-val">
            {{data.business_scope||'未公示'}}
          </div>
        </div>
      </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import headerSwitch from '@/components/headerSwitch.vue'
import customerSrv from '@/api/customerSrv'

export default {
  data() {
    return {
      title: '工商信息',
      loading: false,
      data: {}
    }
  },
  mounted() {
    this.getindustrylist()
  },
  methods: {
    getindustrylist(loadMore = false) {
      if(!loadMore) {
        this.loading = true
      }
      let postParams = {
      companys: [this.$route.query.company],
      shortBrief: 1
      }
      customerSrv.companyBrief(postParams).then(res => {
        if (res.data) {
          this.data = res.data[0]
        }
        this.loading = false
      }).catch(err => {
        this.loading = false;
      })
    }
  },
  components: {
    headerSwitch
  }
}
</script>

<style scoped lang="less">
.container {
  height: calc(100% - 44px);
  overflow: hidden;
  position:relative
}
.container-sub {
  margin-top: 10px;
  background: #fff;
  padding: 0 16px;
  text-align: left;
  .base-cont {
    // display: inline-block;
    padding: 16px 0;
    margin-bottom: 10px;
    font-size: 14px;
    .base-cont-title {
      color: #999;
    }
    .base-cont-val {
      margin-top: 12px;
      color: #333;
      word-break: break-all;
    }
  }
  .base-cont-half {
    display: inline-block;
    width: 46%;
    vertical-align: top;
    .base-cont-val {
      width: 130px;
    }
  }
  .line-left {
    border-left: 1px solid #e3e3e3;/*no*/
    padding-left: 16px;
    width: calc(48% - 16px);
  }
}
</style>
