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
          groupDescribe: '',
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
    moveGroup: [],
    processDetail: undefined,
    processList: [],
  },
  effects: {},
  reducers: {
    setProcessAddData(state, action) {
      return { ...state, processAddData: action.payload };
    },
    setMoveGroup(state, action) {
      return { ...state, moveGroup: action.payload };
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
