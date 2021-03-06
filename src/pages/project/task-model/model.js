// import api from '@/api';

const SeqModel = {
  namespace: 'taskModel',
  state: {
    argumentList: null,
    arguments: [{
      describe: 'string', // 描述
      id: 'string',
      paramKey: 'string', // name
      paramProperties: [
        // 其他选项列表
        {
          isRequired: true,
        },
        {
          placeholder: '请输入',
        },
        {
          defaultValue: '默认值',
        },
      ],
    }, ],
    formItemType: [{
        type: 'input',
        text: '单行输入',
      },
      {
        type: "sample_select",
        text: '样品选择'
      }, {
        type: "sample_group",
        text: '样品分组'
      }, {
        type: "sample_environment_factor",
        text: '样品环境因子表'
      }, {
        type: "number_input",
        text: '数值输入'
      }, {
        type: "checkbox",
        text: "多选"
      }, {
        type: "radio",
        text: "单选"
      }
    ],
    taskModelStatusOptions: [{
        value: 1,
        data: '未发布',
        text: '未发布',
        key: '1',
        label: '未发布',
        status: 'Default',
      },
      {
        value: 2,
        data: '已发布',
        text: '已发布',
        key: '2',
        label: '已发布',
        status: 'Success',
      },
      {
        label: '已禁用',
        data: '已发布',
        value: 3,
        status: 'Error',
        text: '已禁用',
        key: '3',
      },
    ],
    modelStatusOptions: [{
        value: 1,
        data: '未发布',
        text: '未发布',
        key: '1',
        label: '未发布',
        status: 'default',
      },
      {
        value: 2,
        data: '已发布',
        text: '已发布',
        key: '2',
        label: '已发布',
        status: 'success',
      },
      {
        label: '已禁用',
        data: '已发布',
        value: 3,
        status: 'error',
        text: '已禁用',
        key: '3',
      }, {
        label: '已过期',
        data: '已过期',
        value: 4,
        status: 'warning',
        text: '已过期',
        key: '4',
      }
    ],

    viewId: '', // 任务模型列表点击查看的id
    selectParamsId: '', // 根据前置后置任务id查询参数的id
    editOriginModelData: {}, // index页点击一条任务模型时候的信息
    editTaskModelId: '', // 任务模型修改时候传的任务id, 查询参数列表
    taskDetail: null, // 任务模型详细信息
    allPreTaskParamsType: [],
    // 需要请求接口才能获取的参数列表，第一次点击开参数时，是true，之后就是false，走argumentList的数据，而不是从后台获取的数据了
    // 这样就解决了， 如果第一次进去之后将参数清空了， 根据判断还会重新调一次接口的bug，导致数据并没有清除
    firstOpenParams: true,
  },
  effects: {},
  reducers: {
    setFirstOpenParams(state, {
      payload
    }) {
      return {
        ...state,
        firstOpenParams: payload
      }
    },
    setAllPreTaskParamsType(state, {
      payload
    }) {
      return {
        ...state,
        allPreTaskParamsType: payload
      }
    },
    getTaskDetail(state, {
      payload
    }) {
      return {
        ...state,
        taskDetail: payload,
      };
    },
    setEditTaskModelId(state, {
      payload
    }) {
      return {
        ...state,
        editTaskModelId: payload, // 任务模型修改时候传的任务id, 查询参数列表
      };
    },
    // 参数数据
    getArgumentsList(state, {
      payload
    }) {
      return {
        ...state,
        argumentList: payload,
      };
    },
    setViewId(state, {
      payload
    }) {
      return {
        ...state,
        viewId: payload,
      };
    },
    setViewParamsId(state, {
      payload
    }) {
      return {
        ...state,
        selectParamsId: payload,
      };
    },
    getEditOriginModelData(state, {
      payload
    }) {
      return {
        ...state,
        editOriginModelData: payload,
      };
    },
  },
};
export default SeqModel;
