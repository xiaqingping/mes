// import api from '@/api';

const SeqModel = {
  namespace: 'taskModel',
  state: {
    formItemType: [{
        type: "input",
        text: "单行输入框"
      },
      {
        type: "textArea",
        text: "多行输入框"
      },
      {
        type: "radio",
        text: "单选框"
      },
      {
        type: "checkbox",
        text: "多选框"
      },
      {
        type: "select",
        text: "选择框"
      },
      {
        type: "dataPicker",
        text: "日期选择"
      },
      {
        type: "timePicker",
        text: "时间选择"
      },
      {
        type: "switch",
        text: "开关"
      },

    ],
    taskModelStatusOptions: [{
        label: '未发布',
        value: '1'
      },
      {
        label: '已发布',
        value: '2'
      },
      {
        label: '已禁用',
        value: '3'
      },
      {
        label: '已过期',
        value: '4'
      },
    ],
    statusObj: {
      "1": {
        label: '未发布',
        badgeStatus: "default"
      },
      "2": {
        label: '已发布',
        badgeStatus: "success"
      },
      "3": {
        label: '已禁用',
        badgeStatus: "error"
      },
      "4": {
        label: '已过期',
        badgeStatus: "warning"
      },
    },
    statusList: [{
        value: 1,
        data: '未发布',
        text: '未发布',
        key: '1'
      },
      {
        value: 2,
        data: '已发布',
        text: '已发布',
        key: '2'
      },
      {
        value: 3,
        data: '已禁用',
        text: '已禁用',
        key: '3'
      },
      {
        value: 4,
        data: '已过期',
        text: '已过期',
        key: '4'
      },
    ],
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
        text: '已验证',
        // i18n: 'bp.completed',
        status: 'success',
      },
      // 已禁用
      {
        value: 3,
        text: '已拒绝',
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
    taskModelList: [{
        id: 2,
        code: 111112221,
        name: '木木2',
        describe: '描述2',
        creatorCode: "ddjj333",
        creatorName: '创建人名称2',
        createDate: '2019/12/20',
        changerCode: "修改人编号",
        changerName: '大大修改1',
        changeDate: '2019/10/20',
        status: '2',
        publisherCode: "发布人code",
        publisherName: "发布人name",
        publishDate: "2020-11-22",
        version: "v1.1",
        isVisible: 1, // 是否可见  1：是， 2：否
        isAutomatic: 1, // 是否自动执行  1：是， 2：否
        isHighestLevel: 1, // 是否可作为最上级直接执行  1：是， 2：否
        label: ['pink', 'purple', 'blue', 'green'],
        memberNumber: 10,
        projectModelName: '**项目1',
        copyRight: '1.1',
        StartTime: '2019/1/1',
        endTime: '2019/10/1',
        list: [{
            id: 3,
            code: 12,
            name: '木木12',
            describe: '描述12',
            creatorName: '大大创建12',
            creatorTime: '2019/10/20',
            changerName: '大大修改2',
            changerTime: '2019/10/20',
            status: 1,
            memberNumber: 10,
            projectModelName: '**项目12',
            copyRight: '1.2',
            StartTime: '2019/1/1',
            endTime: '2019/10/1',
          },
          {
            id: 4,
            code: 12,
            name: '木木12',
            describe: '描述12',
            creatorName: '大大创建12',
            creatorTime: '2019/10/20',
            changerName: '大大修改2',
            changerTime: '2019/10/20',
            status: 2,
            memberNumber: 10,
            projectModelName: '**项目12',
            copyRight: '1.2',
            StartTime: '2019/1/1',
            endTime: '2019/10/1',
          },
        ],
      },
      {
        id: 1,
        code: 111111,
        name: '木木1',
        describe: '描述1',
        creatorCode: "ddjj",
        creatorName: '创建人名称1',
        createDate: '2019/10/20',
        changerCode: "修改人编号",
        changerName: '大大修改1',
        changeDate: '2019/10/20',
        status: '1',
        publisherCode: "发布人code",
        publisherName: "发布人name",
        publishDate: "2020-11-22",
        version: "v1.1",
        isVisible: 1, // 是否可见  1：是， 2：否
        isAutomatic: 1, // 是否自动执行  1：是， 2：否
        isHighestLevel: 1, // 是否可作为最上级直接执行  1：是， 2：否
        label: ['pink', 'purple', 'blue', 'green'],
        memberNumber: 10,
        projectModelName: '**项目1',
        copyRight: '1.1',
        StartTime: '2019/1/1',
        endTime: '2019/10/1',
        list: [{
            id: 3,
            code: 12,
            name: '木木12',
            describe: '描述12',
            creatorName: '大大创建12',
            creatorTime: '2019/10/20',
            changerName: '大大修改2',
            changerTime: '2019/10/20',
            status: 1,
            memberNumber: 10,
            projectModelName: '**项目12',
            copyRight: '1.2',
            StartTime: '2019/1/1',
            endTime: '2019/10/1',
          },
          {
            id: 4,
            code: 12,
            name: '木木12',
            describe: '描述12',
            creatorName: '大大创建12',
            creatorTime: '2019/10/20',
            changerName: '大大修改2',
            changerTime: '2019/10/20',
            status: 2,
            memberNumber: 10,
            projectModelName: '**项目12',
            copyRight: '1.2',
            StartTime: '2019/1/1',
            endTime: '2019/10/1',
          },
        ],
      },
    ],
  },
  effects: {

  },
  reducers: {

  },
};
export default SeqModel;
