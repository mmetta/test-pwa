<template>
  <v-container>
    <v-form @submit.prevent="save" ref="form" class="mx-4">
      <v-row class="justify-center">
        <v-col cols="12" sm="6" class="secondary">
          <h3 class="success--text ma-3">{{ fazer }}{{ ' INSUMO' }}</h3>
        </v-col>
      </v-row>
        <v-row class="justify-center">
        <v-col cols="12" sm="6">
            <v-text-field
              color="success"
              name="nome"
              label="Nome do insumo"
              id="nome"
              v-model="nome"
              type="text"
              :rules="rules"
              counter="25"
              max="25"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="justify-center">
        <v-col cols="12" sm="6">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  color="success"
                  name="tamanho"
                  label="Tamanho"
                  id="tamanho"
                  v-model="tamanho"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  color="success"
                  :items="items"
                  v-model="unidade"
                  label="Unidade"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="justify-center">
        <v-col cols="12" sm="6">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  color="success"
                  name="preco"
                  label="Preço"
                  id="preco"
                  v-model="preco"
                  type="number"
                  step="0.01"
                  @change="decimal()"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">

              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="justify-center">
        <v-col cols="12" sm="6">

          <v-divider class="success my-4 py-4"></v-divider>

            <v-row class="my-4 mx-0">
              <v-col cols="12" class="px-2">
                <v-row class="justify-center">
                  <v-col cols="6" class="px-4">
                    <v-row class="justify-center">
                      <v-btn
                        fab
                        small
                        color="secondary primary--text"
                        :loading="loading"
                        @click="$router.go(-1)"
                      >
                        <v-icon class="mr-1">mdi-arrow-left-bold</v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>
                  <v-col cols="6" class="px-4">
                    <v-row class="justify-center">
                      <v-btn
                        block
                        height="44"
                        tile color="success"
                        :disabled="!formIsValid"
                        :loading="loading"
                        type="submit"
                      >
                        <v-icon class="mr-1">mdi-content-save-outline</v-icon>
                        {{ fazer }}
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

      </v-form>

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
          Receitas atualizadas
        </v-card-title>
        <v-card-text>
          <v-row
            v-for="receita in receitasAlteradas"
            :key="receita.id"
            class="secondary my-1 pa-2"
          >
            {{ receita.nome }}
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="success"
            text
            @click="fecharDialog()"
          >Entendi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

  </v-container>
</template>

<script>
export default {
  name: 'SaveInsumo',
  props: ['id'],
  computed: {
    formIsValid () {
      return this.nome.length > 2 &&
      this.tamanho > 0 &&
      this.unidade !== '' &&
      this.preco > 0
    },
    fazer () {
      let res = 'INSERIR'
      if (this.id !== 'new') { res = 'ALTERAR' }
      return res
    },
    insumo () {
      return this.$store.getters.insumo(this.id)
    },
    receitasAlteradas () {
      return this.$store.getters.receitasAlteradas
    }
  },
  mounted () {
    if (this.insumo) {
      this.nome = this.insumo.nome
      this.tamanho = this.insumo.tamanho
      this.unidade = this.insumo.unidade
      this.preco = parseFloat(this.insumo.preco).toFixed(2)
    }
  },
  data () {
    return {
      dialog: false,
      rules: [
        v => (v && v.length >= 3) || 'Min. 3 caracteres',
        v => (v && v.length <= 25) || 'Máx. 25 caracteres'
      ],
      nome: '',
      tamanho: '',
      unidade: '',
      preco: '',
      loading: false,
      items: [
        { text: 'grama(s)', value: 'g' },
        { text: 'quilo(s)', value: 'Kg' },
        { text: 'mililitro(s)', value: 'ml' },
        { text: 'litro(s)', value: 'Lt' },
        { text: 'unidades', value: 'un' }
      ]
    }
  },
  methods: {
    save () {
      if (!this.formIsValid) {
        return
      }
      const dados = {
        id: this.id,
        nome: this.nome,
        tamanho: Number(this.tamanho),
        unidade: this.unidade,
        preco: parseFloat(this.preco)
      }
      if (this.id === 'new') {
        this.insert(dados)
      } else {
        this.update(dados)
      }
    },
    insert (dados) {
      this.loading = true
      this.$store.dispatch('createInsumo', dados)
      this.$router.push('/insumo')
    },
    update (dados) {
      this.loading = true
      const alterouPreco = this.preco !== parseFloat(this.insumo.preco).toFixed(2)
      this.$store.dispatch('updateInsumo', dados)
      if (alterouPreco) {
        this.$store.dispatch('updateReceitaCusto', dados)
        if (this.receitasAlteradas.length > 0) {
          this.dialog = true
        } else {
          this.$router.push('/insumo')
        }
      } else {
        this.$router.push('/insumo')
      }
    },
    fecharDialog () {
      this.dialog = false
      this.$router.push('/insumo')
    },
    reset () {
      this.nome = ''
      this.tamanho = ''
      this.unidade = ''
      this.preco = ''
    },
    decimal () {
      if (this.preco === '') { return }
      this.preco = parseFloat(this.preco).toFixed(2)
    }
  }
}
</script>
