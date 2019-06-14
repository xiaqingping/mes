<template>
  <a-select
    style="width:100%; height:100%;"
    size="small"
    v-model="value"
  >
    <a-select-option v-for="item in list" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
  </a-select>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      value: null
    };
  },
  methods: {
    getValue () {
      return this.value;
    },
    isPopup () {
      return false;
    },
    // isCancelBeforeStart () {},
    // isCancelAfterEnd () {},
    onClick () {
      this.params.api.stopEditing();
    },
    onKeyDown (event) {
      const key = event.which || event.keyCode;
      if (key === 37 || key === 39) {
        event.stopPropagation();
      }
    }
  },
  created () {
    this.list = this.params.list;
    this.value = this.params.value;
  },
  mounted () {}
};
</script>
