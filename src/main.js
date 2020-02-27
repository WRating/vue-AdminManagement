import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
Vue.prototype.$http = axios

Vue.config.productionTip = false
axios.defaults.baseURL = 'https://lipiao.top/restaurantApi/common/'//这里写登录数据提交的API根路径

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
