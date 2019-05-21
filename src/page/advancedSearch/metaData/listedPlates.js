var listedPlates = ['沪市A股', '沪市B股', '深市A股', '深市B股', '创业板', '中小板']

var listedPlate = []

listedPlates.forEach(function (v) {
  listedPlate.push(
    {
      text: v,
      value: v
    }
  )
})

module.exports = {
  listedPlate
}
