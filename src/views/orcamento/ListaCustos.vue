<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    max-width="400px"
    max-height="600px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        Custos salvos
      </v-card-title>
      <v-card-text>
        <v-row class="justify-center">
          <v-col cols="12">
            <v-list shaped class="ma-2">
              <v-list-item-group multiple active-class="" v-model="active" color="success">
                 <!-- aria-selected="active" -->
                <v-list-item v-for="custo in custos" :key="custo.id">
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content @click="abrir(custo)">
                      <v-list-item-title :id="custo.nome" v-text="custo.nome"></v-list-item-title>
                      <v-list-item-subtitle>
                        {{ formatDate(custo.modificado) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn
                          text
                        >
                          {{ total(custo) }}
                        </v-btn>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-checkbox v-model="tResumo" :label="(resumo.length || 0) + ' nome(s)'"></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox v-model="tSoma" :label="'Total: ' + soma"></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="warning"
          text
          @click="fechar()"
        >Fechar</v-btn>
        <v-btn
          color="success"
          text
          @click="transporte(soma)"
        >Transportar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { tipoArr } from '../../plugins/arredondar'

export default {
  name: 'ListaCustos',
  computed: {
    margem () {
      return this.$store.getters.config.margem
    },
    custos () {
      return this.$store.getters.custos
    },
    dialog () {
      return this.$store.getters.dialogListaCustos
    },
    receitas () {
      return this.$store.getters.receitas
    },
    resumo () {
      const texto = []
      const n = this.active.length
      if (n <= 0) { return 0.00 }
      for (let i = 0; i < n; i++) {
        const index = this.active[i]
        const nome = this.custos[index].nome
        texto.push(nome)
      }
      return texto
    },
    soma () {
      let soma = 0
      const n = this.active.length
      if (n <= 0) { return 0.00 }
      for (let i = 0; i < n; i++) {
        const index = this.active[i]
        const valor = this.total(this.custos[index])
        soma += parseFloat(valor)
      }
      return parseFloat(soma).toFixed(2)
    }
  },
  watch: {
    custos (value) {
      return value
    },
    dialog (value) {
      return value
    },
    active (a) {
      return a
    }
  },
  data () {
    return {
      active: [],
      items: [],
      select: 'null',
      options: {
        duration: 300,
        offset: 0,
        easing: 'linear'
      },
      tSoma: false,
      tResumo: false
    }
  },
  methods: {
    abrir (v) {
      console.log(v, this.active)
    },
    fechar () {
      this.$store.dispatch('setDialogListaCustos', false)
    },
    total (custo) {
      let subtotal = 0
      for (let i = 0; i < custo.receitas.length; i++) {
        const item = custo.receitas[i]
        const receita = this.receitas.find((receita) => {
          return receita.id === item.id
        })
        const valorUnit = receita.total / receita.rendimento
        const valorTotal = parseFloat(item.quant * valorUnit).toFixed(2)
        subtotal += parseFloat(valorTotal)
      }
      subtotal *= this.margem
      if (custo.outros > 0) {
        subtotal += Number(custo.outros)
      }
      const valor = tipoArr(custo.arredondar, subtotal)
      const total = parseFloat(valor).toFixed(2)
      return total
    },
    transporte (soma) {
      if (this.tSoma) {
        this.$store.dispatch('transpSoma', soma)
      }
      if (this.tResumo) {
        this.$store.dispatch('transpResumo', this.resumo)
      }
      this.fechar()
    },
    formatDate (d) {
      if (!d) return null
      const [date, hora] = d.split(' ')
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year} ${hora}`
    }
  }
}
</script>
