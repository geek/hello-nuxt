import _ from 'lodash'

export const state = () => ({
  books: []
})

export const mutations = {
  RECEIVE_BOOKS(state, data) {
    state.books = data
  },
  ADD_BOOK(state, data) {
    state.books.push(data)
  },
  REMOVE_BOOK(state, data) {
    _.remove(state.books, ['ID', data.ID])
    state.books.push({})
    state.books.pop()
  }
}

export const actions = {
  async fetchBooks({ commit }) {
    try {
      let data = await this.$axios.$get('/books')
      commit('RECEIVE_BOOKS', data)
    } catch (e) {
      let message = 'Failed to get books'
      if (e.response) {
        message += `<p>${e.response.status}: ${e.response.data.message}</p>`
      }
      this.$toast.error(message)
    }
  },
  async addBook({ commit }, d) {
    try {
      let data = await this.$axios.$post('/books', d)
      commit('ADD_BOOK', data)
      this.$toast.success('Added')
    } catch (e) {
      let message = 'Failed to add book'
      if (e.response) {
        message += `<p>${e.response.status}: ${e.response.data.message}</p>`
      }
      this.$toast.error(message)
    }
  },
  async removeBook({ commit }, d) {
    try {
      await this.$axios.$delete(`/books/${d.ID}`)
      commit('REMOVE_BOOK', d)
      this.$toast.success('Removed')
    } catch (e) {
      let message = 'Failed to remove book'
      if (e.response) {
        message += `<p>${e.response.status}: ${e.response.data.message}</p>`
      }
      this.$toast.error(message)
    }
  }
}

export const getters = {
  books(state) {
    return state.books
  }
}
