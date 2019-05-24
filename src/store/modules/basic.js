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
    factorys (state, payload) {
      state.factorys = payload;
    },
    offices (state, payload) {
      state.offices = payload;
    },
    paymethods (state, payload) {
      state.paymethods = payload;
    },
    payterms (state, payload) {
      state.payterms = payload;
    },
    regions (state, payload) {
      state.regions = payload;
    }
  },
  actions: {
    factorys (context) {
      basic.getFactorys().then(res => {
        context.commit('factorys', res);
      });
    },
    offices (context) {
      basic.getOffices().then(res => {
        context.commit('offices', res);
      });
    },
    paymethods (context) {
      basic.getPaymethods().then(res => {
        context.commit('paymethods', res);
      });
    },
    payterms (context) {
      basic.getPayterms().then(res => {
        context.commit('payterms', res);
      });
    },
    regions (context) {
      basic.getRegions().then(res => {
        context.commit('regions', res);
      });
    }
  }
};
