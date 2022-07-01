// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import JsonExcel from 'vue-json-excel'
import md5 from 'md5'
import echarts from '../src/plugin/echarts_ui'

Vue.prototype.$echarts = echarts
Vue.prototype.$md5 = md5
Vue.component('downloadExcel', JsonExcel)
Vue.use(JsonExcel)
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


router.beforeEach((to, from, next) => {
  var flag = sessionStorage.getItem('user')
  var flag2 = sessionStorage.getItem('token')
  if(to.meta.requireAuth == true){
    if(!flag&&!flag2){
      next({
        path:'/'
      })
    }else{
      return next()
    }
  }else{
    return next()
  }

}
)