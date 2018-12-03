<template>
  <v-container>
    <h1>books</h1>
    <v-btn @click="addRandomBook()">add random book</v-btn>
    <v-btn @click="books = []">clear</v-btn>
    <pre class="hoho">{{ books }}</pre>
  </v-container>
</template>

<script>
import rWords from 'random-words'
const debug = require('debug')('pages/books')

export default {
  data() {
    return {
      books: []
    }
  },
  methods: {
    addBook(d) {
      let baseBook = {
        Author: '',
        Title: '',
        Content: '',
        CreatedAt: new Date(),
        UpdatedAt: null,
        PublishedAt: new Date()
      }
      this.books.push(Object.assign(baseBook, d))
    },
    addRandomBook() {
      this.addBook({
        Author: rWords({ exactly: 2, join: ' ' }),
        Title: rWords({ min: 3, max: 10, join: ' ' })
      })
    }
  }
}
</script>

<style>
.hoho {
  color: steelblue;
}
</style>
