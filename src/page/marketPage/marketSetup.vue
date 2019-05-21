<template>
  <div class="template-cont">
    <div class="title">
      <header-switch :title="title">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>
    </div>
    <scroll-view class="container">
      <div>
        <div class="switch-cont" v-for="(item,index) in data" :key="index">
          <div class="switch-title" v-if="item.title">
            {{item.title}}
          </div>
          <ul class="switch-ul">
            <li class="switch-li" v-for="(subItem,subIndex) in item.list" :key="subIndex">
              <div class="switch-info">
                <div class="switch-info-title">
                  {{subItem.head}}
                </div>
                <div class="switch-info-text">
                  {{subItem.describe}}
                </div>
              </div>
              <mt-switch v-model="subItem.value" @change="(checked)=>{switchHandler(checked,subIndex)}" class="switch-btn"></mt-switch>
            </li>
          </ul>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import headerSwitch from '@/components/headerSwitch.vue'
import businessSrv from '@/api/businessSrv'

export default {
  data() {
    return {
      title: '机会推送设置',
      value: true,
      map_name2subName: {
        //营销规则
        '企业股东中新出现上市企业':'目标企业新增上市股东，且出资比例大于等于设定值',
        '企业为A级纳税人':'推送新公布的企业纳税等级为A信息',
        '企业中标':'统计时间内，目标企业中标，且标书所属省份在配置的省份集合中',
        '企业新增分支机构':'目标企业新增分支机构，新增的分支机构注册资本大于等于设定值，且所在省份在配置的省份集合中',
        '企业新增对外投资':'目标企业新增对外投资，投资金额大于等于设定值或者投资比例大于等于设定值'
        //事件传导,mobile没有
      },
      data: [
        {
          title: '',
          list: [
            // {
            //   head: '企业中标',
            //   describe: '统计时间内，目标企业中标,且标书所属省份在配置的省份集合中',
            //   value: true
            // }
          ]
        }
      ],
      list: []//ajax获取的原始数据
    }
  },
  watch: {

  },
  mounted() {
    this.getSetting()
  },
  methods: {
    getSetting() {
      let queryParam = {
        type: 'market'
      }
      businessSrv.getEventSetting(queryParam).then(res => {
        this.list = res.data || []
        this.matchSetting(res.data)
      })
    },
    matchSetting(settingArray) {
      if (settingArray && Array.isArray(settingArray)) {
        this.data[0].list = [];
        settingArray.forEach((item, index) => {
          this.data[0].list.push({
            head: item.name,
            describe: this.map_name2subName[item.name],
            value: item.enable === 1 ? true : false,
            // enable: item.enable,
            // type: item.type,
            // id: item.id//'关'=>'开'则有传id
          })
        })
      }
    },
    switchHandler(checked,key){
      let settings = {
        type: this.list[key]['type'],
        id: this.list[key]['id']
      }
      if(checked){
        settings['enable'] = 0
      }else{
        settings['enable'] = 1
      }
      businessSrv.changeEventSetting(settings).then( res => {
        this.$Toast('修改成功');
        this.getSetting()
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
  height: calc(100% - 40px);
  overflow: hidden;
  .switch-cont {
    padding-top: 12px;
    .switch-title {
      height: 30px;
      line-height: 30px;
      padding: 0 16px;
      color: #999;
      font-size: 14px;
      text-align: left;
    }
    .switch-li {
      box-sizing: border-box;
      height: 80px;
      padding: 12px 16px;
      background: #fff;
      text-align: left;
      display: flex;
      justify-content: space-between;
      .switch-info {
        display: inline-block;
        max-width: 70%;
        .switch-info-title {
          color: #333;
          font-size: 16px;
        }
        .switch-info-text {
          margin-top: 8px;
          font-size: 12px;
          color: #999;
          line-height: 1.4;
        }
      }
      .switch-btn {
        float: right;
      }
    }
  }
}
</style>
