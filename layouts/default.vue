<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-items>
        <v-btn flat to="/">home</v-btn>
        <v-btn flat to="/inspire">inspire</v-btn>
        <v-btn flat to="/books">books</v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-btn flat>nothing</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>
