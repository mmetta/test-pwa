<template>
  <div class="home">
    <v-row class="justify-center">
      <img alt="Vue logo" src="../assets/logo.png">
    </v-row>

    <v-row class="justify-center my-2">
      <v-col cols="10" sm="6">
        {{ 'userAgent: ' }}{{ userAgent }}
        {{ ' - Standalone: ' }}{{ isInStandaloneMode() }}
      </v-col>
    </v-row>
    <v-row class="justify-center my-2">
      {{ 'isIos: ' }}{{ isIos(userAgent) }}
    </v-row>
    <v-row class="justify-center my-2">
      {{ 'winStandalone: ' }}{{ winStandalone }}
    </v-row>
    <v-row class="justify-center my-2">
      {{ 'navStandalone: ' }}{{ navStandalone }}
    </v-row>
    <v-row class="justify-center my-4">
      {{ 'DISPOSITIVO: ' }} <strong v-if="isIos(userAgent)">{{ ' IOS-APPLE' }}</strong><strong v-else>{{ ' Chrome-Android' }}</strong>
    </v-row>

    <v-row v-if="isIos(userAgent) && !winStandalone" class="justify-center">
      <installios />
    </v-row>
    <v-row v-if="!isIos(userAgent) && !winStandalone" class="justify-center">
      <install />
    </v-row>

        <template>
          <v-dialog
            v-model="dialog"
            scrollable
            persistent
            :overlay="false"
            max-width="300px"
            transition="dialog-transition"
          >
            <v-card>
              <v-card-title primary-title>
                Excluir ?
              </v-card-title>
              <v-card-text>
                {{ remover.nome }}
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="warning"
                  text
                  @click="toast('n')"
                >Não</v-btn>
                <v-btn
                  color="success"
                  text
                  @click="toast('y')"
                >Sim</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

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
  created () {
    this.$store.dispatch('loadInsumos')
    this.$store.dispatch('loadImportInsumos')
    this.$store.dispatch('loadReceitas')
    this.$store.dispatch('loadcustos')
    this.$store.dispatch('loadConfig')
  },
  computed: {
    insumos () {
      return this.$store.getters.insumos
    }
  },
  watch: {
    insumos (i) {
      return i
    }
  },
  mounted () {
    this.isIos(this.userAgent)
    // Checks if should display install popup notification:
    if (this.isIos(this.userAgent) && !this.isInStandaloneMode()) {
      this.showInstallMessage = true
    }
  },
  data () {
    return {
      dialog: false,
      remover: {},
      showInstallMessage: false,
      userAgent: window.navigator.userAgent.toLowerCase(),
      isInStandaloneMode: () => ('standalone' in window.navigator) && (window.navigator.standalone),
      winStandalone: window.matchMedia('(display-mode: standalone)').matches,
      navStandalone: !!navigator.standalone
    }
  },
  methods: {
    excluir (i) {
      this.remover = i
      this.dialog = true
    },
    isIos (userAgent) {
      console.log(userAgent)
      return /iphone|ipad|macintosh/g.test(userAgent)
      // return /windows|linux|android/g.test(userAgent)
    },
    toast (t) {
      this.dialog = false
      if (t === 'y') {
        this.$toast('Ok feito!!!', {
          position: 'top-center',
          icon: 'mdi mdi-bomb-off',
          timeout: 2000
        })
      } else {
        this.$toast.warning('Ok feito!!!', {
          position: 'top-center',
          icon: 'mdi mdi-cupcake',
          timeout: 2000
        })
      }
    }
  }
}
</script>
