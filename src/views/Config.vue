<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="12" sm="8">
        <v-row class="justify-center teal lighten-5 py-4">
          <h4>Configurações do APP</h4>
        </v-row>
      </v-col>
    </v-row>
      <v-row class="justify-center my-4">
        <v-col cols="10" sm="6">
          <v-row class="my-2">
            <v-col cols="8">
              <strong>Margem padrão:{{ ' ' }}</strong>
            </v-col>
            <v-col cols="4">
              <span>{{ ' ' + margem }}</span>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="8">
              <strong>Custo de processamento:{{ ' ' }}</strong>
            </v-col>
            <v-col cols="4">
              <span>{{ ' ' + processamento }}</span>
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-btn
              small
              color="success"
              rounded
              @click="editarBase()"
            >
              <v-icon small>mdi-pencil</v-icon>
              alterar
            </v-btn>
          </v-row>
        </v-col>
      </v-row>

          <!-- Dialog para alterar o bases de cálculo -->
            <v-dialog
              v-model="dialogBase"
              persistent
              :overlay="false"
              max-width="380px"
              transition="dialog-transition"
            >
              <v-card>
                <v-card-title primary-title>
                  Alterar Bases de cálculo
                </v-card-title>
                <v-card-text>
                  <v-row class="mx-2">
                    <v-select
                      :items="mps"
                      item-text="text"
                      item-value="value"
                      label="Margem padrão"
                      v-model="mp"
                    ></v-select>
                  </v-row>
                  <v-row class="mx-2">
                    <v-select
                      :items="cps"
                      item-text="text"
                      item-value="value"
                      label="Custo de processamento"
                      v-model="cp"
                    ></v-select>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="warning"
                    text
                    @click="cancelarBase()"
                  >Cancelar</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="success"
                    text
                    @click="salvarBase()"
                  >Salvar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          <!-- FIM Dialog para alterar o base de cálculo -->

  </div>
</template>

<script>
export default {
  name: 'Config',
  computed: {
    processamento () {
      let proc = this.$store.getters.config.processamento
      proc = proc ? (proc - 1) * 100 : 30
      proc = Math.round(proc)
      return proc + '%'
    },
    margem () {
      let margem = this.$store.getters.config.margem
      margem = margem ? (margem - 1) * 100 : 200
      margem = Math.round(margem)
      return margem + '%'
    }
  },
  watch: {
    config () {
      this.config = this.$store.getters.config
    }
  },
  created () {
    this.config = this.$store.getters.config
  },
  data () {
    return {
      dialogBase: false,
      config: '',
      mp: '',
      cp: '',
      cps: [
        { value: 1.1, text: '10%' },
        { value: 1.2, text: '20%' },
        { value: 1.3, text: '30%' },
        { value: 1.4, text: '40%' },
        { value: 1.5, text: '50%' }
      ],
      mps: [
        { value: 1.5, text: '50%' },
        { value: 2.0, text: '100%' },
        { value: 2.5, text: '150%' },
        { value: 3.0, text: '200%' },
        { value: 3.5, text: '250%' },
        { value: 4.0, text: '300%' }
      ]
    }
  },
  methods: {
    dadosBase () {
      this.mp = this.$store.getters.config.margem
      this.cp = this.$store.getters.config.processamento
    },
    cancelarBase () {
      this.dadosBase()
      this.dialogBase = false
    },
    editarBase () {
      this.dadosBase()
      this.dialogBase = true
    },
    salvarBase () {
      if (!this.mp || !this.cp) {
        return
      }
      const bases = {
        id: this.config.id,
        margem: this.mp,
        processamento: this.cp
      }
      this.$store.dispatch('setConfig', bases)
      this.cancelarBase()
    }
  }
}
</script>
