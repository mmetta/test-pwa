import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import './registerServiceWorker'
import firebase from './firebase'
import vuetify from './plugins/vuetify'
import './plugins/toastications'

Vue.use(firebase)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  created () {
    this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('loadInsumos')
        this.$store.dispatch('loadImportInsumos')
        this.$store.dispatch('loadReceitas')
        this.$store.dispatch('loadcustos')
        this.$store.dispatch('loadConfig')
      }
    })
  },
  render: h => h(App)
}).$mount('#app', true)
