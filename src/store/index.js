import Vue from 'vue'
import Vuex from 'vuex'
import modLogin from './modules/modLogin'
import modInsumo from './modules/modInsumo'
import modReceita from './modules/modReceita'
import modCusto from './modules/modCusto'
import modSnack from './modules/modSnack'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    modLogin,
    modInsumo,
    modReceita,
    modCusto,
    modSnack
  }
})
