<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" sm="6" class="pa-6">

        <v-row class="justify-center">
          <v-col cols="12" class="secondary pl-4 py-5 mb-4">
            <v-icon v-if="id === '0'" class="success--text mr-2">mdi-calculator</v-icon>
            <v-icon @click="nome = custo.nome; dialog3 = true" v-else class="primary--text mr-2">mdi-pencil-outline</v-icon>
            <strong class="success--text">{{ titulo }}</strong>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="success">
            <h5 class="white--text ma-2">ITENS NECESSÁRIOS</h5>
          </v-col>
        </v-row>

        <v-row class="justify-center">
          <v-col cols="12" lg="10">
            <v-list dense color="grey lighten-4">
              <v-list-item-group v-model="active" color="success">
                <v-list-item v-for="item in items" :key="item.id">
                  <v-list-item-avatar>
                    <v-icon v-if="item.tipo === 'receita'" color="success lighten-1" small>mdi-cupcake</v-icon>
                    <v-icon v-else color="success lighten-1" small>mdi-view-dashboard</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content @click="alterar(item)">
                    <v-list-item-title :id="item.nome" v-text="item.nome"></v-list-item-title>
                    <v-list-item-subtitle>
                      {{ 'Quant: ' }}
                      {{ item.quant }}
                      {{ ' - R$ ' }}{{ item.valor }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                      @click="excluir(item)"
                    >
                      <v-icon small color="primary">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>

      <v-row class="justify-center py-2">
        <v-btn
          small
          rounded
          class="grey lighten-5 success--text mx-2"
          @click="fazer = 'Inserir'; dialog4 = true"
        >
          <v-icon class="mr-2">mdi-plus</v-icon>
          Receita
        </v-btn>
        <v-btn
          small
          rounded
          class="grey lighten-5 success--text mx-2"
          @click="fazer = 'Inserir'; dialog5 = true"
        >
          <v-icon class="mr-2">mdi-plus</v-icon>
          Insumo
        </v-btn>
      </v-row>

        <v-row>
          <v-col cols="12" class="success">
            <!-- <h5 class="white--text ma-2">RECEITAS NECESSÁRIAS</h5> -->
          </v-col>
        </v-row>

            <v-row>
              <v-col cols="12" class="px-2">
                <v-row class="justify-center">
                  <v-col cols="6" class="px-1">
                    <v-select
                      color="success"
                      :items="margemSelect"
                      item-value="margem"
                      item-text="text"
                      v-model="margem"
                      label="Margem"
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="6" class="px-1">
                    <v-text-field
                      prefix="R$ "
                      type="number"
                      color="success"
                      name="totalReceitas"
                      label="Receitas + margem"
                      v-model="totalReceitas"
                      id="totalreceitas"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row class="justify-center">
              <v-col cols="6" class="pa-1">
                <v-btn
                  text
                  color="success"
                  class="my-1"
                  @click="setOutros()"
                >
                  outros custos
                  <v-icon right>mdi-cursor-default-click</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="6" class="px-2">
                <v-text-field
                  v-if="outros"
                  color="success"
                  prefix="R$ "
                  type="number"
                  name="outrosValor"
                  label="Outros valores"
                  id="outrosvalor"
                  v-model="outrosValor"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="outros">
              <v-col cols="12" class="px-1">
                <v-textarea
                  color="success"
                  v-model="outrosDescricao"
                  outlined
                  rows="2"
                  counter
                  maxlength="80"
                  label="Outros custos"
                  placeholder="embalagem, entrega, etc."
                ></v-textarea>
              </v-col>
            </v-row>

          <!-- Plugin para arredondar o valor total -->
            <v-row>
              <v-col cols="12" class="px-2">
                <v-row>
                  <v-col cols="6" class="px-1">
                    <v-text-field
                      prefix="R$ "
                      color="success"
                      type="number"
                      name="varr"
                      label="Soma total"
                      id="varr"
                      v-model="varr"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" class="px-1">
                    <v-select
                      color="success"
                      :items="tipos"
                      item-value="value"
                      item-text="text"
                      v-model="arredondar"
                      label="Arredondar"
                      hide-details
                    ></v-select>
                  </v-col>
                  </v-row>
              </v-col>
            </v-row>
          <!-- FIM Plugin para arredondar o valor total -->

            <v-row class="justify-center align-center teal lighten-5">
              <v-col cols="6" class="px-2">
                <v-text-field
                  prefix="R$ "
                  type="number"
                  color="success"
                  name="total"
                  label="TOTAL"
                  v-model="total"
                  id="total"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>

        <v-row class="mt-2">
          <v-col cols="12" class="success">
            <!-- <h5 class="white--text ma-2">RECEITAS NECESSÁRIAS</h5> -->
          </v-col>
        </v-row>

        <v-row class="justify-center my-3">
          <v-col cols="12">
            <v-row>
              <v-col cols="2" class="px-0">
                  <v-btn
                    v-if="id === '0'"
                    block
                    tile
                    height="44"
                    color="secondary primary--text"
                    :loading="loading"
                    @click="$router.push('/')"
                  >
                    <v-icon class="mr-1">mdi-home</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    block
                    tile
                    height="44"
                    color="secondary primary--text"
                    :loading="loading"
                    @click="dialog2 = true"
                  >
                    <v-icon class="mr-1">mdi-content-copy</v-icon>
                  </v-btn>
              </v-col>
                  <v-col cols="5" class="px-0">
                      <v-btn
                        v-if="id === '0'"
                        block
                        height="44"
                        tile color="success"
                        @click="abrir()"
                      >
                        <v-icon class="mr-1">mdi-open-in-app</v-icon>
                        abrir
                      </v-btn>
                      <v-btn
                        v-else
                        block
                        height="44"
                        tile color="warning"
                        @click="fechar()"
                      >
                        <v-icon class="mr-1">mdi-close</v-icon>
                        fechar
                      </v-btn>
                  </v-col>
              <v-col cols="5" class="px-0">
                      <v-btn
                        block
                        height="44"
                        tile color="primary"
                        :disabled="!formIsValid"
                        :loading="loading"
                        @click="id === '0' ? dialog = true : salvarCusto()"
                      >
                        <v-icon class="mr-1">mdi-content-save-outline</v-icon>
                        salvar
                      </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- ***** FIM DA CALCULADORA ***** -->

        <!-- Dialog para Salvar nome do Custo -->
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
                Salvar
              </v-card-title>
              <v-card-text>
                <v-text-field
                  color="success"
                  name="nome"
                  label="Nome do custo"
                  id="nome"
                  v-model="nome"
                  type="text"
                  :rules="rules"
                  counter="100"
                  maxlength="100"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="warning"
                  text
                  @click="nome = ''; dialog = false"
                >Cancelar</v-btn>
                <v-btn
                  color="success"
                  text
                  @click="dialog = false; salvarCusto()"
                >Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <!-- Dialog para Copiar e Salvar Como... um Custo -->
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
                Copiar custo
              </v-card-title>
              <v-card-text>
                <v-text-field
                  color="success"
                  name="nome"
                  label="Nome do custo"
                  id="nome"
                  v-model="nome"
                  type="text"
                  :rules="rules"
                  counter="100"
                  maxlength="100"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="warning"
                  text
                  @click="nome = ''; dialog2 = false"
                >Cancelar</v-btn>
                <v-btn
                  color="success"
                  text
                  @click="dialog2 = false; copiarCusto()"
                >Salvar como...</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <!-- Dialog para alterar o nome de um Custo -->
        <template>
          <v-dialog
            v-model="dialog3"
            scrollable
            persistent
            :overlay="false"
            max-width="300px"
            transition="dialog-transition"
          >
            <v-card>
              <v-card-title primary-title>
                Alterar nome
              </v-card-title>
              <v-card-text>
                <v-text-field
                  color="success"
                  name="nome"
                  label="Nome do custo"
                  id="nome"
                  v-model="nome"
                  type="text"
                  :rules="rules"
                  counter="100"
                  maxlength="100"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="warning"
                  text
                  @click="nome = ''; dialog3 = false"
                >Cancelar</v-btn>
                <v-btn
                  color="success"
                  text
                  @click="dialog3 = false; editarNome()"
                >Alterar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <!-- Dialog para inserir/alterar RECEITAS -->
        <template>
          <v-dialog
            v-model="dialog4"
            scrollable
            persistent
            :overlay="false"
            max-width="440px"
            transition="dialog-transition"
          >
            <v-card>
              <v-card-title primary-title>
                <v-icon class="mr-2">mdi-cupcake</v-icon>
                {{ fazer }}{{ ' ' }} RECEITA
              </v-card-title>
              <v-card-text>

            <v-row class="justify-center">
              <v-col cols="12">
                <v-select
                  id="selreceita"
                  color="success"
                  :items="receitas"
                  item-value="id"
                  item-text="nome"
                  v-model="receita"
                  label="receita"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="6" class="px-2">
                <v-text-field
                  color="success"
                  name="rend"
                  label="Rendimento"
                  id="rend"
                  :value="select ? select.rendimento + ' ' + select.rendUnid : ''"
                  tile
                  disabled
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    color="success"
                    name="quant"
                    label="Quant"
                    id="quant"
                    type="number"
                    v-model="quant"
                    :suffix="select ? select.rendUnid : ''"
                    tile
                    required
                  ></v-text-field>
                </v-col>
            </v-row>

              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="warning"
                  text
                  @click="limparForm(); dialog4 = false"
                >Cancelar</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  text
                  @click="dialog4 = false; saveReceita()"
                >{{ fazer }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <!-- Dialog para inserir/alterar INSUMOS -->
        <template>
          <v-dialog
            v-model="dialog5"
            scrollable
            persistent
            :overlay="false"
            max-width="440px"
            transition="dialog-transition"
          >
            <v-card>
              <v-card-title primary-title>
                <v-icon class="mr-2">mdi-view-dashboard</v-icon>
                {{ fazer }}{{ ' ' }} INSUMO
              </v-card-title>
              <v-card-text>

            <v-row class="justify-center">
              <v-col cols="12">
                <v-select
                  id="selinsumo"
                  color="success"
                  :items="insumos"
                  item-value="id"
                  item-text="nome"
                  v-model="insumo"
                  label="insumo"
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="6" class="px-2">
                <v-text-field
                  color="success"
                  name="medida"
                  label="Medida"
                  id="medida"
                  :value="medida()"
                  tile
                  disabled
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    color="success"
                    name="quanti"
                    label="Quant"
                    id="quanti"
                    type="number"
                    v-model="quanti"
                    :suffix="selecti ? selecti.unidade : ''"
                    tile
                    required
                  ></v-text-field>
                </v-col>
            </v-row>

              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="warning"
                  text
                  @click="limparForm(); dialog5 = false"
                >Cancelar</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  text
                  @click="dialog5 = false; saveInsumo()"
                >{{ fazer }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

          <v-snackbar
            v-model="snackbar"
            :timeout="5000"
            color="grey lighten-2 red--text "
          >
            <v-icon color="red">mdi-alert-outline</v-icon>
            <h3>{{ message }}</h3>
          </v-snackbar>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { tipoArr } from '../../plugins/arredondar'

export default {
  data () {
    return {
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      fazer: '',
      nome: '',
      itemAlterar: [],
      btn: 'new',
      outros: false,
      outrosValor: '',
      outrosDescricao: '',
      items: [],
      item: '',
      receita: '',
      insumo: '',
      quant: '',
      quanti: '',
      margem: this.$store.getters.config.margem,
      snackbar: false,
      message: '',
      active: '',
      rules: [
        v => (v && v.length >= 3) || 'Min. 3 caracteres',
        v => (v && v.length <= 100) || 'Máx. 100 caracteres'
      ],
      margemSelect: [
        { margem: 2.0, text: '100%' },
        { margem: 2.5, text: '150%' },
        { margem: 3.0, text: '200%' },
        { margem: 3.5, text: '250%' },
        { margem: 4.0, text: '300%' },
        { margem: 4.5, text: '350%' },
        { margem: 5.0, text: '400%' }
      ],
      tipos: [
        { value: '0', text: 'nada' },
        { value: '1', text: 'centavos' },
        { value: '2', text: 'base 5,00' },
        { value: '3', text: 'base 5,00+' },
        { value: '4', text: 'base 10,00' },
        { value: '5', text: 'base 10,00+' }
      ],
      medidas: [
        { text: 'centímetro(s)', value: 'cm' },
        { text: 'grama(s)', value: 'g' },
        { text: 'quilo(s)', value: 'Kg' },
        { text: 'mililitro(s)', value: 'ml' },
        { text: 'litro(s)', value: 'Lt' },
        { text: 'unidade(s)', value: 'un' }
      ],
      arredondar: '',
      loading: false
    }
  },
  mounted () {
    if (this.id !== '0') {
      this.montar(this.custo)
    }
  },
  computed: {
    id () {
      return this.$store.getters.id
    },
    custo () {
      return this.$store.getters.custo(this.id)
    },
    titulo () {
      return this.id !== '0' ? this.custo.nome : 'CALCULAR PREÇO'
    },
    varr () {
      let outros = this.outrosValor > 0 ? parseFloat(this.outrosValor) : 0
      const receitas = this.totalReceitas > 0 ? parseFloat(this.totalReceitas) : 0
      outros += receitas
      return parseFloat(outros).toFixed(2)
    },
    total () {
      let total = ''
      if (this.varr && this.varr > 0 && this.arredondar) {
        const valor = tipoArr(this.arredondar, this.varr)
        total = parseFloat(valor).toFixed(2)
      }
      return total
    },
    totalReceitas () {
      let total = 0
      const recs = this.items
      if (recs.length > 0) {
        for (let i = 0; i < recs.length; i++) {
          const rec = recs[i]
          total += parseFloat(rec.valor)
        }
        total *= this.margem
        total = parseFloat(total).toFixed(2)
      }
      return total
    },
    disabled () {
      return !!(this.quant <= 0 || this.quant === '' || this.receita === '')
    },
    disabledi () {
      return !!(this.quanti <= 0 || this.quanti === '' || this.insumo === '')
    },
    select () {
      const receita = this.receitas.find((receita) => {
        return receita.id === this.receita
      })
      return receita
    },
    selecti () {
      const insumo = this.insumos.find((insumo) => {
        return insumo.id === this.insumo
      })
      return insumo
    },
    receitas () {
      return this.$store.getters.receitas
    },
    insumos () {
      return this.$store.getters.insumos
    },
    formIsValid () {
      if (this.items.length > 0 && this.total > 0) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    arredondar (a) {
      this.arredondar = a
    },
    receitas (value) {
      return value
    },
    insumos (value) {
      return value
    },
    active (item) {
      if (item === undefined) {
        this.limparForm()
      }
    }
  },
  methods: {
    medida () {
      const un = this.selecti ? this.selecti.unidade : ''
      const medida = this.medidas.filter((m) => {
        return m.value === un
      })
      return medida.length > 0 ? medida[0].text : ''
    },
    abrir () {
      this.$router.push('/custo')
    },
    fechar () {
      this.$store.dispatch('setSearch4', '')
      this.$store.dispatch('setId', '0')
      this.items = []
      this.outros = false
      this.outrosValor = ''
      this.outrosDescricao = ''
      this.arredondar = ''
      this.margem = this.$store.getters.config.margem
    },
    montar (custo) {
      for (let i = 0; i < custo.receitas.length; i++) {
        const item = custo.receitas[i]
        if (!item.tipo) {
          item.tipo = 'receita'
        }
        this.incluirItem(item)
      }
      this.arredondar = custo.arredondar
      this.outrosValor = custo.outros
      if (custo.outros > 0) {
        this.outros = true
      }
      this.outrosDescricao = custo.outrosDescricao
    },
    incluirItem (item) {
      let valorUnit = 0
      let select = []
      if (item.tipo === 'insumo') {
        select = this.insumos.find((insumo) => {
          return insumo.id === item.id
        })
        valorUnit = select.preco / select.tamanho
      } else {
        select = this.receitas.find((receita) => {
          return receita.id === item.id
        })
        valorUnit = select.total / select.rendimento
      }
      const valorTotal = parseFloat(item.quant * valorUnit).toFixed(2)
      const receita = {
        id: select.id,
        nome: select.nome,
        quant: item.quant,
        valor: valorTotal,
        tipo: item.tipo
      }
      this.items.push(receita)
    },
    setOutros () {
      this.outros = !this.outros
      if (!this.outros) {
        this.outrosDescricao = ''
        this.outrosValor = ''
      }
    },
    alterar (item) {
      this.fazer = 'Alterar'
      this.btn = 'upd'
      if (item.tipo === 'receita') {
        this.alterarReceita(item)
      } else {
        this.alterarInsumo(item)
      }
    },
    alterarReceita (item) {
      this.dialog4 = true
      this.itemAlterar = item
      this.quant = item.quant
      this.receita = item.id
    },
    alterarInsumo (item) {
      this.dialog5 = true
      this.itemAlterar = item
      this.quanti = item.quant
      this.insumo = item.id
    },
    detectaDuplicidade (tipo) {
      let duplo = false
      const select = tipo === 'r' ? this.select : this.selecti
      const check = this.items.find((item) => {
        return item.id === select.id
      })
      if (this.btn === 'new' && check !== undefined) {
        duplo = true
      }
      if (this.btn === 'upd' && check !== undefined && select.id !== this.itemAlterar.id) {
        duplo = true
      }
      if (duplo) {
        this.message = check.nome + ' já está na lista.'
        this.snackbar = true
        this.receita = ''
        this.quant = ''
        this.insumo = ''
        this.quanti = ''
      }
      return duplo
    },
    excluir (item) {
      const id = item.id
      const antiga = this.items
      const novaLista = antiga.filter(item => item.id !== id)
      this.items = novaLista
      this.ordenaItems()
      this.limparForm()
    },
    saveReceita () {
      if (this.detectaDuplicidade('r')) {
        return
      }
      // preço calculado pelo valor unitário da receita, considerando o rendimento
      const valorUnit = this.select.total / this.select.rendimento
      const valorTotal = parseFloat(this.quant * valorUnit).toFixed(2)
      const receita = {
        id: this.select.id,
        nome: this.select.nome,
        quant: this.quant,
        valor: valorTotal,
        tipo: 'receita'
      }
      if (this.btn === 'new') {
        this.items.push(receita)
      } else {
        const index = this.items.indexOf(this.itemAlterar)
        this.items.splice(index, 1, receita)
        this.active = undefined
      }
      this.ordenaItems()
      this.limparForm()
    },
    saveInsumo () {
      if (this.detectaDuplicidade('i')) {
        return
      }
      // verifica o valor de cada unidade de medida
      const valorUnit = this.selecti.preco / this.selecti.tamanho
      const valorTotal = parseFloat(this.quanti * valorUnit).toFixed(2)
      const insumo = {
        id: this.selecti.id,
        nome: this.selecti.nome,
        quant: this.quanti,
        valor: valorTotal,
        tipo: 'insumo'
      }
      if (this.btn === 'new') {
        this.items.push(insumo)
      } else {
        const index = this.items.indexOf(this.itemAlterar)
        this.items.splice(index, 1, insumo)
        this.active = undefined
      }
      this.ordenaItems()
      this.limparForm()
    },
    limparForm () {
      this.active = ''
      this.quant = ''
      this.receita = ''
      this.quanti = ''
      this.insumo = ''
      this.btn = 'new'
      this.fazer = 'Inserir'
      this.itemAlterar = []
    },
    ordenaItems () {
      this.items.sort((a, b) => {
        if (a.nome > b.nome) {
          return 1
        }
        if (a.nome < b.nome) {
          return -1
        }
        return 0
      })
    },
    horaAtual () {
      const time = new Date()
      let H = time.getHours().toString()
      if (H.length === 1) { H = '0' + H }
      let M = time.getMinutes().toString()
      if (M.length === 1) { M = '0' + M }
      return H + ':' + M
    },
    copiarCusto () {
      const custo = {
        nome: this.nome,
        receitas: this.items,
        margem: this.margem,
        outros: this.outrosValor,
        outrosDescricao: this.outrosDescricao,
        arredondar: this.arredondar,
        total: this.total,
        modificado: new Date().toISOString().substr(0, 10) + ' ' + this.horaAtual()
      }
      this.$store.dispatch('createcusto', custo)
      this.nome = ''
    },
    salvarCusto () {
      const custo = {
        nome: this.nome,
        receitas: this.items,
        margem: this.margem,
        outros: this.outrosValor,
        outrosDescricao: this.outrosDescricao,
        arredondar: this.arredondar,
        total: this.total,
        modificado: new Date().toISOString().substr(0, 10) + ' ' + this.horaAtual()
      }
      if (this.id === '0') {
        this.$store.dispatch('createcusto', custo)
        this.nome = ''
      } else {
        custo.id = this.id
        this.$store.dispatch('updatecusto', custo)
      }
    },
    editarNome () {
      if (this.id === '0') {
        return
      }
      const custo = {
        id: this.id,
        nome: this.nome,
        modificado: new Date().toISOString().substr(0, 10) + ' ' + this.horaAtual()
      }
      this.$store.dispatch('updatecusto', custo)
    }
  }
}
</script>
