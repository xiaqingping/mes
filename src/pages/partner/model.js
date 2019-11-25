const SeqModel = {
  namespace: 'partnerMaintainEdit',
  state: {
    details: null,
    type: null,
    supplier: null,
    // 业务伙伴认证状态
    BpCertificationStatus: [
      { id: 1, name: '未认证' },
      { id: 2, name: '审核中' },
      { id: 3, name: '部分认证' },
      { id: 4, name: '已认证' },
    ],
    // 操作项状态
    BpOperationItemStatus: [
      { id: 1, name: '待验证' },
      { id: 2, name: '已完成' },
      { id: 3, name: '已拒绝' },
    ],
    // 操作记录类型
    BpOperationRecordType: [
      { id: 1, name: '新增' },
      { id: 2, name: '修改' },
    ],
    // 业务伙伴类别
    BpType: [
      { id: 1, name: '人员' },
      { id: 2, name: '组织' },
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
      { id: 1, name: '完整' },
      { id: 2, name: '不完整' },
    ],
    // 默认开票类型
    DefaultInvoiceType: [
      { id: '10', name: '增值税专用发票' },
      { id: '20', name: '增值税普通发票' },
    ],
    // 邮箱认证状态
    EmailVerifyStatus: [
      { id: 'N', name: '未验证' },
      { id: 'Y', name: '已验证' },
    ],
    // 行业类别
    Industry: [
      { id: '01', name: '军队' },
      { id: '02', name: '国外' },
      { id: '03', name: '政府机关' },
      { id: '04', name: '事业单位' },
      { id: '05', name: '社会团体' },
      { id: '06', name: '个人' },
      { id: '07', name: '企业' },
    ],
    // 随货开票
    InvoiceWithGood: [
      { id: 1, name: '是' },
      { id: 2, name: '否' },
    ],
    // 手机验证状态
    MobilePhoneVerifyStatus: [
      { id: 'N', name: '未验证' },
      { id: 'Y', name: '已验证' },
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
      { id: 1, name: '冻结' },
      { id: 2, name: '正常' },
    ],
    // 装运条件
    ShippingCondition: [{ id: '01', name: '标准' }],
    // 增值税专用发票资质
    SpecialInvoice: [
      { id: 1, name: '是' },
      { id: 2, name: '否' },
    ],
    // 供应商数据状态
    VendorDateStatus: [
      { id: 1, name: '是' },
      { id: 2, name: '否' },
    ],
    // 供应商级别
    VendorLevelCode: [
      { id: 'A', name: '重要' },
      { id: 'B', name: '比较重要' },
      { id: 'C', name: '一般' },
    ],
    // 验证记录-关联售达方记录-验证结果
    VerifyLinkSoldToPartyStatus: [
      { id: 1, name: '验证中' },
      { id: 2, name: '已完成' },
      { id: 3, name: '已拒绝' },
      { id: 4, name: '已取消' },
      { id: 5, name: '已过期' },
    ],
    // 验证记录-关联售达方记录-验证类型
    VerifyLinkSoldToPartyType: [
      { id: 1, name: '手机' },
      { id: 2, name: '邮箱' },
      { id: 3, name: '用户' },
      { id: 4, name: '人工审核' },
    ],
    // 验证记录状态
    VerifyRecordStatus: [
      { value: 1, text: '验证中', status: 'warning' },
      { value: 2, text: '已验证', status: 'success' },
      { value: 3, text: '已拒绝', status: 'error' },
    ],
    // 验证类型
    VerifyRecordType: [
      { value: 1, text: '组织认证' },
      { value: 2, text: '人员认证' },
      { value: 3, text: '绑定售达方' },
      { value: 4, text: '验证手机' },
      { value: 5, text: '验证邮箱' },
      { value: 6, text: '变更验证手机' },
      { value: 7, text: '变更验证邮箱' },
    ],

    // 操作记录状态
    operationStatus: {
      1: {
        value: 'default',
        text: '未完成',
      },
      2: {
        value: 'warning',
        text: '部分完成',
      },
      3: {
        value: 'success',
        text: '已完成',
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
