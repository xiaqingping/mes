const SeqModel = {
  namespace: 'bpEdit',
  state: {
    details: null,
    editType: '',
  },
  effects: {},
  reducers: {
    setDetails(state, action) {
      return { ...state, details: action.payload };
    },
    setEditType(state, action) {
      return { ...state, editType: action.payload };
    },
  },
};
export default SeqModel;
