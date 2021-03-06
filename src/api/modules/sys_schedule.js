// Code generated by dol build. DO NOT EDIT.
const axios = require('@/utils/request').default

// add 添加调度
module.exports.add = (data) => {
  const url = '/api/sys/schedule/add'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// del 删除调度
module.exports.del = (data) => {
  const url = '/api/sys/schedule/del'
  return axios({
    url: url,
    method: 'delete',
    data
  })
}

// batchDel 删除调度
module.exports.batchDel = (data) => {
  const url = '/api/sys/schedule/batch_del'
  return axios({
    url: url,
    method: 'delete',
    data
  })
}

// update 更新调度
module.exports.update = (data) => {
  const url = '/api/sys/schedule/update'
  return axios({
    url: url,
    method: 'put',
    data
  })
}

// page 调度分页查询
module.exports.page = (data) => {
  let url = '/api/sys/schedule/page?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// get 获取调度信息
module.exports.get = (data) => {
  let url = '/api/sys/schedule/get?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}
