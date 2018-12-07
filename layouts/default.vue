<template>
  <nuxt />
</template>

<script>
export default {
  created() {
    this.$axios.defaults.baseURL = 'http://localhost:3010'
  }
}
</script>
