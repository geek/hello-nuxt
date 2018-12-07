<template>
  <v-toolbar v-bind="$attrs" app class="appbar">
    <v-toolbar-side-icon
      v-if="!noSideIcon"
      :disabled="disabledSideIcon"
      class="nav-menu-btn ma-0 mr-2"
      @click.stop="clickedSideIcon"
    ></v-toolbar-side-icon>
    <v-toolbar-title class="mx-1">
      <nuxt-link to="/" style="text-decoration: none;">
        <v-icon large>place</v-icon>
      </nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-btn icon to="/park"><v-icon>nature_people</v-icon></v-btn>
      <v-btn :disabled="!isAuthenticated" icon to="/home"><v-icon>home</v-icon></v-btn>
      <v-btn :disabled="!isAuthenticated" icon to="/office"><v-icon>business</v-icon></v-btn>
    </v-toolbar-items>
    <v-spacer />
    <v-toolbar-items>
      <v-menu min-width="120" right offset-y>
        <div slot="activator">
          <v-btn v-if="!isAuthenticated" icon><v-icon color="grey darken-1">person_outline</v-icon></v-btn>
          <v-btn v-if="isAuthenticated" icon><v-icon>person</v-icon></v-btn>
        </div>

        <v-list>
          <v-list-tile v-if="!isAuthenticated" @click="login">
            <v-list-tile-title>Sign In</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="isAuthenticated" @click="logout">
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    'no-side-icon': { type: Boolean, default: false },
    'disabled-side-icon': { type: Boolean, default: false },
    'clicked-side-icon': { type: Function, default: () => {} }
  },
  computed: {
    ...mapGetters({
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

<style>
@media screen and (max-width: 960px) {
  .appbar .v-toolbar__content {
    padding-left: 0;
  }
  .appbar .v-toolbar__content .nav-menu-btn {
    margin-left: -12px !important;
  }
}
</style>
