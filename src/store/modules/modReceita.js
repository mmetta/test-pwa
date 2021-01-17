import Store from './modLogin'
import firebase from 'firebase/app'
import 'firebase/database'

const state = {
  receitas: [],
  searchReceitas: [],
  search1: '',
  receitasAlteradas: [],
  logged: 'Conectado'
}

const getters = {
  receitas (state) {
    return state.receitas
  },
  receita (state) {
    return (receitaId) => {
      return state.receitas.find((receita) => {
        return receita.id === receitaId
      })
    }
  },
  searchReceitas (state) {
    return state.searchReceitas
  },
  search1 (state) {
    return state.search1
  },
  receitasAlteradas () {
    return state.receitasAlteradas
  }
}

const actions = {
  loadReceitas ({ commit }) {
    if (Store.state.user) {
      const uid = Store.state.user.id
      firebase.database().ref(uid + '/receitas')
        .on('value', snapshot => {
          const receitas = []
          const obj = snapshot.val()
          for (const key in obj) {
            receitas.push({
              id: key,
              nome: obj[key].nome,
              rendUnid: obj[key].rendUnid,
              rendimento: obj[key].rendimento,
              ingredientes: obj[key].ingredientes,
              total: obj[key].total
            })
          }
          commit('setLoadedReceitas', receitas)
        })
    }
  },
  createReceita ({ commit }, payload) {
    const receita = {
      nome: payload.nome,
      rendUnid: payload.rendUnid,
      rendimento: payload.rendimento,
      ingredientes: payload.ingredientes,
      total: payload.total
    }
    const uid = Store.state.user.id
    let key
    let text = ''
    const name = 'receita'
    firebase.database().ref(uid + '/receitas').push(receita)
      .then((data) => {
        key = data.key
        return key
      })
      .then(key => {
        text = 'Receita incluída com sucesso'
        commit('setMessage', { name, text, key })
      })
      .catch((error) => {
        console.log(error)
        text = 'Falha ao incluir receita'
        commit('setMessage', { name, text, key: null })
      })
  },
  updateReceita ({ commit }, payload) {
    const updateObj = {}
    let text = ''
    const name = 'receita'
    if (payload.nome) {
      updateObj.nome = payload.nome
    }
    if (payload.rendimento) {
      updateObj.rendimento = payload.rendimento
    }
    if (payload.rendUnid) {
      updateObj.rendUnid = payload.rendUnid
    }
    if (payload.ingredientes) {
      updateObj.ingredientes = payload.ingredientes
    }
    if (payload.total) {
      updateObj.total = payload.total
    }
    const uid = Store.state.user.id
    firebase.database().ref(uid + '/receitas').child(payload.id).update(updateObj)
      .then(() => {
        commit('updateReceita', payload)
        text = 'Receita alterada com sucesso'
        commit('setMessage', { name, text, key: payload.id })
      })
      .catch(error => {
        console.log(error)
        text = 'Falha ao alterar receita'
        commit('setMessage', { name, text, key: null })
      })
  },
  updateReceitaCusto ({ commit }, payload) {
    const receitas = state.receitas
    const insumo = payload
    const alter = receitas.filter(receita => {
      return receita.ingredientes.find(ingrediente => {
        return ingrediente.id === insumo.id
      })
    })
    for (let i = 0; i < alter.length; i++) {
      const receita = alter[i]
      const item = receita.ingredientes.find(ingrediente => {
        return ingrediente.id === insumo.id
      })
      // Calculo de novo custo
      let q = item.quant
      const p = insumo.preco
      const t = insumo.tamanho
      const u = insumo.unidade
      if (u === 'Lt' || u === 'Kg') {
        q = q / 1000
      }
      const valor = (p / t) * q
      // Fim do calculo de novo custo
      item.valor = parseFloat(valor).toFixed(2)
      // Cálculo de novo total
      let soma = 0
      soma = [].reduce.call(receita.ingredientes, (somatorio, el) => {
        return somatorio + parseFloat(el.valor, 10) || 0
      }, 0)
      // Custo de processamento (padrão 30%)
      const proc = Store.state.config.processamento
      soma = soma * proc
      receita.total = parseFloat(soma).toFixed(2)
      // Fim do cálculo de novo total
      // commit('updateReceitaCusto', receita)
      const uid = Store.state.user.id
      firebase.database().ref(uid + '/receitas').child(receita.id).update(receita)
        .then(() => {
          commit('updateReceita', receita)
        })
        .catch(error => {
          console.log(error)
        })
    }
    commit('setReceitasAlteradas', alter)
  },
  updateReceitaDeleteInsumo ({ commit }, payload) {
    const receitas = state.receitas
    const insumo = payload
    const alter = receitas.filter(receita => {
      return receita.ingredientes.find(ingrediente => {
        return ingrediente.id === insumo
      })
    })
    for (let i = 0; i < alter.length; i++) {
      const receita = alter[i]
      const nova = receita.ingredientes.filter(ingrediente => ingrediente.id !== insumo)
      console.log(nova)
      receita.ingredientes = nova
      let soma = 0
      soma = [].reduce.call(receita.ingredientes, (somatorio, el) => {
        return somatorio + parseFloat(el.valor, 10) || 0
      }, 0)
      // Custo de processamento (padrão 30%)
      const proc = Store.state.config.processamento
      soma = soma * proc
      receita.total = parseFloat(soma).toFixed(2)
      // Fim do cálculo de novo total
      // commit('updateReceitaCusto', receita)
      const uid = Store.state.user.id
      firebase.database().ref(uid + '/receitas').child(receita.id).update(receita)
        .then(() => {
          commit('updateReceita', receita)
        })
        .catch(error => {
          console.log(error)
        })
    }
    commit('setReceitasAlteradas', alter)
  },
  deleteReceita ({ commit }, id) {
    let text = ''
    const name = 'receita'
    const uid = Store.state.user.id
    firebase.database().ref(uid + '/receitas').child(id).remove(err => {
      if (err) {
        console.log(err)
        text = 'Falha ao excluir receita'
        commit('setMessage', { name, text, key: null })
      } else {
        text = 'Receita excluída com sucesso'
        commit('setMessage', { name, text, key: id })
        // commit('deleteReceita', id)
      }
    })
  },
  setSearch1 ({ commit }, value) {
    commit('setSearch1', value)
    commit('searchReceitas', value)
  }
}

const mutations = {
  setLoadedReceitas (state, payload) {
    const list = payload.sort((a, b) => {
      a = a.nome
      b = b.nome
      a = a.replace(/[AÀÁÂÃÄÅ]/, 'A')
      a = a.replace(/[aàáâãäå]/, 'a')
      a = a.replace(/[EÈÉÊË]/, 'E')
      a = a.replace(/[eéèêë]/, 'e')
      a = a.replace(/[ií]/, 'i')
      a = a.replace(/[IÍ]/, 'I')
      a = a.replace(/[OÓÔÕ]/, 'O')
      a = a.replace(/[oóôõ]/, 'o')
      a = a.replace(/[CÇ]/, 'C')
      a = a.replace(/[cç]/, 'c')
      a = a.replace(/[UÚ]/, 'U')
      a = a.replace(/[uú]/, 'u')
      b = b.replace(/[AÀÁÂÃÄÅ]/, 'A')
      b = b.replace(/[aàáâãäå]/, 'a')
      b = b.replace(/[EÈÉÊË]/, 'E')
      b = b.replace(/[eéèêë]/, 'e')
      b = b.replace(/[ií]/, 'i')
      b = b.replace(/[IÍ]/, 'I')
      b = b.replace(/[OÓÔÕ]/, 'O')
      b = b.replace(/[oóôõ]/, 'o')
      b = b.replace(/[CÇ]/, 'C')
      b = b.replace(/[cç]/, 'c')
      b = b.replace(/[UÚ]/, 'U')
      b = b.replace(/[uú]/, 'u')
      a.replace(/[^a-z0-9]/gi, '')
      b.replace(/[^a-z0-9]/gi, '')
      if (a > b) {
        return 1
      }
      if (a < b) {
        return -1
      }
      return 0
    })
    state.receitas = list
  },
  updateReceita (state, payload) {
    const receita = state.receitas.find(receita => {
      return receita.id === payload.id
    })
    if (payload.nome) {
      receita.nome = payload.nome
    }
    if (payload.rendimento) {
      receita.rendimento = payload.rendimento
    }
    if (payload.rendUnid) {
      receita.rendUnid = payload.rendUnid
    }
    if (payload.ingredientes) {
      receita.ingredientes = payload.ingredientes
    }
    if (payload.total) {
      receita.total = payload.total
    }
  },
  // updateReceitaCusto (state, payload) {
  //   console.log(payload)
  // },
  setReceitasAlteradas (state, payload) {
    state.receitasAlteradas = payload
  },
  deleteReceita (state, id) {
    const receitas = state.searchReceitas.filter(receita => receita.id !== id)
    state.receitas = receitas
    state.searchReceitas = receitas
  },
  setSearch1 (state, value) {
    state.search1 = value
  },
  searchReceitas (state, item) {
    let res = []
    if (item === '' || item === undefined || item === null) {
      res = state.receitas
    } else {
      state.receitas.filter(e => {
        if (e.nome.toUpperCase().indexOf(item.toUpperCase()) !== -1) {
          res.push(e)
        }
      })
    }
    state.searchReceitas = res
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
