import Vue from 'vue'
import Vuex from 'vuex'
import { getTimeInterval } from '../utils/index'
import { fetchSocial, fetchSiteInfo } from '@/api'

Vue.use(Vuex)
// 略:后台获取系统运行时间
const runAt = '1589878800000'
let timer = null
const state = {
  loading: false,
  runTimeInterval: '',
  socials: '',
  websiteInfo: '',
  user_login: false
}
const mutations = {
  SET_USERLOGIN: (state, v) => {
    state.user_login = v
  },
  SET_LOADING: (state, v) => {
    state.loading = v
  },
  SET_SOCIALS: (state, v) => {
    state.socials = v
  },
  SET_SITE_INFO: (state, v) => {
    state.websiteInfo = v
  },
  GET_RUNTIME_INTERVAL: state => {
    if (!timer || !state.runTimeInterval) {
      clearInterval(timer)
      timer = setInterval(() => {
        state.runTimeInterval = getTimeInterval(runAt)
      }, 1000)
    }
  }
}
const actions = {
  setUser_login: ({ commit }, v) => {
    console.log(v)
    commit('SET_USERLOGIN', v)
  },
  setLoading: ({ commit }, v) => {
    commit('SET_LOADING', v)
  },
  initComputeTime: ({ commit }) => {
    commit('GET_RUNTIME_INTERVAL')
  },
  getSiteInfo: ({ commit, state }) => {
    return new Promise(resolve => {
      if (state.websiteInfo) {
        resolve(state.websiteInfo)
      } else {
        fetchSiteInfo()
          .then(res => {
            const data = res.data || {}
            commit('SET_SITE_INFO', data)
            resolve(data)
          })
          .catch(err => {
            resolve({ err: err })
          })
      }
    })
  },
  getSocials: ({ commit, state }) => {
    return new Promise(resolve => {
      if (state.socials) {
        resolve(state.socials)
      } else {
        fetchSocial()
          .then(res => {
            const data = res.data || []
            commit('SET_SOCIALS', data)
            resolve(data)
          })
          .catch(err => {
            resolve([err])
          })
      }
    })
  }
}
const getters = {
  loading: state => state.loading,
  runTimeInterval: state => state.runTimeInterval,
  notice: state => (state.websiteInfo ? state.websiteInfo.notice : ''),
  user_login: state => state.user_login
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {},
  getters
})
