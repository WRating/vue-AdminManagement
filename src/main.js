import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
import qs from 'qs';
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs

Vue.config.productionTip = false
// axios.defaults.baseURL = 'https://api.jakting.com/v1/news/netease/conn/'//这里写登录数据提交的API根路径

axios.defaults.baseURL = 'https://lipiao.top/restaurantApi'//这里写登录数据提交的API根路径

// 挂载之前为axios设立拦截器
// axios.interceptors.request.use(config => {
//   //为请求头对象添加token验证的Authorization字段
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   console.log(config)
//   //在最后必须return config
//   return config
// })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
