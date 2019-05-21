var number = ['1 层内关联', '2 层内关联', '3 层内关联', '4 层内关联', '5 层内关联', '6 层内关联', '7 层内关联', '8 层内关联', '9 层内关联', '10 层内关联']

var numbers = []

number.forEach(function (v) {
  numbers.push(
    {
      text: v,
      value: v.substr(0, 1)
    }
  )
})

module.exports = {
  numbers
}
