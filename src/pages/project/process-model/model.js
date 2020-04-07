const projectModel = {
  namespace: 'processModel',
  state: {
    processAddData: {
      name: '',
      describe: '',
      picture: '',
      interactionAnalysis: '',
      version: '',
      groups: [
        {
          sortNo: '',
          groupName: 'no',
          groupDesc: '',
          params: [
            // {
            //   paramId: '',
            //   taskModelId: '',
            //   processModelId: '',
            //   sortNo: '',
            // },
          ],
        },
      ],
      taskModels: [],
    },
    // ids: [],
    // sonIds: [],
    processDetail: undefined,
    processList: [],
  },
  effects: {},
  reducers: {
    setProcessAddData(state, action) {
      return { ...state, processAddData: action.payload };
    },
    setIds(state, action) {
      return { ...state, ids: action.payload };
    },
    setSonIds(state, action) {
      return { ...state, sonIds: action.payload };
    },
    setProcessDetail(state, action) {
      return { ...state, processDetail: action.payload };
    },
    setProcessList(state, action) {
      return { ...state, processList: action.payload };
    },
  },
};
export default projectModel;
