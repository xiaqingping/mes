// import { formatMessage } from 'umi/locale';

const SeqModel = {
  namespace: 'bp',
  state: {
    // details: null,
    // type: null,
    // supplier: null,
    // 客户收货地址来源
    addressSource: [
      { id: 1, name: '线上' },
      { id: 2, name: '线下' },
    ],
    // 业务伙伴认证状态
    BpCertificationStatus: [
      {
        id: 1,
        name: '未认证',
        i18n: 'bp.unapproved',
        badge: 'default',
      },
      {
        id: 2,
        name: '审核中',
        i18n: 'bp.processing',
        badge: 'warning',
      },
      {
        id: 3,
        name: '部分认证',
        i18n: 'bp.partialApproved',
        badge: 'warning',
      },
      {
        id: 4,
        name: '已认证',
        i18n: 'bp.approveds',
        badge: 'success',
      },
    ],
    // PI认证状态
    PiCertificationStatus: [
      {
        id: 1,
        name: '审核中',
        i18n: 'bp.processing',
        badge: 'warning',
      },
      {
        id: 2,
        name: '已认证',
        i18n: 'bp.approveds',
        badge: 'success',
      },
      {
        id: 3,
        name: '未认证',
        i18n: 'bp.unapproved',
        badge: 'default',
      },
    ],
    // 操作项状态
    BpOperationItemStatus: [
      {
        id: 1,
        name: '待验证',
        i18n: 'bp.operation.needVerified',
      },
      {
        id: 2,
        name: '已完成',
        i18n: 'bp.operation.finished',
      },
      {
        id: 3,
        name: '已拒绝',
        i18n: 'bp.operation.rejected',
      },
    ],
    // 操作记录类型
    BpOperationRecordType: [
      {
        id: 1,
        name: '新增',
        i18n: 'action.add',
      },
      {
        id: 2,
        name: '变更',
        i18n: 'action.change',
      },
    ],
    // 业务伙伴类别
    BpType: [
      // 人员
      {
        id: 1,
        name: '人员',
        i18n: 'bp.maintain_details.person',
      },
      // 组织
      {
        id: 2,
        name: '组织',
        i18n: 'bp.maintain_details.organization',
      },
    ],
    // 国家代码
    CountryCode: [
      {
        id: 'CN',
        name: '中国',
      },
      {
        id: 'AU',
        name: '澳大利亚',
      },
      {
        id: 'GB',
        name: '英国',
      },
      {
        id: 'HK',
        name: '中国香港',
      },
      {
        id: 'KR',
        name: '韩国',
      },
      {
        id: 'MO',
        name: '中国澳门',
      },
      {
        id: 'TW',
        name: '中国台湾',
      },
      {
        id: 'US',
        name: '美国',
      },
      {
        id: 'DE',
        name: '德国',
      },
      {
        id: 'EU',
        name: '欧盟',
      },
    ],
    // 客户数据状态
    CustomerDataStatus: [
      {
        id: 1,
        name: '完整',
        i18n: 'bp.maintain.completed',
      },
      {
        id: 2,
        name: '不完整',
        i18n: 'bp.maintain.incomplete',
      },
    ],
    // 默认开票类型
    DefaultInvoiceType: [
      {
        id: '10',
        name: '增值税专用发票',
      },
      {
        id: '20',
        name: '增值税普通发票',
      },
    ],
    // 邮箱认证状态
    EmailVerifyStatus: [
      {
        id: 1,
        name: '未验证',
        i18n: 'bp.EmailVerifyStatus.unverified',
      },
      {
        id: 2,
        name: '验证中',
        i18n: 'bp.verfication',
        badge: 'warning',
      },
      {
        id: 3,
        name: '变更中',
        i18n: 'bp.EmailVerifyStatus.inChange',
        badge: 'warning',
      },
      {
        id: 4,
        name: '已验证',
        i18n: 'bp.EmailVerifyStatus.verified',
      },
    ],
    // 手机验证状态
    MobilePhoneVerifyStatus: [
      {
        id: 1,
        name: '未验证',
        i18n: 'bp.EmailVerifyStatus.unverified',
      },
      {
        id: 2,
        name: '验证中',
        i18n: 'bp.verfication',
        badge: 'warning',
      },
      {
        id: 3,
        name: '变更中',
        i18n: 'bp.EmailVerifyStatus.inChange',
        badge: 'warning',
      },
      {
        id: 4,
        name: '已验证',
        i18n: 'bp.EmailVerifyStatus.verified',
      },
    ],
    // 随货开票
    InvoiceWithGood: [
      {
        id: 1,
        name: '是',
        i18n: 'bp.InvoiceWithGood.yes',
      },
      {
        id: 2,
        name: '否',
        i18n: 'bp.InvoiceWithGood.no',
      },
    ],
    // 付款条件
    PaymentTerms: [
      {
        id: 'D001',
        name: '立即应付的 到期净值',
      },
      {
        id: 'D002',
        name: '30 天之内 到期净值',
      },
      {
        id: 'D003',
        name: '60 天之内 到期净值',
      },
      {
        id: 'D004',
        name: '90 天之内 到期净值',
      },
      {
        id: 'D005',
        name: '180 天之内 到期净值',
      },
      {
        id: 'D006',
        name: '45 天之内 到期净值',
      },
    ],
    // 销售范围冻结状态
    SalesOrderBlock: [
      {
        id: 1,
        name: '冻结',
        i18n: 'bp.block',
        badge: 'error',
      },
      {
        id: 2,
        name: '正常',
        i18n: 'bp.normal',
        badge: 'success',
      },
    ],
    // 装运条件
    ShippingCondition: [
      {
        id: '01',
        name: '标准',
      },
    ],
    // 增值税专用发票资质
    SpecialInvoice: [
      {
        id: 1,
        name: '是',
        i18n: 'bp.InvoiceWithGood.yes',
      },
      {
        id: 2,
        name: '否',
        i18n: 'bp.InvoiceWithGood.no',
      },
    ],
    // 供应商数据状态
    VendorDateStatus: [
      {
        id: 1,
        name: '是',
        i18n: 'bp.InvoiceWithGood.yes',
      },
      {
        id: 2,
        name: '否',
        i18n: 'bp.InvoiceWithGood.no',
      },
    ],
    // 供应商级别
    VendorLevelCode: [
      {
        id: 'A',
        name: '重要',
        i18n: 'bp.VendorLevelCode.important',
      },
      {
        id: 'B',
        name: '比较重要',
        i18n: 'bp.VendorLevelCode.moreImportant',
      },
      {
        id: 'C',
        name: '一般',
        i18n: 'bp.VendorLevelCode.commonly',
      },
    ],
    // 验证记录-关联售达方记录-验证结果
    VerifyLinkSoldToPartyStatus: [
      {
        id: 1,
        name: '验证中',
        i18n: 'bp.verfication',
      },
      {
        id: 2,
        name: '已验证',
        i18n: 'bp.completed',
      },
      {
        id: 3,
        name: '已拒绝',
        i18n: 'bp.rejected',
      },
      {
        id: 4,
        name: '已取消',
        i18n: 'bp.cancelled',
      },
      {
        id: 5,
        name: '已过期',
        i18n: 'bp.expired',
      },
    ],
    // 验证记录-关联售达方记录-验证类型
    VerifyLinkSoldToPartyType: [
      {
        id: 1,
        name: '手机',
        i18n: 'bp.verification.mobilePhone',
      },
      {
        id: 2,
        name: '邮箱',
        i18n: 'bp.verification.email',
      },
      {
        id: 3,
        name: '用户',
        i18n: 'bp.verification.user',
      },
      {
        id: 4,
        name: '人工审核',
        i18n: 'bp.verification.manualAudit',
      },
    ],
    // 验证记录-手机验证和邮箱验证-验证类型
    VerifyPhoneOrEmailType: [
      {
        id: 1,
        name: '手机验证',
        i18n: 'bp.verification.verification.mobileVerification',
      },
      {
        id: 2,
        name: '邮箱验证',
        i18n: 'bp.verification.verification.mailboxVerification',
      },
    ],
    // 验证记录状态
    VerifyRecordStatus: [
      // 验证中
      {
        value: 1,
        text: '验证中',
        i18n: 'bp.verfication',
        status: 'warning',
      },
      // 已验证
      {
        value: 2,
        text: '已验证',
        i18n: 'bp.completed',
        status: 'success',
      },
      // 已拒绝
      {
        value: 3,
        text: '已拒绝',
        i18n: 'bp.rejected',
        status: 'error',
      },
      // 已过期
      {
        value: 4,
        text: '已过期',
        i18n: 'bp.expired',
        status: 'error',
      },
    ],
    // 验证类型
    VerifyRecordType: [
      {
        value: 1,
        text: '组织认证',
        i18n: 'bp.verification.organizationVerification',
      },
      {
        value: 2,
        text: 'PI认证',
        i18n: 'bp.verification.PIVerfication',
      },
      {
        value: 3,
        text: '绑定售达方',
        i18n: 'bp.verification.soldToPartyBundle',
      },
      {
        value: 4,
        text: '验证手机',
        i18n: 'bp.verification.verifyCellPhone',
      },
      {
        value: 5,
        text: '验证邮箱',
        i18n: 'bp.verification.verifyMailbox',
      },
      {
        value: 6,
        text: '变更验证手机',
        i18n: 'bp.verification.changeMobilePhone',
      },
      {
        value: 7,
        text: '变更验证邮箱',
        i18n: 'bp.verification.changeEmail',
      },
    ],
    // 验证方式
    verifyTest: [
      {
        id: 1,
        name: '手机',
        i18n: 'bp.verification.mobilePhone',
      },
      {
        id: 2,
        name: '邮箱',
        i18n: 'bp.verification.email',
      },
      {
        id: 3,
        name: '问题',
        i18n: 'bp.verification.question',
      },
    ],
    // 变更渠道
    verifyChannel: [
      {
        id: 1,
        name: '登录验证',
        i18n: 'bp.verification.validateLogon',
      },
      {
        id: 2,
        name: '自助验证',
        i18n: 'bp.verification.selfHelpVerification',
      },
    ],
    // 变更类型
    verifyChangeType: [
      {
        id: 1,
        name: '验证手机',
        i18n: 'bp.verification.verifyCellPhone',
      },
      {
        id: 2,
        name: '验证邮箱',
        i18n: 'bp.verification.verifyMailbox',
      },
    ],
    // 操作记录状态
    operationStatus: {
      1: {
        value: 'default',
        text: '未完成',
        i18n: 'bp.operation.unfinished',
      },
      2: {
        value: 'warning',
        text: '部分完成',
        i18n: 'bp.operation.partiallyCompleted',
      },
      3: {
        value: 'success',
        text: '已完成',
        i18n: 'bp.operation.finished',
      },
    },
  },
  effects: {},
  reducers: {
    // setDetails(state, action) {
    //   return {
    //     ...state,
    //     details: action.payload,
    //   };
    // },
    // setType(state, action) {
    //   return {
    //     ...state,
    //     type: action.payload,
    //   };
    // },
    // setSupplier(state, action) {
    //   return {
    //     ...state,
    //     supplier: action.payload,
    //   };
    // },
  },
};
export default SeqModel;
