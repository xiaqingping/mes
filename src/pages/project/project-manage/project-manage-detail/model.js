const projectDetailModel = {
  namespace: 'projectDetail',
  state: {
    filedList: [
      {
        id: 1,
        code: 111111,
        name: 'XXXX文件1',
        processName: 'XXXX流程名称1',
        decs: '描述描述描述描述描述描述描述描述描述111',
        changerTime: '2019/10/20 12:00:36',
        size: '6'
      },
      {
        id: 2,
        code: 222222,
        name: 'XXXX文件2',
        processName: 'XXXX流程名称2',
        decs: '描述描述描述描述描述描述描述描述描述222',
        changerTime: '2019/10/20 12:00:36',
        size: '360'
      },
      {
        id: 3,
        code: 333333,
        name: 'XXXX文件3',
        processName: 'XXXX流程名称3',
        decs: '描述描述描述描述描述描述描述描述描述333',
        changerTime: '2019/10/20 12:00:36',
        size: '128'
      },
      {
        id: 4,
        code: 444444,
        name: 'XXXX文件4',
        processName: 'XXXX流程名称4',
        decs: '描述描述描述描述描述描述描述描述描述444',
        changerTime: '2019/10/20 12:00:36',
        size: '128'
      },
    ],

    // 权限
    jurisdiction: [
      { id: 1, name: '所有者' },
      { id: 2, name: '管理者' },
      { id: 3, name: '参与者' },
    ],
    // 执行记录状态
    execRecordStatus: [
      {
        id: '1',
        name: '等待中',
        status: 'default',
      },
      {
        id: '2',
        name: '运行中',
        status: 'processing',
      },
      {
        id: '3',
        name: '已暂停',
        status: 'warning',
      },
      {
        id: '4',
        name: '已完成',
        status: 'success',
      },
      {
        id: '5',
        name: '已失败',
        status: 'error',
      },
    ],
    // 业务伙伴认证状态
    BpCertificationStatus: [
      {
        id: 1,
        name: '未认证',
        // i18n: 'bp.unapproved',
        badge: 'default',
      },
      {
        id: 2,
        name: '审核中',
        // i18n: 'bp.processing',
        badge: 'warning',
      },
      {
        id: 3,
        name: '部分认证',
        // i18n: 'bp.partialApproved',
        badge: 'warning',
      },
      {
        id: 4,
        name: '已认证',
        // i18n: 'bp.approveds',
        badge: 'success',
      },
    ],
    // 销售范围冻结状态
    SalesOrderBlock: [
      {
        id: 1,
        name: '冻结',
        // i18n: 'bp.block',
        badge: 'error',
      },
      {
        id: 2,
        name: '正常',
        // i18n: 'bp.normal',
        badge: 'success',
      },
    ],

    // 流程列表参数
    procssesParam: [],
    // 参数值列表
    paramList: [],
  },
  effects: {},
  reducers: {
    setProcssesParam(state, action) {
      return { ...state, procssesParam: action.payload };
    },
    setParamList(state, action) {
      return { ...state, paramList: action.payload };
    },
  },
};
export default  projectDetailModel;
