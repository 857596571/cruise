import Vue from 'vue'
import Router from 'vue-router'
import Cruise from '@/components/Cruise'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Cruise',
      component: Cruise
    }
  ]
})
