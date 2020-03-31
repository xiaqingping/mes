import basic from '@/api/basic';
import { formatSelectData, getCache, setCache } from '@/utils/utils';

const namespace = 'htsCache';

const INIT_STATE = {
  // 基础数据状态
  basicStatus: [
    { id: 1, name: '正常' },
    { id: 2, name: '已删除' },
  ],
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
