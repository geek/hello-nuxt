<template>
  <v-container>
    <h1>books</h1>
    <v-btn @click="addRandomBook()">add random book</v-btn>
    <v-btn @click="fetchBooks()">fetch books</v-btn>
    <ul>
      <li v-for="(d, i) in books" :key="i">
        <span class="text-capitalize">[{{ d.Author }}]</span>
        <span class="text-capitalize">{{ d.Title }}</span>
        ({{ d.CreatedAt | moment('from') }})
      </li>
    </ul>
  </v-container>
</template>

<script>
import rWords from 'random-words'
const debug = require('debug')('pages/books')

export default {
  data() {
    return {
      timeout: null,
      books: []
    }
  },
  mounted() {
    this.loadData()
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  methods: {
    loadData() {
      this.fetchBooks()
      this.timeout = setTimeout(this.loadData, 10e3)
    },
    async addBook(d) {
      let { data } = await this.$axios.post('http://localhost:3010/books', d)
      this.books.push(data)
    },
    addRandomBook() {
      this.addBook({
        Author: rWords({ exactly: 2, join: ' ' }),
        Title: rWords({ min: 3, max: 10, join: ' ' })
      })
    },
    async fetchBooks() {
      let { data } = await this.$axios.get('http://localhost:3010/books')
      this.books = data
    }
  }
}
</script>

<style>
.hoho {
  color: steelblue;
}
</style>
