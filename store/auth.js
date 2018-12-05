import axios from 'axios'
import Keycloak from 'keycloak-js'

const debug = require('debug')('hello-nuxt:store/auth')

let keycloakAuth = new Keycloak('/keycloak.json')

// https://github.com/nuxt-community/auth-module/pull/208
// request to refresh token on 75% token expiration time.

export const state = () => ({
  authenticated: false,
  idToken: '',
  token: '',
  refreshToken: '',
  idTokenParsed: {},
  tokenParsed: {},
  user: null
})

export const mutations = {
  SET_TOKENS: (state, keycloakAuth) => {
    if (keycloakAuth && keycloakAuth.authenticated) {
      state.authenticated = true
      state.idTokenParsed = JSON.parse(
        JSON.stringify(keycloakAuth.idTokenParsed)
      )
      state.idToken = keycloakAuth.idToken
      state.tokenParsed = JSON.parse(JSON.stringify(keycloakAuth.tokenParsed))
      state.token = keycloakAuth.token
      state.refreshToken = keycloakAuth.refreshToken
    } else {
      state = {
        authenticated: false,
        idToken: '',
        token: '',
        refreshToken: '',
        idTokenParsed: {},
        tokenParsed: {},
        user: null
      }
    }
  },

  SET_USER: (state, user) => {
    state.user = user
  }
}

export const actions = {
  login({ commit, dispatch }, next, error) {
    const handleError = err => {
      commit('SET_TOKENS', null)
      if (error) {
        error(new Error('Failed to login'), {
          statusCode: 401
        })
      }
    }
    const handleSuccess = () => {
      keycloakAuth
        .updateToken(10)
        .success(() => {
          debug('Success init auth')
          commit('SET_TOKENS', keycloakAuth)
          dispatch('updateProfile')

          axios.defaults.headers.common = {
            Authorization: 'Bearer ' + keycloakAuth.token
          }

          // calculate timeout before token expiration (75%)
          let t = (keycloakAuth.tokenParsed.exp * 1000 - Date.now()) * 0.75
          // Limit 10 seconds (avoid self attack)
          if (t < 10000) t = 10000

          // keep refreshing token before expiration time
          let timeout = setTimeout(handleSuccess, t)

          // route next
          if (next) next()
        })
        .error(handleError)
    }

    keycloakAuth
      .init({ onLoad: 'login-required' })
      .success(handleSuccess)
      .error(handleError)
  },

  checkSSO({ commit, dispatch }, next, error) {
    const handleError = err => {
      commit('SET_TOKENS', null)
      if (error) {
        error({
          message: 'Failed to checkSSO',
          statusCode: 401
        })
      } else if (typeof next === 'function') {
        next()
      }
    }
    const handleSuccess = () => {
      keycloakAuth
        .updateToken(10)
        .success(() => {
          debug('Success init auth')
          commit('SET_TOKENS', keycloakAuth)
          dispatch('updateProfile')

          axios.defaults.headers.common = {
            Authorization: 'Bearer ' + keycloakAuth.token
          }

          // calculate timeout before token expiration (75%)
          let t = (keycloakAuth.tokenParsed.exp * 1000 - Date.now()) * 0.75
          // Limit 10 seconds (avoid self attack)
          if (t < 10000) t = 10000

          // keep refreshing token before expiration time
          let timeout = setTimeout(handleSuccess, t)

          // route next
          if (next) next()
        })
        .error(handleError)
    }

    keycloakAuth
      .init({ onLoad: 'check-sso' })
      .success(handleSuccess)
      .error(handleError)
  },

  checkSSOAndLogin({ commit, dispatch }, next, error) {
    const handleError = err => {
      commit('SET_TOKENS', null)
      if (error) {
        error({
          message: 'Failed to checkSSO',
          statusCode: 401
        })
      } else if (typeof next === 'function') {
        next()
      }
    }
    const handleSuccess = () => {
      if (keycloakAuth.authenticated) {
        keycloakAuth
          .updateToken(10)
          .success(() => {
            debug('Success init auth')
            commit('SET_TOKENS', keycloakAuth)
            dispatch('updateProfile')

            axios.defaults.headers.common = {
              Authorization: 'Bearer ' + keycloakAuth.token
            }

            // calculate timeout before token expiration (75%)
            let t = (keycloakAuth.tokenParsed.exp * 1000 - Date.now()) * 0.75
            // Limit 10 seconds (avoid self attack)
            if (t < 10000) t = 10000

            // keep refreshing token before expiration time
            let timeout = setTimeout(handleSuccess, t)

            // route next
            if (next) next()
          })
          .error(handleError)
      } else {
        keycloakAuth
          .init({ onLoad: 'login-required' })
          .success(handleSuccess)
          .error(handleError)
      }
    }

    keycloakAuth
      .init({ onLoad: 'check-sso' })
      .success(handleSuccess)
      .error(handleError)
  },

  logout({ commit }) {
    if (keycloakAuth.logout) keycloakAuth.logout()
    axios.defaults.headers.common = {}
    commit('SET_TOKENS', null)
  },

  updateToken({ commit }) {
    debug('updateToken before', keycloakAuth.token)
    if (keycloakAuth && keycloakAuth.authenticated) {
      keycloakAuth
        .updateToken(-1)
        .success(() => {
          // refresh token success
          debug('updateToken success', keycloakAuth.token)
          commit('SET_TOKENS', keycloakAuth)
          axios.defaults.headers.common = {
            Authorization: 'Bearer ' + keycloakAuth.token
          }
        })
        .error(() => {
          // refresh token failed
          commit('SET_TOKENS', null)
        })
    }
  },

  updateProfile({ commit }) {
    if (keycloakAuth && keycloakAuth.authenticated) {
      keycloakAuth
        .loadUserProfile()
        .success(data => commit('SET_USER', data))
        .error(() => commit('SET_USER', null))
    }
  }
}

export const getters = {
  isAuthenticated: state => state.authenticated,
  user: state => state.user,
  idToken: state => state.idToken,
  token: state => state.token,
  idTokenParsed: state => state.idTokenParsed,
  tokenParsed: state => state.tokenParsed,
  hasResourceRole: state => keycloakAuth.hasResourceRole,
  refreshToken: state => state.refreshToken
}
