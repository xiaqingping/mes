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
        type: 'excel',
        size: '6',
      },
      {
        id: 2,
        code: 222222,
        name: 'XXXX文件2',
        processName: 'XXXX流程名称2',
        decs: '描述描述描述描述描述描述描述描述描述222',
        changerTime: '2019/10/20 12:00:36',
        type: 'pdf',
        size: '360',
      },
      {
        id: 3,
        code: 333333,
        name: 'XXXX文件3',
        processName: 'XXXX流程名称3',
        decs: '描述描述描述描述描述描述描述描述描述333',
        changerTime: '2019/10/20 12:00:36',
        type: 'file',
        size: '128',
      },
      {
        id: 4,
        code: 444444,
        name: 'XXXX文件4',
        processName: 'XXXX流程名称4',
        decs: '描述描述描述描述描述描述描述描述描述444',
        changerTime: '2019/10/20 12:00:36',
        type: 'word',
        size: '128',
      },
    ],

    // 权限
    jurisdiction: [
      {
        id: 1,
        name: '所有者',
      },
      {
        id: 2,
        name: '管理者',
      },
      {
        id: 3,
        name: '参与者',
      },
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
      {
        id: '6',
        name: '已取消',
        status: 'default',
      },
    ],
  },
  effects: {},
  reducers: {},
};
export default projectDetailModel;
