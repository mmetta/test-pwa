<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="8">
        <v-data-table
          :headers="colunas()"
          :items="linha"
          hide-default-footer
          class="elevation-1"
          loading="true"
        >

        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-btn color="success" @click="gerar()">Gerar PDF</v-btn>
    </v-row>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf'

export default {
  mounted () {
    this.linha = this.generateData(this.linhas)
  },
  data () {
    return {
      keys: [
        'id',
        'QUANT',
        'ITENS',
        'UNIT',
        'SUBTOTAL'
      ],
      headers: [
        {
          id: 'id',
          name: 'id',
          prompt: 'id',
          width: 20,
          align: 'center',
          padding: 0
        },
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
      ],
      linhas: [
        {
          QUANT: (2).toString(),
          ITENS: 'Bolo 20 cm com 2 recheios com texto bem grande para ver como fica.',
          UNIT: (142.00).toString(),
          SUBTOTAL: (284.00).toString()
        },
        {
          QUANT: (100).toString(),
          ITENS: 'Brigadeiros tradicionais mais com texto bem grande para ver como fica.',
          UNIT: (2.00).toString(),
          SUBTOTAL: (200.00).toString()
        },
        {
          QUANT: ('10.000').toString(),
          ITENS: 'Creme Brullet com texto bem grande para ver como fica.',
          UNIT: parseFloat(2.80).toFixed(2).toString(),
          SUBTOTAL: parseFloat(280.00).toFixed(2).toString()
        }
      ],
      linha: [],
      posX: 25
    }
  },
  methods: {
    colunas () {
      const colunas = []
      for (let i = 0; i < this.headers.length; i++) {
        const item = this.headers[i]
        const col = {
          text: item.name,
          align: 'start',
          sortable: false,
          value: item.prompt
        }
        colunas.push(col)
      }
      return colunas
    },
    decimal (n) {
      return parseFloat(n).toFixed(2)
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
        console.log(this.posX, atual, mult)
        data.id = (i + 1).toString()
        result.push(Object.assign({}, data))
      }
      return result
    },
    createHeaders (keys) {
      var result = []
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          // width: 65,
          align: 'center',
          padding: 0
        })
      }
      return result
    },
    gerar () {
      // autoSize: true
      // eslint-disable-next-line new-cap
      const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: 'landscape' })
      doc.table(1, 1, this.linha, this.headers, {})
      console.log(this.posX)
      doc.text('Texto Para ver onde vai aparecer', 10, this.posX)
      doc.save('teste.pdf')
    }
  }
}
</script>
