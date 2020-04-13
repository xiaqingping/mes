import React from 'react';
import { Table } from 'antd';

class SampleSelect extends React.Component {
  state = {
    tableData: [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ],
  };

  handleDelete = row => {
    console.log(row);
  };

  render() {
    const { tableData } = this.state;
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.handleDelete(record);
              }}
            >
              删除
            </a>
          </span>
        ),
      },
    ];

    return (
      <>
        <Table columns={columns} dataSource={tableData} />
      </>
    );
  }
}

export default SampleSelect;
