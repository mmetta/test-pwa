import { store } from '../store'

export default (to, from, next) => {
  const user = store.getters.user
  if (user !== null && user !== undefined) {
    next()
  } else {
    next('/login')
  }
}
