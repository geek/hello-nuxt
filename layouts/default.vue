<template>
  <nuxt />
</template>

<script>
export default {
  created() {
    // 3001 is the client-api server, which calls the go server at port 3010
    this.$axios.defaults.baseURL = 'http://localhost:3001/graphql'
  }
}
</script>
