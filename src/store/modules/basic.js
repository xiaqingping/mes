import { basic } from '@/api';

export default {
  namespaced: true,
  state: {
    // 工厂
    factorys: [],
    // 网点
    offices: [],
    // 付款方式
    paymethods: [],
    // 付款条件
    payterms: [],
    // 大区
    regions: []
  },
  mutations: {
    set_factorys (state, payload) {
      state.factorys = payload;
    },
    set_offices (state, payload) {
      state.offices = payload;
    },
    set_paymethods (state, payload) {
      state.paymethods = payload;
    },
    set_payterms (state, payload) {
      state.payterms = payload;
    },
    set_regions (state, payload) {
      state.regions = payload;
    }
  },
  actions: {
    get_factorys (context) {
      basic.getFactorys().then(res => {
        context.commit('set_factorys', res);
      });
    },
    get_offices (context) {
      basic.getOffices().then(res => {
        context.commit('set_offices', res);
      });
    },
    get_paymethods (context) {
      basic.getPaymethods().then(res => {
        context.commit('set_paymethods', res);
      });
    },
    get_payterms (context) {
      basic.getPayterms().then(res => {
        context.commit('set_payterms', res);
      });
    },
    get_regions (context) {
      basic.getRegions().then(res => {
        context.commit('set_regions', res);
      });
    }
  }
};
