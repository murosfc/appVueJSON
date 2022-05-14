import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../pages/home.vue'
import GamesCrud from '../pages/GamesCrud'
import PlataformasCrud from '../pages/PlataformasCrud'
import ClientesCrud from '../pages/ClientesCrud'
import FuncionariosCrud from '../pages/FuncionariosCrud'
import CadastroCliente from '../pages/CadastroCliente'
import AlugueisView from '../pages/AlugueisView'
import MeusAlugueisView from '../pages/MeusAlugueisView'

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
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: ClientesCrud
  },
  {
    path: '/funcionarios',
    name: 'funcionarios',
    component: FuncionariosCrud
  },
  {
    path: '/cadastrar',
    name: 'cadastroCliente',
    component: CadastroCliente
  },
  {
    path: '/alugueis',
    name: 'alugueis',
    component: AlugueisView
  },
  {
    path: '/meusalugueis',
    name: 'meusalugueis',
    component: MeusAlugueisView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
