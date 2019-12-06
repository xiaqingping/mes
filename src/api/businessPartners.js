// /*
//  * 合作伙伴
//  *
//  */

// import request from '@/utils/request';

// export default {
//   // 业务伙伴列表查询
//   getBPList(params) {
//     return request('/businessPartners/v1', { params });
//   },
//   // 新建业务伙伴数据
//   addBP(data) {
//     return request('/businessPartners/v1', { method: 'POST', data });
//   },
//   // 根据业务伙伴ID修改业务伙伴数据
//   updateBP(data) {
//     return request(`/businessPartners/v1/${data.basic.id}`, { method: 'PUT', data });
//   },
//   // 根据业务伙伴ID查询客户数据
//   getBPCustomer(id) {
//     return request(`/businessPartners/v1/${id}/customer`);
//   },
//   // 根据业务伙伴ID查询供应商数据
//   getBPVendor(id) {
//     return request(`/businessPartners/v1/${id}/Vendor`);
//   },

//   // 组织认证
//   // 根据业务伙伴ID查询组织认证资料
//   getBPOrgCertification(id) {
//     return request(`/businessPartners/v1/${id}/organizationCertification`);
//   },
//   // 根据业务伙伴ID变更组织认证资料
//   updateBPOrgCertification(data) {
//     return request(`/businessPartners/v1/${data.basic.id}/organizationCertification`, { method: 'PUT', data });
//   },
//   // 根据业务伙伴ID取消组织认证接口
//   cancelBPOrgCertification(id) {
//     return request(`/businessPartners/v1/${id}/organizationCertification/cancel`);
//   },

//   // 负责人认证
//   // 根据业务伙伴ID查询负责人认证资料
//   getBPPiCertification(id) {
//     return request(`/businessPartners/v1/${id}/piCertification`);
//   },
//   // 根据业务伙伴ID批量变更负责人认证资料
//   updateBPPiCertification(data) {
//     return request(`/businessPartners/v1/${data.basic.id}/piCertification`, { method: 'PUT', data });
//   },
//   // 根据业务伙伴ID和开票方ID取消负责人认证接口
//   cancelBPPiCertification(data) {
//     return request(`/businessPartners/v1/${data.id}/piCertification/${data.invoicePartyId}/cancel`, { method: 'PUT' });
//   },

//   // 操作记录列表
//   getBPOperationRecords(params) {
//     return request('/businessPartners/v1/operationRecords', { params })
//   },

//   // 操作记录明细查询
//   getBPOperationItems(operationRecordId) {
//     return request(`/businessPartners/v1/operationRecords/${operationRecordId}/operationItems`)
//   },
// };
