/**
 * 组织英国气泡
 */
import { Descriptions } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import api from '@/api';
import '@/pages/partner/maintain_edit/style.less';

@connect(({ basicCache }) => ({
  industryCategories: basicCache.industryCategories,
  // SpecialInvoice: bp.SpecialInvoice,
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
    const { data } = this.props;
    const { pic } = this.state;
    const { organizationCertification } = data;
    return (
      <Descriptions column={2} style={{ width: '1000px' }} className="orgStyle">
        <Descriptions.Item label={formatMessage({ id: 'bp.maintain.customerName' })}>
          {organizationCertification.name}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'bp.maintain.ChangeModal.vat' })}>
          {organizationCertification.taxNo}
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
