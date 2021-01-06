<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Instale o App
        </v-card-title>
        <v-card-text>

          <v-row class="my-2">
            <strong>Clique no botão</strong>
            <img src="../../assets/Navigation_Action.png" alt="Action" class="mx-2">
          </v-row>
          <v-row class="my-2">
            Escolha a opção:
          </v-row>
          <v-row class="my-2">
            <img src="../../assets/Navigation_Add.png" width="15px" height="15px" alt="Add" class="mx-2">
            <strong>Adicionar à tela inicial</strong>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Entendi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      dialog: true
    }
  }
}
</script>
