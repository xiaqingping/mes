const sampleModel = {
  namespace: 'sample',
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

    // 能上传的文件类型
    AllImgExt: '.fasta|.fastq|.fq',
  },

  effects: {},
  reducers: {},
};
export default sampleModel;
