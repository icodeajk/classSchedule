var listedStatus = ['正常上市', '拟上市', '暂停上市', '终止上市']

var listedStatu = []

listedStatus.forEach(function (v) {
  listedStatu.push(
    {
      text: v,
      value: v
    }
  )
})

module.exports = {
  listedStatu
}
