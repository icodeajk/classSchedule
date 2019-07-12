import CryptoJS from './tripledes.js'

// 加密
function encryptByDES (message) {
  // 20170527深研一周年
  var keyHex = CryptoJS.enc.Utf8.parse('20170527')

  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

var login = function (username, password, resolveCallback, rejectCallback) {
  fetch('/api/account/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      // password: password
      password: encryptByDES(password)
    })
  }).then(function (response) {
    return response.json()
  }).then(resolveCallback, rejectCallback).catch(function (e) {
  })
}
var signUp = function (username, password, resolveCallback, rejectCallback) {
  fetch('/api/account/signUp', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      // password: password
      password: encryptByDES(password)
    })
  }).then(function (response) {
    return response.json()
  }).then(resolveCallback, rejectCallback).catch(function (e) {
  })
}
export default {
  login: login,
  signUp: signUp
}
