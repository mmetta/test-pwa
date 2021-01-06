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
        <v-row class="justify-center">
          <v-col cols="12" sm="6">
            <v-list shaped class="ml-4 mr-2">
              <v-list-item-group v-model="active" color="success">
                <v-list-item v-for="custo in custos" :key="custo.id" aria-selected="active">
                  <v-list-item-content @click="abrir(custo)">
                    <v-list-item-title :id="custo.nome" v-text="custo.nome"></v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatDate(custo.modificado) }}
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

export default {
  computed: {
    custos () {
      return this.$store.getters.searchcustos
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
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }
  }
}
</script>

<style scoped>
  .lista {
    margin-top: 50px;
  }
</style>
