import { pay } from '@/api';

export default {
  state: {
    // 状态
    status: [
      { id: 1, name: '正常' },
      { id: 2, name: '已删除' }
    ],
    type: [
      { id: 1, name: '工资项目' },
      { id: 2, name: '扣款项目' },
      { id: 3, name: '代发项目' },
      { id: 4, name: '代缴项目' }
    ],
    year: [
      { id: 2019, name: '2019' },
      { id: 2018, name: '2018' },
      { id: 2017, name: '2017' },
      { id: 2016, name: '2016' },
      { id: 2015, name: '2015' }
    ],
    month: [
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
      { id: 4, name: '4' },
      { id: 5, name: '5' },
      { id: 6, name: '6' },
      { id: 7, name: '7' },
      { id: 8, name: '8' },
      { id: 9, name: '9' },
      { id: 10, name: '10' },
      { id: 11, name: '11' },
      { id: 12, name: '12' }
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
        purity: pay.getPurityAll
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
