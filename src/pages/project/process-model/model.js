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
    // moveGroup: [],
    processDetail: {},
    // processList: [],
    // 状态
    status: [
      // 未发布
      {
        value: 1,
        text: '未发布',
        // i18n: 'bp.verfication',
        status: 'default',
      },
      // 已发布
      {
        value: 2,
        text: '已发布',
        // i18n: 'bp.completed',
        status: 'success',
      },
      // 已禁用
      {
        value: 3,
        text: '已禁用',
        // i18n: 'bp.rejected',
        status: 'error',
      },
      // 已过期
      {
        value: 4,
        text: '已过期',
        // i18n: 'bp.expired',
        status: 'warning',
      },
    ],
  },
  effects: {
    *setValue({ payload, key }, { put }) {
      yield put({ type: 'update', payload, key });
    },
  },
  reducers: {
    update(state, action) {
      return { ...state, [action.key]: action.payload };
    },
    // setProcessAddData(state, action) {
    //   return { ...state, processAddData: action.payload };
    // },
    // setMoveGroup(state, action) {
    //   return { ...state, moveGroup: action.payload };
    // },
    // setProcessDetail(state, action) {
    //   return { ...state, processDetail: action.payload };
    // },
    // setProcessList(state, action) {
    //   return { ...state, processList: action.payload };
    // },
  },
};
export default projectModel;
