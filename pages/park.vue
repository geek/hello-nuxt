<template>
  <v-app>
    <appbar disabled-side-icon />
    <v-content>
      <v-container fill-height>
        <v-layout column align-center justify-center>
          <v-icon style="font-size: 128px;" color="grey" x-large>nature_people</v-icon>
          <div class="my-4 display-3 grey--text">Home</div>
          <pre class="hoho">{{ haha }}</pre>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Appbar from '@/components/Appbar'

export default {
  auth: false,
  components: { Appbar },
  data() {
    return {
      haha: null
    }
  },
  async mounted() {
    let { data } = await this.$axios.get(
      'https://dev.cerescloud.io/version.json'
    )
    this.haha = data
  }
}
</script>

<style>
.hoho {
  color: grey;
}
</style>
