import { sysOptionset } from '@/api/modules'

const state = {
}

const mutations = {
}

const actions = {
  async formatterData({ dispatch, commit }, code) {
    await dispatch('getOptionsets', code)
    return state[code]
  },
  async flattenData({ dispatch, commit }, code) {
    await dispatch('getOptionsets', code)
    const stateObj = {}
    state[code].forEach(item => {
      stateObj[item.value] = item.text
    })
    return stateObj
  },
  async getOptionsets({ commit }, code) {
    if (state[code] === undefined) {
      const { data: { value } = {}} = await sysOptionset.get({ code: code })
      if (value) {
        state[code] = JSON.parse(value)
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

