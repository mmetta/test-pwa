<template>
  <div>

    <v-snackbar
      v-model="snackbar"
      :timeout="8000"
    >
      Seu Custo na tela inicial.
<!--
           :style="{'display': installBtn}"
           id="btninstall"5
 -->
      <template>
        <v-btn
          color="secondary"
          text
          @click="installer()"
        >
          <v-icon class="mr-2">mdi-download-outline</v-icon>
          INSTALAR
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script>
let installPrompt

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  installPrompt = e
  // this.installBtn = 'block'
})
export default {
  created () {
    this.installer = () => {
      // this.installBtn = 'none'
      installPrompt.prompt()
      installPrompt.userChoice.then(result => {
        if (result.outcome === 'accepted') {
          console.log('Install accepted!')
          this.$store.dispatch('setAppInstalled', true)
        } else {
          console.log('Install denied!')
        }
      })
    }
  },
  data () {
    return {
      // installBtn: 'none',
      installer: undefined,
      snackbar: true
    }
  }
}
</script>
