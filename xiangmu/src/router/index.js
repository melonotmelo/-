import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import PersonalCenter from '../components/PersonalCenter'
import Home from '../components/Home'
import Contract from "@/components/Contract";
import test from "@/components/test";

Vue.use(VueRouter)

export default new VueRouter({
  routes:[
    { path:'/' ,redirect:'/login'},
    { path: '/login',component:Login},
    { path: '/home',component:Home, meta:{keepAlive:true}},
    { path: '/home/contract',component:Contract},
    { path: '/personalCenter',component:PersonalCenter},
    { path: '/test',component:test}
  ]
})

/*const router = new VueRouter({
  routes:[
    { path:'/' ,redirect:'/login'},
    { path: '/login',component:Login},
    { path: '/home',component:Home},
    { path: '/personalCenter',component:PersonalCenter}

  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  else if(to.path === '/home/contract') return next('/home')
  next()
})

export default router*/
