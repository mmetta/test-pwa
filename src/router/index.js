import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthGuard from './auth-guard'
import SignIn from '../components/User/Signin.vue'
import Home from '../views/Home.vue'
import Insumo from '../views/insumo/Insumos.vue'
import SaveInsumo from '../views/insumo/SaveInsumo.vue'
import ImportInsumos from '../views/insumo/ImportInsumos.vue'
import Receita from '../views/receita/Receitas.vue'
import SaveReceita from '../views/receita/SaveReceita.vue'
import Calculadora from '../views/orcamento/Calculadora.vue'
import Custo from '../views/orcamento/Custos.vue'
import Donativo from '../views/Donativo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      icon: 'mdi-home'
    },
    beforeEnter: AuthGuard
  },
  {
    path: '/login',
    name: 'Login',
    component: SignIn
  },
  {
    path: '/insumo',
    name: 'Insumo',
    component: Insumo,
    beforeEnter: AuthGuard,
    meta: {
      icon: 'mdi-view-dashboard'
    }
  },
  {
    path: '/insumo/:id',
    name: 'SaveInsumo',
    props: true,
    component: SaveInsumo,
    beforeEnter: AuthGuard,
    meta: {
      icon: 'mdi-view-dashboard'
    }
  },
  {
    path: '/importInsumos',
    name: 'ImportInsumos',
    component: ImportInsumos,
    beforeEnter: AuthGuard,
    meta: {
      icon: 'mdi-view-dashboard'
    }
  },
  {
    path: '/receita',
    name: 'Receita',
    component: Receita,
    beforeEnter: AuthGuard,
    meta: {
      icon: 'mdi-cupcake'
    }
  },
  {
    path: '/receita/:id',
    name: 'SaveReceita',
    props: true,
    component: SaveReceita,
    beforeEnter: AuthGuard,
    meta: {
      icon: 'mdi-cupcake'
    }
  },
  {
    path: '/calculadora',
    name: 'Calculadora',
    component: Calculadora,
    beforeEnter: AuthGuard,
    meta: {
      icon: 'mdi-calculator'
    }
  },
  {
    path: '/custo',
    name: 'Custo',
    component: Custo,
    beforeEnter: AuthGuard,
    meta: {
      icon: 'mdi-calculator'
    }
  },
  {
    path: '/donativo',
    name: 'Donativo',
    component: Donativo,
    beforeEnter: AuthGuard,
    meta: {
      icon: 'mdi-currency-usd'
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
