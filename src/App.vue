<template>
  <v-app id="App" data-server-rendered="true">
    <appbar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import appbar from './components/AppBar'

export default {
  name: 'App',
  components: {
    appbar
  },
  created () {
  //   this.$firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       this.$store.dispatch('autoSignIn', user)
  //     }
  //   })
  },
  data: () => ({
    //
  })
}
</script>
