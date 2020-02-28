import basic from '@/api/basic';
import { formatSelectData, getCache, setCache } from '@/utils/utils';

const namespace = 'basicCache';

const INIT_STATE = {
  // 基础数据状态
  basicStatus: [
    { id: 1, name: '正常' },
    { id: 2, name: '已删除' },
  ],
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
  // 仓库
  storages: [],
  // 工厂 // TODO: 废弃，使用plants
  // factorys: [],
};

const BasicModel = {
  namespace,
  state: INIT_STATE,
  effects: {
    /**
     * 获取此命名空间内的缓存数据
     * @param {Object} payload = {type：要请求的缓存数据, options：请求上传递的参数}
     */
    *getCache(action, effects) {
      // 数据请求方法
      const customApi = {
        // countrys: basic.getCountrys,
      };

      yield getCache(namespace, action, effects, basic, customApi);
    },
  },
  reducers: {
    setCache(state, { payload }) {
      // 数据处理方法
      const processing = {
        plants: list => formatSelectData(list),
        storages: list => formatSelectData(list),
      };

      const { type, data } = setCache(namespace, payload, processing);

      return { ...state, [type]: data };
    },
  },
  subscriptions: {
    setup() {},
  },
};
export default BasicModel;
