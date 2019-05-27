export default {
  purity: [
    { id: 1, value: '30' },
    { id: 2, value: '75' },
    { id: 3, value: '80' },
    { id: 4, value: '85' },
    { id: 5, value: '90' },
    { id: 6, value: '95' },
    { id: 7, value: '98' }
  ],
  modificationsType: [
    { id: 0, value: '全部' },
    { id: 1, value: 'N terminus Modification' },
    { id: 2, value: 'Mid' },
    { id: 3, value: 'D form normal amino acid' },
    { id: 4, value: 'Unusual amino acid' },
    { id: 5, value: 'Methyl amino acids' },
    { id: 6, value: 'Phosphorylation' },
    { id: 7, value: 'Fluorescence/Dye Labeling' }
  ],
  modificationPosition: [
    { id: 1, name: '氨基端' },
    { id: 2, name: '羧基端' },
    { id: 3, name: '中间' },
    { id: 4, name: '成环' },
    { id: 5, name: '二硫键' }
  ],
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
  rangeOrganization: [
    { id: '', name: '全部' },
    { id: 3110, name: '国内' },
    { id: 3120, name: '国外' }
  ],
  rangeChannel: [
    { id: '', name: '全部' },
    { id: 10, name: '直销' },
    { id: 20, name: '电商' }
  ]
};
