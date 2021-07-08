import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'


import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

// 部署时，通过dockfile赋值
// const {apiBaseUrl} = document.querySelector('html').dataset // dockfile最后一行，通过变量名对应
// if (apiBaseUrl) {
//   Vue.prototype.$apiBaseUrl = `${apiBaseUrl}`
// } else {
//   Vue.prototype.$apiBaseUrl = process.env.BASE_API
// }

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
