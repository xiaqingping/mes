/**
 * 组织国内气泡
 */
import { Descriptions, Badge } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';
import api from '@/api';
import '@/pages/partner/maintain_edit/style.less';
import ContactInformation from './ContactInformation';

@connect(({ basicCache, bp }) => ({
  industryCategories: basicCache.industryCategories,
  BpCertificationStatus: bp.BpCertificationStatus,
  SpecialInvoice: bp.SpecialInvoice,
}))
class OrgChina extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pic: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'industryCategories' },
    });
    const newData = [];
    const { data } = this.props;
    if (data.organizationCertification.attachmentCode) {
      api.disk
        .getFiles({
          sourceKey: 'bp_organization_certification',
          sourceCode: data.organizationCertification.attachmentCode,
        })
        .then(v => {
          v.forEach(item => {
            if (item.id) {
              newData.push(api.disk.downloadFiles(item.id, { view: true }));
            }
          });
          this.setState({
            pic: newData,
          });
        });
    }
  }

  render() {
    const { data, BpCertificationStatus, SpecialInvoice, industryCategories } = this.props;
    const { pic } = this.state;
    const { organizationCertification } = data;
    return (
      <Descriptions column={2} style={{ width: '1000px' }} className="orgStyle">
        <Descriptions.Item label={formatMessage({ id: 'bp.maintain.customerName' })}>
          {organizationCertification.name}
        </Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain_details.verification_data.VAT_Business' })}
        >
          {organizationCertification.taxNo}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'bp.maintain_details.status' })}>
          <Badge
            status={formatter(BpCertificationStatus, data.status, 'id', 'badge')}
            text={formatter(BpCertificationStatus, data.status, 'id', 'name')}
          />
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'bp.operation.operator' })}>
          {data.operatorName}
        </Descriptions.Item>
        <Descriptions.Item label="">{data.finishDate}</Descriptions.Item>
        <Descriptions.Item label="">{data.operatorDate}</Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain.ChangeModal.address' })}
          span={2}
        >
          {organizationCertification.countryName}&nbsp;
          {organizationCertification.provinceName}&nbsp;
          {organizationCertification.cityName}&nbsp;
          {organizationCertification.countyName}&nbsp;
          {organizationCertification.streetName}&nbsp;
        </Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain_details.verification_data.special_invoice' })}
        >
          {formatter(SpecialInvoice, organizationCertification.specialInvoice)}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'bp.maintain.ChangeModal.businessType' })}>
          {formatter(industryCategories, organizationCertification.industryCode, 'code')}
        </Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain_details.verification_data.account_number' })}
        >
          {organizationCertification.bankCode}
        </Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' })}
        >
          {organizationCertification.bankName}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.settings.basic.phone' })}>
          <ContactInformation
            data={{
              countryCode: organizationCertification.telephoneCountryCode,
              areaCode: organizationCertification.telephoneAreaCode,
              code: organizationCertification.telephone,
              extension: organizationCertification.telephoneExtension,
              hideFlag: true,
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain_details.verification_data.address' })}
        >
          {organizationCertification.registeredAddress}
        </Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
          span={2}
        >
          {organizationCertification.notes}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'bp.maintain_details.popover.attachment' })}>
          {pic.map((item, index) => (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={{
                width: '100px',
                height: '100px',
                border: '1px solid #D9D9D9',
                textAlign: 'center',
                lineHeight: '94px',
                borderRadius: '5px',
                float: 'left',
                marginRight: '10px',
              }}
            >
              <img src={item} alt="" width="90" height="90" />
            </li>
          ))}
        </Descriptions.Item>
      </Descriptions>
    );
  }
}

export default OrgChina;
