import { message } from 'antd';
import api from '@/api';
import router from 'umi/router';

const initDetails = {
  basic: {
    certificationStatus: 1,
  },
  customer: {
    taxesCityCode: null,
    taxesCountyCode: null,
    salesOrderBlock: 2,
    salesAreaList: [],
    addressList: [],
  },
  vendor: {
    invoicePostBlock: 2,
    purchaseOrganizationList: [],
    paymentBank: {},
  },
  organizationCertification: {},
  piCertificationList: [],
  creditList: [],
};

const SeqModel = {
  namespace: 'bpEdit',
  state: {
    // 修改BP时，把查询到的BP详细数据做一个备份
    oldDetails: null,
    // BP 详细数据
    details: null,
    // 编辑状态 add 新增，update 修改
    editType: '',
  },
  effects: {
    // 根据参数，获取BP详细数据
    *readBPDetails(action, effects) {
      const { payload } = action;
      const { call, put, all } = effects;

      try {
        const { id, ...query } = payload;
        const { customerDataStatus, vendorDataStatus } = query;
        let details = JSON.parse(JSON.stringify(initDetails));

        const task = [null, null];

        // 客户
        if (customerDataStatus !== '2') task[0] = call(api.bp.getBPCustomer, id);
        // 供应商
        if (vendorDataStatus !== '2') task[1] = call(api.bp.getBPVendor, id);
        const [customer, vendor] = yield all(task);

        details = { ...details, ...customer, ...vendor };

        const { type } = details.basic;
        // PI认证
        if (type === 1 && details.piCertificationList.length > 0) {
          const options = {
            sourceKey: 'bp_pi_certification',
            sourceCode: details.piCertificationList.map(e => e.attachmentCode).join(','),
          };
          if (options.sourceCode) {
            const img = yield call(api.disk.getFiles, options);
            const piCertificationList = details.piCertificationList.map(e => {
              const attachmentList = img.filter(e1 => e1.sourceCode === e.attachmentCode);
              return {
                ...e,
                attachmentList,
              };
            });
            details = { ...details, piCertificationList };
          }
        }
        // 组织认证
        if (type === 2 && details.organizationCertification) {
          const options = {
            sourceKey: 'bp_organization_certification',
            sourceCode: details.organizationCertification.attachmentCode,
          };
          if (options.sourceCode) {
            const attachmentList = yield call(api.disk.getFiles, options);
            const organizationCertification = {
              ...details.organizationCertification,
              attachmentList,
            };
            details = { ...details, organizationCertification };
          }
        }

        yield put({
          type: 'setState',
          payload: { type: 'details', data: JSON.parse(JSON.stringify(details)) },
        });
        yield put({
          type: 'setState',
          payload: { type: 'oldDetails', data: JSON.parse(JSON.stringify(details)) },
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 新增BP
    *addBP(action, effects) {
      const { payload } = action;
      const { call } = effects;

      try {
        yield call(api.bp.addBP, payload);
        message.success('新增业务伙伴成功');
        router.push('/bp/maintain');
      } catch (error) {
        console.log(error);
      }
    },
    // 修改BP
    *updateBP(action, effects) {
      const { payload } = action;
      const { call } = effects;

      try {
        yield call(api.bp.updateBP, payload);
        message.success('修改业务伙伴成功');
        router.push('/bp/maintain');
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    setState(state, action) {
      const {
        payload: { type, data },
      } = action;
      return { ...state, [type]: data };
    },
    // 新增BP时初始化数据结构
    addInitDetails(state) {
      const details = JSON.parse(JSON.stringify(initDetails));
      return { ...state, details };
    },
  },
};
export default SeqModel;
