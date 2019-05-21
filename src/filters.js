let filters = {
  // 年-月-日
  dateFormat (date) {
    if(!date){return '--'}
    if (!new Date(date)) return ''
    //兼容safari
    date=date.replace(/\-/g,'/').split('.')[0];


    var time = new Date(date)


    var year = time.getFullYear()
    var month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    var day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    var hour = time.getHours() > 9 ? time.getHours() : '0' + time.getHours()
    var minute = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()
    var second = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
    return year + '-' + month + '-' + day
  },
  // 时-分-秒
  dateFormat2 (date) {
    if (!new Date(date)) return ''
    var time = new Date(date)
    var year = time.getFullYear()
    var month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)
    var day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
    var hour = time.getHours() > 9 ? time.getHours() : '0' + time.getHours()
    var minute = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()
    var second = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
    return hour + ':' + minute + ':' + second
  },
  /**
     * @desc 将'1850000000.00'格式的数据转化为'185,000.00'(转化为万元、千分位格式、保存两位小数)
     *
     * */
  formatMoney (value, fixed, unit) {
    fixed = fixed !== undefined ? fixed : 2
    unit = unit !== undefined ? unit : 10000
    if (value === null || value === undefined || isNaN(parseFloat(value)) || Number(value) === 0) {
      return '未公示'
    }
    // 将数字进行千分位格式化
    function toThousands (num) {
      num = (num || 0).toString()
      var parts = num.split('.')
      var bigZeroPart = parts[0]
      var result = ''
      while (bigZeroPart.length > 3) {
        result = ',' + bigZeroPart.slice(-3) + result
        bigZeroPart = bigZeroPart.slice(0, bigZeroPart.length - 3)
      }
      if (bigZeroPart) {
        result = bigZeroPart + result
      }
      if (parts.length > 1) {
        result += '.' + parts[1].toString()
      }
      return result
    }

    // value = (value / unit).toFixed(fixed)    toFixed会四舍五入
    value = (value / unit).toString()
    var arr = value.split('.')
    if (arr.length > 1) {
      value = arr[0] + '.' + arr[1].substr(0, fixed)
    }
    value = toThousands(value)
    return value || '未公示'
  },
  // 解析格式化标签数据
  formatTag (tagObj) {
    return tagObj.valueType == 2 ? tagObj.tagValue : tagObj.tagName + ':' + tagObj.tagValue
  },
  // 解析实际控制人数据
  filterControllers (data) {
    let result = []
    if (Array.isArray(data)) {
      for (let index = 0; index < data.length; index++) {

        result.push(element.controller.name)
      }
    }
    return result.length > 0 ? (result + '') : '未公示'
  }
}
export default {
  install: function (Vue) {
    for (var key in filters) {
      Vue.filter(key, filters[key])
    }
  }
}
