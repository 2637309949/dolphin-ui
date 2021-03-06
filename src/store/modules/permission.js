import { constantRoutes } from '@/router'
import api from '@/api'
import path from 'path'
import Layout from '@/layout'
import router, { resetRouter } from '@/router'

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

function buildRouters(accessedRoutes = []) {
  return accessedRoutes.map(item => {
    const routerItem = {}
    routerItem.name = !item.parent && (item && item.nodes.length === 0 || !item) ? null : item.tag.code
    routerItem.path = !item.parent && (item && item.nodes.length === 0 || !item) ? path.join('/', item.tag.url) : path.join(!item.parent ? '/' : '', item.tag.url)
    routerItem.component = !item.parent ? Layout : () => import(`@/views/${item.tag.component}`)
    routerItem.meta = { 'title': item.tag.name, 'icon': item.tag.icon, 'activeMenu': item.tag.active_menu }
    routerItem.hidden = item.tag.hidden || false
    routerItem.alwaysShow = false
    routerItem.children = !item.parent && (item && item.nodes.length === 0 || !item) ? [{
      path: 'index',
      name: item.tag.code,
      hidden: item.tag.hidden || false,
      component: () => import(`@/views/${item.tag.component}`),
      meta: { title: item.tag.name, icon: item.tag.icon }
    }] : buildRouters(item.nodes)
    return routerItem
  })
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      return api.sysMenu.sidebar().then(res => {
        const { data: menuTree } = res
        const accessedRoutes = buildRouters(menuTree)
        console.log(accessedRoutes)
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
  },

  // dynamically modify routes
  resetRoutes({ commit, dispatch }) {
    return new Promise(async resolve => {
      const { roles } = await dispatch('user/getInfo', null, { root: true })

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('generateRoutes', roles)

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
