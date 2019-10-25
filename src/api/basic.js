/*
 * 基础服务
 * https://devapi.sangon.com:8443/api/basic/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 查询工厂列表
  getFactorys() {
    return request('/basic/v1/factorys');
  },
  // 查询开票类型
  getInvtypes() {
    return request('/basic/v1/invtypes');
  },
  // 查询币种列表
  getCurrencys() {
    return request('/basic/v1/currencys');
  },
  // 查询仓库
  getStorages() {
    return request('/basic/v1/storages');
  },
  // // 查询网点列表
  // getOffices() {
  //   return request('/basic/v1/offices');
  // },
  // 查询付款方式
  getPaymethods() {
    return request('/basic/v1/paymethods');
  },
  // 查询付款条件
  getPayterms() {
    return request('/basic/v1/payterms');
  },
  // 查询大区
  // getRegions() {
  //   return request('/basic/v1/regions');
  // },
  // 查询订货人
  getContacts() {
    return request('/basic/v1/contacts');
  },
  // 查询客户
  getCustomers() {
    return request('/basic/v1/customers');
  },
  // 查询负责人
  getSubcustomer() {
    return request('/basic/v1/subcustomer');
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
  getCountrys () {
    return request('/countrys/v1');
  },
  // 地区(省)主数据
  getProvinces () {
    return request('http://180.167.32.168:8001/provinces/v1');
  },
  // 税号类别主数据
  getTaxNumberCategories () {
    return request('http://180.167.32.168:8001/taxNumberCategories/v1');
  },
  // 银行主数据
  getBanks () {
    return request('http://180.167.32.168:8001/banks/v1');
  },
  // BP角色主数据(非隐藏)
  getBpRoles () {
    return request('http://180.167.32.168:8001/bpRoles/v1');
  },
  // 客户销项税分类主数据(客户税款)(免税,必须上税...)
  getTaxOutputClassifics () {
    return request('http://180.167.32.168:8001/taxOutputClassifics/v1');
  },
  // 定价条件类型(销项税收类别)主数据(MWST)
  getTaxOutputCategories () {
    return request('http://180.167.32.168:8001/taxOutputCategories/v1');
  },
  // 总账科目主数据
  getGlAccounts () {
    return request('http://180.167.32.168:8001/glAccounts/v1');
  },
  // 付款条件主数据
  getPaymentTerms () {
    return request('http://180.167.32.168:8001/paymentTerms/v1');
  },
  // 国家拨号代码主数据
  getCountryDiallingCodes () {
    return request('http://180.167.32.168:8001/countryDiallingCodes/v1');
  },
  // 销售区域主数据（亚洲、欧洲...）
  getSalesDistricts () {
    return request('http://180.167.32.168:8001/salesDistricts/v1');
  },
  // 客户组主数据（付款方式）
  getSalesPaymentMethods () {
    return request('http://180.167.32.168:8001/salesPaymentMethods/v1');
  },
  // 销售办公室+销售组 主数据
  getRegionOffice () {
    return request('http://180.167.32.168:8001/regionOffice/v1');
  },
  // 销售办公室主数据（大区）
  getRegions () {
    return request('http://180.167.32.168:8001/regions/v1');
  },
  // 销售组主数据(网点)
  getOffices () {
    return request('http://180.167.32.168:8001/offices/v1');
  },
  // 货币代码主数据
  getCurrencies () {
    return request('http://180.167.32.168:8001/currencies/v1');
  },
  // 销售范围主数据
  getSalesArea () {
    return request('http://180.167.32.168:8001/salesArea/v1');
  },
  // 销售组织主数据
  getSalesOrganizations () {
    return request('http://180.167.32.168:8001/salesOrganizations/v1');
  },
  // 分销渠道主数据
  getDistributionChannels () {
    return request('http://180.167.32.168:8001/distributionChannels/v1');
  },
  // 产品组主数据
  getSalesDivisions () {
    return request('http://180.167.32.168:8001/salesDivisions/v1');
  },
  // 定价过程的客户分类(Cust.Pric.过程)数据
  getCustomerPricingProcedures () {
    return request('http://180.167.32.168:8001/customerPricingProcedures/v1');
  },
  // 客户统计组主数据
  getCustomerStatGroups () {
    return request('http://180.167.32.168:8001/customerStatGroups/v1');
  },
  // 装运条件主数据
  getShippingConditions () {
    return request('http://180.167.32.168:8001/shippingConditions/v1');
  },
  // 客户科目分配组主数据
  getCustomerAccountAssignmentGroups () {
    return request('http://180.167.32.168:8001/customerAccountAssignmentGroups/v1');
  },
  // 客户组 1主数据（金税发票类型）
  getTaxInvoiceTypes () {
    return request('http://180.167.32.168:8001/taxInvoiceTypes/v1');
  },
  // 客户组 2主数据（新客户分类）
  getCustomerCategories () {
    return request('http://180.167.32.168:8001/customerCategories/v1');
  },
  // 销售订单冻结主数据
  getSalesOrderBlocks () {
    return request('http://180.167.32.168:8001/salesOrderBlocks/v1');
  },
  // 公司代码主数据
  getCompanys () {
    return request('http://180.167.32.168:8001/companys/v1');
  },
  // 供应商帐户组主数据（T077Y ）
  getVonderAccountGroups () {
    return request('http://180.167.32.168:8001/vonderAccountGroups/v1');
  },
  // 客户帐户组主数据（T077D(T077X) ）
  getCustomerAccountGroups () {
    return request('http://180.167.32.168:8001/customerAccountGroups/v1');
  },
  // 排序码主数据
  getSortKeys () {
    return request('http://180.167.32.168:8001/sortKeys/v1');
  },
  // 支付方式主数据(供应商公司代码数据)
  getPaymentMethods () {
    return request('http://180.167.32.168:8001/paymentMethods/v1');
  },
  // 采购组主数据
  getPurchaseGroups () {
    return request('http://180.167.32.168:8001/purchaseGroups/v1');
  },
  // 销售组织 + 公司代码数据
  getSalesOrganizationCompany () {
    return request('http://180.167.32.168:8001/salesOrganizationCompany/v1');
  },
  // 销售组织 + 分销渠道 + 工厂数据
  getSalesOrganizationDistributionChannelPlant () {
    return request('http://180.167.32.168:8001/salesOrganizationDistributionChannelPlant/v1');
  },
  // 工厂主数据
  getPlants () {
    return request('http://180.167.32.168:8001/plants/v1');
  },
  // 销售范围+销售办事处(大区)数据
  getSalesAreaRegion () {
    return request('http://180.167.32.168:8001/salesAreaRegion/v1');
  },
  // 公司代码+工厂数据
  getCompanyPlant () {
    return request('http://180.167.32.168:8001/companyPlant/v1');
  },
  // 采购组织数据
  getPurchaseOrganizations () {
    return request('http://180.167.32.168:8001/purchaseOrganizations/v1');
  },
  // 采购组织对应公司代码关系数据
  getPurchaseOrganizationCompany () {
    return request('http://180.167.32.168:8001/purchaseOrganizationCompany/v1');
  },
  // 国家+税收类别主数据
  getCountryTaxOutputCategory () {
    return request('http://180.167.32.168:8001/countryTaxOutputCategory/v1');
  },
  // 税收城市代码主数据
  getTaxesCitys () {
    return request('http://180.167.32.168:8001/taxesCitys/v1');
  },
  // 税收县代码主数据
  getTaxesCounties () {
    return request('http://180.167.32.168:8001/taxesCounties/v1');
  },
  // 行业类别
  getIndustryCategories () {
    return request('http://180.167.32.168:8001/industryCategories/v1');
  },
  // 国家+时区
  getCountryTimeZone () {
    return request('http://180.167.32.168:8001/countryTimeZone/v1');
  },
  // 国家+（省）地区+时区
  getCountryProvinceTimeZone () {
    return request('http://180.167.32.168:8001/countryProvinceTimeZone/v1');
  },
};
