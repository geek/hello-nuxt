<template>
  <v-container>
    <h1>inspire</h1>
    <pre class="hoho">{{ haha }}</pre>
  </v-container>
</template>

<script>
export default {
  auth: false,
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
  color: steelblue;
}
</style>
