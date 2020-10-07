// Code generated by dol build. DO NOT EDIT.
const axios = require('@/utils/request').default

// add 添加角色菜单
module.exports.add = (data) => {
  const url = '/api/sys/role/menu/add'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// batchAdd 添加角色菜单
module.exports.batchAdd = (data) => {
  const url = '/api/sys/role/menu/batch_add'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// del 删除角色菜单
module.exports.del = (data) => {
  const url = '/api/sys/role/menu/del'
  return axios({
    url: url,
    method: 'delete',
    data
  })
}

// batchDel 删除角色菜单
module.exports.batchDel = (data) => {
  const url = '/api/sys/role/menu/batch_del'
  return axios({
    url: url,
    method: 'delete',
    data
  })
}

// update 更新角色菜单
module.exports.update = (data) => {
  const url = '/api/sys/role/menu/update'
  return axios({
    url: url,
    method: 'put',
    data
  })
}

// page 角色菜单分页查询
module.exports.page = (data) => {
  let url = '/api/sys/role/menu/page?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// get 获取角色菜单信息
module.exports.get = (data) => {
  let url = '/api/sys/role/menu/get?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}
