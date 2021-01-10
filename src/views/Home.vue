<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="8">
        <v-row class="justify-center">
          <v-img max-width="122px" max-height="122" src="../assets/Sc-192.png"></v-img>
        </v-row>
        <v-row class="justify-center">
          <strong class="logo grey--text">SEU</strong><span class="logo grey--text">CUSTO</span>
        </v-row>
        <v-row class="justify-center">
          <span class="grey--text">{{ user.email }}</span>
        </v-row>
      </v-col>
    </v-row>

    <!-- BOTÕES PARA INSTALAR (IOS e ANDROID) -->
    <v-row v-if="isIos(userAgent)" class="justify-center">
      <installios />
    </v-row>
    <v-row v-else class="justify-center">
      <install />
    </v-row>

  </div>
</template>

<script>
import install from '../components/User/Install'
import installios from '../components/User/InstallIOS'

export default {
  name: 'Home',
  components: {
    install,
    installios
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  data () {
    return {
      showInstallMessage: false,
      userAgent: window.navigator.userAgent.toLowerCase(),
      isInStandaloneMode: () => ('standalone' in window.navigator) && (window.navigator.standalone),
      winStandalone: window.matchMedia('(display-mode: standalone)').matches
    }
  },
  // created () {
  //   if (this.user) {
  //     if (!this.user.emailVerified) {
  //       this.$router.push('/confirm')
  //     }
  //   }
  // },
  methods: {
    isIos (userAgent) {
      const ios = /iphone|ipad|macintosh/g.test(userAgent)
      let res = null
      if (ios && !this.winStandalone) {
        res = true
      }
      if (!ios && !this.winStandalone) {
        res = false
      }
      console.log(userAgent, res)
      return res
    }
  }
}
</script>

<style scoped>
  .logo {
    font-size: 32px !important;
  }
</style>
