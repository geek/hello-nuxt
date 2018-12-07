<template>
  <v-app>
    <appbar disabled-side-icon />
    <v-content>
      <v-container fill-height>
        <v-layout column align-center justify-center>
          <div class="my-4 display-3 font-weight-light">Hello Nuxt</div>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Appbar from '@/components/Appbar'

export default {
  auth: false,
  components: { Appbar }
}
</script>
