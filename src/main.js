import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  iconfont: 'mdi'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
