import basic from '@/api/basic';

const BasicModel = {
  namespace: 'basic',
  state: {
    // 国家
    countrys: [],
  },
  effects: {
    *getCountrys({ payload }, { call, put }) {
      try {
        const countrys = yield call(basic.getCountrys, payload);
        yield put({
          type: 'setCountrys',
          payload: countrys,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    setCountrys(state, { payload }) {
      return { ...state, countrys: payload };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default BasicModel;
