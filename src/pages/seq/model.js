import api from '@/api';

const SeqModel = {
  namespace: 'seq',
  state: {
    // 载体系列
    carrierSeries: [],
    // 样品类型
    sampleType: [],
    // 测序类型
    seqType: [],
  },
  effects: {
    *getCarrierSeries({ payload }, { call, put }) {
      const response = yield call(api.series.getSeries, payload);
      yield put({
        type: 'setCarrierSeries',
        payload: response,
      });
    },
    *getSampleType({ payload }, { call, put }) {
      const response = yield call(api.sampletype.getSampleType, payload);
      yield put({
        type: 'setSampleType',
        payload: response,
      });
    },
    *getSeqType({ payload }, { call, put }) {
      const response = yield call(api.sampletype.getSeqType, payload);
      yield put({
        type: 'setSeqType',
        payload: response,
      });
    },
  },
  reducers: {
    setCarrierSeries(state, action) {
      const data = (action.payload && action.payload.filter(e => e.status === 1)) || [];
      return { ...state, carrierSeries: data };
    },
    setSampleType(state, action) {
      const data = (action.payload && action.payload.filter(e => e.status === 1)) || [];
      return { ...state, sampleType: data };
    },
    setSeqType(state, action) {
      const data = (action.payload && action.payload.filter(e => e.status === 1)) || [];
      return { ...state, seqType: data };
    },
  },
};
export default SeqModel;
