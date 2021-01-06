<template>
  <v-container class="receita">

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
                label="Receita"
                id="search"
                v-model="search"
                flat
                clearable
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                icon
                color="success"
                router
                to="/receita/new"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            </v-row>
          </v-col>
        </v-row>

    <v-layout row>
      <v-flex xs12 md6 offset-md3 class="pa-3">
        <v-layout row>
          <v-flex xs12>
            <v-list shaped class="ml-4 mr-2">
          <v-list-item-group v-model="active" color="success">
            <v-list-item v-for="receita in receitas" :key="receita.id" aria-selected="active">
              <v-list-item-content @click="alterar(receita)">
                <v-list-item-title :id="receita.nome" v-text="receita.nome"></v-list-item-title>
                <v-list-item-subtitle>
                  {{ receita.rendimento }}
                  {{ receita.rendUnid }}
                  <span v-if="receita.rendimento > 1 && receita.total > 0">
                  {{ ' x ' }}
                    {{ decimal(receita.total / receita.rendimento) }}
                  {{ ' = ' }}
                  </span>
                  {{ 'R$ ' }}{{ decimal(receita.total) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  icon
                  @click="excluir(receita)"
                >
                  <v-icon color="grey">mdi-trash-can-outline</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-flex>
    </v-layout>
  </v-flex>
</v-layout>
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
    receitas () {
      return this.$store.getters.searchReceitas
    },
    base () {
      return this.$store.getters.receitas
    }
  },
  watch: {
    base () {
      this.$store.dispatch('setSearch1', this.search)
    },
    search (value) {
      this.$store.dispatch('setSearch1', value)
    },
    receitas (value) {
      return value
    }
  },
  mounted () {
    // valor inicial do search
    this.$store.dispatch('setSearch1', '')
  },
  data () {
    return {
      active: '',
      dialog: false,
      loading: false,
      remover: '',
      items: [],
      select: 'null',
      search: this.$store.getters.search1,
      options: {
        duration: 300,
        offset: 0,
        easing: 'linear'
      }
    }
  },
  methods: {
    setSearch () {
      this.$store.dispatch('setSearch1', this.search)
    },
    decimal (preco) {
      return parseFloat(preco).toFixed(2)
    },
    alterar (receita) {
      this.$router.push('/receita/' + receita.id)
    },
    excluir (receita) {
      this.remover = receita
      this.dialog = true
    },
    remove (receita) {
      if (receita.id) {
        this.$store.dispatch('deleteReceita', receita.id)
      }
    }
  }
}
</script>

<style scoped>
  .lista {
    margin-top: 50px;
  }
</style>
