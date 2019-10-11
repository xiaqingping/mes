import api from '@/api';

const PersonelModel = {
  namespace: 'personel',
  state: {
    carrierSeries: [],
  },
  effects: {
    *getCarrierSeries({ payload }, { call, put }) {
      const response = yield call(api.series.getSeries, payload);
      yield put({
        type: 'personelPay',
        payload: response,
      });
    },
  },
  reducers: {
    personelPay(state, action) {
      const data = (action.payload && action.payload.filter(e => e.status === 1)) || [];
      return { ...state, carrierSeries: data };
    },
  },
};
export default PersonelModel;
