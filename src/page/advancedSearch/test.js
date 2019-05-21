let oneMillion = 1000000
let capitalRange = {
{from: '', to: '',  ,label: '全部'},
{to: oneMillion ,label: '100万以下' },
{from: oneMillion, to: 5 * oneMillion,label: '100-500万' },
{from: 5 * oneMillion, to: 10 * oneMillion ,label: '500-1000万' },
{from: 10 * oneMillion, to: 30 * oneMillion ,label: '1000-3000万'},
{from: 30 * oneMillion, to: 50 * oneMillion ,label: '3000-5000万'},
{from: 50 * oneMillion, to: 100 * oneMillion ,label: '5000万-1亿'},
{from: 100 * oneMillion, to: 300 * oneMillion ,label: '1亿-3亿'},
{from: 300 * oneMillion, to: 500 * oneMillion ,label: '3亿-5亿'},
{from: 500 * oneMillion, to: 1000 * oneMillion,label: '5亿-10亿'},
{from: 1000 * oneMillion ,label: '10亿及以上'}
}
let capitalRange = [
  {}
]
module.exports = {
  capitalRange
}
