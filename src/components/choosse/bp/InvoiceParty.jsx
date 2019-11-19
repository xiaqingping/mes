/**
 * 选择收票方
 */
import {
  Modal,
  Button,
  AutoComplete,
  Input,
  Icon,
  Table,
} from 'antd';
import React from 'react';
import bp from '@/api/bp';

class ChooseInvoiceParty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  changeVisible = visible => {
    this.setState({ visible });
    if (visible) this.getTableData({ page: 1 });
  }

  getTableData = (options = {}) => {
    const { pagination } = this.state;
    const query = Object.assign({}, {
      page: pagination.current,
      pageSize: pagination.pageSize,
    }, options);

    this.setState({ loading: true });
    bp.getInvoiceParty(query).then(res => {
      this.setState({
        list: res.results,
        pagination: {
          current: query.page,
          pageSize: query.pageSize,
          total: res.total,
        },
      });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  handleReset = data => {
    console.log(data);
  }

  handleStandardTableChange = ({ current, pageSize, total }) => {
    const pagination = { current, pageSize, total };
    this.setState({ pagination }, () => {
      this.getTableData();
    });
  }

  selectRow = row => {
    this.props.selectChooseModalData(row);
    this.setState({ visible: false });
  }

  tableChange = ({ current, pageSize, total }) => {
    const pagination = { current, pageSize, total };
    this.setState({ pagination }, () => {
      this.getTableData();
    });
  }

  getColumns = () => {
    const columns = [
      {
        title: '收票方',
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
              onClick={() => this.getTableData(selectedKeys, confirm)}
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
              onClick={() => this.getTableData(selectedKeys, confirm)}
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
    return columns;
  }

  render() {
    const { list, loading, pagination, visible } = this.state;
    const tableWidth = 0;
    const columns = this.getColumns();

    return (
      <Modal
        title="收票方"
        visible={visible}
        width="1200px"
        onCancel={() => this.changeVisible(false)}
        footer={null}
      >
        <Table
          rowKey="id"
          scroll={{ x: tableWidth }}
          dataSource={list}
          columns={columns}
          loading={loading}
          onChange={this.tableChange}
          pagination={{ ...pagination }}
        />
      </Modal>
    );
  }
}

export default ChooseInvoiceParty;
