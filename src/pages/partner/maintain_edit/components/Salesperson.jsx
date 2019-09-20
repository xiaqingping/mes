import {
  Table,
  Input,
} from 'antd';
import React from 'react';

class Salesperson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '80%',
        editable: true,
        inputType: <Input />,
        rules: [
          { required: true },
        ],
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

export default Salesperson;
