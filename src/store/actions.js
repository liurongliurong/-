import api from '../share/api'
import * as types from './mutation-types'

export default {
  getUserInfo ({commit, state}) {
    api.get('user/info').then((res) => {
      commit(types.SET_INFO, res.data)
    }).catch(error => {
      console.log(error)
    })
  },
  getAdminUserInfo ({commit, state}) {
    api.get('manager/info').then((res) => {
      commit(types.ADMIN_SET_INFO, res.data)
    }).catch(error => {
      console.log(error)
    })
  }
}
