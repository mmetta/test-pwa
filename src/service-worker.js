/* eslint-disable no-undef */
self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

// install new service worker when ok, then reload page.
self.addEventListener('message', msg => {
  console.log('skipWaiting' + msg.data.action)
  if (msg.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})
