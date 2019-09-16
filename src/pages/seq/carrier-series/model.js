import { getSeries } from './service';

const Model = {
  namespace: 'SeqCarrierSeries',
  state: {
    list: [],
    total: 0,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getSeries, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload.rows, total: action.payload.total };
    },
  },
};
export default Model;
