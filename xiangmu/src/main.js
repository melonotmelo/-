import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import less from 'less'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './css/global.css'
import './plugins/element.js'
//导入阿里图标
import './assets/icon/iconfont.css'
//导入接口
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://81.70.132.82:8000/rms/'
axios.interceptors.request.use(config=>{
  console.log(config)
  //config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.use(ElementUI);
Vue.use(less)
Vue.config.productionTip = false
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
