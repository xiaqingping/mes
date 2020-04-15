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

    detailValue: {
      id: 100,
      sampleCode: 'sampleCode',
      sampleName: 'sampleCode',
      sampleIdentificationCode: 'sampleCode',
      sampleSequenceCount: 'sampleCode',
      sampleLengthMin: 'sampleCode',
      sampleLengthMax: 'sampleCode',
      sampleLengthTotal: 'sampleCode',
      bpCode: 'sampleCode',
      bpName: 'sampleCode',
      creatorCode: 'sampleCode',
      creatorName: 'sampleCode',
      createDate: 'sampleCode',
      sampleProperties: [
        {
          id: '1000',
          sampleId: '1000',
          sequenceFileId: '1000',
          sequenceFileName: '1000',
          sourceSequenceFileId: '1000',
          sourceSequenceFileName: '1000',
          sampleSequenceCount: '1000',
          sampleLengthMin: '1000',
          sampleLengthMax: '1000',
          sampleLengthAve: '1000',
          createDate: '1000',
        },
      ],
    },
  },
  effects: {},
  reducers: {},
};
export default sampleModel;
