import api from '@/api';

const SeqModel = {
  namespace: 'seq',
  state: {
    // 载体系列
    carrierSeries: [],
    // 样品类型
    sampleType:[],
    // 测序类型
    seqType: [],
    // 样品类型
    sampleTypeId: [
      { id:1,name:'PCR产物(已纯化)' },
      { id:2,name:'PCR产物(未纯化)' },
      { id:3,name:'DNA/CDNA' },
      { id:4,name:'菌株' },
      { id:5,name:'质粒' },
      { id:6,name:'血样' },
      { id:7,name:'荧光PCR产物' },
      { id:8,name:'菌株特殊测序' },
    ],
    // 样品特性
    sampleFeature: [
      { id:1,name:'噬菌体质粒' },
      { id:2,name:'病毒DNA' },
      { id:3,name:'低拷贝' },
      { id:4,name:'重复序列' },
      { id:5,name:'复杂结构' },
      { id:6,name:'GC Rich' },
    ],
    // 浓度
    nongdu: [
      { id:1,name:'10' },
      { id:2,name:'20' },
      { id:3,name:'30' },
      { id:4,name:'50' },
    ],
    // 测序点
    seqfactoryIdList: [
      { id:1,name:'上海测序点' },
      { id:2,name:'广州测序点' },
      { id:3,name:'北京测序点' },
      { id:4,name:'武汉测序点' },
      { id:5,name:'成都测序点' },
      { id:6,name:'昆明测序点' },
      { id:7,name:'长春测序点' },
      { id:8,name:'青岛测序点' },
      { id:9,name:'西安测序点' },
      { id:10,name:'南京测序点' },
      { id:11,name:'郑州测序点' },
      { id:12,name:'长沙测序点' },
    ],
    // factory测序点工厂
    factory:[
      { id:3100,name:'生工上海工厂' },
      { id:3101,name:'生工北京工厂' },
      { id:3102,name:'生工广州工厂' },
      { id:3103,name:'生工武汉工厂' },
      { id:3105,name:'生工成都工厂' },
      { id:3106,name:'生工青岛工厂' },
      { id:3107,name:'生工南京工厂' },
      { id:3108,name:'生工郑州工厂' },
      { id:3109,name:'生工长春工厂' },
    ]
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
    // *getSampleFeature({ payload }, { call, put }) {
    //   const response = yield call(api.sampletype.getSampleFeature, payload);
    //   yield put({
    //     type: 'setSeqType',
    //     payload: response,
    //   });
    // },
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
    // setSampleFeature(state, action) {
    //   const data = (action.payload && action.payload.filter(e => e.status === 1)) || [];
    //   return { ...state, seqfactoryName: data };
    // },
  },
};
export default SeqModel;
