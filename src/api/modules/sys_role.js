// Code generated by dol build. DO NOT EDIT.
// source: auto.go
const axios = require('@/utils/request').default

// add 添加角色
module.exports.add = (data) => {
  const url = '/api/sys/role/add'
  return axios({
    url: url,
    method: 'post',
    data
  })
}

// del 删除角色
module.exports.del = (data) => {
  const url = '/api/sys/role/del'
  return axios({
    url: url,
    method: 'delete',
    data
  })
}

// update 更新角色
module.exports.update = (data) => {
  const url = '/api/sys/role/update'
  return axios({
    url: url,
    method: 'put',
    data
  })
}

// page 角色分页查询
module.exports.page = (data) => {
  let url = '/api/sys/role/page?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// roleMenuTree 角色菜单树形结构
module.exports.roleMenuTree = (data) => {
  let url = '/api/sys/role/role_menu_tree?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// roleAppFunTree 角色App功能树形结构
module.exports.roleAppFunTree = (data) => {
  let url = '/api/sys/role/role_app_fun_tree?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

// get 获取角色信息
module.exports.get = (data) => {
  let url = '/api/sys/role/get?'
  for (var key in data) {
    url += key + '=' + encodeURIComponent(data[key]) + '&'
  }
  return axios({
    url: url,
    method: 'get'
  })
}

