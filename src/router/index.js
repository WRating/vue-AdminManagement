import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home
    }
  ]
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to是将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行，next('/login')强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
