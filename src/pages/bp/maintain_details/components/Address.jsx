import { Card, Table } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Flag from '@/assets/imgs/flag.jpg';
import './style.less';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    const {
      details: {
        customer: { addressList },
      },
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
        render(text) {
          return (
            // eslint-disable-next-line jsx-a11y/alt-text
            <>
              <img
                src={Flag}
                width="10"
                height="10"
                style={{ borderRadius: '50%', marginBottom: '3px' }}
              />
              &nbsp;&nbsp;{text}
            </>
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
        render: text => (
          <div className="addEllipsis" style={{ width: '300px' }}>
            {text}
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 150,
      },
    ];
    return (
      <Card title="收货地址" bordered={false} style={{ marginBottom: '24px' }}>
        <Table rowKey="id" dataSource={addressList} columns={columns} pagination={false}></Table>
      </Card>
    );
  }
}

export default BasicInfo;
