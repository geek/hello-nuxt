export const state = () => ({
  books: []
})

export const mutations = {
  RECEIVE_BOOKS(state, data) {
    state.books = data
  },
  ADD_BOOK(state, data) {
    state.books.push(data)
  }
}

export const actions = {
  async fetchBooks({ commit }) {
    let { data } = await this.$axios.get('http://localhost:3010/books')
    commit('RECEIVE_BOOKS', data)
  },
  async addBook({ commit }, d) {
    let { data } = await this.$axios.post('http://localhost:3010/books', d)
    commit('ADD_BOOK', data)
  }
}

export const getters = {
  books(state) {
    return state.books
  }
}
