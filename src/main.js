// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import _g from './assets/js/global'
import axios from 'axios'
import Lockr from 'lockr'
import store from './vuex/store'
import Cookies from 'js-cookie'
import VueRouter from 'vue-router'
import routes from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import _ from 'lodash'  //js第三方依赖库

window.HOST = 'localhost'
axios.defaults.baseURL = HOST
axios.defaults.timeout = 1000 * 15
axios.defaults.headers.authKey = Lockr.get('authKey')
axios.defaults.headers.sessionId = Lockr.get('sessionId')
axios.defaults.headers['Content-Type'] = 'application/json'

axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容
  if (store.state.authKey) {
    config.headers.authKey = Lockr.get('authKey')
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes
})


Vue.use(ElementUI)
Vue.use(VueRouter)
const bus = new Vue()
window.bus = bus


window.store = store
window._ = _
window.router = router
window.Lockr = Lockr
window.Cookies = Cookies
window.axios = axios
window._g = _g
Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
