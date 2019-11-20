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
import { connect } from 'dva';
import employees from '@/api/employees';
import { formatter } from '@/utils/utils'

@connect(({ partnerMaintainEdit }) => ({
  BpCertificationStatus: partnerMaintainEdit.BpCertificationStatus,
  SalesOrderBlock: partnerMaintainEdit.SalesOrderBlock,
  CustomerDataStatus: partnerMaintainEdit.CustomerDataStatus,
}), null, null, { withRef: true })
class ChooseSalesPerson extends React.Component {
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
    employees.getSaler(query).then(res => {
      this.setState({
        list: res.result,
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

  selectRow = row => {
    this.props.selectChooseModalData(row);
    this.setState({ visible: false });
  }

  getColumns = () => {
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
        render: (text, row) => {
          const area = [];
          if (row.regionName) area.push(row.regionName);
          if (row.officeName) area.push(row.officeName);
          return area.join(area.length === 2 ? '/' : '');
        },
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
        render: (text, row) => {
          const mobilePhoneArr = [];
          if (row.mobilePhoneCountryCode) mobilePhoneArr.push(row.mobilePhoneCountryCode);
          if (row.mobilePhone) mobilePhoneArr.push(row.mobilePhone);
          return (
            <>
              {
                mobilePhoneArr.length > 0 ? (
                  <>
                    <span>{mobilePhoneArr.join('-')}</span>
                    <br/>
                  </>
                ) : null
              }
              <span>{row.email}</span>
            </>
          );
        },
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
    const columns = this.getColumns();

    return (
      <Modal
        title="销售员"
        visible={visible}
        width="1200px"
        onCancel={() => this.changeVisible(false)}
        footer={null}
      >
        <Table
          rowKey="id"
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

export default ChooseSalesPerson;
