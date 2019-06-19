import { basic } from '@/api';

export default {
  namespaced: true,
  state: {
    // 通用数据状态
    status: [
      { id: 1, name: '正常' },
      { id: 2, name: '已删除' }
    ],
    // 工厂
    factorys: [],
    // 仓库
    storages: [],
    // 网点
    offices: [],
    // 付款方式
    paymethods: [],
    // 付款条件
    payterms: [],
    // 大区
    regions: [],
    // 品牌
    brands: [
      { 'code': '001', 'name': '进口分装' },
      { 'code': '002', 'name': '生工' },
      { 'code': '003', 'name': 'Worthington' },
      { 'code': '004', 'name': 'G-Bios' },
      { 'code': '005', 'name': '进口' },
      { 'code': '006', 'name': '国产' },
      { 'code': '007', 'name': 'HANNA' },
      { 'code': '008', 'name': '康宁' },
      { 'code': '009', 'name': '耶拿' },
      { 'code': '010', 'name': '大龙' },
      { 'code': '011', 'name': '复日科技' },
      { 'code': '012', 'name': 'KleanAB' },
      { 'code': '013', 'name': '康健' },
      { 'code': '014', 'name': '振威' },
      { 'code': '015', 'name': '双杰' },
      { 'code': '016', 'name': '杭州仪表' },
      { 'code': '017', 'name': '虹益' },
      { 'code': '018', 'name': '天达' },
      { 'code': '019', 'name': '沪西' },
      { 'code': '020', 'name': '华利达' },
      { 'code': '021', 'name': '百晶' },
      { 'code': '022', 'name': 'QSP' },
      { 'code': '023', 'name': 'Simport' },
      { 'code': '024', 'name': '3M' },
      { 'code': '025', 'name': 'Amresco' },
      { 'code': '026', 'name': 'Spetrum' },
      { 'code': '027', 'name': 'Parafilm' },
      { 'code': '028', 'name': '欧西亚' },
      { 'code': 'BBI', 'name': 'BBI' },
      { 'code': 'MBI', 'name': 'MBI' }
    ]
  },
  mutations: {
    setCache (state, payload) {
      // 对返回的数据进行加工处理
      const processMap = {
        storages (arr) {
          arr.forEach(function (e) {
            e.text = e.code + ' - ' + e.name;
          });
          return arr;
        },
        factorys (arr) {
          arr.forEach(function (e) {
            e.text = e.code + ' - ' + e.name;
          });
          return arr;
        }
      };

      if (processMap[payload.type]) {
        payload.data = processMap[payload.type](payload.data);
      }
      state[payload.type] = payload.data;
    }
  },
  actions: {
    getCache (context, payload = { type: null }) {
      var methods = {
        factorys: basic.getFactorys,
        offices: basic.getOffices,
        paymethods: basic.getPaymethods,
        payterms: basic.getPayterms,
        regions: basic.getRegions,
        storages: basic.getStorages
      };
      const { type } = payload;

      // 如果存在type则只获取type对应的数据，否则获取全部数据
      if (type) {
        methods[type]().then(data => {
          context.commit('setCache', { type, data });
        });
      } else {
        for (const type in methods) {
          methods[type]().then(data => {
            context.commit('setCache', { type, data });
          });
        }
      }
    }
  }
};
