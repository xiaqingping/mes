/*
 * 基础服务
 * https://devapi.sangon.com:8443/api/basic/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 查询工厂列表 // TODO: 废弃，新 plants/v1
  // getFactorys() {
  //   return request('/basic/v1/factorys');
  // },
  // 查询开票类型 // TODO: 废弃，新 taxInvoiceTypes/v1
  // getInvtypes() {
  //   return request('/basic/v1/invtypes');
  // },
  // 查询仓库
  getStorages() {
    return request('/basic/v1/storages');
  },
  // 查询付款方式 // TODO: 废弃，新 salesPaymentMethods/v1
  // getPayMethods() {
  //   return request('/basic/v1/paymethods');
  // },
  // 查询付款条件 // TODO: 废弃，新 paymentTerms/v1
  // getPayTerms() {
  //   return request('/basic/v1/payterms');
  // },
  // 查询订货人
  getContacts() {
    return request('/basic/v1/contacts');
  },
  // 查询客户
  getCustomers(params) {
    return request('/basic/v1/customers', { params });
  },
  // 查询负责人
  getSubcustomer(params) {
    return request('/basic/v1/subcustomer', { params });
  },
  // 查询产品
  getProducts(params) {
    return request('/basic/v1/products', { params });
  },
  // 查询销售范围
  getSalesRanges() {
    return request('/basic/v1/salesranges');
  },
  // 查询采购申请
  getPurReqList(params) {
    return request('/basic/v1/purchase_request/easyui', { params });
  },

  // 国际化数据接口
  // 国家主数据
  getCountrys() {
    return request('/countrys/v1');
  },
  // 地区(省)主数据
  getProvinces() {
    return request('/provinces/v1');
  },
  // 税号类别主数据
  getTaxNumberCategories() {
    return request('/taxNumberCategories/v1');
  },
  // 银行主数据
  getBanks(params) {
    return request('/banks/v1', { params });
  },
  // BP角色主数据(非隐藏)
  getBpRoles() {
    return request('/bpRoles/v1');
  },
  // 客户销项税分类主数据(客户税款)(免税,必须上税...)
  getTaxOutputClassifics() {
    return request('/taxOutputClassifics/v1');
  },
  // 定价条件类型(销项税收类别)主数据(MWST)
  getTaxOutputCategories() {
    return request('/taxOutputCategories/v1');
  },
  // 总账科目主数据
  getGlAccounts() {
    return request('/glAccounts/v1');
  },
  // 付款条件
  getPaymentTerms() {
    return request('/paymentTerms/v1');
  },
  // 国家拨号代码主数据
  getCountryDiallingCodes() {
    return request('/countryDiallingCodes/v1');
  },
  // 销售区域主数据（亚洲、欧洲...）
  getSalesDistricts() {
    return request('/salesDistricts/v1');
  },
  // 付款方式
  getSalesPaymentMethods() {
    return request('/salesPaymentMethods/v1');
  },
  // 销售办公室+销售组 主数据
  getRegionOffice() {
    return request('/regionOffice/v1');
  },
  // 销售办公室主数据（大区）
  getRegions() {
    return request('/regions/v1');
  },
  // 销售组主数据(网点)
  getOffices() {
    return request('/offices/v1');
  },
  // 货币代码主数据
  getCurrencies() {
    return request('/currencies/v1');
  },
  // 销售范围主数据
  getSalesArea() {
    return request('/salesArea/v1');
  },
  // 销售组织主数据
  getSalesOrganizations() {
    return request('/salesOrganizations/v1');
  },
  // 分销渠道主数据
  getDistributionChannels() {
    return request('/distributionChannels/v1');
  },
  // 产品组主数据
  getSalesDivisions() {
    return request('/salesDivisions/v1');
  },
  // 定价过程的客户分类(Cust.Pric.过程)数据
  getCustomerPricingProcedures() {
    return request('/customerPricingProcedures/v1');
  },
  // 客户统计组主数据
  getCustomerStatGroups() {
    return request('/customerStatGroups/v1');
  },
  // 装运条件主数据
  getShippingConditions() {
    return request('/shippingConditions/v1');
  },
  // 客户科目分配组主数据
  getCustomerAccountAssignmentGroups() {
    return request('/customerAccountAssignmentGroups/v1');
  },
  // 开票类型
  getTaxInvoiceTypes() {
    return request('/taxInvoiceTypes/v1');
  },
  // 客户组 2主数据（新客户分类）
  getCustomerCategories() {
    return request('/customerCategories/v1');
  },
  // 销售订单冻结主数据
  getSalesOrderBlocks() {
    return request('/salesOrderBlocks/v1');
  },
  // 公司代码主数据
  getCompanys() {
    return request('/companys/v1');
  },
  // 供应商帐户组主数据（T077Y ）
  getVonderAccountGroups() {
    return request('/vonderAccountGroups/v1');
  },
  // 客户帐户组主数据（T077D(T077X) ）
  getCustomerAccountGroups() {
    return request('/customerAccountGroups/v1');
  },
  // 排序码主数据
  getSortKeys() {
    return request('/sortKeys/v1');
  },
  // 支付方式主数据(供应商公司代码数据)
  getPaymentMethods() {
    return request('/paymentMethods/v1');
  },
  // 采购组主数据
  getPurchaseGroups() {
    return request('/purchaseGroups/v1');
  },
  // 销售组织 + 公司代码数据
  getSalesOrganizationCompany() {
    return request('/salesOrganizationCompany/v1');
  },
  // 销售组织 + 分销渠道 + 工厂数据
  getSalesOrganizationDistributionChannelPlant() {
    return request('/salesOrganizationDistributionChannelPlant/v1');
  },
  // 工厂
  getPlants() {
    return request('/plants/v1');
  },
  // 销售范围+销售办事处(大区)数据
  getSalesAreaRegion() {
    return request('/salesAreaRegion/v1');
  },
  // 公司代码+工厂数据
  getCompanyPlant() {
    return request('/companyPlant/v1');
  },
  // 采购组织数据
  getPurchaseOrganizations() {
    return request('/purchaseOrganizations/v1');
  },
  // 采购组织对应公司代码关系数据
  getPurchaseOrganizationCompany() {
    return request('/purchaseOrganizationCompany/v1');
  },
  // 国家+税收类别主数据
  getCountryTaxOutputCategory() {
    return request('/countryTaxOutputCategory/v1');
  },
  // 税收城市代码主数据
  getTaxesCitys() {
    return request('/taxesCitys/v1');
  },
  // 税收县代码主数据
  getTaxesCounties() {
    return request('/taxesCounties/v1');
  },
  // 行业类别
  getIndustryCategories() {
    return request('/industryCategories/v1');
  },
  // 国家+时区
  getCountryTimeZone() {
    return request('/countryTimeZone/v1');
  },
  // 国家+（省）地区+时区
  getCountryProvinceTimeZone() {
    return request('/countryProvinceTimeZone/v1');
  },
};
