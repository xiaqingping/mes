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
  },
  effects: {},
  reducers: {},
};
export default projectModel;