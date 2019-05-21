var marketStatus = ['营业中', '清算', '注销,吊销', '迁入', '迁出', '撤销', '停业', '筹建']
var marketStatu = []
marketStatus.forEach(function (v) {
  let arr = v.split(',')
  marketStatu.push(
    {
      text: v,
      value: arr[0]
    }
  )
})
module.exports = {
  marketStatu
}
