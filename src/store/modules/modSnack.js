const state = {
  snack: []
}

const getters = {
  snack (state) {
    return state.snack
  }
}

const actions = {
  setSnack ({ commit }, payload) {
    commit('setSnack', payload)
  }
}

const mutations = {
  setSnack (state, payload) {
    state.snack = payload
  },
  setMessage (state, payload) {
    let icon = ''
    switch (payload.name) {
      case 'insumo': icon = 'mdi mdi-view-dashboard'
        break
      case 'receita': icon = 'mdi mdi-cupcake'
        break
      case 'orcamento': icon = 'mdi mdi-clipboard-list-outline'
        break
      default: icon = 'mdi mdi-info'
        break
    }
    if (payload.key) {
      this._vm.$toast.success(payload.text, {
        position: 'top-center',
        icon,
        timeout: 2000
      })
    } else {
      this._vm.$toast.error(payload.text, {
        position: 'bottom-center',
        icon,
        timeout: 2000
      })
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
