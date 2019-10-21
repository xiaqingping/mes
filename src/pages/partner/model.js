const SeqModel = {
  namespace: 'partnerMaintainEdit',
  state: {
    details: null,
    type: null,
    supplier: null,
  },
  effects: {},
  reducers: {
    setDetails(state, action) {
      return { ...state, details: action.payload };
    },
    setType(state, action) {
      return { ...state, type: action.payload };
    },
    setSupplier(state, action) {
      return { ...state, supplier: action.payload };
    },
  },
};
export default SeqModel;
