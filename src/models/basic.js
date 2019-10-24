import basic from '@/api/basic';

const BasicModel = {
  namespace: 'basic',
  state: {
    // 国家
    countrys: [],
    // 地区（省）
    provinces: [],
    // 税号类别
    taxNumberCategories: [],
    // BP角色
    bpRoles: [],
    // 客户销项税分类主数据(客户税款)(免税,必须上税...)
    taxOutputClassifics: [],
    // 定价条件类型(销项税收类别)主数据(MWST)
    taxOutputCategories: [],
    // 总账科目
    glAccounts: [],
    // 付款条件
    paymentTerms: [],
    // 国家拨号代码
    countryDiallingCodes: [],
    // 销售区域
    salesDistricts: [],
    // 客户组
    salesPaymentMethods: [],
    // 销售办公室+销售组
    regionOffice: [],
    // 销售办公室主数据（大区）
    regions: [],
    // 销售组主数据(网点)
    offices: [],
    // 货币代码
    currencies: [],
    // 销售范围主数据
    salesArea: [],
    // 销售组织主数据
    salesOrganizations: [],
    // 分销渠道主数据
    distributionChannels: [],
    // 产品组主数据
    salesDivisions: [],
    // 定价过程的客户分类(Cust.Pric.过程)数据
    customerPricingProcedures: [],
    // 客户统计组主数据
    customerStatGroups: [],
    // 装运条件主数据
    shippingConditions: [],
    // 客户科目分配组主数据
    customerAccountAssignmentGroups: [],
    // 客户组 1主数据（金税发票类型）
    taxInvoiceTypes: [],
    // 客户组 2主数据（新客户分类）
    customerCategories: [],
    // 销售订单冻结主数据
    salesOrderBlocks: [],
    // 公司代码主数据
    companys: [],

  },
  effects: {
    *getCache({ payload }, { call, put }) {
      const { type, options } = payload;

      // 数据请求接口
      const methods = {
        countrys: basic.getCountrys,
      }

      const response = yield call(methods[type], options);

      yield put({
        type: 'setCache',
        payload: { type, response },
      });
    },
  },
  reducers: {
    setCache(state, { payload }) {
      const { type, response } = payload;

      // 数据处理方法
      const format = {};

      const data = (format[type] && format[type](response)) || response;

      return { ...state, [type]: data };
    },
  },
  subscriptions: {},
};
export default BasicModel;
