<template>
  <v-container>
    <h1>books</h1>
    <v-btn @click="addRandomBook()">add random book</v-btn>
    <v-btn @click="clearBooks()">clear</v-btn>
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
import store from 'store'
const debug = require('debug')('pages/books')

export default {
  data() {
    return {
      books: store.get('books') || []
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
      store.set('books', this.books)
    },
    addRandomBook() {
      this.addBook({
        Author: rWords({ exactly: 2, join: ' ' }),
        Title: rWords({ min: 3, max: 10, join: ' ' })
      })
    },
    clearBooks() {
      this.books = []
      store.remove('books')
    }
  }
}
</script>

<style>
.hoho {
  color: steelblue;
}
</style>
