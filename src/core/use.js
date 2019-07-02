import Vue from 'vue';

import api from '@/api';
import utils from '@/assets/js/utils';
import './directives/action';

import './ant-design-vue';
import './table';

import './vue-ls';

Vue.prototype.$api = api;
Vue.prototype.$utils = utils;
