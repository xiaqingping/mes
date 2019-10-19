import {
  Card,
  Table,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  subString = (str, len) => {
    // eslint-disable-next-line no-control-regex
    const regexp = /[^\x00-\xff]/g;
    if (str.replace(regexp, 'aa').length <= len) {
      return str;
    }
    const m = Math.floor(len / 2);
    for (let i = m, j = str.length; i < j; i++) {
      if (str.substring(0, i).replace(regexp, 'aa').length >= len) {
        return `${str.substring(0, i)}...`;
      }
    }
    return str;
  }

  render() {
    const { details: { customer: { addressList } } } = this.props
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
        render(val) {
          return (
            <Badge status="error" text={val}/>
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
        render: text => this.subString(text, 30 * 2),
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
          rowKey="id"
          dataSource={addressList}
          columns={columns}
          pagination={false}
        ></Table>
      </Card>
    );
  }
}

export default BasicInfo;
