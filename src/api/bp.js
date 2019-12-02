/* eslint-disable max-len */
/*
 * 合作伙伴
 * https://devapi.sangon.com:8443/api/businesspartner/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 业务伙伴列表查询（带分页）
  getBPList(params) {
    return request('/businessPartners/v1', { params });
  },
  // 按照编号或名称模糊查询组织类客户
  // 模糊搜索开票方
  getOrgCustomerByCodeOrName(params) {
    return request('/businessPartners/v1/org/customer', { params });
  },
  // 新建业务伙伴数据
  addBP(data) {
    return request('/businessPartners/v1', { method: 'POST', data });
  },
  // 根据业务伙伴ID修改业务伙伴数据
  updateBP(data) {
    return request(`/businessPartners/v1/${data.basic.id}`, { method: 'PUT', data });
  },
  // 根据业务伙伴ID查询客户数据
  getBPCustomer(id) {
    return request(`/businessPartners/v1/${id}/customer`);
  },
  // 根据业务伙伴ID查询供应商数据
  getBPVendor(id) {
    return request(`/businessPartners/v1/${id}/vendor`);
  },

  // 组织认证
  // 根据业务伙伴ID查询组织认证资料
  getBPOrgCertification(id) {
    return request(`/businessPartners/v1/${id}/organizationCertification`);
  },
  // 根据业务伙伴ID变更组织认证资料
  updateBPOrgCertification(data) {
    return request(`/businessPartners/v1/${data.basic.id}/organizationCertification`, {
      method: 'PUT',
      data,
    });
  },
  // 根据业务伙伴ID取消组织认证接口
  cancelBPOrgCertification(id) {
    return request(`/businessPartners/v1/${id}/organizationCertification/cancel`, {
      method: 'POST',
    });
  },

  // 负责人认证
  // 根据业务伙伴ID查询负责人认证资料
  getBPPiCertification(id) {
    return request(`/businessPartners/v1/${id}/piCertification`);
  },
  // 根据业务伙伴ID批量变更负责人认证资料
  updateBPPiCertificationList(id, data) {
    return request(`/businessPartners/v1/${id}/piCertification`, { method: 'PUT', data });
  },
  // 根据业务伙伴ID提交负责人认证资料接口
  addBPPiCertification(id, data) {
    return request(`/businessPartners/v1/${id}/piCertification`, { method: 'POST', data });
  },
  // 根据业务伙伴ID变更负责人认证资料接口
  updateBPPiCertification(id, invoicePartyId, data) {
    return request(`/businessPartners/v1/${id}/piCertification/${invoicePartyId}`, {
      method: 'PUT',
      data,
    });
  },
  // 根据业务伙伴ID和开票方ID取消负责人认证接口
  cancelBPPiCertification(data) {
    return request(
      `/businessPartners/v1/${data.id}/piCertification/${data.invoicePartyId}/cancel`,
      { method: 'PUT' },
    );
  },

  // 根据业务伙伴ID禁止客户销售接口
  customerSalesOrderBlock(id) {
    return request(`/businessPartners/v1/${id}/customer/salesBan`, { method: 'POST' });
  },
  // 根据业务伙伴ID激活客户销售接口
  customerSalesActivation(id) {
    return request(`/businessPartners/v1/${id}/customer/salesActivation`, { method: 'POST' });
  },

  // 检查业务伙伴名称是否存在 { name: xxx }
  // 检查业务伙伴移动电话是否存在 { mobilePhone: xxx }
  // 检查业务伙伴邮箱是否存在 { email: xxx }
  // 检查业务伙伴税号是否存在 { taxNo: xxx }
  checkBPFields(params) {
    return request('/businessPartners/v1/check', { method: 'POST', params });
  },

  // 查询所有业务伙伴类型为组织的数据（带分页） 开票方
  getInvoiceParty(params) {
    return request('/businessPartners/v1/org', { params });
  },
  // 查询所有客户类型为人员的业务伙伴（包含开票方子列表） 售达方
  getSoldToParty(params) {
    return request('/businessPartners/v1/person/invoiceTos', { params });
  },
  // 查询所有客户类型为人员的业务伙伴  送达方
  getShipToParty(params) {
    return request('/businessPartners/v1/person', { params });
  },

  // 固定信用额度评估接口
  creditLimitAssessment(id, params) {
    return request(`/businessPartners/v1/${id}/creditLimitAssessment`, { params });
  },
  // 固定信用额度调整接口
  creditLimitAdjustment(id, params) {
    return request(`/businessPartners/v1/${id}/creditLimitAdjustment`, { method: 'POST', params });
  },
  // 临时信用额度评估接口
  tempCreditLimitAssessment(id, params) {
    return request(`/businessPartners/v1/${id}/tempCreditLimitAssessment`, { params });
  },
  // 临时信用额度调整接口
  tempCreditlimitAdjustment(id, params) {
    return request(`/businessPartners/v1/${id}/tempCreditlimitAdjustment`, {
      method: 'POST',
      params,
    });
  },

  // 根据业务伙伴ID查询最新的PI认证或组织认证类型的验证记录 { invoicePartyId }
  getLastVerifyRecords(id, params) {
    return request(`/businessPartners/v1/${id}/verifyRecords/last`, { params });
  },
  // 根据业务伙伴ID查询最新的已完成（已验证或已拒绝）的PI认证或组织认证类型的验证记录
  getLastFinishVerifyRecords(id) {
    return request(`/businessPartners/v1/${id}/verifyRecords/lastFinish`);
  },

  // 操作记录
  // 操作记录列表查询接口（带分页）
  getOperationRecords(params) {
    return request('/businessPartners/v1/operationRecords', { params });
  },
  // 根据操作记录ID查询操作明细接口
  getOperationItems(operationRecordId) {
    return request(`/businessPartners/v1/operationRecords/${operationRecordId}/operationItems`);
  },
  // 获取业务伙伴名称和code接口
  getBPByCodeOrName(params) {
    return request('/businessPartners/v1/code/name', { params });
  },

  // 验证记录
  // 验证记录列表查询接口（带分页）
  getVerifyRecords(params) {
    return request('/businessPartners/v1/verifyRecords', { params });
  },
  // 根据验证记录ID查询验证记录明细-组织认证
  getOrgCertificationVerifyRecords(verifyRecordId) {
    return request(
      `/businessPartners/v1/verifyRecords/${verifyRecordId}/organizationCertification`,
    );
  },
  // 根据验证记录ID查询验证记录明细-PI认证
  getPiCertificationVerifyRecords(verifyRecordId) {
    return request(`/businessPartners/v1/verifyRecords/${verifyRecordId}/piCertification`);
  },
  // 根据验证记录ID查询验证记录明细-绑定售达方
  getSoldToPartyVerifyRecords(verifyRecordId) {
    return request(`/businessPartners/v1/verifyRecords/${verifyRecordId}/soldToParty`);
  },
  // 根据验证记录ID查询验证记录明细-验证联系方式（手机或邮箱）
  getContactInfoVerifyRecords(verifyRecordId) {
    return request(`/businessPartners/v1/verifyRecords/${verifyRecordId}/contactInfo`);
  },
  // 根据验证记录ID查询验证记录明细-变更联系方式（手机或邮箱）
  getChangeContactInfoVerifyRecords(verifyRecordId) {
    return request(`/businessPartners/v1/verifyRecords/${verifyRecordId}/changeContactInfo`);
  },
  // 根据验证记录ID审核验证记录
  approvalVerifyRecords(verifyRecordId) {
    return request(`/businessPartners/v1/verifyRecords/${verifyRecordId}/approval`, {
      method: 'POST',
    });
  },
  // 根据验证记录ID拒绝验证记录
  refuseVerifyRecords(verifyRecordId) {
    return request(`/businessPartners/v1/verifyRecords/${verifyRecordId}/refuse`, {
      method: 'POST',
    });
  },
  // 人工辅助变更已验证手机邮箱验证问题答案提交接口（验证通过产生验证记录）
  changeContactInfoAnswerVerify(id, data) {
    return request(`/businessPartners/v1/${id}/verifyRecords/changeContactInfo/answerSubmission`, {
      method: 'POST',
      data,
    });
  },
  // 人工辅助变更已验证手机邮箱流程中发送新手机验证短信接口（根据验证编号+手机产生验证码并发送）
  changeContactInfoNewMobileVerifyCodeSendingVerify(verifyRecordId, data) {
    return request(
      `/businessPartners/v1/verifyRecords/${verifyRecordId}/changeContactInfo/newMobileVerifyCodeSending`,
      { method: 'POST', data },
    );
  },
  // 人工辅助变更已验证手机邮箱流程中发送新邮箱验证邮件接口（根据验证编号+邮箱产生验证码并发送）
  changeContactInfoNewEmailVerifyCodeSendingVerify(verifyRecordId, data) {
    return request(
      `/businessPartners/v1/verifyRecords/${verifyRecordId}/changeContactInfo/newEmailVerifyCodeSending?email=${data}`,
      { method: 'POST' },
    );
  },
  // 人工辅助变更已验证手机邮箱流程中新手机邮箱验证码验证接口（根据验证编号验证验证码是否正确）
  changeContactInfoNewMobileVerifyCodeVerificationVerify(verifyRecordId, data) {
    return request(
      `/businessPartners/v1/verifyRecords/${verifyRecordId}/changeContactInfo/newMobileVerifyCodeVerification`,
      { method: 'POST', data },
    );
  },
  // 人工辅助变更已验证手机邮箱流程中新手机邮箱验证码提交接口（根据验证编号验证验证码是否正确并更新状态）
  changeContactInfoNewEmailVerifyCodeVerificationVerify(verifyRecordId, data) {
    return request(
      `/businessPartners/v1/verifyRecords/${verifyRecordId}/changeContactInfo/newEmailVerifyCodeVerification?verifyCode=${data}`,
      { method: 'POST' },
    );
  },
};
