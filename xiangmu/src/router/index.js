import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue';
import AdminUser from '../components/admin-user/admin-user.vue';
import AdminHouse from '../components/admin-house/admin-house.vue';
import AdminOrder from '../components/admin-order/admin-order.vue';
import Test from "../test.vue";
Vue.use(Router)

const router = new Router({
  routes:[
    { path:'/' ,redirect:'/login'},
    { path: '/login',component:Login},
    {
      path: '/home',
      component:Home,
      redirect:'/welcome',
      children:[
          {path:'/welcome',component:Welcome},
          {path:'/admin-user',component:AdminUser},
          {path:'/admin-house',component:AdminHouse},
          {path:'/admin-order',component:AdminOrder},
          {path:'/test',component:Test}
      ]
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router

