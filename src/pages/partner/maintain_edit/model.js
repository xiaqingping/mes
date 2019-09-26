const SeqModel = {
  namespace: 'partnerMaintainEdit',
  state: {
    details: null,
  },
  effects: {},
  reducers: {
    setDetails(state, action) {
      return { ...state, details: action.payload };
    },
  },
};
export default SeqModel;
