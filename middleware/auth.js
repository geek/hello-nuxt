const debug = require('debug')('hello-nuxt:middleware/auth')

function routeOption(route, key, value) {
  return route.matched.some(m => {
    if (process.browser) {
      // Browser
      return Object.values(m.components).some(
        component => component.options && component.options[key] === value
      )
    } else {
      // SSR
      return Object.values(m.components).some(component =>
        Object.values(component._Ctor).some(
          ctor => ctor.options && ctor.options[key] === value
        )
      )
    }
  })
}

export default function({ route, store, error }, next) {
  if (store.state.auth.authenticated) {
    // authenticated
    next()
  } else {
    // not loggedin
    if (routeOption(route, 'auth', false)) {
      // public page, just check sso
      store.dispatch('auth/checkSSO', next, error)
    } else {
      // page need authentication
      store.dispatch('auth/checkSSOAndLogin', next, error)
    }
  }
}
