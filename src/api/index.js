import * as api from './modules'

export function apiPlugin(Vue) {
  if (apiPlugin.installed) { return }
  apiPlugin.installed = true
  Object.defineProperties(Vue.prototype, {
    $api: {
      get() {
        return api
      }
    }
  })
}

export default api
