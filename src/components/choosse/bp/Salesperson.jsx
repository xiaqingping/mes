/**
 * 选择销售员
 */
import {
  Modal,
  Table,
  Button,
  AutoComplete,
  Input,
  Icon,
  Cascader,
} from 'antd';
import React from 'react';

class ChooseSalesperson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: [
        {
          id: 1,
          code: '123456789',
          name: '上海交通大学',
        },
      ],
    };
  }

  changeVisible = visible => {
    this.setState({ visible });
  }

  handleSearch = data => {
    console.log(data);
  }

  handleReset = data => {
    console.log(data);
  }

  selectRow = row => {
    this.props.selectChooseModalData(row);
    this.setState({ visible: false });
  }

  render() {
    const { list } = this.state;
    const tableWidth = 0;
    const columns = [
      {
        title: '销售员',
        dataIndex: 'name',
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <AutoComplete style={{ width: 188, marginBottom: 8, display: 'block' }} />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              搜索
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              重置
            </Button>
          </div>
        ),
      },
      {
        title: '区域归属',
        dataIndex: 'area',
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <Cascader style={{ width: 188, marginBottom: 8, display: 'block' }} options={[]} />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              搜索
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              重置
            </Button>
          </div>
        ),
      },
      {
        title: '联系方式',
        dataIndex: 'contactInfo',
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <Input
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >搜索</Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              重置
            </Button>
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'actions',
        render: (text, record) => (
          <a onClick={() => this.selectRow(record)}>选择</a>
        ),
      },
    ];

    return (
      <Modal
        title="销售员"
        visible={this.state.visible}
        width="1200px"
        onCancel={() => this.changeVisible(false)}
        footer={null}
      >
        <Table
          rowKey="id"
          scroll={{ x: tableWidth }}
          dataSource={list}
          columns={columns}
        />
      </Modal>
    );
  }
}

export default ChooseSalesperson;
