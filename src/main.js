import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import searchFormConfig from 'search-form-config'
import 'search-form-config/search-form.css'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(searchFormConfig)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
