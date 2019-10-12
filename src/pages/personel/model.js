import api from '@/api';

const PersonelModel = {
  namespace: 'personel',
  state: {
    // 订单类型状态
    status: [
      { id: 0, name: '全部' },
      { id: 1, name: '正常' },
      { id: 2, name: '已删除' },
    ],
    month: [
      { id:0,name:'1' },
      { id:1,name:'2' },
      { id:2,name:'3' },
      { id:3,name:'4' },
      { id:4,name:'5' },
      { id:5,name:'6' },
      { id:6,name:'7' },
      { id:7,name:'8' },
      { id:8,name:'9' },
      { id:9,name:'10' },
      { id:10,name:'11' },
      { id:11,name:'12' }

    ],
    year: [
      { id:1,name:'2019' },
      { id:2,name:'2018' },
      { id:3,name:'2017' },
      { id:4,name:'2016' },
      { id:5,name:'2015' }
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
