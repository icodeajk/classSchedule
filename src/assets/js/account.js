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
      password: password
      // password: encryptByDES(password)
    })
  }).then(function (response) {
    return response.json()
  }).then(resolveCallback, rejectCallback).catch(function (e) {
  })
}

var loginByjiangnan = function (username, resolveCallback, rejectCallback) {
  fetch('/api/account/user/login/mobile', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username
    })
  }).then(function (response) {
    return response.json()
  }).then(resolveCallback, rejectCallback).catch(function (e) {
  })
}

var getProfile = function (resolveCallback, rejectCallback) {
  fetch('/hz/api/account/user/profile', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
  }).then(function (response) {
    return response.json()
  }).then(resolveCallback, rejectCallback).catch(function (e) {
  })
}

// 百合园token登录
var loginByBhy = function (param) {
  return fetch('/hz/api/account/user/loginByBhy?' + window.fn.getQueryString(param), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export default {
  getProfile: getProfile,
  login: login,
  loginByBhy: loginByBhy,
  loginByjiangnan: loginByjiangnan
}
