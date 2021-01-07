export default class MessagingService {
  constructor () {
    this.messaging = window.firebaseMessaging
    this.messaging.usePublicVapidKey(
      'BHbVyTXh9ndyHP27xR3jiX5wy-7-4GhXy60gZB6bNRXFAQScrtAszhjNTgI--N084recFUe6s4rqnatv55wK0R8'
    )
    // Token refresh event
    this.messaging.onTokenRefresh(function () {
      console.log('Token refreshed.')
      this.messaging.getToken().then(function (refreshedToken) {
        this.setTokenSentToServerFlg(false)
        this.sendTokenToServer(refreshedToken)
      }).catch(function (err) {
        console.log('Unable to retrieve refreshed token ', err)
      })
    })
    // Receiving message event
    //   this.messaging.onMessage(function(payload) {
    //     console.log('Message received. ', payload);
    //   });
  }

  /* Request user's permission */
  async requestPermissionAsync () {
    let permissao = null
    try {
      await this.messaging.requestPermission()
      permissao = 'permitido'
      console.log('Permissão de notificação concedida.')
    } catch (err) {
      permissao = 'bloqueado'
      console.log('Incapaz de obter permissão para notificar.', err)
    }
    return permissao
  }

  /* Get messaging token */
  async getTokenAsync () {
    try {
      const currentToken = await this.messaging.getToken()
      if (currentToken) {
        await this.sendTokenToServerAsync(currentToken)
        return currentToken
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.')
        // Show permission UI.
        this.setTokenSentToServerFlg(false)
        return false
      }
    } catch (err) {
      console.log('An error occurred while retrieving token. ', err)
      this.setTokenSentToServerFlg(false)
      return false
    }
  }

  /* Delete Instance ID token */
  async deleteTokenAsync () {
    try {
      const currentToken = await this.messaging.getToken()
      await this.messaging.deleteToken(currentToken)
      this.setTokenSentToServerFlg(false)
      console.log('Token deleted: ' + currentToken)
    } catch (err) {
      console.log('Unable to delete token. ', err)
    }
  }

  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  async sendTokenToServerAsync (currentToken) {
    try {
      if (!this.isTokenSentToServer()) {
        console.log('Sending token to server...')
        // TODO: Send the current token to your server.
        this.setTokenSentToServerFlg(true)
      } else {
        console.log('O token já foi enviado ao servidor, então não o enviará novamente a menos que ele mude')
      }
    } catch (err) {
      console.log('Unable to send token to server', err)
    }
  }

  isTokenSentToServer () {
    return window.localStorage.getItem('sentToServer') === '1'
  }

  setTokenSentToServerFlg (sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0')
  }
}
