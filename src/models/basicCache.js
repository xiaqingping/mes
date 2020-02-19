import basic from '@/api/basic';
import { formatSelectData } from '@/utils/utils'

const namespace = 'basicCache';

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
      const { payload } = action;
      const { call, put, select } = effects;
      const { type, options } = payload;

      let targetState;

      // 一：如果目标上已经有数据了，则放弃本次请求
      targetState = yield select(state => state[namespace][type]);
      // 类型：数组，检查 length
      if (targetState instanceof Array && targetState.length > 0) return;

      // 二：检查浏览器缓存数据是否有目标数据
      targetState = JSON.parse(sessionStorage.getItem(`${namespace}/${type}`));

      if (!targetState) {
        // 三：数据请求接口
        const methods = {
          // countrys: basic.getCountrys,
        };

        // 四：确定请求方法
        // example: type = countrys，则 methodName = getCountrys，如果你的接口命名规则与此不同，则需要将你的方法写到 methods 里
        let method;
        if (methods[type]) {
          method = methods[type];
        } else {
          const methodName = `get${type.slice(0, 1).toUpperCase()}${type.slice(1)}`;
          if (!basic[methodName]) {
            console.error(`${namespace} getCache type=${type} 对应的接口不存在`);
            return;
          }
          method = basic[methodName];
        }

        // 五：请求数据
        try {
          targetState = yield call(method, options);
        } catch (error) {
          console.error(`${namespace} getCache type=${type} 接口请求失败`);
        }
      }

      if (!targetState) return;

      // 六：设置数据
      yield put({
        type: 'setCache',
        payload: { type, targetState },
      });
    },
  },
  reducers: {
    setCache(state, { payload }) {
      const { type, targetState } = payload;

      // 数据处理方法
      const format = {
        plants(list) { return formatSelectData(list) },
        storages(list) { return formatSelectData(list) },
      };

      const data = (format[type] && format[type](targetState)) || targetState;

      // 将数据存到浏览器缓存中
      sessionStorage.setItem(`${namespace}/${type}`, JSON.stringify(data));

      return { ...state, [type]: data };
    },
  },
  subscriptions: {
    setup() {},
  },
};
export default BasicModel;
