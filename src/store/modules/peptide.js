import { peptideBase } from '@/api';

export default {
  namespaced: true,
  state: {
  // 修饰位置
    modificationPosition: [
      { id: 1, name: '氨基端' },
      { id: 2, name: '羧基端' },
      { id: 3, name: '中间' },
      { id: 4, name: '成环' },
      { id: 5, name: '二硫键' }
    ],
    // 订单状态
    orderStatus: [
      { id: 1, name: '未审核' },
      { id: 2, name: '部门审核' },
      { id: 3, name: '已审核' },
      { id: 4, name: '已转申请' },
      { id: 5, name: '已收货' },
      { id: 6, name: '已发货' },
      { id: 7, name: '已作废' },
      { id: 8, name: '部分收货' },
      { id: 9, name: '部分发货' }
    ],
    // 销售组织
    rangeOrganization: [
      { id: '', name: '全部' },
      { id: 3110, name: '国内' },
      { id: 3120, name: '国外' }
    ],
    // 分销渠道
    rangeChannel: [
      { id: '', name: '全部' },
      { id: 10, name: '直销' },
      { id: 20, name: '电商' },
      { id: 99, name: '公司间' }
    ],
    // 销售范围
    rangeArea: [
      { id: '10-3110', name: '直销-国内' },
      { id: '10-3120', name: '直销-国外' },
      { id: '99-3120', name: '公司间-国外' },
      { id: '20-3110', name: '电商-国内' }
    ],
    // 交货方式
    deliveryTypeStatus: [
      { id: '01', name: '总部直发' },
      { id: '02', name: '总部送货' },
      { id: '03', name: '网点直发' },
      { id: '04', name: '网点送货' },
      { id: '05', name: '自取' },
      { id: '06', name: '服务' },
      { id: '07', name: '总部-网点直发' },
      { id: '08', name: '总部-网点送货' }
    ],
    // 是否随货开票状态
    invoiceByGoodsStatus: [
      { id: 0, name: '否' },
      { id: 1, name: '是' }
    ],
    // 币种
    currency: [
      { id: 'CNY', name: 'CNY' },
      { id: 'USD', name: 'USD' },
      { id: 'CAD', name: 'CAD' },
      { id: 'EUR', name: 'EUR' },
      { id: 'GBP', name: 'GBP' }
    ],
    // 订单类型状态
    orderTypeStatus: [
      { id: 0, name: '标准订单' },
      { id: 1, name: '内部订单' }
    ],
    status: [
      { id: 1, name: '正常' },
      { id: 2, name: '已删除' }
    ],
    // 纯度
    purity: []
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
        purity: peptideBase.getPurityAll
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
