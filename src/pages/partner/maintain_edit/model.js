import bp from '@/api/bp';

const SeqModel = {
  namespace: 'bpEdit',
  state: {
    details: null,
    editType: '',
    uuid: '',
  },
  effects: {
    // 根据参数，获取BP详细数据
    *readBPDetails({ payload }, { call, put }) {
      try {
        const { id } = payload;
        // 客户数据
        const customer = yield call(bp.getBPCustomer, id);
        // 供应商数据
        const vendor = yield call(bp.getBPVendor, id);

        const details = { ...customer, ...vendor };

        yield put({
          type: 'setState',
          payload: { type: 'details', data: details },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    setState(state, action) {
      console.log(action);
      const {
        payload: { type, data },
      } = action;
      return { ...state, [type]: data };
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
