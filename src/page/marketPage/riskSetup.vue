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
      title: '风险推送设置',
      value: true,
      map_name2subName: {
        //风险事件规则
        '企业关联开庭公告':'统计时间内，目标企业以设定角色关联的开庭公告',
        '企业关联法院公告':'统计时间内，目标企业以设定角色关联的法院公告',
        '企业关联案件审判流程':'统计时间内，目标企业以设定角色关联的审判流程',
        '企业关联判决结果':'统计时间内，目标企业以设定角色关联的判决结果',
        '企业失信被执行':'统计时间内，目标企业失信被执行金额大于等于设定值',
        '企业欠税被披露':'统计时间内，目标企业欠税金额大于等于设定值',
        '企业被行政处罚':'推送统计时间区间内，企业关联的行政处罚信息',
        '企业的经营状态变为异常状态':'目标企业经营状态变为设定的经营状态集合中的某个状态',
        '企业法定代表人频繁变更':'统计时间内，目标企业法定代表人变更次数大于等于设定值',
        '企业高管频繁变更':'统计时间内，目标企业高管变更次数大于等于设定值',

        '企业注册资本频繁变更':'统计时间内，目标企业注册资本变更次数大于等于设定值',
        '企业股东频繁变更':'统计时间内，目标企业股东变更次数大于等于设定值',
        '企业名字频繁变更':'统计时间内，目标企业名字变更次数大于等于设定值',
        '企业经营地址频繁变更':'统计时间内，目标企业地址变更次数大于等于设定值',
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
        type: 'risk'
      }
      businessSrv.getEventSetting(queryParam).then(res => {
        this.list = res.data
        this.matchSetting(res.data)
      })
    },
    matchSetting(settingArray) {
      if (settingArray && Array.isArray(settingArray)) {
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
