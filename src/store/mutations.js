import * as types from './mutation-types'

export default {
  [types.SET_INFO] (state, userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    state.userInfo = Object.assign({}, state.userInfo, userInfo)
  },

  [types.GET_INFO] (state) {
    let userInfo = localStorage.getItem('userInfo')
    state.userInfo = Object.assign({}, state.userInfo, JSON.parse(userInfo))
  },

  [types.SIGN_OUT] (state) {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  },

  [types.ADMIN_SET_INFO] (state, userInfo) {
    localStorage.setItem('adminUserInfo', JSON.stringify(userInfo))
    state.adminUserInfo = Object.assign({}, state.adminUserInfo, userInfo)
  },

  [types.ADMIN_GET_INFO] (state) {
    let userInfo = localStorage.getItem('adminUserInfo')
    state.adminUserInfo = Object.assign({}, state.adminUserInfo, JSON.parse(userInfo))
  }
}
