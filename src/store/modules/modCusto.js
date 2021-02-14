import Store from './modLogin'
import firebase from 'firebase/app'
import 'firebase/database'
import { ordenarPtBr } from '../../plugins/Ordenar-ptbr'

const state = {
  custos: [],
  custo: {},
  searchcustos: [],
  search4: '',
  id: '0',
  dialogListaCustos: false,
  soma: '',
  resumo: []
}

const getters = {
  id (state) {
    return state.id
  },
  custos (state) {
    return state.custos
  },
  custo (state) {
    return (custoId) => {
      return state.custos.find((custo) => {
        return custo.id === custoId
      })
    }
  },
  searchcustos (state) {
    return state.searchcustos
  },
  search4 (state) {
    return state.search4
  },
  dialogListaCustos (state) {
    return state.dialogListaCustos
  },
  soma (state) {
    return state.soma
  },
  resumo (state) {
    return state.resumo
  }
}

const actions = {
  setId ({ commit }, id) {
    commit('setId', id)
  },
  setSortDate ({ commit }, order) {
    if (order === 'date') {
      commit('setSortDate')
    } else {
      commit('setSortNome')
    }
  },
  loadcustos ({ commit }) {
    if (Store.state.user) {
      const uid = Store.state.user.id
      firebase.database().ref(uid + '/custos')
        .on('value', snapshot => {
          const custos = []
          const obj = snapshot.val()
          for (const key in obj) {
            custos.push({
              id: key,
              nome: obj[key].nome,
              receitas: obj[key].receitas,
              margem: obj[key].margem,
              outros: obj[key].outros,
              outrosDescricao: obj[key].outrosDescricao,
              arredondar: obj[key].arredondar,
              total: obj[key].total,
              modificado: obj[key].modificado
            })
          }
          commit('setLoadedcustos', custos)
        })
    }
  },
  createcusto ({ commit }, payload) {
    const custo = {
      nome: payload.nome,
      receitas: payload.receitas,
      margem: payload.margem,
      outros: payload.outros,
      outrosDescricao: payload.outrosDescricao,
      arredondar: payload.arredondar,
      total: payload.total,
      modificado: payload.modificado
    }
    const uid = Store.state.user.id
    let key
    let text = ''
    const name = 'custo'
    firebase.database().ref(uid + '/custos').push(custo)
      .then((data) => {
        key = data.key
        return key
      })
      .then(key => {
        commit('createcusto', key)
        text = 'Custo incluído com sucesso'
        commit('setMessage', { name, text, key })
      })
      .catch((error) => {
        console.log(error)
        text = 'Falha ao incluir custo'
        commit('setMessage', { name, text, key: null })
      })
  },
  updatecusto ({ commit }, payload) {
    const updateObj = {}
    let text = ''
    const name = 'custo'

    if (payload.nome) {
      updateObj.nome = payload.nome
    }
    if (payload.receitas) {
      updateObj.receitas = payload.receitas
    }
    if (payload.margem) {
      updateObj.margem = payload.margem
    }
    if (payload.outros) {
      updateObj.outros = payload.outros
    }
    if (payload.outrosDescricao) {
      updateObj.outrosDescricao = payload.outrosDescricao
    }
    if (payload.arredondar) {
      updateObj.arredondar = payload.arredondar
    }
    if (payload.total) {
      updateObj.total = payload.total
    }
    if (payload.modificado) {
      updateObj.modificado = payload.modificado
    }
    const uid = Store.state.user.id
    firebase.database().ref(uid + '/custos').child(payload.id).update(updateObj)
      .then(() => {
        commit('updatecusto', payload)
        text = 'Custo alterado com sucesso'
        commit('setMessage', { name, text, key: payload.id })
      })
      .catch(error => {
        console.log(error)
        text = 'Falha ao alterar custo'
        commit('setMessage', { name, text, key: null })
      })
  },
  deletecusto ({ commit }, id) {
    const uid = Store.state.user.id
    let text = ''
    const name = 'custo'
    firebase.database().ref(uid + '/custos').child(id).remove(err => {
      if (err) {
        console.log(err)
        text = 'Falha ao excluir custo'
        commit('setMessage', { name, text, key: null })
      } else {
        text = 'custo excluído com sucesso'
        commit('setMessage', { name, text, key: id })
      }
    })
  },
  setSearch4 ({ commit }, value) {
    commit('setSearch4', value)
    commit('searchcustos', value)
  },
  setDialogListaCustos ({ commit }, value) {
    commit('setDialogListaCustos', value)
  },
  transpSoma ({ commit }, soma) {
    commit('transpSoma', soma)
  },
  transpResumo ({ commit }, resumo) {
    commit('transpResumo', resumo)
  }
}

const mutations = {
  setId (state, id) {
    state.id = id
  },
  setSortNome (state) {
    const payload = state.custos
    state.custos = ordenarPtBr(payload, 'nome')
  },
  setSortDate (state) {
    const payload = state.custos
    const list = payload.sort((a, b) => {
      a = a.modificado
      b = b.modificado
      if (a < b) {
        return 1
      }
      if (a > b) {
        return -1
      }
      return 0
    })
    state.custos = list
  },
  setLoadedcustos (state, payload) {
    state.custos = ordenarPtBr(payload, 'nome')
  },
  createcusto (state, id) {
    state.id = id
  },
  updatecusto (state, payload) {
    const custo = state.custos.find(custo => {
      return custo.id === payload.id
    })
    if (payload.nome) {
      custo.nome = payload.nome
    }
    if (payload.receitas) {
      custo.receitas = payload.receitas
    }
    if (payload.margem) {
      custo.margem = payload.margem
    }
    if (payload.outros) {
      custo.outros = payload.outros
    }
    if (payload.outrosDescricao) {
      custo.outrosDescricao = payload.outrosDescricao
    }
    if (payload.arredondar) {
      custo.arredondar = payload.arredondar
    }
    if (payload.total) {
      custo.total = payload.total
    }
    if (payload.modificado) {
      custo.modificado = payload.modificado
    }
  },
  deletecusto (state, id) {
    const custos = state.custos.filter(custo => custo.id !== id)
    state.custos = custos
    state.searchcustos = custos
  },
  setSearch4 (state, value) {
    state.search4 = value
  },
  searchcustos (state, item) {
    let res = []
    if (item === '' || item === undefined || item === null) {
      res = state.custos
    } else {
      state.custos.filter(e => {
        if (e.nome.toUpperCase().indexOf(item.toUpperCase()) !== -1) {
          res.push(e)
        }
      })
    }
    state.searchcustos = res
  },
  setDialogListaCustos (state, value) {
    state.dialogListaCustos = value
  },
  transpSoma (state, soma) {
    state.soma = soma
  },
  transpResumo (state, resumo) {
    state.resumo = resumo
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
