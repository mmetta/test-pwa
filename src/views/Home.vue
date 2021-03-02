<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="8">
        <v-row class="justify-center">
          <v-img max-width="68px" max-height="68px" src="../assets/Sc-192.png"></v-img>
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
    <v-row v-if="isIos(userAgent) && !this.winStandalone" class="justify-center">
      <installios />
    </v-row>
    <v-row v-if="!isIos(userAgent) && !this.winStandalone" class="justify-center">
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
    },
    config () {
      return this.$store.getters.config
    }
  },
  created () {
    this.$store.dispatch('loadConfig')
  },
  watch: {
    config (n) {
      const online = window.navigator.onLine
      if (n === undefined && online) {
        const config = {
          basica: false,
          margem: 3,
          processamento: 1.3,
          formasPgto: '',
          photo: '',
          validade: 1
        }
        this.$store.dispatch('createConfig', config)
      }
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
  methods: {
    isIos (userAgent) {
      return /iphone|ipad|macintosh/g.test(userAgent)
    }
  }
}
</script>

<style scoped>
  .logo {
    font-size: 22px !important;
  }
</style>
