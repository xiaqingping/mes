import {
  Card,
  Table,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '移动电话',
    dataIndex: 'mobilePhone',
    render(val) {
      return (
        <Badge status="error" text={val}/>
      );
    },
  },
  {
    title: '邮编',
    dataIndex: 'postCode',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
];

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    const { details: { customer: { addressList } } } = this.props
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
