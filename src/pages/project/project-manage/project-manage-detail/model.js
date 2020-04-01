const projectDetailModel = {
  namespace: 'projectDetail',
  state: {
    processList: [
      {
        id: 1,
        code: 111111,
        name: '微生物11111',
        decs: '描述描述描述描述描述描述描述描述描述111',
        version: 'V1.1',
        schedule: '0',
        processList: {
          path: '/favicon.png',
          name: '微生物多样式分析',
          code: '36648542221'
        },
      },
      {
        id: 2,
        code: 222222,
        name: '微生物2222',
        decs: '描述描述描述描述描述描述描述描述描述111',
        version: 'V1.1',
        schedule: '50',
        processList: {
          path: '/favicon.png',
          name: '微生物多样式分析',
          code: '36648542221'
        },
      },
      {
        id: 3,
        code: 33333333,
        name: '微生物3333',
        decs: '描述描述描述描述描述描述描述描述描述111',
        version: 'V1.1',
        schedule: '50',
        processList: {
          path: '/favicon.png',
          name: '微生物多样式分析',
          code: '36648542221'
        },
      },
      {
        id: 4,
        code: 444444444,
        name: '微生物4444',
        decs: '描述描述描述描述描述描述描述描述描述111',
        version: 'V1.1',
        schedule: '100',
        processList: {
          path: '/favicon.png',
          name: '微生物多样式分析',
          code: '36648542221'
        },
      },
    ],
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
    menberList: [
      {
        name: 'XXXX用户名',
        path: '/favicon.png',
        joinTime: '2020-03-18 12:00:38',
        authority: '1'
      },
      {
        name: 'XXXX用户名',
        path: '/favicon.png',
        joinTime: '2020-03-18 12:00:38',
        authority: '2'
      },
      {
        name: 'XXXX用户名',
        path: '/favicon.png',
        joinTime: '2020-03-18 12:00:38',
        authority: '3'
      },
      {
        name: 'XXXX用户名',
        path: '/favicon.png',
        joinTime: '2020-03-18 12:00:38',
        authority: '3'
      },
    ],
    taskList: [
      {
        key: '1',
        code: '202220005547',
        status: '1',
        parameterList: [],
        startTime: '2020/03/31 18:30:27',
        endTime: '2020/04/02 19:40:37',
        progress: 0,
      },
      {
        key: '2',
        code: '202220005547',
        status: '2',
        parameterList: [],
        runTime: '3m5s',
        startTime: '2020/03/31 19:30:27',
        endTime: '2020/03/31 19:35:11',
        progress: 50,
      },
      {
        key: '3',
        code: '202220005547',
        status: '3',
        parameterList: [],
        runTime: '3m5s',
        startTime: '2020/03/31 19:30:27',
        endTime: '2020/04/05 11:45:50',
        progress: 100,
      },
    ],
    // 权限
    authority: [
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
  },
  effects: {},
  reducers: {},
};
export default  projectDetailModel;
