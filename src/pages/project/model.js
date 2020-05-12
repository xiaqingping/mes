const projectModel = {
  namespace: 'project',
  state: {
    // 状态
    status: [
      // 未发布
      {
        value: 1,
        text: '未发布',
        // i18n: 'bp.verfication',
        status: 'Default',
      },
      // 已发布
      {
        value: 2,
        text: '已发布',
        // i18n: 'bp.completed',
        status: 'Success',
      },
      // 已禁用
      {
        value: 3,
        text: '已禁用',
        // i18n: 'bp.rejected',
        status: 'Error',
      },
      // 已过期
      // {
      //   value: 4,
      //   text: '已过期',
      //   // i18n: 'bp.expired',
      //   status: 'warning',
      // },
    ],
    // 颜色
    colorStore: [],
    // 组件的类型
    formItemType: [
      {
        type: 'input',
        text: '单行输入',
      },
      {
        type: 'sample_select',
        text: '样品选择',
      },
      {
        type: 'sample_group',
        text: '样品分组',
      },
      {
        type: 'sample_environment_factor',
        text: '样品环境因子表',
      },
      {
        type: 'number_input',
        text: '数值输入',
      },
      {
        type: 'checkbox',
        text: '多选',
      },
      {
        type: 'radio',
        text: '单选',
      },
    ],
  },
  effects: {},
  reducers: {
    setColorStore (state, action) {
      return {
        ...state,
        colorStore: action.payload,
      };
    },
  },
};
export default projectModel;
