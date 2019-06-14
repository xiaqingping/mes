import Vue from 'vue';

export default Vue.extend({
  template: `
    <a-select 
      ref="select"
      style="width:100%; height:100%;"
      size="small"
      v-model="value"
      @select="select"
    >
      <a-select-option v-for="item in list" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
    </a-select>`,
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
    destroy () {
      console.log('销毁');
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
    },
    select () {
      // console.log('select');
      // console.log(this.$refs.select);
      // this.$refs.select.blur();
    }
  },
  created () {
    this.list = this.params.list;
    this.value = this.params.value;
  },
  mounted () {
    // console.log(this.$refs);
  }
});
