# hello-nuxt

> Vue + Nuxt + Vuetify example project

## References

[Developer Roadmap](https://github.com/kamranahmedse/developer-roadmap) - Frontend, Backend, Devops Roadmap

[Vue.js](https://vuejs.org) - The Progressive JavaScript Framework
[Nuxt.js](https://nuxtjs.org) - Universal Vue.js Applications
[Vuetify](https://vuetifyjs.com) - Material Design Component Framework

[Vue Router](https://router.vuejs.org) - the official router for Vue.js.
[Vuex](https://vuex.vuejs.org) - a state management pattern + library for Vue.js.

---

## How To Run

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

---

## Step-by-step

---

1. Initialize

```bash
# install nodejs (LTS v8 or v10) https://nodejs.org
$ wget https://nodejs.org/dist/v10.x.x/node-v10.x.x-linux-x64.tar.xz
$ tar xf node-v10.x.x-linux-x64.tar.xz
$ export PATH=$PATH;node-v10.x.x-linux-x64/bin

# install yarn
$ npm i -g yarn

# create nuxt-app
$ yarn create nuxt-app hello-nuxt
# choose:
# none(server framework), vuetify, Single Page App
# axios, eslint, prettier, yarn

# run
$ cd hello-nuxt
$ yarn run dev
# Listening on: http://localhost:3000

# open browser and developer inspector
```

---

2. Nuxt Directory Structure
https://nuxtjs.org/guide/directory-structure
```bash
assets/
components/ # shared .vue
layouts/
middleware/
pages/ # vue-router (_xx/ this.$route.params.xx)
plugins/
static/ # serve raw file (favicon.ico, robots.txt)
store/ # vuex
nuxt.config.js # webpack (**/* => .html, .js, .css)
package.json
```

---

3. Vue file
https://vuejs.org/v2/guide/single-file-components.html
```vue
<template>
  <pre class="hoho">{{ haha }}</pre>
</template>

<script>
export default {
  data () {
    return {
      haha: null
    }
  },
  async mounted () {
    let { data } = await this.$axios.get('https://dev.cerescloud.io/version.json'
    this.haha = data
  }
}
</script>

<style>
.hoho { color: red; }
</style>
```
