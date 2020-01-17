/* eslint-disable max-len */

export default {
  BP_BUSINESSPARTNER_NOT_EXIST: '业务伙伴ID(#key)对应的记录不存在',
  BP_BUSINESSPARTNER_CODE_NOT_EXIST: '业务伙伴(#key)编号为空',
  BP_BUSINESSPARTNER_IS_APPROVALING: '业务伙伴(#key)认证状态为审核中或部分认证',
  BP_BUSINESSPARTNER_CUSTOMER_IS_NULL: '修改BP客户时客户数据不能为空',
  BP_BUSINESSPARTNER_VENDOR_IS_NULL: '修改BP供应商时供应商数据不能为空',
  BP_BUSINESSPARTNER_VENDOR_BANK_IS_NULL: '修改BP供应商时供应商银行数据不能为空',
  BP_CUSTOMER_ADDRESS_NOT_EXIST: '修改地址(#key)对应记录不存在',
  BP_CUSTOMER_ADDRESS_CAN_NOT_UPDATE: '修改地址(#key)对应记录为客户线上新增,不能线下修改',
  BP_CUSTOMER_ADDRESS_CAN_NOT_DELETE: '修改地址(#key)对应记录为客户线上新增,不能线下删除',
  BP_CUSTOMER_IS_UNCERTIFIED: '客户合作伙伴(#key)状态为未认证,不能删除',
  BP_BUSINESSPARTNER_COMMON_DATA_IS_NULL: '通用数据不能为空',
  BP_BUSINESSPARTNER_NAME_IS_NULL: '名称不能为空',
  BP_BUSINESSPARTNER_TYPE_IS_NULL: '类型不能为空',
  BP_BUSINESSPARTNER_TIME_ZONE_IS_NULL: '时区不能为空',
  BP_BUSINESSPARTNER_LANGUAGE_IS_NULL: '语言不能为空',
  BP_BUSINESSPARTNER_INDUSTRY_IS_NULL: '业务伙伴#key对应的行业类别不存在',
  BP_BUSINESSPARTNER_ORG_INDUSTRY_NOT_BE_PERSON: '维护BP时基础数据组织类客户行业类别不能为个人',
  BP_BUSINESSPARTNER_COUNTRYCODE_IS_NULL: '国家编号或名称不能为空',
  BP_BUSINESSPARTNER_SPECIALINVOICE_IS_NULL: '维护BP时基础数据增值税专用发票资质不能为空',
  BP_BUSINESSPARTNER_CERTIFICATION_STATUS_IS_NULL: '认证状态不能为空',
  BP_BUSINESSPARTNER_GROUP_CODE_IS_NULL: '业务伙伴分组编号不能为空',
  BP_BUSINESSPARTNER_TYPE_CODE_IS_NULL: '业务伙伴类别编号不能为空',
  BP_BUSINESSPARTNER_CUSTOMER_DATA_STATUS_IS_NULL: '客户数据状态不能为空',
  BP_BUSINESSPARTNER_VENDOR_DATA_STATUS_IS_NULL: '供应商数据状态不能为空',
  BP_BUSINESSPARTNER_PI_INDUSTRY_CAN_ONLY_BE_PERSON: '维护BP时基础数据人员对应的行业类别只能是个人',
  BP_COUNTRY_CODE_CORRESPONDING_AREA_IS_NOT_EXIST: '国家编号(#key)对应的区域不存在',
  BP_COUNTRY_CODE_CORRESPONDING_PROVINCE_IS_NULL: '国家(#key)对应的省编号不能为空',
  BP_PROVINCE_CODE_CORRESPONDING_AREA_IS_NOT_EXIST: '省编号(#key)对应的区域不存在',
  BP_PROVINCE_CODE_CORRESPONDING_NAME_IS_NULL: '省编号(#key)对应的省名称不能为空',
  BP_PROVINCE_CODE_CORRESPONDING_CITY_IS_NULL: '省(#key)对应的城市编号不能为空',
  BP_CITY_CODE_CORRESPONDING_AREA_IS_NOT_EXIST: '市编号(#key)对应的区域不存在',
  BP_CITY_CODE_CORRESPONDING_NAME_IS_NULL: '市编号(#key)对应的市名称不能为空',
  BP_CITY_CODE_CORRESPONDING_COUNTY_IS_NULL: '市(#key)对应的区/县编号不能为空',
  BP_COUNTY_CODE_CORRESPONDING_AREA_IS_NOT_EXIST: '区/县编号(#key)对应的区域不存在',
  BP_COUNTY_CODE_CORRESPONDING_NAME_IS_NULL: '区/县编号(#key)对应的区域名称不能为空',
  BP_COUNTY_CODE_CORRESPONDING_STREET_IS_NULL: '区/县(#key)对应的街道编号不能为空',
  BP_STREET_CODE_CORRESPONDING_AREA_IS_NOT_EXIST: '街道编号(#key)对应的区域不存在',
  BP_STREET_CODE_CORRESPONDING_NAME_IS_NULL: '街道编号(#key)对应的街道名称不能为空',
  BP_BUSINESSPARTNER_ADDRESS_IS_NULL: '详细地址不能为空',
  BP_BUSINESSPARTNER_TEL_COUNTRY_CODE_IS_NULL: '电话国家不能为空',
  BP_BUSINESSPARTNER_TEL_AREA_CODE_IS_NULL: '电话区号不能为空',
  BP_BUSINESSPARTNER_TEL_IS_NULL: '电话号不能为空',
  BP_BUSINESSPARTNER_TEL_EXTENSION_IS_NULL: '维护BP时基础数据电话分机号不能为空',
  BP_BUSINESSPARTNER_MOBILE_PHONE_COUNTRY_CODE_IS_NULL: '手机国家不能为空',
  BP_BUSINESSPARTNER_MOBILE_PHONE_IS_NULL: '手机不能为空',
  BP_BUSINESSPARTNER_MOBILE_PHONE_CERTIFICATION_STATUS_IS_NULL: '手机号验证状态能为空',
  BP_BUSINESSPARTNER_EMAIL_FORMAT_IS_FALSE: '邮箱(#key)格式不正确',
  BP_BUSINESSPARTNER_EMAIL_CERTIFICATION_STATUS_IS_NULL: '邮箱验证状态不能为空',
  BP_BUSINESSPARTNER_TYPE_IS_FALSE: '当前业务伙伴(#key)对应的客户冻结状态(#key)不正确',
  BP_BUSINESSPARTNER_MOBILE_AND_COUNTY_NEED_COEXIST: '手机国家编号和手机号须同时填写或者同时为空',
  BP_BUSINESSPARTNER_TELPHONE_AND_COUNTY_NEED_COEXIST:
    '电话国家编号及电话号码须同时填写或者同时为空',
  BP_BUSINESSPARTNER_FAX_AND_COUNTY_NEED_COEXIST: '传真国家编号和传真号须同时填写或者同时为空',
  BP_BUSINESSPARTNER_NAME_IS_EXIST: '名称(#key)已存在(#key)',
  BP_BUSINESSPARTNER_MOBILE_IS_EXIST: '移动电话(#key)已存在(#key)',
  BP_BUSINESSPARTNER_EMAIL_IS_EXIST: '邮箱(#key)已存在(#key)',
  BP_BUSINESSPARTNER_CUSTOMER_NOT_EXIST_CAN_NOT_PI_CERTIFITION:
    '维护BP时没有客户数据不能有PI认证数据',
  BP_BUSINESSPARTNER_ORG_CAN_NOT_PI_CERTIFITION: '维护BP时类型为组织的数据不能有PI认证数据',
  BP_PI_CERTIFICATION_BILLTOPARTYID_IS_NULL: 'PI认证数据开票方ID不能为空',
  BP_PI_CERTIFICATION_ATTACHMENTCODE_IS_NULL: 'PI认证数据附件编号不能为空',
  BP_PI_CERTIFICATION_BILLTOPARTYID_FALSE:
    '维护BP时PI认证数据开票方不存在于客户销售区域下的开票方列表数据',
  BP_BUSINESSPARTNER_ORG_CERTIFICATION_IS_NULL: '维护BP时客户数据组织认证不能为空',
  BP_BUSINESSPARTNER_PI_CAN_NOT_ORG_CERTIFITION: '维护BP时类型为人员的数据不能有组织认证数据',
  BP_ORGANIZATION_CERTIFICATION_TAXNO_IS_NULL: '组织认证数据税号不能为空',
  BP_ORGANIZATION_CERTIFICATION_TAXNO_IS_EXIST: '组织认证数据税号(#key)已存在(#key)',
  BP_ORGANIZATION_CERTIFICATION_TAXNO_IS_FALSE: '组织认证数据行业类别(#key)对应税号(#key)不正确',
  BP_ORGANIZATION_REGISTERED_ADDRESS_IS_NULL: '组织认证数据注册地址不能为空',
  BP_ORGANIZATION_BANK_CODE_IS_NULL: '组织认证数据银行编号不能为空',
  BP_ORGANIZATION_BANK_ACCOUNT_IS_NULL: '组织认证数据银行账户不能为空',
  BP_ORGANIZATION_ATTACHMENTCODE_IS_NULL: '组织认证数据附件编号不能为空',
  BP_VENDOR_COMPANY_IS_NULL: '供应商数据供应商公司代码数据不能为空',
  BP_VENDOR_COMPANY_CODE_IS_NULL: '供应商数据公司代码编号不能为空',
  BP_VENDOR_COMPANY_RECONCILIATIONACCOUNTCODE_IS_NULL: '供应商数据公司代码对账科目不能为空',
  BP_VENDOR_COMPANY_SORTKEYCODE_IS_NULL: '供应商数据公司代码排序码不能为空',
  BP_VENDOR_COMPANY_PAYMENTTERMSCODE_IS_NULL: '供应商数据公司代码付款条件不能为空',
  BP_VENDOR_COMPANY_PAYMENTMETHODCODE_IS_NULL: '供应商数据公司代码付款方式不能为空',
  BP_VENDOR_COMPANY_INVOICEPOSTBLOCK_IS_NULL: '供应商数据当前公司代码过账冻结状态不能为空',
  BP_VENDOR_COMPANY_CODE_IS_EXIST: '供应商数据公司代码(#key)已存在,不能重复',
  BP_VENDOR_PURCHASE_IS_NULL: '供应商数据采购组织不能为空',
  BP_VENDOR_PURCHASE_CODE_IS_NULL: '供应商数据采购组织编号不能为空',
  BP_VENDOR_PURCHASE_CURRENCY_CODE_IS_NULL: '供应商数据采购组织币种编号不能为空',
  BP_VENDOR_PURCHASE_PAYMENTTERMS_CODE_IS_NULL: '供应商采购组织付款条件编号不能为空',
  BP_VENDOR_PURCHASE_SALER_NAME_IS_NULL: '供应商采购组织销售人员名称不能为空',
  BP_VENDOR_PURCHASE_SALER_MOBILE_COUNTRY_CODE_IS_NULL:
    '供应商采购组织销售人员电话国家编号不能为空',
  BP_VENDOR_PURCHASE_SALER_MOBILE_IS_NULL: '供应商采购组织销售人员电话不能为空',
  BP_VENDOR_PURCHASE_LEVELCODE_IS_NULL: '供应商采购组织ABC标识不能为空',
  BP_VENDOR_PURCHASE_INVOICEPOSTINRECEIVE_IS_NULL: '供应商采购组织收货时发票过账不能为空',
  BP_VENDOR_PURCHASE_PURCHASEGROUPCODE_IS_NULL: '供应商采购组织采购组编号不能为空',
  BP_VENDOR_PURCHASE_DELIVERYPLANDAYS_IS_NULL: '供应商采购组织计划交货时间不能为空',
  BP_VENDOR_PURCHASE_IS_EXISC: '供应商采购组织(#key)已存在,不能重复',
  BP_VENDOR_PAYMENTBANK_IS_NULL: '供应商数据付款银行数据不能为空',
  BP_VENDOR_PAYMENTBANK_COUNTRY_CODE_IS_NULL: '供应商数据付款银行国家编号不能为空',
  BP_VENDOR_PAYMENTBANK_CODE_IS_NULL: '供应商数据付款银行编号不能为空',
  BP_VENDOR_PAYMENTBANK_ACCOUNT_IS_NULL: '供应商数据付款银行账户不能为空',
  BP_VENDOR_PAYMENTBANK_ACCOUNT_NAME_IS_NULL: '供应商数据付款银行户名不能为空',
  BP_VENDOR_INVOICEPOSTBLOCK_ACCOUNT_IS_NULL: '供应商数据采购冻结不能为空',
  BP_VENDOR_ACCOUNT_GROUP_CODE_IS_NULL: '供应商数据账户组不能为空',
  BP_CUSTOMER_CUSTOMERADDRESS_IS_NULL: '客户数据收货地址不能为空',
  BP_CUSTOMER_CUSTOMERADDRESS_CODE_IS_NULL: '客户收货地址编号不能为空',
  BP_CUSTOMER_CUSTOMERADDRESS_CONSIGNEE_NAME_IS_NULL: '客户收货地址收货人名称不能为空',
  BP_CUSTOMER_CUSTOMERADDRESS_CONSIGNEE_MOBILE_COUNTRY_CODE_IS_NULL:
    '客户收货地址收货人手机号码国家不能为空',
  BP_CUSTOMER_CUSTOMERADDRESS_CONSIGNEE_MOBILE_IS_NULL: '客户收货地址收货人手机号码不能为空',
  BP_CUSTOMER_CUSTOMERADDRESS_ADDRESS_IS_NULL: '客户收货地址详细地址不能为空',
  BP_CUSTOMER_CUSTOMERADDRESS_SOURCE_IS_NULL: '客户收货地址来源不能为空',
  BP_CUSTOMER_CUSTOMERADDRESS_COUNTRY_CODE_OR_NAME_IS_NULL:
    '维护BP时客户收货地址国家编号或名称不能为空',
  BP_CUSTOMER_TAXOUTPUT_COUNTRY_CODE_IS_NULL: '客户数据销项税国家编号不能为空',
  BP_CUSTOMER_TAXOUTPUT_TAXCATEGORYCODE_IS_NULL: '客户数据税收类别编号不能为空',
  BP_CUSTOMER_TAXOUTPUT_TAXCLASSIFICCODE_IS_NULL: '客户数据税分类编号不能为空',
  BP_CUSTOMER_SALES_AREA_IS_NOT_EXIST: '客户数据销售范围不存在,不能有公司代码数据',
  BP_CUSTOMER_COMPANY_IS_NULL: '维护BP时客户数据公司代码不能为空',
  BP_CUSTOMER_COMPANY_CODE_IS_NULL: '维护BP时客户数据公司编号不能为空',
  BP_CUSTOMER_COMPANY_PAYMENTTERMSCODE_IS_NULL: '维护BP时客户数据公司付款条件代码不能为空',
  BP_CUSTOMER_COMPANY_RECONCILIATIONACCOUNTCODE_IS_NULL: '维护BP时客户数据公司对账科目编号不能为空',
  BP_CUSTOMER_COMPANY_CODE_IS_EXIST: '维护BP时客户数据公司编号(#key)已存在,不能重复',
  BP_CUSTOMER_SALES_AREA_IS_NULL: '维护BP时客户数据销售范围不能为空',
  BP_CUSTOMER_SALES_AREA_SALESORGANIZATIONCODE_IS_NULL: '维护BP时客户数据销售组织不能为空',
  BP_CUSTOMER_SALES_AREA_DISTRIBUTIONCHANNELCODE_IS_NULL: '维护BP时客户数据分销渠道不能为空',
  BP_CUSTOMER_SALES_AREA_SALESDIVISIONCODE_IS_NULL: '维护BP时客户数据产品组不能为空',
  BP_CUSTOMER_SALES_AREA_REGIONCODE_IS_NULL: '维护BP时客户数据大区不能为空',
  BP_CUSTOMER_SALES_AREA_OFFICECODE_IS_NULL: '维护BP时客户数据网点不能为空',
  BP_CUSTOMER_SALES_AREA_CURRENCYCODE_IS_NULL: '维护BP时客户数据币种不能为空',
  BP_CUSTOMER_SALES_AREA_PAYMENTMETHODCODE_IS_NULL: '维护BP时客户数据默认付款方式不能为空',
  BP_CUSTOMER_SALES_AREA_INVOICETYPECODE_IS_NULL: '维护BP时客户数据默认开票类型不能为空',
  BP_CUSTOMER_SALES_AREA_SALESDISTRICTCODE_IS_NULL: '维护BP时客户数据销售区域编号不能为空',
  BP_CUSTOMER_SALES_AREA_PRICINGPROCEDURECODE_IS_NULL: '维护BP时客户数据客户定价过程编号不能为空',
  BP_CUSTOMER_SALES_AREA_STATGROUPCODE_IS_NULL: '维护BP时客户数据客户统计组编号不能为空',
  BP_CUSTOMER_SALES_AREA_SHIPPINGCONDITIONCODE_IS_NULL: '维护BP时客户数据装运条件不能为空',
  BP_CUSTOMER_SALES_AREA_INVOICEWITHGOODS_IS_NULL: '维护BP时客户数据随货开票不能为空',
  BP_CUSTOMER_SALES_AREA_PAYMENTTERMSCODE_IS_NULL: '维护BP时客户数据付款条件代码不能为空',
  BP_CUSTOMER_SALES_AREA_ACCOUNTASSIGNMENTGROUPCODE_IS_NULL:
    '维护BP时客户数据客户科目分配组编号不能为空',
  BP_CUSTOMER_SALES_AREA_ACCOUNTASSALESORDERBLOCK_IS_NULL:
    '维护BP时客户数据当前销售范围销售冻结状态不能为空',
  BP_CUSTOMER_SALES_AREA_ORGCOMPANYCODE_IS_NULL: '维护BP时客户销售组织(#key)对应的公司代码不存在',
  BP_CUSTOMER_SALES_AREA_SALESAREAREGION_IS_NULL:
    '维护BP时客户销售范围(#key)对应的销售大区(#key)不存在',
  BP_CUSTOMER_SALES_AREA_DISTRIBUTIONCHANNEL_IS_EXSIT:
    '维护BP时客户数据销售组织分销渠道(#key)已存在,不能重复',
  BP_CUSTOMER_SALES_AREA_DISTRIBUTIONCHANNEL_IS_NOT_EXSIT:
    '维护BP时客户数据销售组织分销渠道(#key)关系不存在',
  BP_CUSTOMER_SALES_AREA_DISTRIBUTIONCHANNEL_IS_NOT_WHOLE:
    '维护BP时客户数据销售组织(#key)对应分销渠道不完整',
  BP_CUSTOMER_SALES_AREA_DISTRIBUTIONCHANNEL_IS_NOT_SAME:
    '维护BP时客户数据同一销售组织(#key)对应分销渠道(#key)数据不同',
  BP_CUSTOMER__DISTRIBUTIONCHANNEL_IS_NOT_WHOLE: '维护BP时客户数据销售组织对应分销渠道(#key)不完整',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_PARTNERTYPECODE_IS_NULL:
    '维护BP时销售范围对应合作伙伴功能编号不能为空',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_PARTNERCODE_IS_NULL:
    '维护BP时销售范围对应合作伙伴编号不能为空',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_BUSINESSPARTNER_IS_NOT_EXIST:
    '维护BP时销售范围合作伙伴编号(#key)对应业务伙伴不存在',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_BUSINESSPARTNER_IS_NOT_WHOLE:
    '维护BP时销售范围合作伙伴编号(#key)对应业务伙伴客户数据不完整',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_BP_NOT_BE_PERSON:
    '维护BP时客户销售范围对应开票方不能为其它人员类型业务伙伴(#key)',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_BP_NOT_CERTIFICATION:
    '维护BP时销售范围开票方编号(#key)对应业务伙伴认证状态不是已认证状态',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_SP_NOT_BE_ORG:
    '维护BP时客户销售范围对应售达方不能为其它组织类型业务伙伴(#key)',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_SP_NOT_CERTIFICATION:
    '维护BP时销售范围售达方编号(#key)对应业务伙伴认证状态不是已认证状态',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_SH_NOT_BE_ORG:
    '维护BP时客户销售范围对应送达方不能为其它组织类型业务伙伴(#key)',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_SALES_AREA_NOT_EXIST:
    '维护BP时客户销售范围对应合作伙伴(#key)对应的销售范围(#key)不存在',
  BP_CUSTOMER_SALES_AREA_CUSTOMERPARTNER_NOT_REPEAT:
    '维护BP时客户数据合作伙伴(#key)已存在,不能重复',
  BP_BUSINESSPARTNER_ROLE_IS_NULL: '维护BP时角色数据不能为空',
  BP_BUSINESSPARTNER_ROLE_CODE_IS_NULL: '维护BP时角色数据编号不能为空',
  BP_CUSTOMER_SALESORDERBLOCK_IS_NULL: '维护BP时客户数据销售冻结不能为Null',
  BP_CUSTOMER_ACCOUNTGROUPCODE_IS_NULL: '维护BP时客户数据账户组不能为空',
  BP_BUSINESSPARTNER_SALESORDERBLOCK_IS_FALSE: '当前业务伙伴(#key)对应的类型(#key)不正确',
  BP_BUSINESSPARTNER_CENTRALINVOICEPOSTBLOCK_IS_FALSE:
    '当前业务伙伴(#key)对应的供应商采购冻结(#key)不正确',
  BP_BUSINESSPARTNER_INVOICEPOSTINRECEIVE_IS_FALSE:
    '当前业务伙伴(#key)对应的收货时发票过账(#key)不正确',
  BP_BUSINESSPARTNER_CREDIT_IS_NULL: '客户信用额度不存在,无法申请临时信用额度',
  BP_BUSINESSPARTNER_NOT_ORG: '业务伙伴ID(#key)的类型不是组织',
  BP_BUSINESSPARTNER_MOBILE_NOT_VERIFY: '业务伙伴ID(#key)的手机验证状态不是已验证',
  BP_BUSINESSPARTNER_EMAIL_NOT_VERIFY: '业务伙伴ID(#key)的邮箱验证状态不是已验证',
  BP_CHANGE_MOBILE_EMAIL_QUESTION_ANSWER_PARAM_IS_NULL:
    '人工辅助变更已验证手机邮箱验证问题答案提交参数不能为空',
  BP_CHANGE_MOBILE_EMAIL_QUESTION_ANSWER_IS_NULL:
    '人工辅助变更已验证手机邮箱验证问题答案提交参数答案列表不能为空',
  BP_CHANGE_MOBILE_EMAIL_QUESTION_ANSWER_TYPE_IS_NULL:
    '人工辅助变更已验证手机邮箱验证问题答案参数type不正确',
  BP_VERIFY_RECORD_MOBILE_STATUS_NOT_UNVERIFY: '业务伙伴(#key)对应的手机验证状态不是未验证状态',
  BP_VERIFY_RECORD_EMAIL_STATUS_NOT_UNVERIFY: '业务伙伴(#key)对应的邮箱验证状态不是未验证状态',
  BP_VERIFY_RECORD_NOT_EXIST: '验证记录ID(#key)对应的记录不存在',
  BP_VERIFY_RECORD_NOT_VERIFING: '验证记录(#key)不是验证中状态',
  BP_VERIFY_RECORD_IS_EXPIRE: '验证记录(#key)已失效',
  BP_VERIFY_RECORD_TYPE_NOT_CHANGE_EMAIL: '验证记录(#key)类型不是变更验证邮箱',
  BP_EMAIL_IS_NULL: '参数邮件不能为空',
  BP_VERIFY_RECORD_TYPE_NOT_CHANGE_MOBILE: '验证记录(#key)类型不是变更验证手机',
  BP_MOBILE_COUNTRY_IS_NULL: '参数手机国家不能为空',
  BP_MOBILE_IS_NULL: '参数手机号不能为空',
  BP_BPID_IS_NULL: '参数业务伙伴(bpId)不能为空',
  BP_BUSINESSPARTNER_CUSTOMER_NOT_EXIST: '业务伙伴(#key)对应的客户数据不存在',
  BP_BUSINESSPARTNER_CUSTOMER_IS_BLOCK: '业务伙伴(#key)对应的客户已冻结',
  BP_BUSINESSPARTNER_CUSTOMER_IS_ACTIVE: '业务伙伴(#key)对应的客户已激活',
  BP_CURRENCYCODE_IS_NULL: '参数currencyCode不能为空',
  BP_BUSINESSPARTNER_NOT_CERTIFITION_PARTCERTIFITION:
    '业务伙伴(#key)对应的业务伙伴不是部分认证证或已认证',
  BP_BUSINESSPARTNER_PI_BILLTOPARTYID_IS_NULL: '人员类业务伙伴对应开票方ID不能为空',
  BP_BUSINESSPARTNER_PI_BILLTOPARTY_RELATION_IS_NULL:
    '人员类业务伙伴(#key)对应开票方(#key)关系不存在',
  BP_BUSINESSPARTNER_CREDIT_PARAM_IS_NULL: '客户信用额度配置参数不存在,无法评估信用额度',
  BP_PERSON_CAN_NOT_CANCLE_ORG_CERTIFITION: '业务伙伴(#key)的类型为人员,不能取消组织认证',
  BP_NOT_CERTIFITIONED_CAN_NOT_CANCLE_ORG_CERTIFITION:
    '业务伙伴(#key)不是已认证状态,不能取消组织认证',
  BP_APPROVALING_OR_UNCERTIFITION_CAN_NOT_CANCEL_PI_CERTIFITION:
    '业务伙伴(#key)是审核中或未认证状态,PI取消认证失败',
  BP_PI_CERTIFITION_NOT_EXIST: 'PI认证记录(#key)不存在',
  BP_PI_APPROVALING_CAN_NOT_CANCEL_PI_CERTIFITION: 'PI认证记录(#key)状态为审核中,不能取消认证',
  BP_PI_APPROVALING_CAN_NOT_SUBMIT_PI_CERTIFITION: '有审核中的PI认证不能提交认证',
  BP_BATCH_UPDATE_PI_CERTIFITION_NAME_IS_NULL: '批量变更PI认证资料新增PI认证列表名称不能为空',
  BP_PI_CERTIFITION_BILLTOPARTYID_IS_NOT_EXIST: 'PI认证业务伙伴(#key)对应开票方(#key)不存在',
  BP_PI_CERTIFITION_BILLTOPARTY_IS_ALREADY_CERTIFITION:
    'PI认证记录(#key)已经存在,批量变更PI认证资料不能新增PI认证',
  BP_PI_APPROVALING_CAN_NOT_BATCH_UPDATE_PI_CERTIFITION:
    'PI认证记录(#key)为审核中状态,批量变更PI认证资料不能新增PI认证',
  BP_PI_APPROVALING_CAN_NOT_BATCH_CANCLE_PI_CERTIFITION:
    'PI认证记录(#key)状态为审核中,批量变更PI认证资料不能删除当前PI认证记录',
  BP_BUSINESSPARTNER_CODE_IS_ALREADY_EXIST: '编号(#key)已存在',
  BP_BUSINESSPARTNER_NOT_PERSON: 'ID为(#key)的业务伙伴类型不是人员',
  BP_PI_CERTIFITION_BILLTOPARTY_NAME_IS_NOT_EXIST: 'Pi认证数据对应的开票方名称不存在',
  BP_VERIFY_RECORD_BUSINESSPARTNER_NOT_EXIST: '验证记录(#key)对应的业务伙伴不存在',
  BP_PI_CERIFITION_VERIFY_RECORD_BILLTOPARTY_NOT_EXIST: '验证记录(#key)对应的开票方不存在',
  BP_VERIFY_RECORD_SH_NOT_EXIST: '验证记录(#key)对应的送达方不存在',
  BP_VERIFY_RECORD_SP_NOT_EXIST: '验证记录(#key)对应的售达方不存在',
  BP_VERIFYCODE_FALSE: '验证码不正确',
  BP_VERIFY_RECORD_BUSINESSPARTNER_CODE_IS_NULL: '验证记录(#key)对应的业务伙伴编号为空',
  BP_VERIFY_RECORD_BUSINESSPARTNER_NOT_APPROVALING_OR_PARTCERTIFITION:
    '业务伙伴(#key)对应的认证状态不是审核中或部分认证',
  BP_VERIFY_RECORD_ORG_CERTIFITION_NOT_EXIST: '验证记录(#key)对应的组织认证验证记录不存在',
  BP_VERIFY_RECORD_PI_VERIFY_NOT_EXIST: '验证记录(#key)对应的PI认证验证记录不存在',
  BP_VERIFY_RECORD_PI_CERTIFITION_NOT_EXIST: '验证记录(#key)对应的PI认证记录不存在',
  BP_VERIFY_RECORD_CUSTOMERPARTNER_NOT_APPROVALING:
    '验证记录(#key)对应的合作伙伴记录状态不是审核中状态',
  BP_VERIFY_RECORD_LINK_SP_NOT_EXIST: '验证记录(#key)对应的关联售达方记录不存在',
  BP_VERIFY_RECORD_LINK_SP_NOT_VERIFING: '验证记录(#key)对应的关联售达方记录状态不是验证中',
  BP_VERIFY_RECORD_CUSTOMERPARTNER_NOT_EXIST: '验证记录(#key)对应的合作伙伴记录不存在',
  BP_VERIFY_RECORD_CUSTOMERPARTNER_NOT_VERIFING:
    '验证记录(#key)对应的合作伙伴记录状态不是验证中状态',
  BP_VERIFY_RECORD_BUSINESSPARTNER_EMAIL_NOT_VERIFING:
    '验证记录(#key)对应的业务伙伴邮箱状态不是验证中',
  BP_VERIFY_RECORD_BUSINESSPARTNER_MOBILE_NOT_VERIFING:
    '验证记录(#key)对应的业务伙伴手机状态不是验证中',
  BP_VERIFY_RECORD_VERIFY_CONTACT_NOT_EXIST: '验证记录(#key)对应的验证联系信息记录不存在',
  BP_VERIFY_RECORD_VERIFY_CONTACT_STATUS_NOT_VERIFING:
    '验证记录(#key)对应的验证联系信息记录状态不是验证中',
  BP_VERIFY_RECORD_EMAIL_DIFFERENT: '验证记录(#key)对应的验证联系信息记录中邮箱与BP邮箱不一致',
  BP_VERIFY_RECORD_MOBILE_DIFFERENT: '验证记录(#key)对应的验证联系信息记录中手机与BP手机不一致',
  BP_VERIFY_RECORD_EMAIL_NOT_CHANGEING: '验证记录(#key)对应的业务伙伴邮箱状态不是变更中',
  BP_VERIFY_RECORD_MOBILE_NOT_CHANGEING: '验证记录(#key)对应的业务伙伴手机状态不是变更中',
  BP_VERIFY_RECORD_CHAGEING_CONTACT_NOT_EXIST: '验证记录(#key)对应的变更联系信息记录不存在',
  BP_VERIFY_RECORD_CHAGEING_CONTACT_STATUS_NOT_VERIFIED:
    '验证记录(#key)对应变更联系信息记录原状态不是已完成',
  BP_VERIFY_RECORD_CHAGEING_CONTACT_STATUS_NOT_VERIFING:
    '验证记录(#key)对应变更联系信息记录新状态不是验证中',
  BP_BUSINESSPARTNER_COUNTRY_AREA_IS_NOT_EXIST: '国家编号(#key)对应的区域不存在',
  BP_BUSINESSPARTNER_NOT_CERTIFITION_OR_UNCERTIFITION:
    '业务伙伴(#key)不是已认证或未认证状态,组织认证失败',
  BP_ORG_CERTIFITION_COMMON_IS_NULL: '组织认证时基础数据不能为空',
  BP_ORG_CERTIFITION_IS_NULL: '组织认证时认证数据不能为空',
  BP_ORG_CERTIFITION_COUNTRY_CODE_IS_NULL: '组织认证时国家编号不能为空',
  BP_ORG_CERTIFITION_TEL_COUNTRY_CODE_IS_NULL: '组织认证时电话国家不能为空',
  BP_ORG_CERTIFITION_TEL_AREA_CODE_IS_NULL: '组织认证时电话区号不能为空',
  BP_ORG_CERTIFITION_TEL_IS_NULL: '组织认证时电话号不能为空',
  BP_ORG_CERTIFITION_TEL_EXTENSION_IS_NULL: '组织认证时电话分机号不能为空',
  BP_ORG_CERTIFITION_INDUSTRY_FALSE: '组织认证时行业类别不正确',
  BP_ORG_CERTIFITION_NAME_FALSE: '组织认证时名称不能为空',
  BP_ORG_CERTIFITION_NAME_ALREADY_EXIST: '组织认证时名称(#key)已存在(#key)',
  BP_ORG_CERTIFITION_ADDRESS_IS_NULL: '组织认证时基础数据详细地址不能为空',
  BP_ORG_CERTIFITION_TAXNO_IS_NULL: '维护BP时组织认证数据税号(#key)已存在(#key)',
  BP_ORG_CERTIFITION_NOTES_IS_NULL: '维护BP时组织认证说明不能为空',
  BP_BILLTOPARTY_NAME_NOT_EXIST: '开票方对应的名称不存在',
  BP_BILLTOPARTY_SOLDTOPARTY_NAME_NOT_EXIST: '开票方对应售达方的名称不存在',
  BP_SOLDTOPARTY_NAME_NOT_EXIST: '售达方对应的名称不存在',
  BP_SHIPTOPARTY_NAME_NOT_EXIST: '送达方对应的名称不存在',
  BP_CREDIT_BILLTOPARTY_NAME_NOT_EXIST: '信贷数据对应的开票方名称不存在',
};
