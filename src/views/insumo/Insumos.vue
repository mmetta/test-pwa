<template>
  <div id="insumo">
    <v-container>
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
              label="Insumo"
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
              to="/insumo/new"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="loading" class="justify-center py-4">
        <v-col cols="12" sm="6">
          <esqueleto />
        </v-col>
      </v-row>
      <v-row v-else class="justify-center">
        <v-col cols="12" sm="6">
          <v-list shaped class="ml-4 mr-2">
            <v-list-item-group v-model="active" color="success">
              <v-list-item v-for="insumo in insumos" :key="insumo.id" aria-selected="active">
                <v-list-item-content @click="alterar(insumo)">
                  <v-list-item-title :id="insumo.nome" v-text="insumo.nome"></v-list-item-title>
                  <v-list-item-subtitle>
                    {{ tamanho(insumo.tamanho, insumo.unidade) }}
                    {{ ' ' }}
                    {{ unidade(insumo.tamanho, insumo.unidade) }}
                    {{ ' - R$ ' }}{{ decimal(insumo.preco) }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                    <v-btn
                      icon
                      @click="excluir(insumo)"
                    >
                      <v-icon color="grey">mdi-trash-can-outline</v-icon>
                    </v-btn>
                </v-list-item-action>

              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>

      <template v-if="!basica">
        <listabasica />
      </template>

  </v-container>

    <!-- Dialog confirmando exclusão -->
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
              Excluir
            </v-card-title>
            <v-card-subtitle>
              {{ remover.nome }}
            </v-card-subtitle>
            <v-card-text>
              Esta ação afetará as receitas que contêm este item, deseja continuar?
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
    <!-- FIM Dialog confirmando exclusão -->

    <!-- Dialog para listar receitas afetadas pela exclusão -->
    <template>
      <v-dialog
        v-model="dialog2"
        scrollable
        persistent
        :overlay="false"
        max-width="300px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title primary-title>
            Receitas afetadas
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
              @click="dialog2 = false"
            >Entendi</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <!-- FIM Dialog para listar receitas afetadas pela exclusão -->
  </div>
</template>

<script>
import { tipoArr } from '../../plugins/arredondar'
import listabasica from './ListaBasica'
import esqueleto from '../../components/Skeleton'

export default {
  name: 'insumo',
  components: {
    listabasica,
    esqueleto
  },
  computed: {
    total () {
      let total = ''
      if (this.varr && this.varr > 0 && this.tipo) {
        const valor = tipoArr(this.tipo, this.varr)
        total = parseFloat(valor).toFixed(2)
      }
      return total
    },
    base () {
      return this.$store.getters.insumos
    },
    receitasAlteradas () {
      return this.$store.getters.receitasAlteradas
    }
  },
  watch: {
    base (value) {
      this.$store.dispatch('setSearch', this.search)
    },
    search (value) {
      this.$store.dispatch('setSearch', value)
    },
    insumos (value) {
      return value
    },
    basica (value) {
      console.log(value)
    }
  },
  mounted () {
    this.tipo = '1'
    this.$store.dispatch('setSearch', '')
    this.insumos = this.$store.getters.searchInsumos
    // tempo para mostrar esqueleto
    setTimeout(() => {
      // valor inicial do search
      this.basica = this.$store.getters.config.basica || false
      this.loading = false
    }, 600)
    // console.log(window.outerWidth)
  },
  data () {
    return {
      loading: true,
      basica: true,
      insumos: [],
      active: '',
      dialog: false,
      dialog2: false,
      remover: '',
      items: [],
      select: 'null',
      search: this.$store.getters.search,
      tipos: [
        { value: '1', text: 'centavos' },
        { value: '2', text: 'por 5,00' },
        { value: '3', text: 'por 10,00' }
      ],
      options: {
        duration: 300,
        offset: 0,
        easing: 'linear'
      },
      tipo: '',
      varr: 194.32
    }
  },
  methods: {
    setSearch () {
      this.$store.dispatch('setSearch', this.search)
    },
    decimal (preco) {
      return parseFloat(preco).toFixed(2)
    },
    tamanho (t, u) {
      let tam = t
      if (t > 999 && u !== 'un') {
        tam = t / 1000
      }
      return tam
    },
    unidade (t, u) {
      let uni = u
      if (t > 999 && u !== 'un') {
        switch (u) {
          case 'ml': uni = 'Lt'
            break
          case 'g': uni = 'Kg'
            break
        }
      }
      return uni
    },
    alterar (insumo) {
      this.$router.push('/insumo/' + insumo.id)
    },
    excluir (insumo) {
      this.remover = insumo
      this.dialog = true
    },
    remove (insumo) {
      if (!insumo.id) {
        return
      }
      this.$store.dispatch('deleteInsumo', insumo.id)
      this.$store.dispatch('updateReceitaDeleteInsumo', insumo.id)
      console.log(this.receitasAlteradas)
      if (this.receitasAlteradas.length > 0) {
        this.dialog2 = true
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
