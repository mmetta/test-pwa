<template>

    <v-snackbar
      color="success"
      v-model="snackbar"
      :timeout="8000"
    >
      Lista básica de insumos.
      <template>
        <v-btn
          color="secondary"
          class="success"
          text
          link
          router
          :disabled="btn"
          @click="btn = true"
          to="/importInsumos"
        >
          <v-icon class="mr-2">mdi-download-outline</v-icon>
          BAIXAR
        </v-btn>
      </template>
    </v-snackbar>

</template>

<script>
export default {
  data () {
    return {
      snackbar: true,
      btn: false
    }
  }
}
</script>
