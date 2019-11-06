import basic from '@/api/basic';

const namespace = 'peptide';
const Model = {
  namespace,

  state: {
    // // 订单列表数据
    // orderList: [],
    // // 列表数据
    // data: [],
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
        { id: 0, name: '全部' },
        { id: 1, name: '正常' },
        { id: 2, name: '已删除' },
      ],
      // 品牌
    brands: [
      { code: '001', name: '进口分装' },
      { code: '002', name: '生工' },
      { code: '003', name: 'Worthington' },
      { code: '004', name: 'G-Bios' },
      { code: '005', name: '进口' },
      { code: '006', name: '国产' },
      { code: '007', name: 'HANNA' },
      { code: '008', name: '康宁' },
      { code: '009', name: '耶拿' },
      { code: '010', name: '大龙' },
      { code: '011', name: '复日科技' },
      { code: '012', name: 'KleanAB' },
      { code: '013', name: '康健' },
      { code: '014', name: '振威' },
      { code: '015', name: '双杰' },
      { code: '016', name: '杭州仪表' },
      { code: '017', name: '虹益' },
      { code: '018', name: '天达' },
      { code: '019', name: '沪西' },
      { code: '020', name: '华利达' },
      { code: '021', name: '百晶' },
      { code: '022', name: 'QSP' },
      { code: '023', name: 'Simport' },
      { code: '024', name: '3M' },
      { code: '025', name: 'Amresco' },
      { code: '026', name: 'Spetrum' },
      { code: '027', name: 'Parafilm' },
      { code: '028', name: '欧西亚' },
      { code: 'BBI', name: 'BBI' },
      { code: 'MBI', name: 'MBI' },
    ],
    },
    // // 修饰类型
    // modificationTypes: [],
    // // 纯度
    // purity: [],
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
    currencies: [],
    // 销售范围
    salesRanges: [],
  },
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
      targetState = JSON.parse(localStorage.getItem(`${namespace}/${type}`));

      if (!targetState) {
        // 三：数据请求接口
        const methods = {
          // countrys: basic.getCountrys,
        }

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
      const format = {};

      const data = (format[type] && format[type](targetState)) || targetState;

      // 将数据存到浏览器缓存中
      localStorage.setItem(`${namespace}/${type}`, JSON.stringify(data));
      return { ...state, [type]: data };
    },
  },
};
export default Model;
