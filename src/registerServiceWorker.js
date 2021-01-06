/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker registrado.')
    },
    cached () {
      console.log('Conteúdo em cache para uso offline.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated (registration) {
      const confirmationResult = confirm('Novo conteúdo disponível! Atualize o app agora.')
      if (confirmationResult) registration.waiting.postMessage({ action: 'skipWaiting' })
    },
    offline () {
      console.log('Sem conexão no momento. App rodando no modo offline.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })

  let refreshing
  navigator.serviceWorker.addEventListener('controllerchange', e => {
    if (refreshing) return
    window.location.reload()
    refreshing = true
  })
}
