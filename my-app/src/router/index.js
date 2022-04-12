import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../pages/home.vue'
import GamesCrud from '../pages/GamesCrud'

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
