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
    paramLists: {
      "id": "0c4fd02d1d1340a4b74ee88ff25908d5",
      "paramId": "96cd8259b6cf4dabb36971b6cb0f7932",
      "taskModelId": "8681cbd27b3b457fab42b1631b7636f6",
      "processModelId": "8e1a690d7ba046bfa2410c42bd92a2b9",
      "paramKey": "sample1",
      "paramName": "样品数据2",
      "type": "radio",
      "groupId": "938c9e994e9a4f0a8e33af9e45b089bd",
      "isrequired": true,
      "defaultValue": "select_1",
      "select_1": '选择一',
      "select_2": '选择二',
      "select_3": '选择三',
    }
  },
  effects: {},
  reducers: {},
};
export default projectDetailModel;
