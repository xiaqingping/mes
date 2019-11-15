const SeqModel = {
  namespace: 'bpEdit',
  state: {
    details: null,
    editType: '',
  },
  effects: {},
  reducers: {
    setDetails(state, action) {
      return { ...state, details: action.payload };
    },
    setEditType(state, action) {
      return { ...state, editType: action.payload };
    },
    // 新增BP时初始化数据结构
    addInitDetails(state) {
      const details = {
        basic: {},
        customer: {
          taxesCityCode: null,
          taxesCountyCode: null,
          salesOrderBlock: 2,
          salesAreaList: [],
          addressList: [],
        },
        vendor: {
          invoicePostBlock: 2,
          purchasingOrganizationList: [],
          paymentBank: {},
        },
        organizationCertification: {},
        piCertificationList: [],
        creditList: [],
      };
      return { ...state, details };
    },
  },
};
export default SeqModel;
