import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import EmTemplates from './views/EmTemplates.vue'
import EventTemplates from './views/EventTemplates.vue'
import Settings from './views/Settings.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/em-templates'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/em-templates',
    name: 'EmTemplates',
    component: EmTemplates
  },
  {
    path: '/event-templates',
    name: 'EventTemplates',
    component: EventTemplates
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = new VueRouter({
  // mode: 'hash',
  mode: 'history',
  routes
})

export default router