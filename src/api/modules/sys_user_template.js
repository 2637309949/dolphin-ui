// Code generated by dol build. DO NOT EDIT.
const axios = require('@/utils/request').default

// add 添加用户模板
module.exports.add = (data) => {
  const url = '/api/sys/user/template/add'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// del 删除用户模板
module.exports.del = (data) => {
  const url = '/api/sys/user/template/del'
  return axios({
    url: url,
    method: 'delete',
    data
  })
}

// update 更新用户模板
module.exports.update = (data) => {
  const url = '/api/sys/user/template/update'
  return axios({
    url: url,
    method: 'put',
    data
  })
}

// page 用户模板分页查询
module.exports.page = (data) => {
  let url = '/api/sys/user/template/page?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// get 获取用户模板信息
module.exports.get = (data) => {
  let url = '/api/sys/user/template/get?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}
