<template>
  <div class="template-cont">
    <div class="title">
      <header-switch :title="'事件详情'">
        <a slot="left">
          <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
        </a>
      </header-switch>
    </div>
    <scroll-view class="container">
      <div>

        <iframe v-show="showIframe" class="inner-iframe" name="innerIframe" id="innerIframe"></iframe>
        <div v-if="[104,115,'bid_info'].includes(eventType)">

          <div class="content-div">
            <div class="content-title">
              {{eventTitle}}
            </div>
            <div class="content-title">
              项目名称
            </div>
            <div class="content-text">
              {{commonDetail.title||'未公示'}}
            </div>
            <div class="content-title">
              中标编号
            </div>
            <div class="content-text">
              {{commonDetail.bid_id||'未公示'}}
            </div>
            <div class="content-title">
              所属城市
            </div>
            <div class="content-text">
              {{commonDetail.city||commonDetail.province||'未公示'}}
            </div>
            <div class="content-title">
              中标金额
            </div>
            <div class="content-text">
              {{commonDetail.bid_budget || '未公示'}}
            </div>
             <div v-if="commonDetail.publish_time">
              <div class="content-title">
                公告日期
              </div>
              <div class="content-text">
                {{commonDetail.publish_time|dateFormat}}
              </div>
            </div>
          </div>

          <div class="content-div">
            <div class="content-title">
              招标公司
            </div>
            <div class="content-text red"  @click='jumpRouter(0,commonDetail.public_bid_company)' v-for='company_bid in commonDetail.public_bid_company'>
              {{company_bid+'' || '未公示'}}
            </div>
            <div class="content-title">
              中标公司
            </div>
            <div class="content-text red" @click='jumpRouter(1,commonDetail.win_bid_company)' v-for='company_win in commonDetail.win_bid_company'>
              {{company_win+'' || '未公示'}}
            </div>
          </div>
        </div>
        <div v-else-if="[113,109].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              {{eventTitle}}
            </div>

            <div v-if="commonDetail.title">
              <div class="content-title">
                标题
              </div>
              <div class="content-text">
                {{commonDetail.title}}
              </div>
            </div>
            <div v-if="commonDetail.publish_date">
              <div class="content-title">
                公告日期
              </div>
              <div class="content-text">
                {{commonDetail.publish_date|dateFormat}}
              </div>
            </div>
            <div v-if="commonDetail.inventors">
              <div class="content-title">
                发明者
              </div>
              <div class="content-text">
                {{commonDetail.inventors+''}}
              </div>
            </div>
            <div v-if="commonDetail.submitter">
              <div class="content-title">
                申请者
              </div>
              <div class="content-text">
                {{commonDetail.submitter+''}}
              </div>
            </div>
            <div v-if="commonDetail.submit_id">
              <div class="content-title">
                申请号
              </div>
              <div class="content-text">
                {{commonDetail.submit_id+''}}
              </div>
            </div>
            <div v-if="commonDetail.submit_date">
              <div class="content-title">
                申请时间
              </div>
              <div class="content-text">
                {{commonDetail.submit_date|dateFormat}}
              </div>
            </div>
            <div v-if="commonDetail.agent_org">
              <div class="content-title">
                专利代理机构
              </div>
              <div class="content-text">
                {{commonDetail.agent_org+''}}
              </div>
            </div>
            <div v-if="commonDetail.agents">
              <div class="content-title">
                专利代理人
              </div>
              <div class="content-text">
                {{commonDetail.agents+''}}
              </div>
            </div>
            <div v-if="commonDetail.abstract">
              <div class="content-title">
                摘要
              </div>
              <div class="content-text">
                {{commonDetail.abstract}}
              </div>
            </div>
            <div v-if="commonDetail.summary">
              <div class="content-title">
                概要
              </div>
              <div class="content-text">
                {{commonDetail.summary}}
              </div>
            </div>
            <a v-if="commonDetail.href||commonDetail._src" class="content-href" :href="commonDetail.href||commonDetail._src[0].url" target="innerIframe" @click="showIframe = true">
              源站点
            </a>
          </div>
        </div>
        <div v-else-if="[108,110,111,112].includes(eventType)">
          <div class="content-div">
            <div class="content-title" v-if='!commonDetail.news_title'>
              {{eventTitle}}
            </div>
            <div v-if="commonDetail.before_content">
              <div class="content-title">
                变更前
              </div>
              <div class="content-text">
                {{commonDetail.before_content}}
              </div>
            </div>
            <div v-if="commonDetail.before_content">
              <div class="content-title">
                变更后
              </div>
              <div class="content-text">
                {{commonDetail.after_content}}
              </div>
            </div>

              <div class="content-title" v-if='commonDetail.change_date|| commonDetail._utime'>
                变更日期
              </div>
              <div class="content-text" v-if='commonDetail.change_date'>
                {{commonDetail.change_date | dateFormat}}
              </div>
              <div class='content-text' v-else-if="commonDetail._utime">
                {{commonDetail._utime | dateFormat}}
              </div>

            <div v-if='commonDetail.news_title'>
              <div class="content-title">
                事件标题
              </div>
              <div class="content-text">
                {{commonDetail.news_title}}
              </div>
            </div>
             <div v-if='commonDetail.news_content'>
              <div class="content-title">
                事件内容
              </div>
              <div class="content-text">
                {{commonDetail.news_content}}
              </div>
            </div>
             <div v-if='commonDetail.href'>

              <div class="content-text">
                <a :href="commonDetail.href" style='color:red'>链接</a>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[114].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              {{eventTitle}}
            </div>



            <div class='content-title' v-if='commonDetail.company_full_name'>
              企业名称
            </div>
            <div class='content-text'>
              {{commonDetail.company_full_name}}
            </div>
            <a v-if="commonDetail.href||commonDetail._src" class="content-href" :href="commonDetail.href||commonDetail._src[0].url" target="innerIframe" @click="showIframe = true">
              源站点
            </a>
            </div>
          </div>


        <div v-else-if="[102, 'tax_payer_level_a'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              {{eventTitle}}
            </div>
              <div class="content-title">
                纳税等级
              </div>
              <div class="content-text">
                {{commonDetail.level}}
              </div>
              <div class="content-title">
                年份
              </div>
              <div class="content-text">
                {{commonDetail.year}}
              </div>
               <div class="content-title" v-if='commonDetail.taxpayer_name'>
                纳税人名称
              </div>
              <div class="content-text">
                {{commonDetail.taxpayer_name}}
              </div>

          </div>
        </div>
        <div v-else-if="[134,122,130,131,133,135,137,139,136,138,117,132].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}

              </div>
              <div class="content-title">
              事件时间
            </div>
            <div class="content-text">
              {{bussiness_starttime| dateFormat}}

              </div>
              <div v-if='commonDetail.des'>
                <div class="content-title" >
                事件内容
                </div>
                <div class="content-text">
                  {{commonDetail.des}}
                </div>
              </div>
              <div v-if='commonDetail.company_full_name'>
                <div class="content-title" >
                公司名称
                </div>
                <div class="content-text">
                  {{commonDetail.company_full_name}}
                </div>
              </div>
          </div>
        </div>
        <div v-else-if="[118].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}

              </div>
              <div v-if='commonDetail.money_before_change'>
                <div class="content-title" >
                投资前金额
                </div>
                <div class="content-text">
                  {{commonDetail.money_before_change | formatMoney}}
                </div>
              </div>
              <div v-if='commonDetail.money_after_change'>
                <div class="content-title" >
                投资后金额
                </div>
                <div class="content-text">
                  {{commonDetail.money_after_change |formatMoney}}
                </div>
              </div>
               <div v-if='commonDetail.shareholder_name_before_change'>
                <div class="content-title" >
                投资前出资信息
                </div>
                <div class="content-text">
                  {{commonDetail.shareholder_name_before_change }}
                </div>
              </div>
              <div v-if='commonDetail.shareholder_name_after_change'>
                <div class="content-title" >
                投资后出资信息
                </div>
                <div class="content-text">
                  {{commonDetail.shareholder_name_after_change }}
                </div>
              </div>
          </div>
        </div>


        <div v-else-if="[204, 'judgement_wenshu'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.company_full_name'>
              <div class="content-title" >
              公司名
              </div>
              <div class="content-text">
                {{commonDetail.company_full_name }}
              </div>
            </div>
            <div v-if='role'>
              <div class="content-title" >
              角色
              </div>
              <div class="content-text">
                {{role }}
              </div>
            </div>
            <div v-if='commonDetail.case_name'>
              <div class="content-title" >
              案件标题
              </div>
              <div class="content-text">
                {{commonDetail.case_name }}
              </div>
            </div>
            <div v-if='commonDetail.doc_content'>
              <div class="content-title" >
              案件详情
              </div>
              <div class="content-text">
                {{commonDetail.doc_content }}
              </div>
            </div>
            <div v-if='commonDetail.judge_content'>
              <div class="content-title" >
              判决结果
              </div>
              <div class="content-text">
                {{commonDetail.judge_content }}
              </div>
            </div>
            <div v-if='date'>
              <div class="content-title" >
              案件日期
              </div>
              <div class="content-text">
                {{commonDetail.case_date.substr(0,10) | dateFormat}}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[201, 'court_ktgg'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.litigants'>
              <div class="content-title" >
              当事人
              </div>
              <div class="content-text">
                {{commonDetail.litigants }}
              </div>
            </div>
            <div v-if='commonDetail.case_id'>
              <div class="content-title" >
              案件编号
              </div>
              <div class="content-text">
                {{commonDetail.case_id }}
              </div>
            </div>
            <div v-if='commonDetail.case_cause'>
              <div class="content-title" >
              案由
              </div>
              <div class="content-text">
                {{commonDetail.case_cause }}
              </div>
            </div>
            <div v-if='commonDetail.court_time'>
              <div class="content-title" >
              开庭日期
              </div>
              <div class="content-text">
                {{commonDetail.court_time.substr(0,10) }}
              </div>
            </div>
            <div v-if='commonDetail.bulletin_date'>
              <div class="content-title" >
              公告日期
              </div>
              <div class="content-text">
                {{commonDetail.bulletin_date.substr(0,10) }}
              </div>
            </div>
            <div v-if='commonDetail.defendant_list'>
              <div class="content-title">
              被告名单
              </div>
              <div class="content-text">
                <div v-for="(item,index) in commonDetail.defendant_list" :key = 'index'>
                  {{ item }}
                </div>
              </div>
            </div>
            <div v-if='commonDetail.plaintiff_list'>
              <div class="content-title">
              原告名单
              </div>
              <div class="content-text">
                <div v-for="(item,index) in commonDetail.plaintiff_list" :key = 'index'>
                  {{ item }}
                </div>
              </div>
            </div>
            <div v-if='commonDetail.court'>
              <div class="content-title" >
              法院
              </div>
              <div class="content-text">
                {{commonDetail.court}}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[203, 'judge_process'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.filing_date'>
              <div class="content-title" >
              立案日期
              </div>
              <div class="content-text">
                {{commonDetail.filing_date.substr(0, 10)}}
              </div>
            </div>
            <div v-if='commonDetail.case_id'>
              <div class="content-title" >
              案件编号
              </div>
              <div class="content-text">
                {{commonDetail.case_id }}
              </div>
            </div>
            <div v-if='commonDetail.case_cause'>
              <div class="content-title" >
              案由
              </div>
              <div class="content-text">
                {{commonDetail.case_cause }}
              </div>
            </div>
            <div v-if='commonDetail.status'>
              <div class="content-title" >
              案件状态
              </div>
              <div class="content-text">
                {{commonDetail.status}}
              </div>
            </div>
            <div v-if='commonDetail.court_time'>
              <div class="content-title" >
              开庭时间
              </div>
              <div class="content-text">
                {{commonDetail.court_time.substr(0,10)}}
              </div>
            </div>
            <div v-if='commonDetail.close_date'>
              <div class="content-title" >
              结案时间
              </div>
              <div class="content-text">
                {{commonDetail.close_date.substr(0,10)}}
              </div>
            </div>
            <div v-if='commonDetail.defendant_list'>
              <div class="content-title">
              被告名单
              </div>
              <div class="content-text">
                <div v-for="(item,index) in commonDetail.defendant_list" :key = 'index'>
                  {{ item }}
                </div>
              </div>
            </div>
            <div v-if='commonDetail.plaintiff_list'>
              <div class="content-title">
              原告名单
              </div>
              <div class="content-text">
                <div v-for="(item,index) in commonDetail.plaintiff_list" :key = 'index'>
                  {{ item }}
                </div>
              </div>
            </div>
            <div v-if='commonDetail.court'>
              <div class="content-title" >
              法院/法庭
              </div>
              <div class="content-text">
                {{commonDetail.court | commonDetail.court_place }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[202, 'bulletin'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.litigants'>
              <div class="content-title" >
              当事人
              </div>
              <div class="content-text">
                {{commonDetail.litigants }}
              </div>
            </div>
            <div v-if='commonDetail.case_id'>
              <div class="content-title" >
              案件编号
              </div>
              <div class="content-text">
                {{commonDetail.case_id }}
              </div>
            </div>
            <div v-if='commonDetail.case_cause'>
              <div class="content-title" >
              案由
              </div>
              <div class="content-text">
                {{commonDetail.case_cause }}
              </div>
            </div>
            <div v-if='commonDetail.bulletin_date'>
              <div class="content-title" >
              公告日期
              </div>
              <div class="content-text">
                {{commonDetail.bulletin_date.substr(0,10) }}
              </div>
            </div>
            <div v-if='commonDetail.bulletin_type'>
              <div class="content-title" >
              公告类型
              </div>
              <div class="content-text">
                {{commonDetail.bulletin_type}}
              </div>
            </div>
            <div v-if='commonDetail.bulletin_content'>
              <div class="content-title" >
              公告内容
              </div>
              <div class="content-text">
                {{commonDetail.bulletin_content}}
              </div>
            </div>
            <div v-if='commonDetail.defendant_list'>
              <div class="content-title">
              被告名单
              </div>
              <div class="content-text">
                <div v-for="(item,index) in commonDetail.defendant_list" :key = 'index'>
                  {{ item }}
                </div>
              </div>
            </div>
            <div v-if='commonDetail.plaintiff_list'>
              <div class="content-title">
              原告名单
              </div>
              <div class="content-text">
                <div v-for="(item,index) in commonDetail.plaintiff_list" :key = 'index'>
                  {{ item }}
                </div>
              </div>
            </div>
            <div v-if='commonDetail.court'>
              <div class="content-title" >
              法院/法庭
              </div>
              <div class="content-text">
                {{commonDetail.court | commonDetail.court_place }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[205, 'shixin_info', 'zhixing_info'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.publish_date'>
              <div class="content-title" >
              发布日期
              </div>
              <div class="content-text">
                {{commonDetail.publish_date }}
              </div>
            </div>
            <div v-if='commonDetail.case_id'>
              <div class="content-title" >
              案件编号
              </div>
              <div class="content-text">
                {{commonDetail.case_id }}
              </div>
            </div>
            <div v-if='commonDetail.max_money'>
              <div class="content-title" >
              涉案金额
              </div>
              <div class="content-text">
                {{commonDetail.max_money }}
              </div>
            </div>
            <div v-if='commonDetail.performance'>
              <div class="content-title" >
              被执行人履行情况
              </div>
              <div class="content-text">
                {{commonDetail.performance}}
              </div>
            </div>
            <div v-if='commonDetail.i_name'>
              <div class="content-title" >
              失信被执行人主体
              </div>
              <div class="content-text">
                {{commonDetail.i_name}}
              </div>
            </div>
            <div v-if='commonDetail.gist_id'>
              <div class="content-title" >
              执行依据文号
              </div>
              <div class="content-text">
                {{commonDetail.gist_id}}
              </div>
            </div>
            <div v-if='commonDetail.registered_code'>
              <div class="content-title" >
              注册号
              </div>
              <div class="content-text">
                {{commonDetail.registered_code}}
              </div>
            </div>
            <div v-if='commonDetail.reg_date'>
              <div class="content-title" >
              立案时间
              </div>
              <div class="content-text">
                {{commonDetail.reg_date.substr(0,10)}}
              </div>
            </div>
            <div v-if='commonDetail.legal_man'>
              <div class="content-title" >
              法定代表人
              </div>
              <div class="content-text">
                {{commonDetail.legal_man}}
              </div>
            </div>
            <div v-if='commonDetail.court'>
              <div class="content-title" >
              法院/法庭
              </div>
              <div class="content-text">
                {{commonDetail.court | commonDetail.court_place }}
              </div>
            </div>
            <div v-if='commonDetail.disrupt_type_name'>
              <div class="content-title" >
              失信被执行人行为具体情形
              </div>
              <div class="content-text">
                {{commonDetail.disrupt_type_name}}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[209,213,212,210, 'legal_man_change', 'place_change', 'shareholder_change', 'senior_executive_change'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.company_full_name'>
              <div class="content-title" >
                公司名
              </div>
              <div class="content-text">
                {{commonDetail.company_full_name }}
              </div>
            </div>
          </div>
          <div class="content-div" v-for="(item, index) in commonDetail.list" :key = 'index'>
              <div v-if='item.change_item' class="content-left">
                <div class="content-title" >
                变更项
                </div>
                <div class="content-text">
                  {{item.change_item }}
                </div>
              </div>
              <div v-if='item.change_date' class="content-right">
                <div class="content-title" >
                变更时间
                </div>
                <div class="content-text">
                  {{item.change_date.substr(0,10)}}
                </div>
              </div>
              <div v-if='item.before_content' class="content-left">
                <div class="content-title" >
                变更前
                </div>
                <div class="content-text">
                  {{item.before_content }}
                </div>
              </div>
              <div v-if='item.after_content' class="content-right">
                <div class="content-title" >
                变更后
                </div>
                <div class="content-text">
                  {{item.after_content}}
                </div>
              </div>
            </div>
        </div>
        <div v-else-if="[207, 'penalty'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.accused_name'>
              <div class="content-title" >
                当事人
              </div>
              <div class="content-text">
                {{commonDetail.accused_name }}
              </div>
            </div>
            <div v-if='commonDetail.case_cause'>
              <div class="content-title" >
              案由
              </div>
              <div class="content-text">
                {{commonDetail.case_cause }}
              </div>
            </div>
            <div v-if='commonDetail.penalty_type'>
              <div class="content-title" >
              处罚类型
              </div>
              <div class="content-text">
                {{commonDetail.penalty_type }}
              </div>
            </div>
            <div v-if='commonDetail.penalty_result'>
              <div class="content-title" >
              处罚结果
              </div>
              <div class="content-text">
                {{commonDetail.penalty_result}}
              </div>
            </div>
            <div v-if='commonDetail.penalty_time'>
              <div class="content-title" >
              处罚时间
              </div>
              <div class="content-text">
                {{commonDetail.penalty_time.substr(0,10)}}
              </div>
            </div>
            <div v-if='commonDetail.execute_authority'>
              <div class="content-title" >
              执行机构
              </div>
              <div class="content-text">
                {{commonDetail.execute_authority }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[222,208, 'business_status_change'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.company_full_name'>
              <div class="content-title" >
                公司名
              </div>
              <div class="content-text">
                {{commonDetail.company_full_name }}
              </div>
            </div>
            <div v-if='commonDetail.news_content'>
              <div class="content-title" >
                事件内容
              </div>
              <div class="content-text">
                {{commonDetail.news_content }}
              </div>
            </div>
            <div v-if='commonDetail.href'>
              <div class="content-title" >
                事件网址
              </div>
              <div class="content-text">
                {{commonDetail.href }}
              </div>
            </div>
            <div v-if='commonDetail.news_id'>
              <div class="content-title" >
                事件ID
              </div>
              <div class="content-text">
                {{commonDetail.news_id }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="[116].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{commonDetail.title}}

              </div>
              <div v-if='commonDetail.publish_time'>
                <div class="content-title" >
                事件时间
                </div>
                <div class="content-text">
                  {{commonDetail.publish_time}}
                </div>
              </div>
              <div v-if='commonDetail.summary'>
                <div class="content-title" >
                事件内容
                </div>
                <div class="content-text">
                  {{commonDetail.summary }}
                </div>
              </div>
          </div>
        </div>
        <div v-else-if="[105].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.company_full_name'>
              <div class="content-title" >
                公司名
              </div>
              <div class="content-text">
                {{commonDetail.company_full_name }}
              </div>
            </div>
            <div v-if='commonDetail.list'>
              <div class="content-title" >
              新增机构
              </div>
              <div class="content-text" v-for='(item,index) in commonDetail.list' :key='index'>
                {{item }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[106, 'new_invested_company'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.company_full_name'>
              <div class="content-title" >
                公司名
              </div>
              <div class="content-text">
                {{commonDetail.company_full_name }}
              </div>
            </div>
            <div v-if='commonDetail.list'>
              <div class="content-title" >
              新增对外投资
              </div>
              <div class="content-text" v-for='(item,index) in commonDetail.list' :key='index'>
                {{item }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[101, 'new_listed_shareholder'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.company_full_name'>
              <div class="content-title" >
                公司名
              </div>
              <div class="content-text">
                {{commonDetail.company_full_name }}
              </div>
            </div>
            <div v-if='commonDetail.list'>
              <div class="content-title" >
              股东中新出上市企业名
              </div>
              <div class="content-text" v-for='(item,index) in commonDetail.list' :key='index'>
                {{item }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[120].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div class="content-title">
              事件日期
            </div>
            <div class="content-text">
              {{commonDetail.publish_date}}
            </div>
              <div v-if='commonDetail.content'>
                <div class="content-title" >
                事件内容
                </div>
                <div class="content-text" >
                {{commonDetail.content}}
                </div>

              </div>
          </div>
        </div>
        <div v-else-if="['patent'].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>
            <div v-if='commonDetail.period'>
              <div class='content-title'>
                摘要
              </div>
              <div class='content-text'>
                {{commonDetail.abstract}}
              </div>
            </div>
            <div v-if='commonDetail.address'>
              <div class='content-title'>
                地址
              </div>
              <div class='content-text'>
                {{commonDetail.address}}
              </div>
            </div>
            <div v-if='commonDetail.agent_org'>
              <div class='content-title'>
                代理机构
              </div>
              <div class='content-text'>
                {{commonDetail.agent_org}}
              </div>
            </div>
            <div v-if='commonDetail.agents'>
              <div class='content-title'>
                代理人
              </div>
              <div class='content-text' v-for="(item, index) in commonDetail.agents" :key="index">
                {{item}}
              </div>
            </div>
            <div v-if='commonDetail.inventors'>
              <div class='content-title'>
                发明家
              </div>
              <div class='content-text' v-for="(item, index) in commonDetail.inventors" :key="index">
                {{item}}
              </div>
            </div>
            <div v-if='commonDetail.patent_id'>
              <div class='content-title'>
                专利编号
              </div>
              <div class='content-text'>
                {{commonDetail.patent_id}}
              </div>
            </div>
            <div v-if='commonDetail.submitter'>
              <div class='content-title'>
                提交方
              </div>
              <div class='content-text'>
                {{commonDetail.submitter}}
              </div>
            </div>
            <div v-if='commonDetail.submit_date'>
              <div class='content-title'>
                提交日期
              </div>
              <div class='content-text'>
                {{commonDetail.submit_date}}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="[119].includes(eventType)">
          <div class="content-div">
            <div class="content-title">
              事件标题
            </div>
            <div class="content-text">
              {{eventTitle}}
            </div>

              <div v-if='commonDetail.changerecords '>
                <div class="content-title" >
                变更记录
                </div>
                <div v-for='(item,index) in commonDetail.changerecords' :key='index'>
                <div class="content-title" >
                变更项目:{{item.change_item}}
                </div>
                <div class="content-text" >
                变更前:{{item.before_content}}
                </div>
                <div class="content-text" >
                变更后:{{item.after_content}}
                </div>
                </div>
              </div>
              <div v-if='commonDetail.invested_companies.length'>
                <div class='content-title'>
                  投资公司
                </div>
                <div class='content-text'>
                  {{commonDetail.invested_companies}}
                </div>

              </div>
              <div v-if='commonDetail.period'>
                <div class='content-title'>
                  持续时间
                </div>
                <div class='content-text'>
                  {{commonDetail.period}}
                </div>

              </div>
            </div>
          </div>
        </div>
    </scroll-view>
  </div>
</template>

<script>
import headerSwitch from '@/components/headerSwitch.vue'
import store from '../../store'
import {SAVE_CURRENT} from '../../store/mutation-types'
import BScroll from 'better-scroll'

export default {
  data() {
    return {
      title: '事件详情',
      eventTitle: '',
      showIframe: false,
      bussiness_starttime:'',
      date: '',
      eventType: '',
      baseInfo: {
        title: '国投昔阳能源有限责任公司俩矿倔进机采购中标候选人',
        id: 'CCTC10171155',
        city: '山西省昔阳县',
        money: ''
      },
      companyInfo: {
        name: '国投昔阳能源有限责任公司',
        biding: '三一重工股份有限公司'
      },
      detailInfo: {
        first: '三一重工股份有限公司',
        second: '山西天地煤机装备有限公司',
        third: '山西美佳矿业有限公司',
        startDate: '2017-07-28',
        endDate: '2017-07-31',
        connectMan: '罗璇',
        phone: '010-84293590',
        detail:
          '各投标人或者其他利害关系人对中标候选人有异议的，可以在公示期内，以书面形式 (法定代表人签字并加盖单位公章)向中煤招标公司提出异议，并以接受确认日期作为受理时间。逾期或未按照要求提交的异议函将不予受理。',
        company: '中煤招标有限责任公司',
        date: '2017-07-28'
      },
      commonDetail: {}
    }
  },
  methods:{
    jumpRouter(flag,company){


      if(flag){
        if( (this.commonDetail.win_bid_company+'') && (this.commonDetail.win_bid_company.length+'')>3 && (this.commonDetail.win_bid_company+'').indexOf('公司')!=-1){
          this.$router.push({path:'/customerDetail',query:{company:this.companyInfo.win_bid_company+''}})
        }
      }else{

        if( (this.commonDetail.public_bid_company.length+'')>3 && (this.commonDetail.public_bid_company+'').indexOf('公司')!=-1){
          this.$router.push({path:'/customerDetail',query:{company:this.commonDetail.public_bid_company+''}})
        }
      }

    }
  },
  mounted() {

    let eventId = this.$route.query.id
    this.eventType = this.$route.query.type
    let storeEventList = JSON.parse(localStorage.getItem('storeEventList'))
    if (storeEventList && Array.isArray(storeEventList)) {
      // for (let index = 0; index < storeEventList.length; index++) {
        let element = storeEventList[eventId]
        // if (element.id === eventId) {
          this.commonDetail = element.detail
          this.commonDetail.company_full_name = element.company
          this.title = element.cnname
          this.eventTitle = element.title
          this.commonDetail.pub_date = element.push_time
          this.bussiness_starttime = element.date
          this.date = element.date
          // break
        // }
      // }
    }
  },
  components: {
    headerSwitch
  }
}
</script>

<style scoped lang="less">
.container {
  padding-top: 10px;
  height: calc(100% - 50px);
  overflow: hidden;
  position:relative;
  .content-div {
    margin-bottom: 10px;
    padding: 12px 16px;
    background: #fff;
    font-size: 14px;
    text-align: left;
    .content-title {
      margin-top: 12px;
      height: 20px;
      line-height: 20px;
      color: #999;
      &:not(:first-child) {
        margin-top: 16px;
      }
    }
    .content-text {
      line-height: 20px;
      margin-top: 2px;
      color: #333;
      margin-bottom:20px;
      font-size: 12px;
      &.red {
        color: #d24545;
      }
    }
    .content-href {
      display: inline-block;
      margin-top: 20px;
      color: #d24545;
    }
    .content-left, .content-right {
      display: inline-block;
      width: 48%;
    }
  }
}
.inner-iframe {
  width: 100%;
  height: 100%;
}
</style>
