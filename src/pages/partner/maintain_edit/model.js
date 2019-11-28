import bp from '@/api/bp';

const initDetails = {
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
    purchaseOrganizationList: [],
    paymentBank: {},
  },
  organizationCertification: {},
  piCertificationList: [],
  creditList: [],
};

const SeqModel = {
  namespace: 'bpEdit',
  state: {
    // 修改BP时，把查询到的BP详细数据做一个备份
    oldDetails: null,
    // BP 详细数据
    details: null,
    // 编辑状态 add 新增，update 修改
    editType: '',
  },
  effects: {
    // 根据参数，获取BP详细数据
    *readBPDetails({ payload }, { call, put }) {
      try {
        const { id, ...query } = payload;
        const { customerDataStatus, vendorDataStatus } = query;
        let details = JSON.parse(JSON.stringify(initDetails));

        // 客户
        if (customerDataStatus === '1') {
          const customer = yield call(bp.getBPCustomer, id);
          details = { ...details, ...customer };
        }

        // 供应商
        if (vendorDataStatus === '1') {
          const vendor = yield call(bp.getBPVendor, id);
          details = { ...details, ...vendor };
        }

        // TODO: 默认类型为组织
        // details.basic.type = 2;

        yield put({
          type: 'setState',
          payload: { type: 'details', data: JSON.parse(JSON.stringify(details)) },
        });
        yield put({
          type: 'setState',
          payload: { type: 'oldDetails', data: JSON.parse(JSON.stringify(details)) },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    setState(state, action) {
      const {
        payload: { type, data },
      } = action;
      return { ...state, [type]: data };
    },
    // 新增BP时初始化数据结构
    addInitDetails(state) {
      const details = JSON.parse(JSON.stringify(initDetails));
      return { ...state, details };
    },
  },
};
export default SeqModel;
