const Model = {
  namespace: 'partner_maintain',
  state: {
    details: {},
  },
  effects: {
    *read({ payload }, { call, put }) {
      const response = {
        name: 'max',
        age: 26,
      };
      yield put({
        type: 'setDetails',
        payload: response,
      });
    },
  },
  reducers: {
    setDetails(state, action) {
      return { ...state, details: action.payload || {} };
    },
  },
};
export default Model;
