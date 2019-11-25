/**
 * 页面数据结构要以 “查询BP数据结构” 为主，新增/修改时进行数据结构转换
 */

// 查询BP数据结构
export const readDetails = {
  // 基础数据
  basic: {
    id: '',
    type: 1,
    code: '',
    name: '',
    certificationStatus: '',
    mobilePhoneCountryCode: '',
    mobilePhone: '',
    mobilePhoneVerifyStatus: '',
    email: '',
    emailVerifyStatus: '',
    telephoneCountryCode: '',
    telephoneAreaCode: '',
    telephone: '',
    telephoneExtension: '',
    faxCountryCode: '',
    faxAreaCode: '',
    fax: '',
    faxExtension: '',
    postCode: '',
    timeZoneCode: '',
    languageCode: '',
    industryCode: '',
    countryCode: '',
    countryName: '',
    provinceCode: '',
    provinceName: '',
    cityCode: '',
    cityName: '',
    countyCode: '',
    countyName: '',
    streetCode: '',
    streetName: '',
    address: '',
  },
  // 客户数据
  customer: {
    // 税收城市
    taxesCityCode: '',
    // 税收县
    taxesCountyCode: '',
    // 销售冻结
    salesOrderBlock: false,
    // 销售范围列表
    salesAreaList: [
      {
        salesOrganizationCode: '',
        distributionChannelCode: '',
        regionCode: '',
        officeCode: '',
        defaultPaymentMethodCode: '',
        currencyCode: '',
        salesOrderBlock: false,
        defaultInvoiceTypeCode: '',
        taxClassificCode: '',
        invoicePartyList: [
          {
            id: '',
            type: '',
            code: '',
            name: '',
            soldToPartyId: '',
            soldToPartyCode: '',
            soldToPartyName: '',
            verifyStatus: '',
          },
        ],
        soldToPartyList: [
          {
            id: '',
            type: '',
            code: '',
            name: '',
            linkVerifyStatus: '',
          },
        ],
        shipToPartyList: [
          {
            id: '',
            type: '',
            code: '',
            name: '',
            verifyStatus: '',
          },
        ],
        salerList: [{ code: '', name: '' }],
      },
    ],
    // 收货地址列表
    addressList: [
      {
        id: '',
        name: '',
        mobilePhone: '',
        mobilePhoneCountryCode: '',
        postCode: '',
        countryCode: '',
        countryName: '',
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        countyCode: '',
        countyName: '',
        streetCode: '',
        streetName: '',
        address: '',
        source: '',
      },
    ],
  },
  // 供应商数据
  vendor: {
    // 采购冻结
    invoicePostBlock: false,
    // 采购组织列表
    purchasingOrganizationList: [
      {
        purchasingOrganizationCode: 'BBI',
        salerName: '张三',
        salerTelephoneCountryCode: '+86',
        salerTelephone: '18735818888',
        paymentTermsCode: '1',
        currencyCode: '1',
        levelCode: '1',
        invoicePostInReceive: true,
        purchasingGroupCode: '1',
        deliveryPlanDays: '1',
      },
    ],
    // 付款银行
    paymentBank: {
      countryCode: '1',
      bankCode: '1',
      bankName: '1',
      bankAccount: '6666666666',
      bankAccountName: 'Max',
    },
  },
  // 组织认证
  organizationCertification: {
    effectiveDate: '2019-10-10',
    specialInvoice: true,
    taxNo: 123,
    bankCode: 12345,
    bankAccount: '60045612378',
    address: '注册地址',
    notes: '这是一段认证说明',
    attachmentList: [
      { code: 'https://blog.maxmeng.top/images/avatar.jpg', name: '照片', type: 'image' },
    ],
  },
  // 负责人认证
  piCertificationList: [
    {
      id: -1,
      status: 1,
      effectiveDate: '2019-10-10',
      invoicePartyId: 123,
      invoicePartyCode: 12345,
      invoicePartyName: '上海交通大学',
      notes: '这是一段认证说明',
      attachmentList: [
        { code: 'https://blog.maxmeng.top/images/avatar.jpg', name: '照片', type: 'image' },
      ],
    },
  ],
  // 信贷数据（查询接口返回此数据，新增和修改接口无法直接修改）
  creditList: [
    {
      invoicePartyId: 123,
      invoicePartyCode: 12345,
      invoicePartyName: '上海交通大学',
      currencyCode: 'CNY',
      credit: '40000',
      creditPeriod: '30',
      tempCreditLimit: '60000',
      tempCreditLimitExpirationDate: '2019-10-30',
      billingCycle: '50',
      billingDay: '25',
      lastEvaluationDate: '2019-10-01',
    },
  ],
};

// 新增BP数据结构
export const addDetails = {
  // 基础数据
  basic: {
    type: 1,
    name: '',
    mobilePhoneCountryCode: '',
    mobilePhone: '',
    email: '',
    telephoneCountryCode: '',
    telephoneAreaCode: '',
    telephone: '',
    telephoneExtension: '',
    faxCountryCode: '',
    faxAreaCode: '',
    fax: '',
    faxExtension: '',
    postCode: '',
    timeZoneCode: '',
    languageCode: '',
    industryCode: '',
    countryCode: '',
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    streetCode: '',
    address: '',
  },
  // 客户数据
  customer: {
    // 销售冻结
    salesOrderBlock: false,
    // 销售范围列表
    salesAreaList: [
      {
        salesOrganizationCode: '',
        distributionChannelCode: '',
        regionCode: '',
        officeCode: '',
        defaultPaymentMethodCode: '',
        currencyCode: '',
        defaultInvoiceTypeCode: '',
        taxClassificCode: '',
        invoicePartyList: [
          {
            id: '',
            // type: '',
            soldToPartyId: '',
            // soldToPartyCode: '',
            // soldToPartyName: '',
            // verifyStatus: '',
          },
        ],
        soldToPartyIdList: [123],
        // soldToPartyList: [{ id: '', type: '', code: '', name: '', linkVerifyStatus: '' }],
        shipToPartyIdList: [123],
        // shipToPartyList: [{ id: '', type: '', code: '', name: '', verifyStatus: '' }],
        salerCodeList: ['123'],
        // salerList: [{ code: '', name: '' }],
      },
    ],
    // 收货地址列表
    addressList: [
      {
        name: '',
        mobilePhone: '',
        mobilePhoneCountryCode: '',
        postCode: '',
        countryCode: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
        streetCode: '',
        address: '',
      },
    ],
  },
  // 供应商数据
  vendor: {
    // 采购冻结
    invoicePostBlock: false,
    // 采购组织列表
    purchasingOrganizationList: [
      {
        purchasingOrganizationCode: 'BBI',
        salerName: '张三',
        salerTelephoneCountryCode: '+86',
        salerTelephone: '18735818888',
        paymentTermsCode: '1',
        currencyCode: '1',
        levelCode: '1',
        invoicePostInReceive: true,
        purchasingGroupCode: '1',
        deliveryPlanDays: '1',
      },
    ],
    // 付款银行
    paymentBank: {
      countryCode: '1',
      bankCode: '1',
      bankAccount: '6666666666',
      bankAccountName: 'Max',
    },
  },
  // 组织认证
  organizationCertification: {
    specialInvoice: true,
    taxNo: 123,
    bankCode: 12345,
    bankAccount: '60045612378',
    address: '注册地址',
    notes: '这是一段认证说明',
    attachmentList: '',
  },
  // 负责人认证
  piCertificationList: [
    {
      id: -1,
      invoicePartyId: 123,
      notes: '这是一段认证说明',
      attachmentList: '',
    },
  ],
};

// 修改BP数据结构
export const updateDetails = {
  // 基础
  basic: {
    mobilePhoneCountryCode: '',
    mobilePhone: '',
    email: '',
    telephoneCountryCode: '',
    telephoneAreaCode: '',
    telephone: '',
    telephoneExtension: '',
    faxCountryCode: '',
    faxAreaCode: '',
    fax: '',
    faxExtension: '',
    postCode: '',
    timeZoneCode: '',
    languageCode: '',
    industryCode: '',
    countryCode: '',
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    streetCode: '',
    address: '',
  },
  // 客户
  customer: {
    salesOrderBlock: false,
    salesAreaList: [
      {
        salesOrganizationCode: '',
        distributionChannelCode: '',
        regionCode: '',
        officeCode: '',
        defaultPaymentMethodCode: '',
        currencyCode: '',
        defaultInvoiceTypeCode: '',
        taxClassificCode: '',
        // 收票方
        newInvoicePartyList: [{ id: '', soldToPartyId: '' }],
        deleteInvoicePartyList: [{ id: '', soldToPartyId: '' }],
        // 售达方
        newSoldToPartyIdList: [123],
        deleteSoldToPartyIdList: [123],
        // 送达方
        newShipToPartyIdList: [123],
        deleteShipToPartyIdList: [123],
        // 销售员
        newsalerCodeList: ['123'],
        deletesalerCodeList: ['123'],
      },
    ],
    // 地址
    newAddressList: [{}],
    modifyAddressList: [{}],
    deleteAddressIdList: [123],
  },
  // 供应商
  vendor: {
    // 采购冻结
    invoicePostBlock: false,
    // 采购组织列表
    purchasingOrganizationList: [
      {
        purchasingOrganizationCode: 'BBI',
        salerName: '张三',
        salerTelephoneCountryCode: '+86',
        salerTelephone: '18735818888',
        paymentTermsCode: '1',
        currencyCode: '1',
        levelCode: '1',
        invoicePostInReceive: true,
        purchasingGroupCode: '1',
        deliveryPlanDays: '1',
      },
    ],
    // 付款银行
    paymentBank: {
      countryCode: '1',
      bankCode: '1',
      bankAccount: '6666666666',
      bankAccountName: 'Max',
    },
  },
};
