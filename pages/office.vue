<template>
  <v-app dark>
    <appbar
      :clicked-side-icon="() => {drawer = !drawer}"
      :clipped-left="$vuetify.breakpoint.lgAndUp"
    />

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-tile to="/office" exact>
          <v-list-tile-action><v-icon>dashboard</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Overview</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/office/computers">
          <v-list-tile-action><v-icon>computer</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Computers</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/office/employees">
          <v-list-tile-action><v-icon>people</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Employees</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <nuxt-child />
    </v-content>
  </v-app>
</template>

<script>
import Appbar from '@/components/Appbar'

export default {
  components: { Appbar },
  data() {
    return {
      drawer: this.$vuetify.breakpoint.lgAndUp
    }
  }
}
</script>
