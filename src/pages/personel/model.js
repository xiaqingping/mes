import api from '@/api';

const PersonelModel = {
  namespace: 'personel',
  state: {
    // 月
    month: [
      { id:1,name:'1' },
      { id:2,name:'2' },
      { id:3,name:'3' },
      { id:4,name:'4' },
      { id:5,name:'5' },
      { id:6,name:'6' },
      { id:7,name:'7' },
      { id:8,name:'8' },
      { id:9,name:'9' },
      { id:10,name:'10' },
      { id:11,name:'11' },
      { id:12,name:'12' }
    ],
    // 年
    year: [
      { id:1,name:'2019' },
      { id:2,name:'2018' },
      { id:3,name:'2017' },
      { id:4,name:'2016' },
      { id:5,name:'2015' }
    ],
    // 类型
    type: [
      { id:1,name:'工资项目' },
      { id:2,name:'扣款项目' },
      { id:3,name:'代发项目' },
      { id:4,name:'代缴项目' }
    ]
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
