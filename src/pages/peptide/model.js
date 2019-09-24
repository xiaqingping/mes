import api from '@/api';

const Model = {
  namespace: 'peptide',
  state: {
    orderList: [],
    // 修饰位置
    commonData: {
      modificationPosition: [
        { id: 1, name: '氨基端' },
        { id: 2, name: '羧基端' },
        { id: 3, name: '中间' },
        { id: 4, name: '成环' },
        { id: 5, name: '二硫键' },
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
        { id: 9, name: '部分发货' },
      ],
      // 销售组织
      rangeOrganization: [
        { id: '', name: '全部' },
        { id: 3110, name: '国内' },
        { id: 3120, name: '国外' },
      ],
      // 分销渠道
      rangeChannel: [
        { id: '', name: '全部' },
        { id: 10, name: '直销' },
        { id: 20, name: '电商' },
        { id: 99, name: '公司间' },
      ],
      // 销售范围
      rangeArea: [
        { id: '10-3110', name: '直销-国内' },
        { id: '10-3120', name: '直销-国外' },
        { id: '99-3120', name: '公司间-国外' },
        { id: '20-3110', name: '电商-国内' },
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
        { id: '08', name: '总部-网点送货' },
      ],
      // 是否随货开票状态
      invoiceByGoodsStatus: [
        { id: 0, name: '否' },
        { id: 1, name: '是' },
      ],
      // 订单类型状态
      orderTypeStatus: [
        { id: 0, name: '标准订单' },
        { id: 1, name: '内部订单' },
      ],
      status: [
        { id: 1, name: '正常' },
        { id: 2, name: '已删除' },
      ],
    },
    // 修饰类型
    modificationTypes: [],
    // 纯度
    purity: [],
    // 销售大区
    regions: [],
    // 销售网点
    offices: [],
    // 开票类型
    invtypes: [],
    // 付款方式
    payMethods: [],
    // 付款条件
    payTerms: [],
    // 币种类型
    currencys: [],
  },
  effects: {
    // 多肽订单
    *getOrder({ payload }, { call, put }) {
      const response = yield call(api.peptideorder.getOrder, payload);
      yield put({
        type: 'orderList',
        payload: response,
      });
    },
    // 销售大区
    *getRegions({ payload }, { call, put }) {
      const response = yield call(api.basic.getRegions, payload);
      yield put({
        type: 'regions',
        payload: response,
      });
    },
    // 销售网点
    *getOffices({ payload }, { call, put }) {
      const response = yield call(api.basic.getOffices, payload);
      yield put({
        type: 'offices',
        payload: response,
      });
    },
    // 开票类型
    *getInvtypes({ payload }, { call, put }) {
      const response = yield call(api.basic.getInvtypes, payload);
      yield put({
        type: 'invtypes',
        payload: response,
      });
    },
    // 付款方式
    *getPaymethods({ payload }, { call, put }) {
      const response = yield call(api.basic.getPaymethods, payload);
      yield put({
        type: 'payMethods',
        payload: response,
      });
    },
    // 付款方式
    *getPayterms({ payload }, { call, put }) {
      const response = yield call(api.basic.getPayterms, payload);
      yield put({
        type: 'payTerms',
        payload: response,
      });
    },
    // 付款方式
    *getCurrencys({ payload }, { call, put }) {
      const response = yield call(api.basic.currencys, payload);
      yield put({
        type: 'currencys',
        payload: response,
      });
    },
  },
  reducers: {
    orderList(state, action) {
      return { ...state, orderList: action.payload };
    },
    regions(state, action) {
      return { ...state, regions: action.payload };
    },
    offices(state, action) {
      return { ...state, offices: action.payload };
    },
    invtypes(state, action) {
      return { ...state, invtypes: action.payload };
    },
    payMethods(state, action) {
      return { ...state, payMethods: action.payload };
    },
    payTerms(state, action) {
      return { ...state, payTerms: action.payload };
    },
    currencys(state, action) {
      return { ...state, currencys: action.payload };
    },
  },
};
export default Model;
