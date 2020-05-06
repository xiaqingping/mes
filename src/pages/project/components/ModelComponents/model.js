const projectModel = {
  namespace: 'componentsModel',
  state: {
    // 颜色
    colorStore: [],
  },
  effects: {},
  reducers: {
    setColorStore(state, action) {
      return {
        ...state,
        colorStore: action.payload,
      };
    },
  },
};
export default projectModel;
