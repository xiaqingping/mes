import {
  Card,
  Table,
  Button,
} from 'antd';
import React, { Component } from 'react';

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '移动电话',
    dataIndex: 'mobile',
  },
  {
    title: '邮编',
    dataIndex: 'youbian',
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

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    const dataSource = [
      {
        id: 1,
        name: 'name',
        mobile: '18735818888',
        youbian: '123456',
        address: '上海市松江区',
      },
    ];

    return (
      <Card title="收货地址" bordered={false} style={{ marginBottom: '24px' }}>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        ></Table>
      </Card>
    );
  }
}

export default BasicInfo;
