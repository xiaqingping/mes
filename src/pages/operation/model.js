import { formatMessage } from 'umi/locale';

import api from '@/api';

const SeqModel = {
  namespace: 'operation',
  state: {
    record: [],
    // 所有记录的类型
    recordType: [],
    // 操作记录状态
    operationStatus: {
      1: {
        value: 'default',
        text: formatMessage({
          id: 'bp.operation.unfinished',
        }),
      },
      2: {
        value: 'warning',
        text: formatMessage({
          id: 'bp.operation.partiallyCompleted',
        }),
      },
      3: {
        value: 'success',
        text: formatMessage({
          id: 'bp.operation.finished',
        }),
      },
    },
  },
  effects: {
    *GET_RECORD({ payload }, { call, put }) {
      const res = yield call(api.bp.getOperationRecords, payload);
      yield put({
        type: 'setState',
        payload: {
          type: 'save',
          data: JSON.parse(JSON.stringify(res)),
        },
      });
    },
  },
  reducers: {
    setState(state, action) {
      const {
        payload: { type, data },
      } = action;
      return {
        ...state,
        [type]: data,
      };
    },
    setRecordType(state, action) {
      return { ...state, recordType: action.payload };
    },
  },
};
export default SeqModel;
