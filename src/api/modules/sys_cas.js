// Code generated by dol build. DO NOT EDIT.
// source: auto.go
const axios = require('@/utils/request').default

// login 登录信息
module.exports.login = (data) => {
  const url = '/api/sys/cas/login'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// logout 注销信息
module.exports.logout = (data) => {
  let url = '/api/sys/cas/logout?'
  for (var key in data) {
    url += key + '=' + data[key] + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// affirm 用户授权
module.exports.affirm = (data) => {
  const url = '/api/sys/cas/affirm'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// authorize 用户授权
module.exports.authorize = (data) => {
  let url = '/api/sys/cas/authorize?'
  for (var key in data) {
    url += key + '=' + data[key] + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// token 获取令牌
module.exports.token = (data) => {
  const url = '/api/sys/cas/token'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// uRL 授权地址
module.exports.uRL = (data) => {
  let url = '/api/sys/cas/url?'
  for (var key in data) {
    url += key + '=' + data[key] + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// oauth2 授权回调
module.exports.oauth2 = (data) => {
  let url = '/api/sys/cas/oauth2?'
  for (var key in data) {
    url += key + '=' + data[key] + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// refresh 刷新令牌
module.exports.refresh = (data) => {
  let url = '/api/sys/cas/refresh?'
  for (var key in data) {
    url += key + '=' + data[key] + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// check 检验令牌
module.exports.check = (data) => {
  let url = '/api/sys/cas/check?'
  for (var key in data) {
    url += key + '=' + data[key] + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// profile 用户信息
module.exports.profile = (data) => {
  let url = '/api/sys/cas/profile?'
  for (var key in data) {
    url += key + '=' + data[key] + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// qrcode 扫码登录(绑定第三方)
module.exports.qrcode = (data) => {
  let url = '/api/sys/cas/qrcode?'
  for (var key in data) {
    url += key + '=' + data[key] + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

