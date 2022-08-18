// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'

// 需要创建一个css文件,保存全局样式
import './assets/css/global.css'


// 局部引入element-ui
import './plugins/element.js'

// 请求单独处理
import http from './utils/request.js'

Vue.prototype.$http = http

Vue.component('tree-table', TreeTable)


// 全局引入组件element-ui
// import elementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(elementUI);

// 引入axios
// import axios from 'axios';
// // 配置请求的根路径,后端的接口
// axios.defaults.baseURL = 'http://localhost:3035/'
// axios.interceptors.request.use(config => {
//   // 为请求头对象,添加 Token 验证的 Authorization 字段
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   // 在最后必须返回config
//   return config
// })
// Vue.prototype.$http = axios



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
