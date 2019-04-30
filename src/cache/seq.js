export default {
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
  ]
};
