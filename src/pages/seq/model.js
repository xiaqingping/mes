import api from '@/api';

const SeqModel = {
  namespace: 'seq',
  state: {
    carrierSeries: [],
  },
  effects: {
    *getCarrierSeries({ payload }, { call, put }) {
      const response = yield call(api.series.getSeries, payload);
      yield put({
        type: 'setCarrierSeries',
        payload: response,
      });
    },
  },
  reducers: {
    setCarrierSeries(state, action) {
      const data = (action.payload && action.payload.filter(e => e.status === 1)) || [];
      return { ...state, carrierSeries: data };
    },
  },
};
export default SeqModel;
