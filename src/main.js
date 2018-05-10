// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './share/api'
import store from './store/store'
import './stylesheets/style.scss'
import './iconfont/iconfont.css'
import 'babel-polyfill'

Vue.config.productionTip = false

Vue.prototype.api = api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
