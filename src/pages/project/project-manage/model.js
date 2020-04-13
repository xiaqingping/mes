const projectModel = {
  namespace: 'projectManage',
  state: {
    statusList: [
      { value: 1, text: '未开始', status: 'default' },
      { value: 2, text: '进行中', status: 'Warning' },
      { value: 3, text: '已完成', status: 'success' },
      { value: 4, text: '已终止', status: 'error' },
      { value: 5, text: '待处理', status: 'Processing' },
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
    // 标签
    labelList: [
      {
        id: 1,
        name: '真核转录组',
        text: 'eukaryotic_transcriptome',
      },
      {
        id: 2,
        name: '宏转录组',
        text: 'metatranscriptome',
      },
      {
        id: 3,
        name: '真菌基因组',
        text: 'fugus_genome',
      },
      {
        id: 4,
        name: '外显子组',
        text: 'exome',
      },
      {
        id: 5,
        name: '简化基因组',
        text: 'RAD',
      },
      {
        id: 6,
        name: '宏基因组',
        text: 'metagenome',
      },
      {
        id: 7,
        name: '微生物基因组',
        text: 'microbial_genome',
      },
      {
        id: 8,
        name: '重测序',
        text: 'resequencing',
      },
      {
        id: 9,
        name: '原核转录组',
        text: 'prokaryotic_transcriptom',
      },
      {
        id: 10,
        name: '小RNA',
        text: 'microRNA',
      },
      {
        id: 11,
        name: '动植物基因组',
        text: 'eukaryotic_genome',
      },
      {
        id: 12,
        name: '微生物多样性',
        text: 'microbial_diversity',
      },
      {
        id: 13,
        name: '表观遗传学',
        text: 'epigenetics',
      },
    ],
    // 点击查看的数据
    viewlist: [],
    // 修改项目参数
    projectData: [],
    // 已选中的流程
    processSelectedList: [],
    // 新建项目的基础信息
    projectInfor: [],
  },
  effects: {},
  reducers: {
    setviewlist(state, payload) {
      // console.log(action);
      return { ...state, viewlist: payload };
    },
    setProjectData(state, action) {
      return { ...state, projectData: action.payload };
    },
    setProcessSelectedList(state, action) {
      return { ...state, processSelectedList: action.payload };
    },
    setProjectInfor(state, action) {
      return { ...state, projectInfor: action.payload };
    },
  },
};
export default projectModel;
