import { Card, Table } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';
import ContactInformation from '@/pages/partner/maintain_edit/components/ContactInformation';
import { formatMessage } from 'umi/locale';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class BasicInfo extends Component {
  render() {
    const {
      details: { customer },
    } = this.props;
    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain_details.shipping_address.name' }),
        dataIndex: 'name',
        width: 300,
      },
      {
        title: formatMessage({ id: 'bp.mobilePhone' }),
        dataIndex: 'mobilePhone',
        width: 300,
        render(text, record) {
          return (
            <ContactInformation
              data={{
                countryCode: record.mobilePhoneCountryCode,
                code: record.mobilePhone,
              }}
            />
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.postal_code' }),
        dataIndex: 'postCode',
        width: 200,
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.shipping_address.address' }),
        dataIndex: 'address',
        width: 500,
        render: (text, record) => (
          <div className="addEllipsis" style={{ width: '300px' }}>
            {record.countryName}&nbsp;
            {record.provinceName}&nbsp;
            {record.cityName}&nbsp;
            {record.countyName}&nbsp;
            {record.streetName}&nbsp;
            {text}
          </div>
        ),
      },
    ];
    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.shipping_address.address' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <Table
          rowKey={(record, index) => index}
          dataSource={customer ? customer.addressList : []}
          columns={columns}
          pagination={false}
        ></Table>
      </Card>
    );
  }
}

export default BasicInfo;
