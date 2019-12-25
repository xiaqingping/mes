import api from '@/api';

const namespace = 'dashboard';
const Model = {
  namespace,

  state: {
    // 利润中心
    profitCenter: [],
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
      targetState = JSON.parse(sessionStorage.getItem(`${namespace}/${type}`));

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
          if (!api[methodName]) {
            console.error(`${namespace} getCache type=${type} 对应的接口不存在`);
            return;
          }
          method = api[methodName];
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
      sessionStorage.setItem(`${namespace}/${type}`, JSON.stringify(data));
      return { ...state, [type]: data };
    },
  },
};
export default Model;
