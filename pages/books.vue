<template>
  <v-container>
    <h1>
      Books
      <span class="font-weight-light">{{ books.length | '-' }}</span>
    </h1>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-btn flat color="primary" @click="addRandomBook()">add random book</v-btn>
        <v-btn flat color="primary" @click="fetchBooks()">fetch books</v-btn>
      </v-flex>
      <v-flex offset-xs3 xs9 offset-md0 md6>
        <v-text-field v-model="search" label="Search" />
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="books"
      :pagination.sync="pagination"
      :search="search"
      must-sort
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <td class="text-capitalize">{{ props.item.Title }}</td>
        <td class="text-capitalize">{{ props.item.Author }}</td>
        <td>{{ props.item.CreatedAt | moment('from') }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import rWords from 'random-words'
import { mapActions, mapGetters } from 'vuex'
const debug = require('debug')('pages/books')

export default {
  data() {
    return {
      timeout: null,
      search: '',
      headers: [
        { text: 'Title', value: 'Title' },
        { text: 'Author', value: 'Author' },
        { text: 'Created', value: 'CreatedAt' }
      ],
      pagination: {
        descending: true,
        rowsPerPage: -1,
        sortBy: 'CreatedAt'
      }
    }
  },
  computed: {
    ...mapGetters({
      books: 'store00/books'
    })
  },
  mounted() {
    this.loadData()
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  methods: {
    ...mapActions({
      fetchBooks: 'store00/fetchBooks',
      addBook: 'store00/addBook'
    }),
    loadData() {
      this.fetchBooks()
      this.timeout = setTimeout(this.loadData, 10e3)
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
