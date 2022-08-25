// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


// 需要创建一个css文件,保存全局样式
import './assets/css/global.css'
// 引入防抖、节流函数
import { debounce, throttle } from './utils/commons.js'


// 局部引入element-ui
import './plugins/element.js'

// 请求单独处理
import http from './utils/server.js'
Vue.prototype.$http = http

// 树形结构
Vue.component('tree-table', TreeTable)

// 将富文本注册为全局可用的组件
Vue.use(VueQuillEditor)

// 过滤日期时间(毫秒的形式)
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  // padStart: 第一个参数代表总长度;第二个参数代表,不足2位的话用哪个字符串填充
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hour = (dt.getHours() + '').padStart(2, '0')
  const minute = (dt.getMinutes() + '').padStart(2, '0')
  const second = (dt.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})
/*  
    使用模板
    <template slot-scope="scope">
        {{scope.row.createTime | dateFormat}}
    </template>
*/



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
