/**
 * 选择售达方
 */
import {
  Modal,
  Table,
  Button,
  AutoComplete,
  Input,
  Icon,
} from 'antd';
import React from 'react';
import bp from '@/api/bp';

class ChooseSoldToParty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: [],
    };
  }

  changeVisible = visible => {
    this.setState({ visible });
    if (visible) this.handleSearch({ page: 1 });
  }

  handleSearch = data => {
    console.log(data);
    bp.getSoldToParty({ page: 1, pageSize: 10 }).then(res => {
      console.log(res);
    });
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
        title: '售达方',
        dataIndex: 'name',
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <AutoComplete
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
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
        title: '认证',
        dataIndex: 'certificationStatus',
        filters: [
          { value: 1, text: '已认证' },
          { value: 2, text: '未认证' },
          { value: 3, text: '审核种' },
        ],
      },
      {
        title: '冻结',
        dataIndex: 'salesOrderBlock',
        filters: [
          { value: 1, text: '冻结' },
          { value: 2, text: '活跃' },
        ],
      },
      {
        title: '完整',
        dataIndex: 'dataStatus',
        filters: [
          { value: 1, text: '完整' },
          { value: 2, text: '不完整' },
        ],
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
        title: '收票方',
        dataIndex: 'invoiceParty',
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
        title="售达方"
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

export default ChooseSoldToParty;
