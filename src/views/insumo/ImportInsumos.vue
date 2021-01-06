<template>
  <div>
    <v-layout row>
      <v-flex xs12 md6 offset-md3 class="px-5">
        <v-row
          class="secondary my-2 py-2 px-4"
          align="center"
          justify="center"
        >
          <strong>Lista básica de insumos</strong>
          <v-spacer></v-spacer>
          <v-btn text color="success" @click="importar()">
            <v-icon small>mdi-download</v-icon>
            importar
          </v-btn>
        </v-row>

        <v-layout row>
          <v-flex xs12>

            <v-list dense color="grey lighten-4">
              <v-list-item-group v-model="active" color="success">
                <v-list-item v-for="base in basica" :key="base.id" aria-selected="active">
                  <v-list-item-avatar
                    v-if="show"
                    @click="base.check = !base.check"
                  >
                    <v-checkbox
                      readonly
                      color="success"
                      :input-value="base.check"
                      value
                    ></v-checkbox>
                  </v-list-item-avatar>
                  <v-list-item-avatar v-else>
                    <v-icon x-small>mdi-square</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content @click="base.check = !base.check">
                    <v-list-item-title :id="base.nome" v-text="base.nome"></v-list-item-title>
                    <v-list-item-subtitle>
                      {{ base.tamanho }}
                      {{ base.unidade }}
                      {{ ' - R$ ' }}
                      {{ parseFloat(base.preco).toFixed(2) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                    >
                      <v-icon color="success" v-if="base.imported === 'ok'">mdi-check</v-icon>
                      <v-icon color="red darken-2" v-else-if="base.imported === 'err'">mdi-close</v-icon>
                      <v-icon x-small color="grey" v-else>mdi-square</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>

          <v-row
            class="secondary my-2 py-2 px-4"
            align="center"
            justify="center"
          >
            <v-btn
              text
              color="success"
              :disabled="btn"
              :loading="btn"
              @click="btn = true, importar()"
            >
              <v-icon small>mdi-download</v-icon>
              importar
            </v-btn>
          </v-row>

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
          Processo em andamento
        </v-card-title>
        <v-card-text>
          <v-row
            align="center"
            justify="center"
          >
            <strong x-large>{{ load }}%</strong>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions
          v-if="!!(load === 100)"
        >
          <span>
            {{ alter.length }} importados
          </span>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="dialog = false; voltar()"
          >Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  created () {
    this.active = false
  },
  data () {
    return {
      basica: this.$store.getters.importInsumos,
      btn: false,
      load: 0,
      alter: [],
      active: '',
      show: true,
      erro: false,
      dialog: false
    }
  },
  methods: {
    importar () {
      this.alter = this.basica.filter(r => {
        return r.check === true
      })
      this.basica = []
      this.show = false
      this.dialog = true
      for (let i = 0; i < this.alter.length; i++) {
        setTimeout(() => {
          const item = this.alter[i]
          item.imported = 'ok'
          this.$store.dispatch('createInsumo', item)
          this.basica.push(item)
          this.load = this.progress(i)
        }, 1000)
      }
    },
    progress (v) {
      if (!v) {
        return 0
      }
      const a = this.alter.length
      const valor = (v + 1) / a * 100
      return parseInt(valor)
    },
    voltar () {
      const configId = this.$store.getters.config.id
      const config = {
        id: configId,
        basica: true
      }
      this.$store.dispatch('setConfig', config)
      this.$router.push('/insumo')
    }
  }
}
</script>
