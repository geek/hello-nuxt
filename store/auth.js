import axios from 'axios'
import Keycloak from 'keycloak-js'

const debug = require('debug')('hello-nuxt:store/auth')

let keycloakAuth = new Keycloak('/keycloak.json')
let timeoutUpdateToken = null

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
      if (timeoutUpdateToken) clearTimeout(timeoutUpdateToken)
    }
  },

  SET_USER: (state, user) => {
    state.user = user
  }
}

export const actions = {
  async login({ commit, dispatch }, next, error) {
    try {
      let authenticated = await keycloakAuth.init({
        onLoad: 'login-required',
        promiseType: 'native'
      })
      debug('login', authenticated)
      dispatch('updateToken')
      dispatch('updateProfile')
      // route next
      if (next) next()
    } catch (e) {
      debug('failed to checkSSO', e)
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
  },

  async checkSSO({ commit, dispatch }, next, error) {
    try {
      let authenticated = await keycloakAuth.init({
        onLoad: 'check-sso',
        promiseType: 'native'
      })
      debug('checkSSO', authenticated)
      if (authenticated) {
        dispatch('updateToken')
        dispatch('updateProfile')
      }
      // route next anyway
      if (next) next()
    } catch (e) {
      debug('failed to checkSSO', e)
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
  },

  async checkSSOAndLogin({ commit, dispatch }, next, error) {
    try {
      let authenticated = await keycloakAuth.init({
        onLoad: 'check-sso',
        promiseType: 'native'
      })
      debug('checkSSO', authenticated)
      if (authenticated) {
        dispatch('updateToken')
        dispatch('updateProfile')
        // route next anyway
        if (next) next()
      } else {
        keycloakAuth.login()
      }
    } catch (e) {
      debug('failed to checkSSO', e)
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
  },

  logout({ commit }) {
    if (keycloakAuth.logout) keycloakAuth.logout()
    axios.defaults.headers.common = {}
    commit('SET_TOKENS', null)
  },

  async updateToken({ commit, dispatch }) {
    if (keycloakAuth && keycloakAuth.authenticated) {
      try {
        await keycloakAuth.updateToken(-1)
        // refresh token success
        debug('succeeded to update token')
        commit('SET_TOKENS', keycloakAuth)
        axios.defaults.headers.common = {
          Authorization: 'Bearer ' + keycloakAuth.token
        }

        // calculate timeout before token expiration (75%)
        let t = (keycloakAuth.tokenParsed.exp * 1000 - Date.now()) * 0.75
        // Limit 10 seconds (avoid self attack)
        if (t < 10000) t = 10000
        debug('t', t)

        // keep refreshing token before expiration time
        if (timeoutUpdateToken) clearTimeout(timeoutUpdateToken)
        timeoutUpdateToken = setTimeout(() => dispatch('updateToken'), t)
      } catch (e) {
        // refresh token failed
        debug('failed to update token', e)
        commit('SET_TOKENS', null)
        dispatch('login')
      }
    }
  },

  async updateProfile({ commit }) {
    if (keycloakAuth && keycloakAuth.authenticated) {
      try {
        let data = await keycloakAuth.loadUserProfile()
        debug('succeeded update profile', data)
        commit('SET_USER', data)
      } catch (e) {
        debug('failed to update profile', e)
        commit('SET_USER', null)
      }
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
