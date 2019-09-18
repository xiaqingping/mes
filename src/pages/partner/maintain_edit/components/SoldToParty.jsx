import {
  Table,
  Input,
} from 'antd';
import React from 'react';

class SoldToParty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '40%',
        editable: true,
        inputType: <Input />,
        rules: [
          { required: true },
        ],
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '40%',
      },
      {
        title: '操作',
        dataIndex: 'actions',
      },
    ];
  }

  render() {
    return (
      <Table
        columns={this.columns}
      ></Table>
    );
  }
}

export default SoldToParty;
