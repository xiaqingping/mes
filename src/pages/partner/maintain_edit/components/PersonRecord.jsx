/**
 * 个人气泡
 */
import { Descriptions, Badge } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';
import api from '@/api';
import '@/pages/partner/maintain_edit/style.less';

@connect(({ basicCache, bp }) => ({
  industryCategories: basicCache.industryCategories,
  BpCertificationStatus: bp.BpCertificationStatus,
  // SpecialInvoice: bp.SpecialInvoice,
}))
class PersonRecord extends Component {
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
    if (data.piCertification.attachmentCode) {
      api.disk
        .getFiles({
          sourceKey: 'bp_pi_certification',
          sourceCode: data.piCertification.attachmentCode,
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
    const { data, BpCertificationStatus } = this.props;
    const { pic } = this.state;
    const { piCertification } = data;
    return (
      <Descriptions column={2} style={{ width: '1000px' }} className="orgStyle">
        <Descriptions.Item label={formatMessage({ id: 'bp.maintain.customerName' })} span={2}>
          {piCertification.name}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'bp.maintain_details.status' })} span={2}>
          <Badge
            status={formatter(BpCertificationStatus, data.status, 'id', 'badge')}
            text={formatMessage({
              id: formatter(BpCertificationStatus, data.status, 'id', 'i18n'),
            })}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          {data.finishDate}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'bp.operation.operator' })} span={2}>
          {data.operatorName}&nbsp;&nbsp;&nbsp;&nbsp;
          {data.operatorDate}
        </Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
          span={2}
        >
          {piCertification.notes}
        </Descriptions.Item>
        <Descriptions.Item
          label={formatMessage({ id: 'bp.maintain_details.popover.attachment' })}
          span={2}
        >
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

export default PersonRecord;
