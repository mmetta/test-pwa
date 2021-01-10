<template>
  <div v-if="user">
    <v-app-bar elevation="0" height="55px" color="primary" dark app>
      <v-app-bar-nav-icon @click="toggle=!toggle"></v-app-bar-nav-icon>
      <v-toolbar-title><strong>SEU</strong><span>CUSTO</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon>
        <v-icon small>mdi-bell</v-icon>
      </v-btn> -->
      <v-btn
        icon
        @click="ir('/config')"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      style="z-index: 30;"
      v-model="toggle"
      left
      app
    >
      <v-list nav>
        <v-list-item class="grey lighten-4 pl-4 py-4">
          <img src="../assets/logo-grey5.png" width="200px" alt="logo">
        </v-list-item>
        <v-divider class="mb-4"></v-divider>
          <v-list-item
            v-for="(item, index) in itemsMenu"
            :key="index"
            @click="ir(item.path)"
          >
            <v-list-item-title>
              <v-icon class="pr-2">{{ item.icon }}</v-icon>
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="signOut" class="py-2">
            <v-list-item-title class="primary--text">
              <v-icon class="pr-2">mdi-power</v-icon>
              Sair
            </v-list-item-title>
          </v-list-item>
        </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  computed: {
    // confirm () {
    //   let res = false
    //   if (this.user) {
    //     res = this.user.emailVerified
    //   }
    //   return res
    // },
    user () {
      return this.$store.getters.user
    },
    config () {
      return this.$store.getters.config
    }
  },
  data: () => ({
    toggle: null,
    itemsMenu: [
      { name: 'Home', icon: 'mdi-home', path: '/' },
      // { name: 'Agenda', icon: 'mdi-calendar', path: '/agenda' },
      { name: 'Insumo', icon: 'mdi-view-dashboard', path: '/insumo' },
      { name: 'Receita', icon: 'mdi-cupcake', path: '/receita' },
      // { name: 'Orçamento', icon: 'mdi-clipboard-list-outline', path: '/orcamento' },
      { name: 'Calculadora', icon: 'mdi-calculator', path: '/calculadora' },
      { name: 'Donativo', icon: 'mdi-currency-usd', path: '/donativo' }
    ]
  }),
  methods: {
    ir (path) {
      const atual = this.$router.app.$route.path
      if (atual === path) {
        return
      }
      if (this.user) {
        this.$router.push({ path })
      }
    },
    signOut () {
      this.drawer = false
      this.$store.dispatch('signOut')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.v-overlay {
  z-index: 6 !important;
}
</style>
