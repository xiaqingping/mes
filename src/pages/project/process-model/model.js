const projectModel = {
  namespace: 'processModel',
  state: {
    processAddData: {
      name: '',
      describe: '',
      picture: '',
      interactionAnalysis: '',
      version: '',
      // groups: [
      //   {
      //     sortNo: '',
      //     groupName: '',
      //     groupDesc: '',
      //     params: [
      //       {
      //         paramId: '',
      //         taskModelId: '',
      //         processModelId: '',
      //         sortNo: '',
      //       },
      //     ],
      //   },
      // ],
      taskModelIds: [],
    },
  },
  effects: {},
  reducers: {
    setProcessAddData(state, action) {
      return { ...state, processAddData: action.payload };
    },
  },
};
export default projectModel;
