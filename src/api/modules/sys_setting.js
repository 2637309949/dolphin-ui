// Code generated by dol build. DO NOT EDIT.
const axios = require('@/utils/request').default

// add 添加设置
module.exports.add = (data) => {
  const url = '/api/sys/setting/add'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// del 删除设置
module.exports.del = (data) => {
  const url = '/api/sys/setting/del'
  return axios({
    url: url,
    method: 'delete',
    data
  })
}

// batchDel 删除设置
module.exports.batchDel = (data) => {
  const url = '/api/sys/setting/batch_del'
  return axios({
    url: url,
    method: 'delete',
    data
  })
}

// update 更新设置
module.exports.update = (data) => {
  const url = '/api/sys/setting/update'
  return axios({
    url: url,
    method: 'put',
    data
  })
}

// page 设置分页查询
module.exports.page = (data) => {
  let url = '/api/sys/setting/page?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// get 获取设置信息
module.exports.get = (data) => {
  let url = '/api/sys/setting/get?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}
