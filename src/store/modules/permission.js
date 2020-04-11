import { constantRoutes } from '@/router'
import api from '@/api'
import path from 'path'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

function buildRouters(accessedRoutes) {
  return (accessedRoutes || []).map(item => {
    const routerItem = {}
    if (!item.parent) {
      routerItem.component = Layout
      if (!item.component) {
        routerItem.path = item.tag.url
        routerItem.path = path.join('/', routerItem.path)
      } else {
        routerItem.path = '/'
        routerItem.children = [{
          path: item.tag.url,
          name: item.tag.code,
          hidden: item.tag.hidden || false,
          component: () => require(`@/views/${item.tag.component}`).default,
          meta: { title: item.tag.name, icon: item.tag.icon }
        }]
      }
    } else {
      routerItem.path = item.tag.url
      routerItem.component = item.tag.component ? () => require(`@/views/${item.tag.component}`).default : Layout
    }
    routerItem.name = item.tag.code
    routerItem.meta = { 'title': item.tag.name, 'icon': item.tag.icon }
    if (item.tag.active_menu) {
      routerItem.meta.activeMenu = item.tag.active_menu
    }
    routerItem.hidden = item.tag.hidden || false
    routerItem.alwaysShow = false
    routerItem.children = buildRouters(item.nodes)
    return routerItem
  })
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      return api.sysMenu.sidebar().then(res => {
        let { data: accessedRoutes } = res
        accessedRoutes = buildRouters(accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
