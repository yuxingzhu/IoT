import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
 
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)

// import JsonExcel from 'vue-json-excel'
// Vue.component('downloadExcel', JsonExcel)
import Blob from './Excel/Bolb'
import Export2Excel from './Excel/Export2Excel'
import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to zh-CN
Vue.use(ElementUI, {
  locale,
  size: 'small'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
