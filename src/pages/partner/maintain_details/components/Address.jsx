import { Card, Table } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';
import ContactInformation from '@/pages/partner/maintain_edit/components/ContactInformation';
// import { formatMessage } from 'umi/locale';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    const {
      details: { customer },
    } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 300,
      },
      {
        title: '移动电话',
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
        title: '邮编',
        dataIndex: 'postCode',
        width: 200,
      },
      {
        title: '地址',
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
      <Card title="收货地址" bordered={false} style={{ marginBottom: '24px' }}>
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
