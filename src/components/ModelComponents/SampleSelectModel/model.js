// import api from '@/api';

const SeqModel = {
  namespace: 'sampleSelect',
  state: {
    sampleId: null,
    checkedFilesIds: null,
  },
  effects: {},
  reducers: {
    setSampleId(state, { payload }) {
      return {
        ...state,
        sampleId: payload,
      };
    },

    setCheckedFilesIds(state, { payload }) {
      return {
        ...state,
        checkedFilesIds: payload,
      };
    },
    // setCheckedIds(state, {
    //   payload
    // }) {
    //   return {
    //     ...state,
    //     checkedIds: payload
    //   }
    // },

    // setViewId(state, {
    //   payload
    // }) {
    //   console.log(payload);
    //   return {
    //     ...state,
    //     viewId: payload
    //   }
    // },
  },
};
export default SeqModel;
