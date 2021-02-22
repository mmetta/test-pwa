<template>
    <v-dialog
      v-model="dialogPhoto"
      persistent
      :overlay="false"
      max-width="380px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Sua Imagem
        </v-card-title>
        <v-card-subtitle>
          Permitido até 600 x 600 px
        </v-card-subtitle>
        <form>
          <v-card-text>
        <v-row class="justify-center">
          <v-avatar
            class="mb-3"
            size="100"
            color="grey"
          >
            <template v-if="photo">
              <img :src="photo" title="Foto do perfil" id="photo">
            </template>
            <template v-else>
              <v-icon x-large class="white--text">mdi-account</v-icon>
            </template>
          </v-avatar>
        </v-row>

            <v-row class="justify-center">
              {{ arquivo ? arquivo.name : 'Nenhuma foto selecionada' }}
            </v-row>

              <input
                ref="fileInput"
                type="file"
                @change="onFilePicked"
                class="d-none"
                accept="image/*"
              >

            <v-row>
              <v-btn
                @click="openFileDialog"
                class="mx-auto"
                text
                :loading="disabled"
                :disabled="disabled"
              >
                Escolher nova foto
              </v-btn>
            </v-row>

          </v-card-text>
        </form>
        <v-card-actions>
          <v-btn
            color="warning"
            text
            @click="cancelarPhoto()"
            :disabled="salvando"
          >Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="salvarPhoto()"
            :disabled="salvando"
            :loading="salvando"
          >Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>

export default {
  name: 'SetPhotoURL',
  computed: {
    dialogPhoto () {
      return this.$store.getters.dialogPhoto
    },
    user () {
      return this.$store.getters.user
    },
    config () {
      return this.$store.getters.config
    },
    fileName () {
      if (this.arquivo) {
        const split = this.arquivo.name.split('.')
        return `photoUser.${split[1]}`
      } else {
        return ''
      }
    }
  },
  watch: {
    user () {
      this.user = this.$store.getters.user
    }
  },
  data () {
    return {
      photo: this.$store.getters.config.photo,
      image: null,
      arquivo: null,
      disabled: false,
      salvando: false
    }
  },
  methods: {
    cancelarPhoto () {
      this.arquivo = null
      this.photo = this.config ? this.config.photo : ''
      this.$store.dispatch('setDialogPhoto', false)
    },
    onFilePicked (event) {
      const files = event.target.files
      const fileName = files[0].name
      if (fileName.lastIndexOf('.') <= 0) {
        alert(fileName + ' não é válida')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.photo = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.arquivo = files[0]
    },
    openFileDialog () {
      this.disabled = true
      // this.$refs.input.value = null
      this.$refs.fileInput.click()
      setTimeout(() => {
        this.disabled = false
      }, 5000)
    },
    salvarPhoto () {
      if (!this.fileName) {
        return
      }
      const h = document.getElementById('photo').naturalHeight
      const w = document.getElementById('photo').naturalWidth
      if (parseInt(h) > 600 || parseInt(w) > 600) {
        this.$toast.error('Imagem: ' + w + ' x ' + h + ', excede tamanho máximo.', {
          position: 'bottom-center',
          icon: 'mdi mdi-clipboard-list-outline',
          timeout: 5000
        })
      } else {
        this.salvando = true
        const nova = {
          fileName: this.fileName,
          photo: this.arquivo
        }
        // this.$store.dispatch('setDataURL', this.photo)
        this.$store.dispatch('setPhoto', nova)
        setTimeout(() => {
          this.cancelarPhoto()
        }, 4000)
      }
    }
  }
}
</script>
