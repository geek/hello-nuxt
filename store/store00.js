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

const kQueries = {
  // Notice that Content isn't included because we aren't using it in the page
  getBooks: `query GetBooks {
    getBooks {
      ID
      Author
      Title
      CreatedAt
    }
  }`,
  createBook: `mutation CreateBook($Author: String, $Title: String) {
    createBook(Author: $Author, Title: $Title) {
      ID
      Author
      Title
      CreatedAt
    }
  }`,
  deleteBook: `mutation DeleteBook($ID: ID!) {
    deleteBook(ID: $ID) { ID }
  }`
}

export const actions = {
  async fetchBooks({ commit }) {
    try {
      let { data } = await this.$axios.$post('', {
        query: kQueries.getBooks
      })
      commit('RECEIVE_BOOKS', data.getBooks)
      console.log(data.getBooks)
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
      let { data } = await this.$axios.$post('', {
        query: kQueries.createBook,
        variables: d
      })
      commit('ADD_BOOK', data.createBook)
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
      await this.$axios.$post('', {
        query: kQueries.deleteBook,
        variables: d
      })

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
