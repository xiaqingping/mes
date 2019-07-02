import Vue from 'vue';

import VueStorage from 'vue-ls';

// vue-ls 缓存参数
const lsOptions = {
  namespace: 'mes_',
  name: 'ls',
  storage: 'local'
};

Vue.use(VueStorage, lsOptions);
