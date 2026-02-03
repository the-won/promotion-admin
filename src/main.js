import Vue from 'vue'
import App from './App.vue'
import router from './router'
// main.js 또는 App.vue에서
import './styles/common-form.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')