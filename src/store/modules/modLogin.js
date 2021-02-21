import Snack from './modSnack'
import firebase from 'firebase/app'
import 'firebase/auth'

const state = {
  snack: Snack.state,
  user: null,
  iniciado: false,
  error: null,
  loading: false,
  register: false,
  subscribe: false,
  appInstalled: false,
  config: [],
  logged: 'Conectado',
  online: window.navigator.onLine,
  dialogPhoto: false,
  token: null
}

const getters = {
  isLogged: state => state.logged,
  user (state) {
    return state.user
  },
  iniciado (state) {
    return state.iniciado
  },
  loading (state) {
    return state.loading
  },
  register (state) {
    return state.register
  },
  subscribe (state) {
    return state.subscribe
  },
  appInstalled (state) {
    return state.appInstalled
  },
  config (state) {
    return state.config
  },
  error (state) {
    return state.error
  },
  online (state) {
    return state.online
  },
  dialogPhoto (state) {
    return state.dialogPhoto
  },
  token (state) {
    return state.token
  }
}

const actions = {
  auth ({ commit }, usuario) {
    console.log(usuario)
    commit('setUser', usuario)
  },
  setIniciado ({ commit }, payload) {
    commit('setIniciado', payload)
  },
  stateChanged ({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      console.log('change: ' + user)
      const newUser = {
        id: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
        providerId: user.providerData[0].providerId,
        emailVerified: user.emailVerified
      }
      commit('setUser', newUser)
    })
  },
  autoSignIn ({ commit }, user) {
    const newUser = {
      id: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      providerId: user.providerData[0].providerId,
      emailVerified: user.emailVerified
    }
    commit('setUser', newUser)
  },
  signUserUp ({ commit }, payload) {
    commit('clearError')
    commit('setLoading', true)
    let color = 'success'
    let message
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(() => {
        message = 'Usuário criado com sucesso'
      })
      .catch(
        error => {
          commit('setLoading', false)
          const err = error.code
          color = 'error'
          message = err
          if (err === 'auth/email-already-in-use') {
            message = 'Este usuário já está cadastrado.'
          }
          if (err === 'auth/network-request-failed') {
            message = 'Falha ao conectar, verifique sua internet.'
          }
        }
      )
    const snack = {
      snackbar: true,
      color: color,
      timeout: 6000,
      message: message
    }
    commit('snack', snack)
  },
  checarEmail ({ commit }) {
    commit('clearError')
    commit('setLoading', true)
    const user = firebase.auth().currentUser
    let message = 'Email de confirmação enviado para ' + user.email
    let color = 'success'
    user.sendEmailVerification().then(() => {
      console.log(message)
    }).catch((error) => {
      console.log(error)
      message = 'Email de confirmação falhou'
      color = 'error'
    })
    const snack = {
      snackbar: true,
      color: color,
      timeout: 10000,
      message: message
    }
    commit('snack', snack)
  },
  checkSubscription ({ commit }) {
    // Verifica se tem token registrado no navegador atual
    const messaging = window.firebaseMessaging
    messaging.getToken().then((token) => {
      commit('setToken', token)
    }).catch((err) => {
      console.log(err)
      commit('setToken', null)
    })
    firebase.database().ref('/tokens').orderByChild('uid')
      .equalTo(firebase.auth().currentUser.uid).on('value', snapshot => {
        commit('checkSubscription', snapshot.val())
      })
  },
  // setToken ({ commit }, payload) {
  //   commit('setToken', payload)
  // },
  handleTokenRefresh () {
    firebase.messaging().getToken()
      .then((token) => {
        firebase.database().ref('/tokens').push({
          token: token,
          uid: firebase.auth().currentUser.uid
        })
      })
  },
  unsubscribe ({ commit }) {
    const token = state.token
    firebase.database().ref('/tokens').orderByChild('token')
      .equalTo(token).once('value')
      .then((snapshot) => {
        console.log(token)
        const key = Object.keys(snapshot.val())[0]
        return firebase.database().ref('/tokens').child(key).remove()
      })
      .catch((err) => {
        console.log(err)
        const snack = {
          snackbar: true,
          color: 'error',
          timeout: 6000,
          message: 'Erro ao tentar excluir token'
        }
        commit('snack', snack)
      })
  },
  signUserIn ({ commit }, payload) {
    commit('clearError')
    commit('setLoading', true)
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then((e) => {
        console.log(e)
        commit('setLoading', false)
      }
      )
      .catch(
        error => {
          console.log(error)
          commit('setLoading', false)
          const err = error.code
          let message = err
          if (err === 'auth/wrong-password') {
            message = 'Senha inválida.'
          }
          if (err === 'auth/user-not-found') {
            message = 'Usuário não encontrado.'
          }
          if (err === 'auth/network-request-failed') {
            message = 'Falha ao conectar, verifique sua internet.'
          }
          this._vm.$toast.error(message, {
            position: 'top-center',
            timeout: 5000
          })
        }
      )
  },
  signGoogle ({ commit }) {
    commit('clearError')
    commit('setLoading', true)
    const PROVIDER = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(PROVIDER)
      .then(
        e => {
          commit('setLoading', false)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          const err = error.code
          let message = err
          if (err === 'auth/wrong-password') {
            message = 'Senha inválida.'
          }
          if (err === 'auth/user-not-found') {
            message = 'Usuário não encontrado.'
          }
          if (err === 'auth/network-request-failed') {
            message = 'Falha ao conectar, verifique sua internet.'
          }
          const snack = {
            snackbar: true,
            color: 'error',
            timeout: 6000,
            message: message
          }
          commit('snack', snack)
        }
      )
  },
  signOut ({ commit }) {
    firebase.auth().signOut()
      .then(() => {
        commit('setLoading', false)
        commit('setUser', null)
      })
      .catch(
        error => {
          commit('setLoading', false)
          const err = error.code
          let message = err
          if (err === 'auth/network-request-failed') {
            message = 'Falha ao tentar desconectar, verifique sua internet.'
          }
          const snack = {
            snackbar: true,
            color: 'error',
            timeout: 6000,
            message: message
          }
          commit('snack', snack)
        }
      )
  },
  register ({ commit }) {
    firebase.database().ref('/tokens').orderByChild('uid')
      .equalTo(firebase.auth().currentUser.uid).once('value')
      .then((snapshot) => {
        commit('setRegister', snapshot)
      })
  },
  setAppInstalled ({ commit }, payload) {
    commit('setAppInstalled', payload)
  },
  setError ({ commit }, payload) {
    commit('setError', payload)
  },
  clearError ({ commit }) {
    commit('clearError')
  },
  setOnline ({ commit }) {
    const online = window.navigator.onLine
    commit('setOnline', online)
  },
  setDialogPhoto ({ commit }, value) {
    commit('setDialogPhoto', value)
  },
  setDisplayName ({ commit }, nome) {
    const user = firebase.auth().currentUser
    user.updateProfile({
      displayName: nome
    }).then(function () {
      commit('setDisplayName', nome)
    }).catch(function (error) {
      console.log(error)
      const snack = {
        snackbar: true,
        color: 'error',
        timeout: 6000,
        message: 'Falha ao editar seu nome'
      }
      commit('snack', snack)
    })
  },
  setPhoto ({ commit }, nova) {
    const storageRef = firebase.storage().ref()
    const uid = state.user.id
    const uploadTask = storageRef.child(uid + '/profilePicture/' + nova.fileName).put(nova.photo)
    uploadTask.then((snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        const user = firebase.auth().currentUser
        user.updateProfile({
          photoURL: downloadURL
        }).then(() => {
          commit('setPhoto', downloadURL)
        }).catch((error) => {
          console.log(error)
          const snack = {
            snackbar: true,
            color: 'error',
            timeout: 6000,
            message: 'Erro ao atualizar foto'
          }
          commit('snack', snack)
        })
      })
    })
  },
  loadConfig ({ commit }) {
    const uid = state.user.id
    firebase.database().ref(uid + '/config')
      .on('value', snapshot => {
        const config = []
        const obj = snapshot.val()
        for (const key in obj) {
          config.push({
            id: key,
            basica: obj[key].basica,
            margem: obj[key].margem,
            processamento: obj[key].processamento,
            formasPgto: obj[key].formasPgto
          })
        }
        commit('loadConfig', config[0])
      })
  },
  createConfig ({ commit }, payload) {
    const config = {
      basica: payload.basica,
      margem: payload.margem,
      processamento: payload.processamento,
      formasPgto: payload.formasPgto
    }
    const uid = state.user.id
    let key
    firebase.database().ref(uid + '/config').push(config)
      .then((data) => {
        key = data.key
        return key
      })
      .then(key => {
        commit('setConfig', {
          ...config,
          id: key
        })
      })
      .catch((error) => {
        console.log(error)
        const snack = {
          snackbar: true,
          color: 'error',
          timeout: 6000,
          message: 'Falha ao configurar perfil'
        }
        commit('snack', snack)
      })
  },
  setConfig ({ commit }, payload) {
    const uid = state.user.id
    firebase.database().ref(uid + '/config').child(payload.id).update(payload)
      .then(() => {
        commit('setConfig', payload)
      })
      .catch((error) => {
        console.log(error)
        const snack = {
          snackbar: true,
          color: 'error',
          timeout: 6000,
          message: 'Falha ao editar configuração'
        }
        commit('snack', snack)
      })
  }
}

const mutations = {
  snack (state, snack) {
    Snack.mutations.setSnack(state.snack, snack)
  },
  setUser: (state, payload) => {
    state.user = payload
  },
  setIniciado: (state, payload) => {
    state.iniciado = payload
  },
  setDisplayName: (state, nome) => {
    state.user.displayName = nome
  },
  setLoading: (state, payload) => {
    state.loading = payload
  },
  setRegister: (state, payload) => {
    state.register = payload
  },
  setToken: (state, payload) => {
    state.token = payload
  },
  setError: (state, payload) => {
    state.error = payload
  },
  checkSubscription: (state, payload) => {
    const obj = payload
    const token = state.token
    const tokens = []
    if (obj) {
      for (const key in obj) {
        console.log(obj[key].token, token)
        if (obj[key].token === token && state.user.id === obj[key].uid) {
          tokens.push({
            id: key,
            token: obj[key].token,
            uid: obj[key].uid
          })
        }
      }
    }
    console.log(tokens)
    state.subscribe = tokens.length
  },
  setAppInstalled: (state, payload) => {
    state.appInstalled = payload
  },
  loadConfig: (state, payload) => {
    // state.config.listaBasica = payload.basica ? payload.basica : false
    // state.config.processamento = payload.processamento ? payload.processamento : 1.3
    // state.config.margem = payload.margem ? payload.margem : 3
    state.config = payload
  },
  setConfig (state, payload) {
    if (payload.basica) {
      state.config.listaBasica = payload.basica
    }
    if (payload.processamento) {
      state.config.processamento = payload.processamento
    }
    if (payload.margem) {
      state.config.margem = payload.margem
    }
    if (payload.formasPgto) {
      state.config.formasPgto = payload.formasPgto
    }
  },
  clearError: (state) => {
    state.error = null
  },
  setOnline (state, online) {
    state.online = online
  },
  setDialogPhoto (state, value) {
    state.dialogPhoto = value
  },
  setPhoto (state, foto) {
    state.user.photoURL = foto
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
