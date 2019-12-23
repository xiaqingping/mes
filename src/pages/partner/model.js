import { formatMessage } from 'umi/locale';

const SeqModel = {
  namespace: 'bp',
  state: {
    details: null,
    type: null,
    supplier: null,
    // 业务伙伴认证状态
    BpCertificationStatus: [
      { id: 1, name: formatMessage({ id: 'bp.unapproved' }), badge: 'default' },
      { id: 2, name: formatMessage({ id: 'bp.processing' }), badge: 'warning' },
      { id: 3, name: formatMessage({ id: 'bp.partialApproved' }), badge: 'warning' },
      { id: 4, name: formatMessage({ id: 'bp.approveds' }), badge: 'success' },
    ],
    // // 销售冻结
    // salesOrderBlock: [
    //   { id: 1, name: formatMessage({ id: 'bp.maintain.blocked' }) },
    //   { id: 2, name: formatMessage({ id: 'bp.maintain.actived' }) },
    // ],
    // PI认证状态
    PiCertificationStatus: [
      { id: 1, name: formatMessage({ id: 'bp.processing' }), badge: 'warning' },
      { id: 2, name: formatMessage({ id: 'bp.approveds' }), badge: 'success' },
      { id: 3, name: formatMessage({ id: 'bp.unapproved' }), badge: 'default' },
    ],
    // 操作项状态
    BpOperationItemStatus: [
      { id: 1, name: formatMessage({ id: 'bp.operation.needVerified' }) },
      { id: 2, name: formatMessage({ id: 'bp.operation.finished' }) },
      { id: 3, name: formatMessage({ id: 'bp.operation.rejected' }) },
    ],
    // 操作记录类型
    BpOperationRecordType: [
      { id: 1, name: formatMessage({ id: 'action.add' }) },
      { id: 2, name: formatMessage({ id: 'action.change' }) },
    ],
    // 业务伙伴类别
    BpType: [
      // 人员
      { id: 1, name: formatMessage({ id: 'bp.maintain_details.person' }) },
      // 组织
      { id: 2, name: formatMessage({ id: 'bp.maintain_details.organization' }) },
    ],
    // 国家代码
    CountryCode: [
      { id: 'CN', name: '中国' },
      { id: 'AU', name: '澳大利亚' },
      { id: 'GB', name: '英国' },
      { id: 'HK', name: '中国香港' },
      { id: 'KR', name: '韩国' },
      { id: 'MO', name: '中国澳门' },
      { id: 'TW', name: '中国台湾' },
      { id: 'US', name: '美国' },
      { id: 'DE', name: '德国' },
      { id: 'EU', name: '欧盟' },
    ],
    // 客户数据状态
    CustomerDataStatus: [
      { id: 1, name: formatMessage({ id: 'bp.maintain.completed' }) },
      { id: 2, name: formatMessage({ id: 'bp.maintain.incomplete' }) },
    ],
    // 默认开票类型
    DefaultInvoiceType: [
      { id: '10', name: '增值税专用发票' },
      { id: '20', name: '增值税普通发票' },
    ],
    // 邮箱认证状态
    EmailVerifyStatus: [
      { id: 'N', name: formatMessage({ id: 'bp.EmailVerifyStatus.unverified' }) },
      { id: 'Y', name: formatMessage({ id: 'bp.EmailVerifyStatus.verified' }) },
    ],
    // 手机验证状态
    MobilePhoneVerifyStatus: [
      { id: 'N', name: formatMessage({ id: 'bp.EmailVerifyStatus.unverified' }) },
      { id: 'Y', name: formatMessage({ id: 'bp.EmailVerifyStatus.verified' }) },
    ],
    // 随货开票
    InvoiceWithGood: [
      { id: 1, name: formatMessage({ id: 'bp.InvoiceWithGood.yes' }) },
      { id: 2, name: formatMessage({ id: 'bp.InvoiceWithGood.no' }) },
    ],
    // 付款条件
    PaymentTerms: [
      { id: 'D001', name: '立即应付的 到期净值' },
      { id: 'D002', name: '30 天之内 到期净值' },
      { id: 'D003', name: '60 天之内 到期净值' },
      { id: 'D004', name: '90 天之内 到期净值' },
      { id: 'D005', name: '180 天之内 到期净值' },
      { id: 'D006', name: '45 天之内 到期净值' },
    ],
    // 销售范围冻结状态
    SalesOrderBlock: [
      { id: 1, name: formatMessage({ id: 'bp.block' }), badge: 'error' },
      { id: 2, name: formatMessage({ id: 'bp.normal' }), badge: 'success' },
    ],
    // 装运条件
    ShippingCondition: [{ id: '01', name: '标准' }],
    // 增值税专用发票资质
    SpecialInvoice: [
      { id: 1, name: formatMessage({ id: 'bp.InvoiceWithGood.yes' }) },
      { id: 2, name: formatMessage({ id: 'bp.InvoiceWithGood.no' }) },
    ],
    // 供应商数据状态
    VendorDateStatus: [
      { id: 1, name: formatMessage({ id: 'bp.InvoiceWithGood.yes' }) },
      { id: 2, name: formatMessage({ id: 'bp.InvoiceWithGood.no' }) },
    ],
    // 供应商级别
    VendorLevelCode: [
      { id: 'A', name: formatMessage({ id: 'bp.VendorLevelCode.important' }) },
      { id: 'B', name: formatMessage({ id: 'bp.VendorLevelCode.moreImportant' }) },
      { id: 'C', name: formatMessage({ id: 'bp.VendorLevelCode.commonly' }) },
    ],
    // 验证记录-关联售达方记录-验证结果
    VerifyLinkSoldToPartyStatus: [
      { id: 1, name: formatMessage({ id: 'bp.verfication' }) },
      { id: 2, name: formatMessage({ id: 'bp.completed' }) },
      { id: 3, name: formatMessage({ id: 'bp.rejected' }) },
      { id: 4, name: formatMessage({ id: 'bp.cancelled' }) },
      { id: 5, name: formatMessage({ id: 'bp.expired' }) },
    ],
    // 验证记录-关联售达方记录-验证类型
    VerifyLinkSoldToPartyType: [
      { id: 1, name: formatMessage({ id: 'bp.verification.mobilePhone' }) },
      { id: 2, name: formatMessage({ id: 'bp.verification.email' }) },
      { id: 3, name: formatMessage({ id: 'bp.verification.user' }) },
      { id: 4, name: formatMessage({ id: 'bp.verification.manualAudit' }) },
    ],
    // 验证记录-手机验证和邮箱验证-验证类型
    VerifyPhoneOrEmailType: [
      { id: 1, name: formatMessage({ id: 'bp.verification.verification.mobileVerification' }) },
      { id: 2, name: formatMessage({ id: 'bp.verification.verification.mailboxVerification' }) },
    ],
    // 验证记录状态
    VerifyRecordStatus: [
      // 验证中
      {
        value: 1,
        text: formatMessage({ id: 'bp.verfication' }),
        status: 'warning',
      },
      // 已验证
      {
        value: 2,
        text: formatMessage({ id: 'bp.completed' }),
        status: 'success',
      },
      // 已拒绝
      {
        value: 3,
        text: formatMessage({ id: 'bp.rejected' }),
        status: 'error',
      },
      // 已过期
      {
        value: 4,
        text: formatMessage({ id: 'bp.expired' }),
        status: 'error',
      },
    ],
    // 验证类型
    VerifyRecordType: [
      { value: 1, text: formatMessage({ id: 'bp.verification.organizationVerification' }) },
      { value: 2, text: formatMessage({ id: 'bp.verification.PIVerfication' }) },
      { value: 3, text: formatMessage({ id: 'bp.verification.soldToPartyBundle' }) },
      { value: 4, text: formatMessage({ id: 'bp.verification.verificationMobilePhone' }) },
      { value: 5, text: formatMessage({ id: 'bp.verification.verificationEmail' }) },
      { value: 6, text: formatMessage({ id: 'bp.verification.changeMobilePhone' }) },
      { value: 7, text: formatMessage({ id: 'bp.verification.changeEmail' }) },
    ],

    // 验证方式
    verifyTest: [
      { id: 1, name: formatMessage({ id: 'bp.verification.mobilePhone' }) },
      { id: 2, name: formatMessage({ id: 'bp.verification.email' }) },
      { id: 3, name: formatMessage({ id: 'bp.verification.question' }) },
    ],

    // 变更渠道
    verifyChannel: [
      { id: 1, name: formatMessage({ id: 'bp.verification.validateLogon' }) },
      { id: 2, name: formatMessage({ id: 'bp.verification.selfHelpVerification' }) },
    ],

    // 变更类型
    verifyChangeType: [
      { id: 1, name: formatMessage({ id: 'bp.verification.verifyCellPhone' }) },
      { id: 2, name: formatMessage({ id: 'bp.verification.verifyMailbox' }) },
    ],

    // 操作记录状态
    operationStatus: {
      1: {
        value: 'default',
        text: formatMessage({ id: 'bp.operation.unfinished' }),
      },
      2: {
        value: 'warning',
        text: formatMessage({ id: 'bp.operation.partiallyCompleted' }),
      },
      3: {
        value: 'success',
        text: formatMessage({ id: 'bp.operation.finished' }),
      },
    },
  },
  effects: {},
  reducers: {
    setDetails(state, action) {
      return { ...state, details: action.payload };
    },
    setType(state, action) {
      return { ...state, type: action.payload };
    },
    setSupplier(state, action) {
      return { ...state, supplier: action.payload };
    },
  },
};
export default SeqModel;
