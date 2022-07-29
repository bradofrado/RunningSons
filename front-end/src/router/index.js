import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MerchandiseView from '@/views/MerchandiseView.vue'
import MerchandiseCollectionsView from '@/views/MerchandiseCollectionsView.vue'
import MusicView from '@/views/MusicView.vue';
import MerchItemView from '@/views/MerchItemView.vue'
import ShoppingCartView from '@/views/ShoppingCartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import AccountView from '@/views/AccountView.vue'
import SignupView from '@/views/SignupView.vue'
import AlbumView from '@/views/AlbumView.vue'
import SongView from '@/views/SongView.vue'

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
    path: '/music/:album',
    name: 'album',
    component: AlbumView
  },
  {
    path: '/music/:album/:title',
    name: 'song',
    component: SongView
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
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView
  },
  {
    path: '/account/signup',
    name: 'signup',
    component: SignupView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
