<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    const cache = this.$ls.get('cache');
    this.$store.commit('setCacheByLocalStorage', cache);
  }
};
</script>
