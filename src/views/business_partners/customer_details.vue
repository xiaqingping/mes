<template>
  <div>123 {{ $t('lang') }} </div>
</template>

<script>
export default {
  name: 'A',
  mounted () {
    console.log(this);
    console.log(this.$t('lang'));
  }
};
</script>

<style>

</style>
