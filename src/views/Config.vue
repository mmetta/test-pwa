<template>
  <div id="Config">
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-4">
            <h4>CONFIGURAÇÕES DO APP</h4>
          </v-row>
        </v-col>
      </v-row>
        <v-row v-if="loading" class="justify-center my-4">
          <v-col cols="10" sm="6">
            <!-- <v-skeleton-loader
              class="mb-5"
              :boilerplate="false"
              :elevation="0"
              type="list-item-two-line, actions"
            ></v-skeleton-loader> -->
            <v-row class="justify-center my-2">
              <v-progress-circular
                :size="36"
                color="success"
                indeterminate
              ></v-progress-circular>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-else class="justify-center my-4">
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

        <!-- Formas de pagemento padrão -->
        <v-row class="justify-center">
          <v-col cols="12" sm="8">
            <v-row class="justify-center teal lighten-5 py-4">
              <h4>Formas de pagamento padrão</h4>
            </v-row>
          </v-col>
        </v-row>

      <div v-if="loading">
        <v-row class="justify-center my-4">
          <v-col cols="10" sm="6">
            <v-row class="justify-center my-2">
              <v-progress-circular
                :size="36"
                color="success"
                indeterminate
              ></v-progress-circular>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row class="justify-center grey--text px-4" v-if="!editarPgto">
          <v-col cols="12" sm="8">
            <v-row>
              {{ pgto }}
            </v-row>
            <v-row>
              <strong class="mr-2">Validade da proposta:</strong>
              {{ validade }}
              <span class="ml-2">{{ validade > 1 ? 'dias.' : 'dia.' }}</span>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-else class="justify-center my-2 px-2">
          <v-col cols="12" sm="8">
            <v-row>
              <v-textarea
                color="success"
                v-model="formasPgto"
                outlined
                rows="5"
                counter
                :rules="rulePgto"
                maxlength="200"
                label="Formas de pagamento"
                placeholder="Formas de pagamento aceitas por você ..."
              ></v-textarea>
            </v-row>
            <v-row>
              <v-col cols="6" class="pt-2">
                <strong class="mr-2">Validade da proposta:</strong>
              </v-col>
              <v-col cols="6" class="pt-0">
                <v-select
                  :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 30]"
                  v-model="diasValidade"
                  label="Dia(s)"
                  type="number"
                  class="mx-2"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="justify-center mb-4">
          <v-col cols="12" sm="8">
            <v-btn
              small
              text
              right
              color="success"
              class="mx-2"
              title="Alterar"
              @click="editarPgto = !editarPgto"
            >
              {{ editarPgto ? 'Cancelar' : 'Editar' }}
              <v-icon class="primary--text" v-if="editarPgto" small>mdi-close</v-icon>
              <v-icon v-else small>mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn
              v-if="editarPgto"
              small
              color="success"
              class="mx-2"
              rounded
              :disabled="!formIsValid"
              @click="salvarPgto()"
            >
              <v-icon small>mdi-pencil</v-icon>
              salvar
            </v-btn>
          </v-col>
        </v-row>
        <!-- FIM Formas de pagemento padrão -->
      </div>

        <!-- Imagem para orçamento -->
        <v-row class="justify-center">
          <v-col cols="12" sm="8">
            <v-row class="justify-center teal lighten-5 py-4">
              <h4>Sua imagem no orçamento</h4>
            </v-row>
          </v-col>
        </v-row>
        <div v-if="loading">
          <v-row class="justify-center my-4">
            <v-col cols="10" sm="6">
              <v-row class="justify-center my-2">
                <v-progress-circular
                  :size="36"
                  color="success"
                  indeterminate
                ></v-progress-circular>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <v-row class="justify-center">
            <v-img id="myImg" max-width="120" max-height="120" :src="ph" alt="sua imagem" />
          </v-row>
        <v-row class="justify-center my-4">
            <v-btn
              icon
              color="success"
              title="Alterar"
              @click="editarPhoto()"
            >
              <v-icon>mdi-upload</v-icon>
              Trocar imagem
            </v-btn>
          </v-row>
        </div>
      </v-container>
      <!-- FIM Imagem para orçamento -->

    <!-- Dialog para alterar Foto do perfil -->
      <SetPhotoURL />
    <!-- FIM Dialog para alterar Foto do perfil -->

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
import SetPhotoURL from '../components/User/SetPhotoURL'

export default {
  name: 'Config',
  components: {
    SetPhotoURL
  },
  computed: {
    config () { return this.$store.getters.config },
    formIsValid () { return this.pgto.length >= 10 },
    ph () { return this.$store.getters.config.photo },
    pgto () { return this.$store.getters.config.formasPgto },
    validade () { return this.$store.getters.config.validade },
    processamento () { return this.setprocessamento() },
    margem () { return this.setMargem() }
  },
  watch: {
    pgto () {
      this.formasPgto = this.pgto
    }
  },
  mounted () {
    setTimeout(() => {
      this.formasPgto = this.pgto
      this.loading = false
    }, 2000)
  },
  data () {
    return {
      loading: true,
      formasPgto: '',
      diasValidade: this.validade || 1,
      editarPgto: false,
      dialogBase: false,
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
      ],
      rulePgto: [
        v => (v && v.length >= 10) || 'Min. 10 caracteres',
        v => (v && v.length <= 200) || 'Máx. 200 caracteres'
      ]
    }
  },
  methods: {
    setprocessamento () {
      let proc = this.$store.getters.config.processamento
      proc = proc ? (proc - 1) * 100 : 30
      proc = Math.round(proc)
      return proc + '%'
    },
    setMargem () {
      let margem = this.$store.getters.config.margem
      margem = margem ? (margem - 1) * 100 : 200
      margem = Math.round(margem)
      return margem + '%'
    },
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
    },
    salvarPgto () {
      if (!this.formasPgto) {
        return
      }
      const pg = {
        id: this.config.id,
        formasPgto: this.formasPgto,
        validade: this.diasValidade
      }
      this.$store.dispatch('setConfig', pg)
      this.editarPgto = false
    },
    editarPhoto () {
      this.$store.dispatch('setDialogPhoto', true)
    }
  }
}
</script>
