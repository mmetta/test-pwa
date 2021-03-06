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
        Preços salvos
      </v-card-title>
      <v-card-text>
        <v-row class="justify-center">
          <v-col cols="12">
            <v-list three-line shaped>
              <v-list-item-group multiple active-class="" v-model="active" color="success">
                 <!-- aria-selected="active" -->
                <v-list-item class="grey lighten-5 mb-1" v-for="custo in custos" :key="custo.id">
                  <template v-slot:default="{ active }">
                    <v-list-item-action v-show="false">
                      <v-checkbox small :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-subtitle class="black--text" :id="custo.nome" v-html="nome(custo.nome)"></v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ formatDate(custo.modificado) }}
                        <strong class="ml-5">
                          {{ 'R$ ' + total(custo) }}
                        </strong>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col cols="6">
            <v-checkbox v-model="tResumo" :label="(resumo.length || 0) + ' nome(s)'"></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox v-model="tSoma" :label="'Total: ' + soma"></v-checkbox>
          </v-col>
        </v-row> -->
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
  created () {
    this.$store.dispatch('setSortDate', 'date')
  },
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
    insumos () {
      return this.$store.getters.insumos
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
      tSoma: true,
      tResumo: true
    }
  },
  methods: {
    nome (nome) {
      return '<span>' + nome + '</span>'
    },
    fechar () {
      this.active = []
      this.$store.dispatch('setDialogListaCustos', false)
    },
    total (custo) {
      let subtotal = 0
      for (let i = 0; i < custo.receitas.length; i++) {
        const item = custo.receitas[i]
        let valorUnit = 0
        if (item.tipo === 'insumo') {
          const insumo = this.insumos.find((insumo) => {
            return insumo.id === item.id
          })
          valorUnit = insumo.preco / insumo.tamanho
        } else {
          const receita = this.receitas.find((receita) => {
            return receita.id === item.id
          })
          valorUnit = receita.total / receita.rendimento
        }
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
      if (this.active.length <= 0) {
        this.fechar()
        return
      }
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
