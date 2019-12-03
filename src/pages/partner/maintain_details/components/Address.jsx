import {
  Card,
  Table,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less'
import api from '@/api';

@connect(({ partnerMaintainEdit, basicCache }) => ({
  details: partnerMaintainEdit.details,
  countryDiallingCodes: basicCache.countryDiallingCodes,
}))
// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  state = {
    phoneData: [],
  };

  componentDidMount() {
    api.basic.getCountryDiallingCodes().then(res => {
      this.setState({
        phoneData: res,
      })
    })
  }

  render() {
    const { details: { customer: { addressList } } } = this.props
    const { phoneData } = this.state
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
          let newData = [];
          // eslint-disable-next-line array-callback-return
          phoneData.map(item => {
            if (item.countryCode === record.mobilePhoneCountryCode) {
              newData = item;
            }
          })
          return (
            // eslint-disable-next-line jsx-a11y/alt-text
            <><img src={`/images/country/${newData.countryCode}.png`} width="10" height="10"
          style={{
            borderRadius: '50%',
            marginBottom: '3px',
          }}/>&nbsp;&nbsp;+{newData.diallingCode}&nbsp;&nbsp;{text}</>
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
      render: (text, record) => <div className="addEllipsis" style={{ width: '300px' }}>
        {record.countryName}&nbsp;
        {record.provinceName}&nbsp;
        {record.cityName}&nbsp;
        {record.countyName}&nbsp;
        {record.streetName}&nbsp;
        {text}
        </div>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 150,
      },
    ];
    return (
      <Card title="收货地址" bordered={false} style={{ marginBottom: '24px' }}>
        <Table
          rowKey={(record, index) => index}
          dataSource={addressList}
          columns={columns}
          pagination={false}
        ></Table>
      </Card>
    );
  }
}

export default BasicInfo;
