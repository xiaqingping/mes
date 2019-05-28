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
    setCache (state, payload) {
      state[payload.type] = payload.data;
    }
  },
  actions: {
    getCache (context, payload) {
      const { type } = payload;
      var map = {
        factorys: basic.getFactorys,
        offices: basic.getOffices,
        paymethods: basic.getPaymethods,
        payterms: basic.getPayterms,
        regions: basic.getRegions
      };
      map[type]().then(data => {
        context.commit('setCache', { type, data });
      });
    }
  }
};
