import Vue from 'vue';
import Storage from 'vue-ls';

const options = {
  namespace: 'mes_',
  name: 'ls',
  storage: 'local'
};

Vue.use(Storage, options);
