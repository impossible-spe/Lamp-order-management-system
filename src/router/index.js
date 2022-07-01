import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import config from '@/components/config'
import dingdan from '@/components/dingdan'
import customer from '@/components/customer'
import supplier from '@/components/supplier'
import typeinput from '@/components/typeinput'
import user from '@/components/user'
import login from '@/components/login'
import cailiao from '@/components/cailiao'
import zhanshi from '@/components/zhanshi'
import bijia from '@/components/bijia'

Vue.use(Router)

export default new Router({
  
  routes: [
    {
      path: '/',
      component: login,
    },
    {
      path: '/login',
      component: login,
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta:{
        requireAuth: true
      },
      children: [
        { path: '/config', component: config, 
        meta:{
          requireAuth: true
        },},
        { path: '/dingdan', 
          component: dingdan, 
          name: '订单页面', 
          beforeEnter:(to, from, next)=>{
            var role = JSON.parse(sessionStorage.getItem('user')) [0].role
            if (role == '管理员'){
              return next()
            }else{
              next('/home')
            }
          },
          meta:{
          requireAuth: true
        }, },
        { path: '/customer', 
          component: customer, 
          name: '客户名录',
          beforeEnter:(to, from, next)=>{
            var role = JSON.parse(sessionStorage.getItem('user')) [0].role
            if (role == '管理员'){
              return next()
            }else{
              next('/home')
            }
          },
          meta:{
          requireAuth: true
        }, },
        { path: '/supplier', 
          component: supplier,
          name: '供应商名录', 
          meta:{
          requireAuth: true
        }, },
        { path: '/typeinput', component: typeinput, name: '录单页面', meta:{
          requireAuth: true
        }, 
      },
        { path: '/user', 
          component: user, 
          name: '用户页面',
          beforeEnter:(to, from, next)=>{
            var role = JSON.parse(sessionStorage.getItem('user')) [0].role
            if (role == '管理员'){
              return next()
            }else{
              next('/home')
            }
          },
          meta:{
          requireAuth: true
        }, 
      },
        { path: '/bijia', 
          component: bijia, 
          name: '材料比价',
          beforeEnter:(to, from, next)=>{
            var role = JSON.parse(sessionStorage.getItem('user')) [0].role
            if (role == '管理员'){
              return next()
            }else{
              next('/home')
            }
          },
          meta:{
          requireAuth: true
        }, 
      },
      { path: '/zhanshi', 
          component: zhanshi, 
          name: '数据展示',
          beforeEnter:(to, from, next)=>{
            var role = JSON.parse(sessionStorage.getItem('user')) [0].role
            if (role == '管理员'){
              return next()
            }else{
              next('/home')
            }
          },
          meta:{
          requireAuth: true
        }, 
      },
        { path: '/cailiao', 
          component: cailiao, 
          meta:{
          requireAuth: true
        }, 
      },
        ]
      },
  ] 
})

