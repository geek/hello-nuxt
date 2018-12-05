<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-items>
        <v-btn flat to="/">home</v-btn>
        <v-btn flat to="/inspire">inspire</v-btn>
        <v-btn :disabled="!isAuthenticated" flat to="/books">books ({{ books.length || '-' }})</v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat>{{ $vuetify.breakpoint.name }}</v-btn>
        <v-btn v-if="!isAuthenticated" flat @click="login">login</v-btn>
        <v-btn v-if="isAuthenticated" flat @click="logout">logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      books: 'store00/books',
      isAuthenticated: 'auth/isAuthenticated'
    })
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
      logout: 'auth/logout'
    })
  }
}
</script>
