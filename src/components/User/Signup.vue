<template>
  <v-container>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="onDismissed" :text="error"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card-text>
          <v-container>
            <v-form @submit.prevent="onSignUp">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    success
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
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    success
                    name="confirPassword"
                    label="Confirmar Senha"
                    id="confirPassword"
                    v-model="confirmPassword"
                    :hint="comparePasswords"
                    type="password"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn
                    v-if="formIsValid"
                    tile
                    color="success"
                    type="submit"
                    :disabled="loading"
                    :loading="loading"
                  >
                      <v-icon>mdi-login-variant</v-icon>
                      Criar usuário
                  </v-btn>
                  <v-btn
                    v-else
                    tile
                    color="success"
                    :disabled="true"
                  >
                      <v-icon>mdi-login-variant</v-icon>
                      Criar usuário
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  computed: {
    formIsValid () {
      return this.email.length > 3 &&
      this.password.length >= 6 &&
      !this.comparePasswords
    },
    loading () {
      return this.$store.getters.loading
    },
    comparePasswords () {
      return this.password !== this.confirmPassword ? 'As senhas estão diferentes' : ''
    },
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        // this.$store.dispatch('checarEmail')
        // this.$router.push('/confirm')
        const config = {
          basica: false,
          margem: 3,
          processamento: 1.3,
          formasPgto: 'Metade do valor na aprovação do orçamento e o restante no ato da entrega. Aceitamos cartões de débito, crédito (1x) e PicPay.',
          photo: ''
        }
        this.$store.dispatch('createConfig', config)
        this.$router.push('/')
      }
    }
  },
  methods: {
    onSignUp () {
      this.$store.dispatch('signUserUp', { email: this.email, password: this.password })
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    }
  }
}
</script>
