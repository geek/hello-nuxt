<template>
  <v-container>
    <h1 class="display-2 mb-5">
      Books
      <span class="font-weight-light">{{ books.length || '-' }}</span>
    </h1>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-btn flat color="primary" @click="dialogAdd = true">add book</v-btn>
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
        <td class="text-capitalize">
          <nuxt-link :to="`/home/books/${props.item.ID}`">
            {{ props.item.Title }}
          </nuxt-link>
        </td>
        <td class="text-capitalize">{{ props.item.Author }}</td>
        <td>{{ props.item.CreatedAt | moment('from') }}</td>
        <td><v-btn flat small color="red" @click="openRemoveDialog(props.item)">Remove</v-btn></td>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogAdd" max-width="400">
      <v-card>
        <v-card-title class="headline">Create a new Book</v-card-title>
        <v-form @submit.stop.prevent="submitFormAdd">
          <v-card-text>
            <v-text-field v-model="newBook.Title" label="Title" />
            <v-text-field v-model="newBook.Author" label="Author" />
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="primary" type="button" @click="dialogAdd = false">Cancel</v-btn>
            <v-spacer />
            <v-btn flat color="primary" type="submit">Add</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRemove" max-width="400">
      <v-card>
        <v-card-title class="headline">Remove a Book</v-card-title>
        <v-card-text class="text-xs-center">
          Do you want to remove this book?<br/>
          <b class="text-capitalize">
            '{{ bookToRemove && bookToRemove.Title }}'
          </b>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="primary" type="button" @click="dialogRemove = false">Cancel</v-btn>
          <v-spacer />
          <v-btn flat color="primary" type="button" @click="handleRemoveBook()">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
        { text: 'Created', value: 'CreatedAt' },
        { text: 'Actions', value: null, sortable: false }
      ],
      pagination: {
        descending: true,
        rowsPerPage: -1,
        sortBy: 'CreatedAt'
      },
      dialogAdd: false,
      dialogRemove: false,
      newBook: { Title: '', Author: '' },
      bookToRemove: null
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
      addBook: 'store00/addBook',
      removeBook: 'store00/removeBook'
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
    },
    submitFormAdd() {
      this.addBook(this.newBook)
      this.dialogAdd = false
    },
    openRemoveDialog(d) {
      this.bookToRemove = d
      this.dialogRemove = true
    },
    handleRemoveBook() {
      this.removeBook(this.bookToRemove)
      this.dialogRemove = false
    }
  }
}
</script>
