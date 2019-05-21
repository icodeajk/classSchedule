var industry = ['农、林、牧、渔业', '采矿业', '制造业', '电力、热力、燃气及...', '建筑业', '批发和零售业', '交通运输、仓储和...',
  '住宿和餐饮业', '信息传输、软件和...', '金融业', '房地产业', '租赁和商务服务业', '科学研究和技术服务业', '水利、环境和...',
  '居民服务、修理和...', '教育', '卫生和社会工作', '文化、体育和娱乐业', '公共管理、社会保障和...', '国际组织']
var industries = []
var twoIndustries = {}
// var twoIndustries = ['农业', '林业', '畜牧业', '渔业', '农、林、牧、渔服务业', '煤炭开采和洗选业', '石油和天然气开采业',
//   '黑色金属矿采选业', '有色金属矿采选业', '非金属矿采选业', '开采辅助活动', '其他采矿业', '农副食品加工业', '食品制造业',
//   '酒、饮料和精制茶制造业', '烟草制品业', '纺织业', '纺织服装、服饰业', '皮革、毛皮、羽毛及其制品和制鞋业', '木材加工和木、竹、藤、棕、草制品业',
//   '家具制造业', '造纸和纸制品业', '印刷和记录媒介复制业', '文教、工美、体育和娱乐用品制造业', '石油加工、炼焦和核燃料加工业',
//   '化学原料和化学制品制造业', '医药制造业', '化学纤维制造业', '橡胶和塑料制品业', '非金属矿物制品业', '黑色金属冶炼和压延加工业',
//   '有色金属冶炼和压延加工业', '金属制品业', '通用设备制造业', '专用设备制造业', '汽车制造业', '铁路、船舶、航空航天和其他运输设备制造业',
//   '电气机械和器材制造业', '计算机、通信和其他电子设备制造业', '仪器仪表制造业', '其他制造业', '废弃资源综合利用业', '金属制品、机械和设备修理业',
//   '电力、热力生产和供应业', '燃气生产和供应业', '水的生产和供应业', '房屋建筑业', '土木工程建筑业', '建筑安装业', '建筑装饰和其他建筑业', '批发业',
//   '零售业', '铁路运输业', '道路运输业', '水上运输业', '航空运输业', '管道运输业', '装卸搬运和运输代理业', '仓储业', '邮政业', '住宿业', '餐饮业',
//   '电信、广播电视和卫星传输服务', '互联网和相关服务', '软件和信息技术服务业', '货币金融服务', '资本市场服务', '保险业', '其他金融业', '房地产业',
//   '租赁业', '商务服务业', '研究和试验发展', '专业技术服务业', '科技推广和应用服务业', '水利管理业', '生态保护和环境治理业', '公共设施管理业', '居民服务业',
//   '机动车、电子产品和日用产品修理业', '其他服务业', '教育', '卫生', '社会工作', '新闻和出版业', '广播、电视、电影和影视录音制作业', '文化艺术业', '体育',
//   '娱乐业', '中国共产党机关', '国家机构', '人民政协、民主党派', '社会保障', '群众团体、社会团体和其他成员组织', '基层群众自治组织', '国际组织']
var twomap = {
  '农、林、牧、渔业': ['农业', '林业', '畜牧业', '渔业', '农、林、牧、渔服务业'],
  '采矿业': ['煤炭开采和洗选业', '石油和天然气开采业', '黑色金属矿采选业', '有色金属矿采选业', '非金属矿采选业', '开采辅助活动', '其他采矿业'],
  '制造业': ['农副食品加工业', '食品制造业', '酒、饮料和精制茶制造业', '烟草制品业', '纺织业', '纺织服装、服饰业', '皮革、毛皮、羽毛及其制品和制鞋业', '木材加工和木、竹、藤、棕、草制品业', '家具制造业', '造纸和纸制品业', '印刷和记录媒介复制业', '文教、工美、体育和娱乐用品制造业', '石油加工、炼焦和核燃料加工业',
    '化学原料和化学制品制造业', '医药制造业', '化学纤维制造业', '橡胶和塑料制品业', '非金属矿物制品业', '黑色金属冶炼和压延加工业',
    '有色金属冶炼和压延加工业', '金属制品业', '通用设备制造业', '专用设备制造业', '汽车制造业', '铁路、船舶、航空航天和其他运输设备制造业',
    '电气机械和器材制造业', '计算机、通信和其他电子设备制造业', '仪器仪表制造业', '其他制造业', '废弃资源综合利用业', '金属制品、机械和设备修理业'],
  '电力、热力、燃气及...': ['电力、热力生产和供应业', '燃气生产和供应业', '水的生产和供应业'],
  '建筑业': ['房屋建筑业', '土木工程建筑业', '建筑安装业', '建筑装饰和其他建筑业'],
  '批发和零售业': ['批发业', '零售业'],
  '交通运输、仓储和...': ['铁路运输业', '道路运输业', '水上运输业', '航空运输业', '管道运输业', '装卸搬运和运输代理业', '仓储业', '邮政业'],
  '住宿和餐饮业': ['住宿业', '餐饮业'],
  '信息传输、软件和...': ['电信、广播电视和卫星传输服务', '互联网和相关服务', '软件和信息技术服务业'],
  '金融业': ['货币金融服务', '资本市场服务', '保险业', '其他金融业'],
  '房地产业': ['房地产业'],
  '租赁和商务服务业': ['租赁业', '商务服务业'],
  '科学研究和技术服务业': ['研究和试验发展', '专业技术服务业', '科技推广和应用服务业'],
  '水利、环境和...': ['水利管理业', '生态保护和环境治理业', '土地管理业'],
  '居民服务、修理和...': ['居民服务业', '机动车、电子产品和日用产品修理业', '其他服务业'],
  '教育': ['教育'],
  '卫生和社会工作': ['卫生', '社会工作'],
  '文化、体育和娱乐业': ['新闻和出版业', '广播、电视、电影和影视录音制作业', '文化艺术业', '体育', '娱乐业'],
  '公共管理、社会保障和...': ['中国共产党机关', '国家机构', '人民政协、民主党派', '社会保障', '群众团体、社会团体和其他成员组织', '基层群众自治组织'],
  '国际组织': ['国际组织']
}
// var area = {
//   '110100': [
//     {
//       'city': '市辖区',
//       'text': '东城区',
//       'value': '110101'
//     },
//     {
//       'city': '市辖区',
//       'text': '西城区',
//       'value': '110102'
//     }
//   ],
//   '110200': [
//     {
//       'city': '市辖区',
//       'text': '东城区',
//       'value': '110101'
//     },
//     {
//       'city': '市辖区',
//       'text': '西城区',
//       'value': '110102'
//     }
//   ]
// }
industry.forEach(function (v) {
  industries.push(
    {
      text: v,
      value: v
    }
  )
})
for (var first in twomap) {
  let tempArr = []
  for (var two in twomap[first]) {
    tempArr.push({
      text: twomap[first][two],
      value: twomap[first][two]
    })
  }
  twoIndustries[first] = tempArr
}

module.exports = {
  industries,
  twoIndustries
}
