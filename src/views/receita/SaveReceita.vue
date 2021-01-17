<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 md6 offset-md3 class="pa-6">

      <v-layout row>
        <v-flex xs12 class="secondary">
          <h3 class="success--text ma-3">{{ fazer }}{{ ' RECEITA' }}</h3>
        </v-flex>
      </v-layout>

        <v-layout row>
          <v-flex xs12>
            <v-text-field
              color="success"
              name="nome"
              label="Nome da receita"
              id="nome"
              v-model="nome"
              type="text"
              :rules="rules"
              counter="50"
              max="50"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>

            <v-layout row>
              <v-flex xs12 class="success">
                <h5 class="white--text ma-2">INGREDIENTES</h5>
              </v-flex>
            </v-layout>

        <v-layout row>
          <v-flex xs12>

            <v-list dense color="grey lighten-4">
              <v-list-item-group v-model="active" color="success">
                <v-list-item v-for="(ingrediente, index) in ingredientes" :key="index" aria-selected="active">
                  <v-list-item-avatar>
                    <v-icon v-if="ingrediente.nome === select" color="red lighten-1" small>mdi-close</v-icon>
                    <v-icon v-else color="teal lighten-1">mdi-square-small</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content @click="alterar(ingrediente, index)">
                    <v-list-item-title :id="ingrediente.nome" v-text="ingrediente.nome"></v-list-item-title>
                    <v-list-item-subtitle>
                      {{ 'Quant: ' }}
                      {{ ingrediente.quant }}
                      {{ ingrediente.unidade }}
                      {{ ' - R$ ' }}{{ ingrediente.valor }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                      @click="excluir(ingrediente)"
                    >
                      <v-icon color="grey">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-flex>
        </v-layout>

          <v-form @submit.prevent="detectaDuplicidade" ref="form">
            <v-layout row>
              <v-flex xs12 class="px-4">
                <v-select
                  id="selinsumo"
                  color="success"
                  :items="insumos"
                  item-value="id"
                  item-text="nome"
                  v-model="insumo"
                  label="Insumo"
                ></v-select>
              </v-flex>
            </v-layout>
              <v-layout row>
                <v-flex xs6 class="pl-4">
                  <v-text-field
                    :suffix="suffix"
                    color="success"
                    name="quant"
                    label="Quant"
                    id="quant"
                    type="number"
                    v-model="quant"
                    tile
                    required
                  ></v-text-field>
                </v-flex>
              <v-flex xs6>
                <v-layout row class="justify-center">
                  <v-btn
                    v-if="btn === 'new'"
                    color="success"
                    small
                    fab
                    :disabled="disabled"
                    type="submit"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    color="warning"
                    small
                    fab
                    :disabled="disabled"
                    type="submit"
                  >
                    <v-icon>mdi-sync</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>

      <!-- <v-snackbar
        v-model="snackbar"
        :timeout="5000"
        color="grey lighten-2 red--text "
      >
        <v-icon color="red">mdi-alert-outline</v-icon>
        <h3>{{ message }}</h3>
      </v-snackbar> -->

      <v-divider class="success my-4 py-4"></v-divider>

        <v-layout row>
          <v-flex xs12 class="px-4">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  color="success"
                  name="rendimento"
                  label="Rendimento"
                  id="rendimento"
                  v-model="rendimento"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  color="success"
                  :items="items"
                  v-model="rendUnid"
                  label="Medida"
                  required
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  readonly
                  prefix="R$ "
                  color="success"
                  name="total"
                  :label="'Total com ' + processamento"
                  id="total"
                  v-model="total"
                  type="number"
                  @change="decimal()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-flex>
        </v-layout>

        <v-layout row class="my-4 mx-0">
          <v-flex xs12 class="px-2">
            <v-layout row>
              <v-flex xs6 class="px-4">
                <v-layout row class="justify-center">
                  <v-btn
                    fab
                    small
                    color="secondary primary--text"
                    :loading="loading"
                    @click="$router.go(-1)"
                  >
                    <v-icon class="mr-1">mdi-arrow-left-bold</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs6 class="px-4">
                <v-layout row class="justify-center">
                  <v-btn
                    block
                    height="44"
                    tile color="success"
                    :disabled="!formIsValid"
                    :loading="loading"
                    @click="save"
                  >
                    <v-icon class="mr-1">mdi-content-save-outline</v-icon>
                    {{ fazer }}
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

      </v-flex>
    </v-layout>

    <!-- Dialog de aviso DUPLICIDADE -->
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
              Duplicidade
            </v-card-title>
            <v-card-text>
              O item {{ duplo ? duplo.nome : '' }} já está na lista, deseja acrescentar mais esta quantidade?
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="warning"
                text
                @click="resolveDuplicidade('n')"
              >Não</v-btn>
              <v-btn
                color="success"
                text
                @click="resolveDuplicidade('y')"
              >Sim</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    <!-- FIM dialog de aviso DUPLICIDADE -->

  </v-container>
</template>

<script>
export default {
  name: 'SaveReceita',
  props: ['id'],
  computed: {
    disabled () {
      return !!(this.quant <= 0 || this.quant === '' || this.insumo === '')
    },
    select () {
      const insumo = this.insumos.find((insumo) => {
        return insumo.id === this.insumo
      })
      return insumo
    },
    processamento () {
      let proc = this.proc
      proc = (proc - 1) * 100
      proc = parseInt(proc)
      return proc + '%'
    },
    total () {
      let soma = 0
      if (this.ingredientes.length > 0) {
        soma = [].reduce.call(this.ingredientes, (somatorio, el) => {
          return somatorio + parseFloat(el.valor, 10) || 0
        }, 0)
        // Custo de processamento (padrão 30%)
        soma = soma * this.proc
      }
      return parseFloat(soma).toFixed(2)
    },
    suffix () {
      let unidade = ''
      if (this.select) {
        unidade = this.select.unidade
        if (unidade === 'Kg') { unidade = 'g' }
        if (unidade === 'Lt') { unidade = 'ml' }
      }
      return unidade
    },
    formIsValid () {
      return this.nome.length > 2 &&
      this.rendimento > 0 &&
      this.rendUnid &&
      this.ingredientes.length > 0 &&
      this.total > 0
    },
    fazer () {
      let res = 'INSERIR'
      if (this.id !== 'new') { res = 'ALTERAR' }
      return res
    },
    receita () {
      return this.$store.getters.receita(this.id)
    },
    insumos () {
      return this.$store.getters.insumos
    }
  },
  watch: {
    insumos (value) {
      return value
    },
    active (act) {
      if (act === undefined) {
        this.quant = ''
        this.insumo = ''
        this.btn = 'new'
      }
    }
  },
  mounted () {
    if (this.receita) {
      this.nome = this.receita.nome
      this.rendimento = this.receita.rendimento
      this.rendUnid = this.receita.rendUnid
      this.ingredientes = this.receita.ingredientes
    }
  },
  data () {
    return {
      proc: this.$store.getters.config.processamento,
      btn: 'new',
      snackbar: false,
      dialog: false,
      duplo: undefined,
      message: '',
      active: '',
      rules: [
        v => (v && v.length >= 3) || 'Min. 3 caracteres',
        v => (v && v.length <= 50) || 'Máx. 50 caracteres'
      ],
      nome: '',
      rendimento: '',
      ingredientes: [],
      insumo: '',
      quant: '',
      rendUnid: '',
      items: [
        { text: 'centímetro(s)', value: 'cm' },
        { text: 'grama(s)', value: 'g' },
        { text: 'quilo(s)', value: 'Kg' },
        { text: 'mililitro(s)', value: 'ml' },
        { text: 'litro(s)', value: 'Lt' },
        { text: 'unidade(s)', value: 'un' }
      ],
      loading: false
    }
  },
  methods: {
    menu (item, ingrediente) {
      switch (item.title) {
        case 'Alterar': this.alterar(ingrediente)
          break
        case 'Excluir': this.excluir(ingrediente)
          break
      }
    },
    detectaDuplicidade () {
      this.duplo = this.ingredientes.find((ingrediente) => {
        return ingrediente.id === this.insumo
      })
      if (this.btn === 'upd') {
        const index = this.ingredientes.findIndex((ingrediente) => {
          return ingrediente === this.duplo
        })
        if (index === this.active) {
          this.saveIngrediente()
        } else {
          this.alertaDuplicidade()
        }
      } else {
        this.alertaDuplicidade()
      }
    },
    alertaDuplicidade () {
      if (this.duplo === undefined) {
        this.saveIngrediente()
      } else {
        this.dialog = true
      }
    },
    resolveDuplicidade (res) {
      this.dialog = false
      if (res === 'y') {
        this.active = this.ingredientes.findIndex((ingrediente) => {
          return ingrediente === this.duplo
        })
        const quant = parseFloat(this.quant) + parseFloat(this.duplo.quant)
        const insumo = this.select
        const valor = this.calculaValor(quant, this.select.preco, this.select.tamanho, this.select.unidade)
        const ingrediente = {
          id: this.insumo,
          nome: insumo.nome,
          unidade: insumo.unidade,
          quant: quant,
          valor: valor
        }
        this.btn = 'upd'
        this.inserirNaLista(ingrediente)
      } else {
        this.quant = ''
        this.insumo = ''
        this.btn = 'new'
        this.duplo = undefined
      }
    },
    alterar (ingrediente, index) {
      this.quant = ingrediente.quant
      this.insumo = ingrediente.id
      this.btn = 'upd'
    },
    excluir (item, index) {
      const id = item.id
      const antiga = this.ingredientes
      const novaLista = antiga.filter(ingrediente => ingrediente.id !== id)
      this.ingredientes = novaLista
      this.active = undefined
    },
    saveIngrediente () {
      const quant = this.quant
      const insumo = this.select

      const valor = this.calculaValor(this.quant, this.select.preco, this.select.tamanho, this.select.unidade)
      const ingrediente = {
        id: this.insumo,
        nome: insumo.nome,
        unidade: insumo.unidade,
        quant: quant,
        valor: valor
      }
      this.inserirNaLista(ingrediente)
    },
    inserirNaLista (ingrediente) {
      if (this.btn === 'new') {
        this.ingredientes.push(ingrediente)
      } else {
        this.ingredientes.splice(this.active, 1, ingrediente)
        this.active = undefined
      }
      this.quant = ''
      this.insumo = ''
      this.btn = 'new'
      this.duplo = undefined
    },
    calculaValor (q, p, t, u) {
      if (u === 'Lt' || u === 'Kg') {
        q = q / 1000
      }
      const valor = (p / t) * q
      return parseFloat(valor).toFixed(2)
    },
    save () {
      if (!this.formIsValid) {
        return
      }
      const dados = {
        id: this.id,
        nome: this.nome,
        rendimento: Number(this.rendimento),
        rendUnid: this.rendUnid,
        ingredientes: this.ingredientes,
        total: parseFloat(this.total)
      }
      if (this.id === 'new') {
        this.insert(dados)
      } else {
        this.update(dados)
      }
    },
    insert (dados) {
      this.loading = true
      this.$store.dispatch('createReceita', dados)
      this.$router.push('/receita')
    },
    update (dados) {
      this.loading = true
      this.$store.dispatch('updateReceita', dados)
      this.$router.push('/receita')
    },
    reset () {
      this.nome = ''
      this.rendimento = ''
      this.ingredientes = {}
    },
    decimal () {
      if (this.preco === '') { return }
      this.preco = parseFloat(this.preco).toFixed(2)
    }
  }
}
</script>
