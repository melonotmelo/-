import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue';
import AdminUser from '../components/admin-user/admin-user.vue';
import AdminHouse from '../components/admin-house/admin-house.vue';
import AdminOrder from '../components/admin-order/admin-order.vue';
import AdminFeedbacks from '../components/admin-feedbacks/admin-feedbacks.vue'

import Room from "@/components/Room";
import Info from "@/components/Info";
import Contract from "@/components/Contract";
import PersonalCenter from "@/components/PersonalCenter";

import Center from '../views/Center.vue'
import Repair from '../views/Repair.vue'
import Complaint from '../views/Complaint.vue'
import HouseInfo from '../views/HouseInfo.vue'
import Feedbacks from '../views/Feedbacks.vue'
import TestUpload from '../views/Test.vue'
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
          {path:'/admin-feedbacks', component: AdminFeedbacks},
      ]
    },
    {
      path: '/login/',
      name: 'login',
      component: Login
    },
    { path: '/room',component:Room},
    { path: '/room/info',component:Info},
    { path: '/room/info/contract',component:Contract},
    { path: '/personalCenter',component:PersonalCenter},
    {
      path: '/center/',
      name: 'center',
      component: Center,
    },
    {
      path: '/repair/',
      name: 'repair',
      component: Repair,
    },
    {
      path: '/complaint/',
      name: 'complaint',
      component: Complaint,
    },
    {
      path: '/houseInfo/:house_id',
      name: 'houseInfo',
      component: HouseInfo,
    },
    {
      path: '/feedbacks/',
      name: 'feedbacks',
      component: Feedbacks,
    },
    {
      path: '/testUpload/',
      name: 'testUpload',
      component: TestUpload,
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

