import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}


// 公告方法
Vue.prototype.formFormat = (format) => {
  if(String(format).length > 15){
    return format
  }
  if(!format){
    var d = new Date();
  }else {
    var d = new Date(format * 1000);    //根据时间戳生成的时间对象
  }
  let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
  let day = d.getDate() <10 ? '0' + d.getDate() : d.getDate();
  let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
  var date = (d.getFullYear()) + "-" +
  month + "-" +
  day + " " +
  hour + ":" +
  minutes + ":" +
  seconds;
  return date
}
// set ElementUI lang to EN
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
