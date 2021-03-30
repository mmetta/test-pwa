import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    // dark: true,
    themes: {
      light: {
        primary: colors.pink.darken1,
        success: colors.teal.darken1,
        secondary: colors.grey.lighten2,
        accent: colors.pink.lighten2,
        error: colors.red.darken4
      }
    }
  }
})
