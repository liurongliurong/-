import axios from 'axios'
import { Config } from '../../config/default'
import router from '../router'
var qs = require('qs')

let token = localStorage.getItem('token') || ''
let api = axios.create({
  baseURL: Config.backend,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'x-auth-token': token
  }
})

// 修改返回数据格式//localStorage.getItem('token') || ''
api.defaults.transformResponse = (res) => {
  let data = JSON.parse(res)
  if (data.code === 401) {
    localStorage.setItem('logged', false)
    if (router.history.current.path.includes('/admin')) {
      router.push({name: 'AdminLogin'})
    } else {
      router.push({name: 'Login'})
    }
  }
  return data
}

api.interceptors.response.use(res => {
  if (typeof (res.headers['x-auth-token']) !== 'undefined') {
    localStorage.setItem('token', res.headers['x-auth-token'])
    api.defaults.headers['x-auth-token'] = res.headers['x-auth-token']
  }

  if (res.status === 200) {
    return res.data
  }
  return res
})

api.interceptors.request.use(config => {
  config.data = qs.stringify(config.data)
  return config
}, error => {
  return Promise.reject(error)
})

export default api
