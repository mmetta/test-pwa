<template>
  <div>
      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-2">
            <h3 class="text-uppercase">Orçamento</h3>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center my-4">
        <v-col cols="10" sm="6">
          <v-row class="grey--text">
            Preencha os dados abaixo para gerar um documento personalizado em PDF para mandar ao seu cliente para aprovação.
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-2">
            <h4 class="text-uppercase">Cliente</h4>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center my-4">
        <v-col cols="10" sm="6">
          <v-row>
            <v-text-field
              color="success"
              v-model="cliente"
              counter
              :rules="ruleCliente"
              maxlength="100"
              label="Nome"
              placeholder="Digite o nome do cliente"
            ></v-text-field>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-2">
            <h4 class="text-uppercase">Entrega</h4>
          </v-row>
        </v-col>
      </v-row>

    <!-- Datepicker para data e hora de entrega -->
      <v-row class="justify-center my-4">
        <v-col cols="10" sm="6">
          <v-row>
            <v-col cols="6" class="px-2">
              <v-menu
                v-model="menu1"
                :close-on-content-click="true"
                max-width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :disabled="acombinar"
                    color="teal lighten-3"
                    :value="formatDate(date)"
                    label="Data de entrega"
                    readonly
                    v-on="on"
                    @click:clear="date = null"
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  locale="pt-br"
                  color="success"
                  v-model="date"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="6" class="px-2">
              <v-menu
                ref="menu"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="20"
                :return-value.sync="time"
                offset-y
                max-width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :disabled="acombinar"
                    color="teal lighten-3"
                    :value="time"
                    label="Hora da entrega"
                    readonly
                    v-on="on"
                    @click:clear="time = null"
                  ></v-text-field>
                </template>
                <v-time-picker
                  color="success"
                  v-model="time"
                  format="24hr"
                  @click:minute="$refs.menu.save(time)"
                >
                  <!-- <v-spacer></v-spacer>
                  <v-btn text color="success" @click="menu2 = false">OK</v-btn> -->
                </v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-checkbox
              v-model="acombinar"
              label="Entrega à combinar"
              color="success"
              hide-details
            ></v-checkbox>
          </v-row>
        </v-col>
      </v-row>
    <!-- FIM Datepicker para data e hora de entrega -->

      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-2">
            <h4 class="text-uppercase">Descrição do pedido</h4>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center my-4">
        <v-col cols="10" sm="6">
          <v-row>
            <v-textarea
              color="success"
              v-model="descricao"
              outlined
              rows="4"
              counter
              :rules="ruleDescricao"
              maxlength="200"
              label="Descrição"
              placeholder="Faça uma breve descrição do pedido"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-col cols="5" class="py-0">
              <v-text-field
                prefix="R$"
                size="10"
                color="success"
                type="number"
                step="0.01"
                v-model="total"
                label="Total"
                @change="decimal()"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="7" class="pt-5">
              <v-row class="justify-center align-center">
                <v-btn
                  small
                  text
                  color="success"
                  @click="lista()"
                >
                  <v-icon small>mdi-list</v-icon>
                  Listar Custos
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-2">
            <h4 class="text-uppercase">Formas de pagamento</h4>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center my-4">
        <v-col cols="10" sm="6">
          <v-row class="grey--text" v-if="!editarPgto">
            {{ pgto }}
          </v-row>
          <v-row v-else>
            <v-textarea
              color="success"
              v-model="pgto"
              outlined
              rows="4"
              counter
              :rules="rulePgto"
              maxlength="150"
              label="Formas de pagamento"
              placeholder="Formas de pagamento aceitas por você"
            ></v-textarea>
          </v-row>
          <v-row class="justify-center pt-2">
            <v-btn
              small
              text
              right
              color="success"
              title="Alterar"
              @click="editarPgto = !editarPgto"
            >
              Editar
              <v-icon small>mdi-pencil-outline</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-2">
            <h4 class="text-uppercase">Observação</h4>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center my-4">
        <v-col cols="10" sm="6">
          <v-row v-if="obs">
            <v-textarea
              color="success"
              v-model="observacao"
              outlined
              rows="4"
              counter
              :rules="ruleDescricao"
              maxlength="200"
              label="Observação"
              placeholder="Anote aqui outras informações importantes"
            ></v-textarea>
          </v-row>

          <v-row class="justify-center pt-2">
            <v-btn
              small
              text
              color="success"
              title="Observações"
              @click="obs = !obs"
            >
              <v-icon small>{{ obsIcon }}</v-icon>
              {{ obsLabel }}
            </v-btn>
          </v-row>

        </v-col>
      </v-row>

      <v-row class="justify-center">
        <v-col cols="12" sm="8">
          <v-row class="justify-center teal lighten-5 py-2">
            <h4 class="text-uppercase">Gere o arquivo para enviar</h4>
          </v-row>
        </v-col>
      </v-row>

    <v-row class="justify-center">
      <v-col cols="6">
        <v-row class="justify-center pb-5">
          <v-btn
            tile
            :loading="loading"
            @click="gerarPDF()"
            :disabled="!formIsValid"
          >
            <v-icon class="mr-2 red--text">mdi-file-pdf-box-outline</v-icon>
            gerar pdf
          </v-btn>
          <strong v-if="loading" class="grey--text ml-2">Aguarde...</strong>
          </v-row>
      </v-col>
    </v-row>

    <lista-custos :dialog="dialog" />

  </div>
</template>

<script>
import { jsPDF } from 'jspdf'
import ListaCustos from './ListaCustos.vue'

export default {
  name: 'SaveOrcamento',
  components: {
    ListaCustos
  },
  computed: {
    formIsValid () {
      return this.cliente.length >= 3 &&
      this.descricao.length >= 10 &&
      this.formasPgto.length >= 10 &&
      this.total > 0
    },
    user () {
      return this.$store.getters.user
    },
    formasPgto () {
      const pg = this.$store.getters.config.formasPgto
      return pg
    },
    computedDateFormatted () {
      let time = ''
      let date = ''
      if (typeof this.time === 'string') {
        time = this.time
        date = this.formatDate(this.date)
      }
      return date + ' ' + time
    },
    obsLabel () {
      return this.obs ? 'Cancelar' : 'Mais informações ?'
    },
    obsIcon () {
      return this.obs ? 'mdi-close' : 'mdi-plus'
    },
    soma () {
      return this.$store.getters.soma
    },
    resumo () {
      return this.$store.getters.resumo
    }
  },
  watch: {
    soma (n) {
      this.total = n
    },
    resumo (res) {
      if (res.length > 0) {
        let descricao = ''
        for (let i = 0; i < res.length; i++) {
          const txt = res[i]
          if (i > 0 && i < res.length) {
            descricao += ', '
          }
          descricao += txt
        }
        this.descricao = descricao
      }
    }
  },
  data () {
    return {
      dialog: false,
      acombinar: false,
      obs: false,
      observacao: '',
      date: new Date().toISOString().substr(0, 10),
      time: this.horaAtual(),
      menu1: false,
      menu2: false,
      descricao: '',
      total: '',
      cliente: '',
      editarPgto: false,
      pgto: '',
      photo: '',
      ph: this.$store.getters.user.photoURL,
      loading: false,
      imgAsBase64: null,
      ruleCliente: [
        v => (v && v.length >= 3) || 'Min. 3 caracteres',
        v => (v && v.length <= 100) || 'Máx. 100 caracteres'
      ],
      ruleDescricao: [
        v => (v && v.length >= 10) || 'Min. 10 caracteres',
        v => (v && v.length <= 200) || 'Máx. 200 caracteres'
      ],
      rulePgto: [
        v => (v && v.length >= 10) || 'Min. 10 caracteres',
        v => (v && v.length <= 150) || 'Máx. 150 caracteres'
      ]
    }
  },
  mounted () {
    this.toDataURL(this.ph, data => {
      this.imgAsBase64 = data
    })
    this.pgto = this.formasPgto || ''
  },
  methods: {
    lista () {
      this.$store.dispatch('setDialogListaCustos', true)
    },
    horaAtual () {
      const time = new Date()
      let H = time.getHours().toString()
      if (H.length === 1) { H = '0' + H }
      let M = time.getMinutes().toString()
      if (M.length === 1) { M = '0' + M }
      return H + ':' + M
    },
    gerarPDF () {
      this.loading = true
      const email = this.user ? this.user.email : ''
      const cliente = this.cliente
      const entrega = this.acombinar ? 'à combinar' : this.computedDateFormatted
      const descricao = this.descricao
      const valor = this.total
      const formasPgto = this.pgto
      const now = new Date()
      const hora = this.horaAtual() + ':' + now.getSeconds()
      const dataHora = this.formatDate(now.toISOString().substr(0, 10)) + ' ' + hora
      // eslint-disable-next-line new-cap
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [120, 200]
      })

      // base-64
      const imgData = this.imgAsBase64

      // FÚCSIA 216, 27, 96
      // TEAL 0, 137, 123

      doc.addImage(imgData, 'JPEG', 10, 10, 30, 30)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(216, 27, 96)
      doc.text('ORÇAMENTO', 50, 20)
      doc.setFontSize(10)
      doc.setTextColor(150)
      doc.text(email, 50, 26)
      doc.setFontSize(9)
      doc.setTextColor(150)
      doc.text(dataHora, 50, 30)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('Cliente:', 10, 50)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100)
      doc.text(cliente, 25, 50)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('DESCRIÇÃO', 60, 60, null, null, 'center')

      // linha Fucsia
      doc.setLineWidth(0.2)
      doc.setDrawColor(216, 27, 96)
      doc.line(10, 64, 110, 64)
      // Texto longo Descrição
      const texto = doc.splitTextToSize(descricao, 95)
      doc.setFontSize(10)
      doc.setTextColor(150)
      doc.text(15, 70, texto)
      // linha Fucsia
      doc.setLineWidth(0.2)
      doc.setDrawColor(216, 27, 96)
      doc.line(10, 86, 110, 86)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('Total:', 10, 95)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(150)
      doc.text('R$ ' + valor, 25, 95)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('Formas de pagamento:', 10, 102)

      // Texto longo Formas de Pagamento
      const formas = doc.splitTextToSize(formasPgto, 95)
      doc.setFontSize(10)
      doc.setTextColor(150)
      doc.text(15, 110, formas)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('Entrega:', 10, 140)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(150)
      doc.text(entrega, 30, 140)

      let y = 160
      if (this.obs) {
        y = 180
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(0, 137, 123)
        doc.text('Observação:', 10, 150)
        // Texto longo Observações
        const outros = doc.splitTextToSize(this.observacao, 95)
        doc.setFontSize(10)
        doc.setTextColor(150)
        doc.text(15, 156, outros)
      }

      // Linha final - assinatura do app
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(180)
      doc.text('SEUCUSTO - APP', 60, y, null, null, 'center')
      doc.setLineWidth(0.1)
      doc.setDrawColor(180)
      doc.line(10, y - 3, 110, y - 3)

      // Salvae documento PDF em Downloads
      doc.save(cliente + '.pdf')
      setTimeout(() => {
        this.loading = false
      }, 5000)
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    toDataURL (url, callback) {
      var xhr = new XMLHttpRequest()
      xhr.onload = function () {
        var reader = new FileReader()
        reader.onloadend = function () {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', url)
      xhr.responseType = 'blob'
      xhr.send()
    },
    decimal () {
      if (this.total === '') { return }
      this.total = parseFloat(this.total).toFixed(2)
    }
  }
}
</script>
