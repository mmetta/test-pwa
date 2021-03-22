<template>
  <div id="login">
    <v-container>
      <v-row class="justify-center" v-if="error">
        <v-col cols="12" sm="6" offset-md3>
          <app-alert @dismissed="onDismissed" :text="error"></app-alert>
        </v-col>
      </v-row>
      <v-row v-if="verificando" style="padding-top: 74px" class="justify-center">
          <v-col cols="12" sm="6">
            <!-- <v-row class="justify-center mb-2">
              <v-img max-width="102px" max-height="102px" src="../../assets/Sc-192.png"></v-img>
            </v-row> -->
            <v-row class="justify-center">
              <strong class="logo grey--text">SEU</strong><span class="logo grey--text">CUSTO</span>
            </v-row>
            <v-row class="justify-center">
              <strong class="grey--text">Aguarde...</strong>
            </v-row>
          </v-col>
      </v-row>
      <v-row v-else class="justify-center">
        <v-col cols="12" sm="6">
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex xs12>
                  <v-card
                    class="d-flex justify-center align-center"
                    color="grey lighten-3"
                    flat
                    height="100"
                    tile
                  >
                    <img src="../../assets/logo-grey5.png" height="72">
                  </v-card>
                </v-flex>
              </v-layout>
              <v-form @submit.prevent="onSignIn">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      success
                      class="mt-4"
                      name="email"
                      label="Email"
                      id="email"
                      v-model="email"
                      type="email"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      success
                      name="password"
                      label="Senha"
                      id="password"
                      v-model="password"
                      :type="show2 ? 'text' : 'password'"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="show2 = !show2"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row height="100px" class="grey">
                  <v-flex xs12>
                  <v-card
                    class="d-flex justify-center align-center"
                    flat
                    height="80"
                    tile
                  >
                    <v-card
                      class="pb-2"
                      flat
                      tile
                    >
                      <v-btn
                        v-if="formIsValid"
                        tile
                        color="success"
                        type="submit"
                        :disabled="loading"
                        :loading="loading"
                      >
                        <v-icon>mdi-login-variant</v-icon>
                        Entrar
                      </v-btn>
                      <v-btn
                        v-else
                        tile
                        color="success"
                        :disabled="true"
                      >
                        <v-icon>mdi-login-variant</v-icon>
                        Entrar
                      </v-btn>
                    </v-card>
                  </v-card>
                  </v-flex>
                </v-layout>
              </v-form>
              <v-layout row>
                <v-flex xs6>
                  <v-row class="d-flex justify-left align-center">
                    <v-btn
                      small
                      color="success"
                      text
                      tile
                      router
                      to="/signup"
                    >
                      <v-icon small>mdi-account</v-icon>
                      <small>Criar novo usuário</small>
                    </v-btn>
                  </v-row>
                </v-flex>
                <v-flex xs6>
                  <v-row class="d-flex justify-end align-center">
                    <v-btn
                      small
                      color="success"
                      text
                      tile
                    >
                      <v-icon small>mdi-file-document-outline</v-icon>
                      <small>Termos de uso</small>
                    </v-btn>
                  </v-row>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-card
                    class="d-flex justify-center align-center"
                    color="grey lighten-3"
                    flat
                    height="140"
                    tile
                  >
                    <v-card
                      class="pa-2"
                      color="grey lighten-3"
                      flat
                      tile
                    >
                      <v-card-subtitle>
                        ou acesse com sua conta Gmail
                      </v-card-subtitle>
                      <v-divider></v-divider>
                      <v-row justify="center">
                        <v-btn
                          tile
                          color="white"
                          class="my-3"
                          @click="google"
                        >
                          <!-- <v-icon class="mr-1">mdi-gmail</v-icon> -->
                          <img src="../../assets/gmail 24x24.png" class="mr-2">
                          gmail
                        </v-btn>
                      </v-row>
                    </v-card>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-row class="d-flex justify-center align-center">
                    <v-btn
                      small
                      color="success"
                      text
                      tile
                    >
                      <small>Política de privacidade</small>
                    </v-btn>
                  </v-row>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

console.log('renderizando')

export default {
  name: 'login',
  data () {
    return {
      loading: false,
      verificando: true,
      user: [],
      email: '',
      password: '',
      confirmPassword: '',
      show2: false
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    formIsValid () {
      return this.email.length > 3 &&
      this.password.length >= 6
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      } else {
        this.verificando = false
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.loading = this.$store.getters.loading
      this.$firebase.auth().onAuthStateChanged((user) => {
        this.user = user
      })
    }, 1500)
  },
  methods: {
    onSignIn () {
      this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    },
    google () {
      this.$store.dispatch('signGoogle')
    }
  }
}
</script>

<style scoped>
  .logo {
    font-size: 33px !important;
  }
</style>
