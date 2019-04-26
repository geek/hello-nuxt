<template>
  <v-container>
    <v-layout>
      <v-btn to="/home/books" flat class="pl-1"><v-icon>chevron_left</v-icon>Back</v-btn>
      <v-spacer/>
    </v-layout>
    <v-layout>
      <v-responsive :aspect-ratio="2/3" class="grey darken-3 pa-3 white--text book mx-auto">
        <v-layout fill-height column>
          <div class="subheading">No. {{ $route.params.id }}</div>
          <div class="display-1 text-capitalize mt-5 pr-5">
            {{ p('Title')(book) || '-' }}
          </div>
          <v-spacer />
          <v-icon style="font-size: 192px;" x-large>blur_on</v-icon>
          <v-spacer />
          <div class="headline text-capitalize my-4 text-xs-right">
            {{ p('Author')(book) || '-' }}
          </div>
        </v-layout>
      </v-responsive>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
const debug = require('debug')('pages/books/_id')

export default {
  data() {
    return {
      book: null
    }
  },
  computed: {
    ...mapGetters({
      books: 'store00/books'
    })
  },
  async mounted() {
    if (_.isEmpty(this.books)) {
      await this.fetchBooks()
    }
    this.findBook()
  },
  methods: {
    ...mapActions({
      fetchBooks: 'store00/fetchBooks'
    }),
    p: _.property,
    findBook() {
      this.book = _.find(this.books, ['ID', this.$route.params.id])
    }
  }
}
</script>

<style>
.book {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
}
</style>
