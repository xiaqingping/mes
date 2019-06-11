import Vue from 'vue';

import VueStorage from 'vue-ls';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import api from '@/api';
import units from '@/assets/js/utils';
import './directives/action';

// ag-grid 企业版 未注册密钥，控制台会报错
import 'ag-grid-enterprise';
// import { LicenseManager } from 'ag-grid-enterprise';
// LicenseManager.setLicenseKey('your license key');

// vue-ls 缓存参数
const lsOptions = {
  namespace: 'mes_',
  name: 'ls',
  storage: 'local'
};

Vue.use(VueStorage, lsOptions);
Vue.use(Antd);

Vue.prototype.$api = api;
Vue.prototype.$units = units;
