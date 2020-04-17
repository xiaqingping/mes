import basic from '@/api/basic';
import { formatSelectData, getCache, setCache } from '@/utils/utils';

const namespace = 'htsCache';

const INIT_STATE = {
  // 基础数据状态
  status: [
    {
      id: 1,
      name: '进行中',
      status: 'processing',
    },
    {
      id: 2,
      name: '已完成',
      status: 'success',
    },
    {
      id: 3,
      name: '已失败',
      status: 'error',
    },
  ],
  // 元数据 列表
  list: [
    {
      id: 1,
      code: 111,
      projectCode: 10004658512,
      taskCode: 10004658512,
      operatorCode: 12,
      operatorName: '老王',
      beginDate: '2020/3/19 11:25:31',
      endDate: '2020/3/20 16:47:16',
      status: 1,
    },
    {
      id: 2,
      code: 222,
      projectCode: 10004658512,
      taskCode: 10004658512,
      operatorCode: 12,
      operatorName: '老王',
      beginDate: '2020/3/19 11:25:31',
      endDate: '2020/3/20 16:47:16',
      status: 2,
    },
    {
      id: 3,
      code: 333,
      projectCode: 10004658512,
      taskCode: 10004658512,
      operatorCode: 12,
      operatorName: '老王',
      beginDate: '2020/3/19 11:25:31',
      endDate: '2020/3/20 16:47:16',
      status: 3,
    },
    {
      id: 4,
      code: 444,
      projectCode: 10004658512,
      taskCode: 10004658512,
      operatorCode: 12,
      operatorName: '老王',
      beginDate: '2020/3/19 11:25:31',
      endDate: '2020/3/20 16:47:16',
      status: 4,
    },
    {
      id: 5,
      code: 555,
      projectCode: 10004658512,
      taskCode: 10004658512,
      operatorCode: 12,
      operatorName: '老王',
      beginDate: '2020/3/19 11:25:31',
      endDate: '2020/3/20 16:47:16',
      status: 5,
    },
  ],
  // 样品列表 数据
  sampleData: [
    {
      id: 1,
      name: '样品名称1',
      otherName: '别名1',
      sequence: '2000 (10000bp)',
      length: '2333-10000 (avg 6000)',
      color: 'pink',
      fieldList: [
        {
          id: 1,
          name: '文档1.fq',
          sequence: '2000 (10000bp)',
          length: '2333-10000 (avg 6000)',
        },
        {
          id: 2,
          name: '文档2.fq',
          sequence: '2000 (10000bp)',
          length: '2333-10000 (avg 6000)',
        },
        {
          id: 3,
          name: '文档3.fq',
          sequence: '2000 (10000bp)',
          length: '2333-10000 (avg 6000)',
        },
      ],
    },
    {
      id: 2,
      name: '样品名称2',
      otherName: '别名2',
      sequence: '2000 (10000bp)',
      length: '2333-10000 (avg 6000)',
      color: '#4e96f7',
      fieldList: [
        {
          id: 1,
          name: '文档1.fq',
          sequence: '2000 (10000bp)',
          length: '2333-10000 (avg 6000)',
        },
      ],
    },
    {
      id: 3,
      name: '样品名称3',
      otherName: '别名3',
      sequence: '2000 (10000bp)',
      length: '2333-10000 (avg 6000)',
      color: '#f5a623',
      fieldList: [
        {
          id: 1,
          name: '文档1.fq',
          sequence: '2000 (10000bp)',
          length: '2333-10000 (avg 6000)',
        },
        {
          id: 2,
          name: '文档2.fq',
          sequence: '2000 (10000bp)',
          length: '2333-10000 (avg 6000)',
        },
      ],
    }
  ],
  // 分组方案 数据
  groupSchemeData: [
    {
      id: 1,
      sampleName: '别名1',
      group1: 'Con1',
      groupColor1: '#ee5a5a',
      group2: 'Con2',
      groupColor2: '#f5a623',
      group3: 'Con3',
      groupColor3: '#4e96f7',
      group4: 'Con4',
      groupColor4: '#4e96f7',
    },
    {
      id: 2,
      sampleName: '别名2',
      group1: 'Con1',
      groupColor1: '#4e96f7',
      group2: 'Con2',
      groupColor2: '#3cbf53',
      group3: 'Con3',
      groupColor3: '#b46ed0',
    },
    {
      id: 3,
      sampleName: '别名3',
      group1: 'Con1',
      groupColor1: 'pink',
      group2: 'Con2',
      groupColor2: '#f5a623',
      group3: 'Con3',
      groupColor3: 'yellow',
    },
    {
      id: 4,
      sampleName: '别名4',
      group1: 'Con1',
      groupColor1: '#b46ed0',
      group2: 'Con2',
      groupColor2: 'blue',
      group3: 'Con3',
      groupColor3: '#3cbf53',
    },
  ],
  // 环境因子表 数据
  environmentalFactorData: [
    {
      id: 1,
      sampleName: '别名1',
      factor1: '1',
      factor2: '2',
      factor3: '3',
    },
    {
      id: 2,
      sampleName: '别名2',
      factor1: '1',
      factor2: '2',
      factor3: '3',
    },
    {
      id: 3,
      sampleName: '别名3',
      factor1: '1',
      factor2: '2',
      factor3: '3',
    },
  ],
  // 元数据 编号 参数信息
  metadataParam: [
    {
      sampleList: [
        {
          sampleId: 1,
          sampleCode: 54621548,
          sampleName: '样品1',
          sampleAlias: '样品别名1',
          colour: 'red',
          sampleSequenceCount: 2000,
          sampleLengthTotal: 100000,
          sampleLengthAve: 2333,
          sampleLengthMax: 1,
          sampleLengthMin: 1,
          sequenceFileCount: 1,
          sequenceFileList: [
            {
              sequenceFileName: '文档.fq',
              sampleSequenceCount: '2000',
              sampleLengthMin: '2333',
              sampleLengthMax: '10000',
              sampleLengthAve: '6000',
              sampleLengthTotal: '10000总长',
            }
          ],
        }
      ],
      groupSchemeList: [
        {
          groupSchemeName: '分组方案一',
          groupList: [
            {
              sampleId: 311,
              groupName: '分组一',
              groupColour: 'red',
              sampleList: []
            },
            {
              sampleId: 312,
              groupName: '分组二',
              groupColour: 'red',
            },
            {
              sampleId: 313,
              groupName: '分组三',
              groupColour: 'red',
            },
          ],
          sampleList: [],
        },
        {
          groupSchemeName: '分组方案二',
          groupList: [],
          sampleList: [
            {
              sampleId: 211,
              sampleName: '样品一'
            }
          ],
        },
        {
          groupSchemeName: '分组方案三',
          groupList: [
            {
              sampleId: 411,
              groupName: '分组4',
              groupColour: 'red',

            },
            {
              sampleId: 412,
              groupName: '分组5',
              groupColour: 'red',
            },
            {
              sampleId: 413,
              groupName: '分组6',
              groupColour: 'red',
            },
          ],
          sampleList: [],
        },
      ]
    }
  ],

  // 元数据编号查看参数传递数据
  metadataRow: [],
};

const BasicModel = {
  namespace,
  state: INIT_STATE,
  effects: {
    /**
     * 获取此命名空间内的缓存数据
     * @param {Object} payload = {type：要请求的缓存数据, options：请求上传递的参数}
     */
    *getCache(action, effects) {
      // 数据请求方法
      const customApi = {
        // countrys: basic.getCountrys,
      };

      yield getCache(namespace, action, effects, basic, customApi);
    },
  },
  reducers: {
    setCache(state, { payload }) {
      // 数据处理方法
      const processing = {
        plants: list => formatSelectData(list),
        storages: list => formatSelectData(list),
      };

      const { type, data } = setCache(namespace, payload, processing);

      return { ...state, [type]: data };
    },
    setMetadataRow(state, action) {
      return { ...state, metadataRow: action.payload };
    },
  },
  subscriptions: {
    setup() {},
  },
};
export default BasicModel;
