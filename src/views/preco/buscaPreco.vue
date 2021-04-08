<template>
  <div id="Busca">

      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-4">
            <h4>PREÇOS MONITORADOS</h4>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="justify-center">
        <v-col cols="12" sm="6">
          <v-row class="justify-center py-4">
            <v-select
              id="selinsumo"
              :items="tipos"
              item-text="nome"
              v-model="selected"
              label="Escolha um tipo na lista"
            ></v-select>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-list shaped class="ml-4 mr-2">
            <v-list-item v-for="item in lista" :key="item.id">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.produto }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.consult }}
                  {{ ' - ' }}
                  {{ item.local }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <strong>{{ item.valor }}</strong>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

  </div>
</template>

<script>
export default {
  name: 'Busca',
  computed: {
    items () {
      return this.$store.getters.buscaPreco
    },
    tipos () {
      const tipos = this.$store.getters.termos
      return tipos
    }
  },
  watch: {
    selected (t) {
      this.listar(t)
    }
  },
  data () {
    return {
      selected: '',
      lista: []
    }
  },
  created () {
    // Preparar
    this.$store.dispatch('loadBuscaPreco')
    this.$store.dispatch('loadTermos')
  },
  mounted () {
    // Buscar preços atualizados
  },
  methods: {
    listar (tipo) {
      // Seleciona os itens conforme tipo selecionado
      const base = this.items
      const items = []
      const n = tipo.length
      base.find((i) => {
        if (i.produto.substring(0, n) === tipo) {
          items.push(i)
        }
        this.lista = this.ranking(items)
      })
    },
    ranking (items) {
      const lista = items.sort((a, b) => {
        a = parseFloat(a.valor)
        b = parseFloat(b.valor)
        if (a > b) {
          return 1
        }
        if (a < b) {
          return -1
        }
        return 0
      })
      return lista
    }
  }
}
</script>
