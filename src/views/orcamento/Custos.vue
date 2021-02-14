<template>
  <v-container class="custo">

        <v-row class="justify-center">
          <v-col cols="12" sm="6" class="mx-0 px-0">
            <v-row class="justify-center">
            <v-toolbar
              elevation="0"
              color="white"
              style="position: fixed; top: 56px; width: 100vh; z-index: 20;"
            >
              <v-text-field
                color="teal lighten-3"
                :cache-items="false"
                hide-no-data
                hide-details
                solo-inverted
                prepend-inner-icon="mdi-view-dashboard"
                append-icon="mdi-magnify"
                name="search"
                label="Custo"
                id="search"
                v-model="search"
                flat
                clearable
              ></v-text-field>
            </v-toolbar>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="justify-center mt-4">
          <v-col cols="8">
            <small class="success--text">Ordenado por: </small>
            <v-btn
              small
              @click="sort('nome')"
              :color="order==='nome'?'success':'grey'"
              text
            >nome</v-btn>
            <v-btn
              small
              @click="sort('date')"
              :color="order==='date'?'success':'grey'"
              text
            >data</v-btn>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="12" sm="6">
            <v-list shaped class="ml-4 mr-2">
              <v-list-item-group v-model="active" color="success">
                <v-list-item v-for="custo in custos" :key="custo.id" aria-selected="active">
                  <v-list-item-content @click="abrir(custo)">
                    <v-list-item-title :id="custo.nome" v-text="custo.nome"></v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatDate(custo.modificado) }}
                      <strong class="ml-5">
                        {{ 'R$ ' + total(custo) }}
                      </strong>
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                      <v-btn
                        icon
                        @click="excluir(custo)"
                      >
                        <v-icon color="grey">mdi-trash-can-outline</v-icon>
                      </v-btn>
                  </v-list-item-action>

                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>

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
                  @click="dialog = false; active = undefined"
                >Não</v-btn>
                <v-btn
                  color="success"
                  text
                  @click="dialog = false; remove(remover)"
                >Sim</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

  </v-container>
</template>

<script>
import { tipoArr } from '../../plugins/arredondar'

export default {
  computed: {
    custos () {
      return this.$store.getters.searchcustos
    },
    receitas () {
      return this.$store.getters.receitas
    },
    margem () {
      return this.$store.getters.config.margem
    }
  },
  watch: {
    custos (value) {
      return value
    },
    search (value) {
      this.$store.dispatch('setSearch4', value)
    }
  },
  mounted () {
    this.tipo = '1'
    // valor inicial do search
    this.$store.dispatch('setSearch4', '')
    // console.log(window.outerWidth)
  },
  data () {
    return {
      order: 'date',
      active: '',
      dialog: false,
      loading: false,
      remover: '',
      items: [],
      select: 'null',
      search: this.$store.getters.search4,
      options: {
        duration: 300,
        offset: 0,
        easing: 'linear'
      },
      tipo: ''
    }
  },
  methods: {
    sort (s) {
      this.order = s
      this.$store.dispatch('setSortDate', s)
    },
    setSearch () {
      this.$store.dispatch('setSearch4', this.search)
    },
    abrir (custo) {
      this.$store.dispatch('setId', custo.id)
      this.$router.push('/calculadora')
    },
    excluir (custo) {
      this.remover = custo
      this.dialog = true
    },
    remove (custo) {
      if (custo.id) {
        this.$store.dispatch('deletecusto', custo.id)
      }
      this.setSearch()
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
    formatDate (d) {
      if (!d) return null
      const [date, hora] = d.split(' ')
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year} ${hora}`
    }
  }
}
</script>

<style scoped>
  .lista {
    margin-top: 50px;
  }
</style>
