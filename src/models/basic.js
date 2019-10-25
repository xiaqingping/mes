import basic from '@/api/basic';

const namespace = 'basic';

const INIT_STATE = {
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
  // 供应商帐户组主数据（T077Y ）
  vonderAccountGroups: [],
  // 客户帐户组主数据（T077D(T077X) ）
  customerAccountGroups: [],
  // 排序码主数据
  sortKeys: [],
  // 支付方式主数据(供应商公司代码数据)
  paymentMethods: [],
  // 采购组主数据
  purchaseGroups: [],
  // 销售组织 + 公司代码数据
  salesOrganizationCompany: [],
  // 销售组织 + 分销渠道 + 工厂数据
  salesOrganizationDistributionChannelPlant: [],
  // 工厂主数据
  plants: [],
  // 销售范围+销售办事处(大区)数据
  salesAreaRegion: [],
  // 公司代码+工厂数据
  companyPlant: [],
  // 采购组织数据
  purchaseOrganizations: [],
  // 采购组织对应公司代码关系数据
  purchaseOrganizationCompany: [],
  // 国家+税收类别主数据
  countryTaxOutputCategory: [],
  // 税收城市代码主数据
  taxesCitys: [],
  // 税收县代码主数据
  taxesCounties: [],
  // 行业类别
  industryCategories: [],
  // 国家+时区
  countryTimeZone: [],
  // 国家+（省）地区+时区
  countryProvinceTimeZone: [],
};

const BasicModel = {
  namespace,
  state: INIT_STATE,
  effects: {
    /**
     * 获取此命名空间内的缓存数据
     * @param {Object} payload = {type, options}
     */
    *getCache({ payload }, { call, put }) {
      const { type, options } = payload;
      let response;

      // 数据请求接口
      const methods = {
        // countrys: basic.getCountrys,
      }

      // 确定请求方法
      let method;
      if (methods[type]) {
        method = methods[type];
      } else {
        const methodName = `get${type.slice(0, 1).toUpperCase()}${type.slice(1)}`;
        if (!basic[methodName]) {
          console.log(`${namespace} getCache type=${type} 对应的接口不存在`);
          return;
        }
        method = basic[methodName];
      }

      // 请求数据
      try {
        response = yield call(method, options);
      } catch (error) {
        console.log(error);
      }

      // 设置数据
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
  subscriptions: {
    setup() {
    },
  },
};
export default BasicModel;
