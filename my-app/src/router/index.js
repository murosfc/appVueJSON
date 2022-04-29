import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../pages/home.vue'
import GamesCrud from '../pages/GamesCrud'
import PlataformasCrud from '../pages/PlataformasCrud'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/games',
    name: 'gamescrud',
    component: GamesCrud
  },
  {
    path: '/plataformas',
    name: 'plataformascrud',
    component: PlataformasCrud
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
