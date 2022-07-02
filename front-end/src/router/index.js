import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MerchandiseView from '@/views/MerchandiseView.vue'
import MusicView from '@/views/MusicView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/merchandise',
    name: 'merchandise',
    component: MerchandiseView
  },
  {
    path: '/music',
    name: 'music',
    component: MusicView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
