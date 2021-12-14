import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/style.less'
import './assets/font/iconfont.css'
import { parseTime } from './utils'
import './plugins/element.js'
import SlideVerify from 'vue-monoplasty-slide-verify'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.use(SlideVerify)
Vue.config.productionTip = false
Vue.filter('parseTime', v => parseTime(v, '{y}-{m}-{d}'))
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
