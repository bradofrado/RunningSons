import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MerchandiseView from '@/views/MerchandiseView.vue'
import MerchandiseCollectionsView from '@/views/MerchandiseCollectionsView.vue'
import MusicView from '@/views/MusicView.vue';
import MerchItemView from '@/views/MerchItemView.vue'
import ShoppingCartView from '@/views/ShoppingCartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'

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
    path: '/merchandise/collections/:type',
    name: 'erchandiseType',
    component: MerchandiseCollectionsView
  },
  {
    path: '/music',
    name: 'music',
    component: MusicView
  },
  {
    path: '/merchandise/:name/:id?',
    name: 'merchandiseItem',
    component: MerchItemView
  },
  {
    path: '/cart',
    name: 'shoppingCart',
    component: ShoppingCartView
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
