const HUNDRED = 100
// let registered_capital = {
//   '全部': null,
//   '100万以下': {to: HUNDRED},
//   '100-500万': {from: HUNDRED, to: 5 * HUNDRED},
//   '500-1000万': {from: 5 * HUNDRED, to: 10 * HUNDRED},
//   '1000-3000万': {from: 10 * HUNDRED, to: 30 * HUNDRED},
//   '3000-5000万': {from: 30 * HUNDRED, to: 50 * HUNDRED},
//   '5000万-1亿': {from: 50 * HUNDRED, to: 100 * HUNDRED},
//   '1亿-3亿': {from: 100 * HUNDRED, to: 300 * HUNDRED},
//   '3亿-5亿': {from: 300 * HUNDRED, to: 500 * HUNDRED},
//   '5亿-10亿': {from: 500 * HUNDRED, to: 1000 * HUNDRED},
//   '10亿及以上': {from: 1000 * HUNDRED}
// }

/* 注册资本-START */
let registered_capital = [
  {from: '', to: '', label: '全部'},
  {to: HUNDRED, label: '100万以下'},
  {from: HUNDRED, to: 5 * HUNDRED, label: '100-500万'},
  {from: 5 * HUNDRED, to: 10 * HUNDRED, label: '500-1000万'},
  {from: 10 * HUNDRED, to: 30 * HUNDRED, label: '1000-3000万'},
  {from: 30 * HUNDRED, to: 50 * HUNDRED, label: '3000-5000万'},
  {from: 50 * HUNDRED, to: 100 * HUNDRED, label: '5000万-1亿'},
  {from: 100 * HUNDRED, to: 300 * HUNDRED, label: '1亿-3亿'},
  {from: 300 * HUNDRED, to: 500 * HUNDRED, label: '3亿-5亿'},
  {from: 500 * HUNDRED, to: 1000 * HUNDRED, label: '5亿-10亿'},
  {from: 1000 * HUNDRED, label: '10亿及以上'}
]
registered_capital.forEach(item => {
  item.unit = '万'
  item.name = '注册资本'
  item.placeholder1 = '最低'
  item.placeholder2 = '最高'
})
/* 注册资本-END */

/* 注册时间:-START */
let registered_time = [
  {from: '', to: '', label: '全部'},
  {to: 1, label: '一年内'},
  {from: 1, to: 3, label: '1-3年'},
  {from: 4, to: 10, label: '4-10年'},
  {from: 10, label: '10年以上'}
]
registered_time.forEach(item => {
  item.unit = '年'
  item.name = '注册时间'
  item.placeholder1 = '最低年数'
  item.placeholder2 = '最高年数'
})
/* 注册时间:-END */

/* 上市时间:-START */
let list_time = [
  {from: '', to: '', label: '全部'},
  {to: 1, label: '一年内'},
  {from: 1, to: 3, label: '1-3年'},
  {from: 4, to: 10, label: '4-10年'},
  {from: 10, label: '10年以上'}
]
list_time.forEach(item => {
  item.unit = '年'
  item.name = '上市时间'
  item.placeholder1 = '最低年数'
  item.placeholder2 = '最高年数'
})
/* 上市时间:-END */

/* 是否上市:-START */
let is_listed = [
  {from: '', to: '', label: '全部'},
  {from: true, label: '是'},
  {from: false, label: '否'}
]
is_listed.forEach(item => {
  item.name = '是否上市'
})
/* 是否上市:-END */

// 经营特征

/* 分支机构总数:-START */
let branch_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0个'},
  {from: 1, to: 5, label: '1-5个'},
  {from: 6, to: 10, label: '6-10个'},
  {from: 10, label: '10个以上'}
]
branch_num.forEach(item => {
  item.unit = '个'
  item.name = '分支机构总数'
  item.placeholder1 = '最低数目'
  item.placeholder2 = '最高数目'
})
/* 分支机构总数:-END */

/* 对外投资企业数目-START */
let investment_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0个'},
  {from: 1, to: 5, label: '1-5个'},
  {from: 6, to: 10, label: '6-10个'},
  {from: 10, label: '10个以上'}
]
investment_num.forEach(item => {
  item.unit = '个'
  item.name = '对外投资企业数目'
  item.placeholder1 = '最低数目'
  item.placeholder2 = '最高数目'
})
/* 对外投资企业数目-END */

/* 股东数目:-START */
let shareholders_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0个'},
  {from: 1, to: 5, label: '1-5个'},
  {from: 6, to: 10, label: '6-10个'},
  {from: 10, label: '10个以上'}
]
shareholders_num.forEach(item => {
  item.unit = '个'
  item.name = '股东数目'
  item.placeholder1 = '最低数目'
  item.placeholder2 = '最高数目'
})
/* 股东数目:-END */

/* 股东变更:-START */
let shareholders_change = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 1, label: '1次'},
  {from: 2, to: 2, label: '2次'},
  {from: 2, label: '2次以上'}
]
shareholders_change.forEach(item => {
  item.unit = '次'
  item.name = '股东变更'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 股东变更:-END */

/* 公司名变更:-START */
let company_name_change = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 1, label: '1次'},
  {from: 2, to: 2, label: '2次'},
  {from: 2, label: '2次以上'}
]
company_name_change.forEach(item => {
  item.unit = '次'
  item.name = '公司名变更'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 公司名变更:-END */

/* 法定代表人变更:-START */
let legal_man_change = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 1, label: '1次'},
  {from: 2, to: 2, label: '2次'},
  {from: 2, label: '2次以上'}
]
legal_man_change.forEach(item => {
  item.unit = '次'
  item.name = '法定代表人变更'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 法定代表人变更:-END */

/* 地址变更:-START */
let address_change = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 1, label: '1次'},
  {from: 2, to: 2, label: '2次'},
  {from: 2, label: '2次以上'}
]
address_change.forEach(item => {
  item.unit = '次'
  item.name = '地址变更'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 地址变更:-END */

/* 成员变更:-START */
let member_change = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 1, label: '1次'},
  {from: 2, to: 2, label: '2次'},
  {from: 2, label: '2次以上'}
]
member_change.forEach(item => {
  item.unit = '次'
  item.name = '成员变更'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 成员变更:-END */

/* 章程变更:-START */
let rule_change = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 1, label: '1次'},
  {from: 2, to: 2, label: '2次'},
  {from: 2, label: '2次以上'}
]
rule_change.forEach(item => {
  item.unit = '次'
  item.name = '章程变更'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 章程变更:-END */

/* 经营范围变更:-START */
let scope_change = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 1, label: '1次'},
  {from: 2, to: 2, label: '2次'},
  {from: 2, label: '2次以上'}
]
scope_change.forEach(item => {
  item.unit = '次'
  item.name = '经营范围变更'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 经营范围变更:-END */

/* 专利数目:-START */
let pattern_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0个'},
  {from: 1, to: 5, label: '1-5个'},
  {from: 6, to: 10, label: '6-10个'},
  {from: 10, label: '10个以上'}
]
pattern_num.forEach(item => {
  item.unit = '个'
  item.name = '专利数目'
  item.placeholder1 = '最低数目'
  item.placeholder2 = '最高数目'
})
/* 专利数目:-END */

/* 近一年中标次数:-START */
let win_bid_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 5, label: '1-5次'},
  {from: 6, to: 10, label: '6-10次'},
  {from: 10, label: '10次以上'}
]
win_bid_num.forEach(item => {
  item.unit = '次'
  item.name = '近一年中标次数'
  item.placeholder1 = '最低数目'
  item.placeholder2 = '最高数目'
})
/* 近一年中标次数:-END */

/* 近一年代理招标次数:-START */
let acting_bid_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 5, label: '1-5次'},
  {from: 6, to: 10, label: '6-10次'},
  {from: 10, label: '10次以上'}
]
acting_bid_num.forEach(item => {
  item.unit = '次'
  item.name = '近一年代理招标次数'
  item.placeholder1 = '最低数目'
  item.placeholder2 = '最高数目'
})
/* 近一年代理招标次数:-END */

/* 近一年发布招标次数:-START */
let bid_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 5, label: '1-5次'},
  {from: 6, to: 10, label: '6-10次'},
  {from: 10, label: '10次以上'}
]
bid_num.forEach(item => {
  item.unit = '次'
  item.name = '近一年发布招标次数'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 近一年发布招标次数:-END */

/* 近三年A级纳税次数:-START */
let a_tax_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 1, label: '1次'},
  {from: 2, to: 2, label: '2次'},
  {from: 2, to: '', label: '2次以上'}
]
a_tax_num.forEach(item => {
  item.unit = '次'
  item.name = '近三年纳税等级为A的次数'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 近三年A级纳税次数:-END */

// 涉诉处罚

/* 一年作为原告的涉案次数:-START */
let plaintiff_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 3, label: '1-3次'},
  {from: 4, to: 10, label: '4-10次'},
  {from: 10, label: '10次以上'}
]
plaintiff_num.forEach(item => {
  item.unit = '次'
  item.name = '一年作为原告的涉案次数'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 一年作为原告的涉案次数:-END */

/* 近一年作为被告的涉诉次数:-START */
let defendant_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 3, label: '1-3次'},
  {from: 4, to: 10, label: '4-10次'},
  {from: 10, label: '10次以上'}
]
defendant_num.forEach(item => {
  item.unit = '次'
  item.name = '近一年作为被告的涉诉次数'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 近一年作为被告的涉诉次数:-END */

/* 近一年失信被执行金额:-START */
let executed_money = [
  {from: '', to: '', label: '全部'},
  // {from: 0, to: 0, label: '0万'},
  {from: 0, to: 10, label: '0-10万'},
  {from: 10, to: 50, label: '10-50万'},
  {from: 50, to: 100, label: '50-100万'},
  {from: 100, label: '100万以上'}
]
executed_money.forEach(item => {
  item.unit = '万'
  item.name = '近一年失信被执行金额'
  item.placeholder1 = '最低金额'
  item.placeholder2 = '最高金额'
})
/* 近一年失信被执行金额:-END */

/* 近一年失信被执行次数:-START */
let executed_count = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 3, label: '1-3次'},
  {from: 4, to: 10, label: '4-10次'},
  {from: 10, label: '10次以上'}
]
executed_count.forEach(item => {
  item.unit = '次'
  item.name = '近一年失信被执行次数'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 近一年失信被执行次数:-END */

/* 近一年欠税金额:-START */
let tax_arrears = [
  {from: '', to: '', label: '全部'},
  // {from: 0, to: 0, label: '0万'},
  {from: 0, to: 10, label: '0-10万'},
  {from: 10, to: 50, label: '10-50万'},
  {from: 50, to: 100, label: '50-100万'},
  {from: 100, label: '100万以上'}
]
tax_arrears.forEach(item => {
  item.unit = '万'
  item.name = '近一年欠税金额'
  item.placeholder1 = '最低金额'
  item.placeholder2 = '最高金额'
})
/* 近一年欠税金额:-END */

/* 近一年欠税次数:-START */
let tax_arrears_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 3, label: '1-3次'},
  {from: 4, to: 10, label: '4-10次'},
  {from: 10, label: '10次以上'}
]
tax_arrears_num.forEach(item => {
  item.unit = '次'
  item.name = '近一年欠税次数'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 近一年欠税次数:-END */

/* 近一年被行政处罚的次数:-START */
let punish_num = [
  {from: '', to: '', label: '全部'},
  {from: 0, to: 0, label: '0次'},
  {from: 1, to: 3, label: '1-3次'},
  {from: 4, to: 10, label: '4-10次'},
  {from: 10, label: '10次以上'}
]
punish_num.forEach(item => {
  item.unit = '次'
  item.name = '近一年被行政处罚的次数'
  item.placeholder1 = '最低次数'
  item.placeholder2 = '最高次数'
})
/* 近一年被行政处罚的次数:-END */

// 经营特征-股东是否有上市公司

/* 股东是否上市:-START */
let shareholder_listed = [
  {from: '', to: '', label: '全部'},
  {from: true, label: '是'},
  {from: false, label: '否'}
]
shareholder_listed.forEach(item => {
  item.name = '股东是否有上市公司'
})
/* 股东是否上市:-END */

module.exports = {
  registered_capital,
  registered_time,
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
  is_listed,
  list_time
}
