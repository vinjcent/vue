import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Perms from '../components/authority/Perms.vue'
import Roles from '../components/authority/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Commodities from '../components/goods/Commodities.vue'
import AddCommo from '../components/goods/AddCommo.vue'



Vue.use(Router)

const router = new Router({
  // 路径不带 # 符号
  mode: 'history',
  routes: [
    // 访问路径"/"重定向到Login
    { path: "/", redirect: '/login' },
    { path: "/login", component: Login },
    {
      path: "/home",
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/perms', component: Perms },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/params', component: Params },
        { path: '/commodities', component: Commodities },
        { path: '/commodities/add', component: AddCommo },




      ]
    },
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转
  // next 是一个函数,代表放行
  // next('/login') 强制跳转
  if (to.path === '/login') return next();
  // 获取token
  const token = window.sessionStorage.getItem('token');
  // 如果token为空,返回登录页
  if (!token) return next('/login');
  // 执行下一步
  next();
})

// 将路由导出
export default router
