import { sampletype, seqfactory, series } from '@/api';

export default {
  namespaced: true,
  state: {
    // 取样单状态
    sampleOrderStatus: [
      { id: 1, name: '未确认' },
      { id: 2, name: '已确认' },
      { id: 3, name: '网点收样' },
      { id: 4, name: '部门收样' },
      { id: 5, name: '已转订单' },
      { id: 6, name: '已作废' }
    ],
    // 取样方式
    sampleMethod: [
      { id: 1, name: '网点取样' },
      { id: 2, name: '快递送样' },
      { id: 3, name: '无需取样' }
    ],
    // 引物类型
    primerType: [
      { id: 1, name: '通用' },
      { id: 2, name: '自带' },
      { id: 3, name: '合成' }
    ],
    // 引物状态
    primerStatus: [
      { id: 1, name: '未使用' },
      { id: 2, name: '待合成' },
      { id: 3, name: '合成中' },
      { id: 4, name: '待收样' },
      { id: 5, name: '已收样' },
      { id: 6, name: '已失效' },
      { id: 7, name: '已作废' }
    ],
    // 样品类型
    sampleType: [],
    // 测序点
    seqfactory: [],
    // 测序类型
    seqType: [],
    // 载体系列
    series: [],
    // 浓度
    concentration: [
      { id: 10, name: 10 },
      { id: 20, name: 20 },
      { id: 30, name: 30 },
      { id: 50, name: 50 }
    ],
    // 样品特性
    sampleFeature: [],
    // 统一附加费
    surcharge: [
      { id: 1, name: '√' },
      { id: 2, name: '' }
    ],
    // 反应状态
    reactionStatus: [
      { id: 1, name: '未排板' },
      { id: 2, name: '已暂停' },
      { id: 3, name: '排板中' },
      { id: 4, name: '排板完成' },
      { id: 5, name: '测序中' },
      { id: 6, name: '待分析' },
      { id: 7, name: '已分析' },
      { id: 8, name: '已完成' },
      { id: 9, name: '重新制备' },
      { id: 10, name: '重新反应' },
      { id: 11, name: '已失败' },
      { id: 12, name: '已取消' }
    ],
    // 反应板状态
    reactionBoardStatus: [
      { id: 1, name: '未排板' },
      { id: 2, name: '排板中' },
      { id: 3, name: '排板完成' },
      { id: 4, name: '已上机' },
      { id: 5, name: '上机完成' },
      { id: 6, name: '已取消' }
    ]
  },
  mutations: {
    setCache (state, payload) {
      // 对返回的数据进行加工处理
      const processMap = {};
      if (processMap[payload.type]) {
        payload.data = processMap[payload.type](payload.data);
      }

      state[payload.type] = payload.data;
    }
  },
  actions: {
    getCache (context, payload = { type: null }) {
      const methods = {
        sampleType: sampletype.getSampleType,
        seqfactory: seqfactory.getSeqfactory,
        seqType: sampletype.getSeqType,
        sampleFeature: sampletype.getSampleFeature,
        series: series.getSeries
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
