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
        <v-col cols="12" sm="8">
          <v-row>
            <v-data-table
              :headers="colunas()"
              :items="linha"
              hide-default-footer
              class="elevation-1 mx-0"
              loading="true"
              mobile-breakpoint="300"
            >

            </v-data-table>
          </v-row>
          <!-- <v-row>
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
          </v-row> -->
          <v-row class="pt-2">
            <v-col cols="5">
              <v-text-field
                prefix="R$"
                size="10"
                color="success"
                type="number"
                step="0.01"
                v-model="total"
                label="Total"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="7" class="pt-5">
              <v-row class="justify-center align-center">
                <v-btn
                  small
                  text
                  color="success"
                  @click="dialogItem = true"
                >
                  <v-icon small>mdi-plus</v-icon>
                  Novo Item
                </v-btn>
                <v-btn
                  small
                  text
                  color="warning"
                  @click="lista()"
                >
                  <v-icon small>mdi-plus</v-icon>
                  Custo
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
              :rules="ruleObservacao"
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
            @click="limparTudo()"
          >
            <v-icon class="mr-2 red--text">mdi-close</v-icon>
            Limpar Tudo
          </v-btn>
          <v-spacer></v-spacer>
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

    <!-- Dialog para inclusão manual de itens no orçamento -->
    <v-dialog
      v-model="dialogItem"
      scrollable
      persistent
      :overlay="false"
      max-width="440px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          {{ fazer }}{{ ' ' }} ITEM
        </v-card-title>
        <v-card-text>
          <v-row class="pa-1">
            <v-textarea
              color="success"
              v-model="desc"
              outlined
              rows="4"
              counter
              :rules="ruleDesc"
              maxlength="120"
              label="Descrição"
              placeholder="Descrição do item"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-col cols="6" class="pa-2">
              <v-text-field
                size="10"
                color="success"
                type="number"
                v-model="qtd"
                label="Quantidade"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pa-2">
              <v-text-field
                prefix="R$"
                size="10"
                color="success"
                type="number"
                step="0.01"
                v-model="un"
                label="Valor Unitário"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="dialogItem = false"
          >fechar</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="insertLinha()"
            :disabled="!itemIsValid"
          >{{ fazer }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- FIM Dialog para inclusão manual de itens no orçamento -->

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
      this.linha.length >= 0 &&
      this.pgto.length >= 10 &&
      this.total > 0
    },
    itemIsValid () {
      return this.qtd > 0 &&
      this.desc.length >= 10 &&
      this.un > 0
    },
    user () {
      return this.$store.getters.user
    },
    formasPgto () {
      const pg = this.$store.getters.config.formasPgto
      return pg || ''
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
    },
    total () {
      let total = 0
      if (this.linha.length > 0) {
        total = [].reduce.call(this.linha, (somatorio, el) => {
          return somatorio + parseFloat(el.SUBTOTAL, 10) || 0
        }, 0)
      }
      return parseFloat(total).toFixed(2)
    }
  },
  watch: {
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
        this.desc = descricao
        this.qtd = 1
        this.un = this.soma
        this.insertLinha()
      }
    }
  },
  data () {
    return {
      keys: [
        // 'id',
        'QUANT',
        'ITENS',
        'UNIT',
        'SUBTOTAL'
      ],
      linha: [],
      dialog: false,
      dialogItem: false,
      fazer: 'INSERIR',
      desc: '',
      qtd: '',
      un: '',
      posX: 68,
      acombinar: false,
      obs: false,
      observacao: '',
      date: new Date().toISOString().substr(0, 10),
      time: this.horaAtual(),
      menu1: false,
      menu2: false,
      descricao: '',
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
      ruleDesc: [
        v => (v && v.length >= 10) || 'Min. 10 caracteres',
        v => (v && v.length <= 120) || 'Máx. 120 caracteres'
      ],
      ruleObservacao: [
        v => (v && v.length >= 10) || 'Min. 10 caracteres',
        v => (v && v.length <= 200) || 'Máx. 200 caracteres'
      ],
      rulePgto: [
        v => (v && v.length >= 10) || 'Min. 10 caracteres',
        v => (v && v.length <= 150) || 'Máx. 150 caracteres'
      ],
      // Substituir por dados dinâmicos depois
      linhas: [],
      headers: [
        // {
        //   id: 'id',
        //   name: 'id',
        //   prompt: 'id',
        //   width: 20,
        //   align: 'center',
        //   padding: 0
        // },
        {
          id: 'QUANT',
          name: 'QUANT',
          prompt: 'QUANT',
          width: 50,
          align: 'center',
          padding: 0
        },
        {
          id: 'ITENS',
          name: 'ITENS',
          prompt: 'ITENS',
          width: 100,
          align: 'center',
          padding: 0
        },
        {
          id: 'UNIT',
          name: 'UNIT',
          prompt: 'UNIT',
          width: 40,
          align: 'center',
          padding: 0
        },
        {
          id: 'SUBTOTAL',
          name: 'SUBTOTAL',
          prompt: 'SUBTOTAL',
          width: 60,
          align: 'center',
          padding: 0
        }
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
    colunas () {
      const colunas = []
      for (let i = 0; i < this.keys.length; i++) {
        const item = this.keys[i]
        const col = {
          text: item,
          align: item === 'SUBTOTAL' ? 'end' : 'start',
          sortable: false,
          value: item
        }
        colunas.push(col)
      }
      return colunas
    },
    insertLinha () {
      if (!this.desc) {
        return
      }
      this.dialogItem = false

      // Calcula subtotal
      let sub = Number(this.qtd) * Number(this.un)
      if (isNaN(sub)) {
        sub = 0
      }
      const subtotal = parseFloat(sub).toFixed(2).toString()

      const linha = {
        // id: (this.linha.length + 1).toString(),
        QUANT: (this.qtd).toString(),
        ITENS: this.desc,
        UNIT: parseFloat(this.un).toFixed(2).toString(),
        SUBTOTAL: subtotal
      }
      this.limpaForm()
      this.linha.push(linha)
    },
    generateData (linhas) {
      var result = []
      for (var i = 0; i < linhas.length; i += 1) {
        const data = linhas[i]
        const desc = data.ITENS.length / 30 > 1 ? data.ITENS.length / 30 : 1
        const atual = Math.ceil(desc)
        let mult = 10
        if (atual > 1) { mult = 7 }
        this.posX += atual * mult

        // data.id = (i + 1).toString()
        result.push(Object.assign({}, data))
      }
      return result
    },
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
      // const descricao = this.descricao
      const valor = this.total
      const formasPgto = this.pgto
      const now = new Date()
      const hora = this.horaAtual() + ':' + now.getSeconds()
      const dataHora = this.formatDate(now.toISOString().substr(0, 10)) + ' ' + hora
      // eslint-disable-next-line new-cap
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 297]
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

      // Descrição
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('DESCRIÇÃO', 105, 60, null, null, 'center')

      // linha
      doc.setLineWidth(0.2)
      doc.setDrawColor(160)
      doc.line(10, 64, 200, 64)

      // Texto longo Descrição
      // const texto = doc.splitTextToSize(descricao, 95)
      // doc.setFontSize(10)
      // doc.setTextColor(150)
      // doc.text(15, 70, texto)

      // TABELA com a Descrição
      const tableRows = this.generateData(this.linha)
      doc.table(10, 68, tableRows, this.headers, {})
      // FIM da TABELA com a Descrição

      // linha
      // this.posX += 12
      // doc.setLineWidth(0.2)
      // doc.setDrawColor(160)
      // // linha Fucsia
      // // doc.setDrawColor(216, 27, 96)
      // doc.line(10, this.posX, 200, this.posX)

      this.posX += 18
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('Total:', 10, this.posX)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(150)
      doc.text('R$ ' + valor, 25, this.posX)

      this.posX += 10
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('Formas de pagamento:', 10, this.posX)

      // Texto longo Formas de Pagamento
      this.posX += 10
      const formas = doc.splitTextToSize(formasPgto, 170)
      doc.setFontSize(10)
      doc.setTextColor(150)
      doc.text(20, this.posX, formas)

      this.posX += 18
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(0, 137, 123)
      doc.text('Entrega:', 10, this.posX)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(150)
      doc.text(entrega, 30, this.posX)

      this.posX += 8
      // let y = 160
      if (this.obs) {
        // y = 180
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(0, 137, 123)
        doc.text('Observação:', 10, this.posX)

        // Texto longo Observações
        this.posX += 6
        const outros = doc.splitTextToSize(this.observacao, 170)
        doc.setFontSize(10)
        doc.setTextColor(150)
        doc.text(20, this.posX, outros)
      }

      // Linha final - assinatura do app
      this.posX += 20
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(180)
      doc.text('SEUCUSTO - APP', 105, this.posX, null, null, 'center')
      doc.setLineWidth(0.1)
      doc.setDrawColor(180)
      doc.line(10, this.posX - 3, 190, this.posX - 3)

      // Salva o documento PDF em Downloads
      try {
        doc.save(cliente + '.pdf')
        setTimeout(() => {
          this.loading = false
          this.limparTudo()
        }, 5000)
      } catch (error) {
        console.log('Alguma coisa deu errado: ' + ErrorEvent)
      }
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
    limpaForm () {
      this.un = ''
      this.qtd = ''
      this.desc = ''
    },
    limparTudo () {
      this.cliente = ''
      this.linha = []
      this.observacao = ''
      this.obs = false
      this.acombinar = false
      this.date = new Date().toISOString().substr(0, 10)
      this.time = this.horaAtual()
    },
    decimal () {
      if (this.total === '') { return }
      this.total = parseFloat(this.total).toFixed(2)
    }
  }
}
</script>
