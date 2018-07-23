import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import MapBox from '@/components/MapBox.vue'
import d3 from '@/components/D3.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/mapbox', component: MapBox },
    { path: '/d3', component: d3 }
  ]
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
