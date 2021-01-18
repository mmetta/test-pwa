import Store from './modLogin'
import firebase from 'firebase/app'
import 'firebase/database'
import { ordenarPtBr } from '../../plugins/Ordenar-ptbr'

const state = {
  insumos: [],
  importInsumos: [],
  searchInsumos: [],
  search: '',
  logged: 'Conectado'
}

const getters = {
  insumos (state) {
    return state.insumos
  },
  importInsumos (state) {
    return state.importInsumos
  },
  insumo (state) {
    return (insumoId) => {
      return state.insumos.find((insumo) => {
        return insumo.id === insumoId
      })
    }
  },
  searchInsumos (state) {
    return state.searchInsumos
  },
  search (state) {
    return state.search
  }
}

const actions = {
  loadInsumos ({ commit }) {
    if (Store.state.user) {
      const uid = Store.state.user.id
      firebase.database().ref(uid + '/insumos')
        .on('value', snapshot => {
          const insumos = []
          const obj = snapshot.val()
          for (const key in obj) {
            insumos.push({
              id: key,
              nome: obj[key].nome,
              tamanho: obj[key].tamanho,
              unidade: obj[key].unidade,
              preco: obj[key].preco
            })
          }
          commit('setLoadedinsumos', insumos)
        })
    }
  },
  loadImportInsumos ({ commit }) {
    if (Store.state.user) {
      firebase.database().ref('/insumos').once('value')
        .then((data) => {
          const insumos = []
          const obj = data.val()
          for (const key in obj) {
            insumos.push({
              id: key,
              check: obj[key].check,
              nome: obj[key].nome,
              tamanho: obj[key].tamanho,
              unidade: obj[key].unidade,
              preco: obj[key].preco
            })
          }
          commit('setLoadedImportInsumos', insumos)
        })
        .catch(
          (error) => {
            console.log(error)
          }
        )
    }
  },
  createInsumo ({ commit }, payload) {
    const insumo = {
      nome: payload.nome,
      tamanho: payload.tamanho,
      unidade: payload.unidade,
      preco: payload.preco
    }
    const uid = Store.state.user.id
    let key
    let text = ''
    const name = 'insumo'
    const importado = payload.imported
    firebase.database().ref(uid + '/insumos').push(insumo)
      .then((data) => {
        key = data.key
        return key
      })
      .then(key => {
        if (importado !== 'ok') {
          text = 'Insumo incluído com sucesso'
          commit('setMessage', { name, text, key })
        }
      })
      .catch((error) => {
        console.log(error)
        if (importado !== 'ok') {
          text = 'Falha ao incluir insumo'
          commit('setMessage', { name, text, key: null })
        }
      })
  },
  updateInsumo ({ commit }, payload) {
    const updateObj = {}
    let text = ''
    const name = 'insumo'
    if (payload.nome) {
      updateObj.nome = payload.nome
    }
    if (payload.tamanho) {
      updateObj.tamanho = payload.tamanho
    }
    if (payload.unidade) {
      updateObj.unidade = payload.unidade
    }
    if (payload.preco) {
      updateObj.preco = payload.preco
    }
    const uid = Store.state.user.id
    firebase.database().ref(uid + '/insumos').child(payload.id).update(updateObj)
      .then(() => {
        commit('updateInsumo', payload)
        text = 'Insumo alterado com sucesso'
        commit('setMessage', { name, text, key: payload.id })
      })
      .catch(error => {
        console.log(error)
        text = 'Falha ao alterar insumo'
        commit('setMessage', { name, text, key: null })
      })
  },
  deleteInsumo ({ commit }, id) {
    const uid = Store.state.user.id
    let text = ''
    const name = 'insumo'
    firebase.database().ref(uid + '/insumos').child(id).remove(err => {
      if (err) {
        console.log(err)
        text = 'Falha ao excluir insumo'
        commit('setMessage', { name, text, key: null })
      } else {
        text = 'Insumo excluído com sucesso'
        commit('setMessage', { name, text, key: id })
        // commit('deleteReceita', id)
      }
    })
  },
  setSearch ({ commit }, value) {
    commit('setSearch', value)
    commit('searchInsumos', value)
  }
}

const mutations = {
  setLoadedinsumos (state, payload) {
    state.insumos = ordenarPtBr(payload, 'nome')
  },
  setLoadedImportInsumos (state, payload) {
    state.importInsumos = ordenarPtBr(payload, 'nome')
  },
  createInsumo (state, payload) {
    // state.insumos.push(payload)
  },
  updateInsumo (state, payload) {
    const insumo = state.insumos.find(insumo => {
      return insumo.id === payload.id
    })
    if (payload.nome) {
      insumo.nome = payload.nome
    }
    if (payload.tamanho) {
      insumo.tamanho = payload.tamanho
    }
    if (payload.unidade) {
      insumo.unidade = payload.unidade
    }
    if (payload.preco) {
      insumo.preco = payload.preco
    }
  },
  deleteInsumo (state, id) {
    const insumos = state.searchInsumos.filter(insumo => insumo.id !== id)
    state.insumos = insumos
    state.searchInsumos = insumos
  },
  setSearch (state, value) {
    state.search = value
  },
  searchInsumos (state, item) {
    let res = []
    if (item === '' || item === undefined || item === null) {
      res = state.insumos
    } else {
      state.insumos.filter(e => {
        if (e.nome.toUpperCase().indexOf(item.toUpperCase()) !== -1) {
          res.push(e)
        }
      })
    }
    state.searchInsumos = res
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
