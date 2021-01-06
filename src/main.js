import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import './registerServiceWorker'
import firebase from './firebase'
import vuetify from './plugins/vuetify'
import Toast from './plugins/toastications'

Vue.use(firebase)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  Toast,
  created () {
    this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        console.log(user)
      }
    })
  },
  render: h => h(App)
}).$mount('#app')
