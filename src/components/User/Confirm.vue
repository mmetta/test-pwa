<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md6 offset-md3 class="teal lighten-3 pa-4">
        <v-icon class="mr-4" dark large>mdi-email-outline</v-icon>
        <strong class="white--text">CONFIRMAÇÃO DE E-MAIL</strong>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md6 offset-md3 class="pa-4">
        <h5 class="my-4">
          Um link de verificação foi encaminhado para seu e-mail. Clique nele para liberar seu acesso ao App.
        </h5>
        <h5 class="my-4">
          Assim que o e-mail for confirmado passaremos para a próxima etapa.
        </h5>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md6 offset-md3 class="secondary pa-4 d-flex justify-center align-center">
        <v-btn
          color="success white--text"
          height="40px"
          :disabled="disabled"
          @click="disabled = true; verificarEmail()"
          tile
        >
        <v-icon>mdi-send</v-icon>
        enviar novo email
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="red white--text"
          width="100px"
          height="40px"
          @click="signOut"
          tile
        >
        <v-icon>mdi-account-off</v-icon>
        Sair
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      disabled: false
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    user () {
      return this.$store.getters.user
    }
  },
  watch: {
    user (user) {
      if (!user) {
        this.$router.push('/login')
      }
    }
  },
  methods: {
    verificarEmail () {
      this.$store.dispatch('checarEmail')
    },
    signOut () {
      this.$store.dispatch('signOut')
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    }
  }
}
</script>
