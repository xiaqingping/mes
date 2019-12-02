/**
 * 选择销售员
 */
import { Modal, Table, Button, AutoComplete, Input, Icon, Cascader } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import employees from '@/api/employees';

@connect(
  ({ partnerMaintainEdit }) => ({
    BpCertificationStatus: partnerMaintainEdit.BpCertificationStatus,
    SalesOrderBlock: partnerMaintainEdit.SalesOrderBlock,
    CustomerDataStatus: partnerMaintainEdit.CustomerDataStatus,
  }),
  null,
  null,
  { withRef: true },
)
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
  };

  getTableData = (options = {}) => {
    const { pagination } = this.state;
    const query = Object.assign(
      {},
      {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
      options,
    );

    this.setState({ loading: true });
    employees
      .getSaler(query)
      .then(res => {
        this.setState({
          list: res.results,
          pagination: {
            current: query.page,
            pageSize: query.pageSize,
            total: res.total,
          },
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleReset = data => {
    console.log(data);
  };

  selectRow = row => {
    this.props.selectChooseModalData(row);
    this.setState({ visible: false });
  };

  getColumns = () => {
    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_rep' }),
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
              <FormattedMessage id="action.search" />
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              <FormattedMessage id="action.reset" />
            </Button>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_area' }),
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
              <FormattedMessage id="action.search" />
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              <FormattedMessage id="action.reset" />
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
        title: formatMessage({ id: 'bp.maintain_details.contact_information' }),
        dataIndex: 'contactInfo',
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <Input style={{ width: 188, marginBottom: 8, display: 'block' }} />
            <Button
              type="primary"
              onClick={() => this.getTableData(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              <FormattedMessage id="action.search" />
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              <FormattedMessage id="action.reset" />
            </Button>
          </div>
        ),
        render: (text, row) => (
          <>
            {row.workEmail ? (
              <>
                <span>{row.workEmail}</span>
                <br />
              </>
            ) : null}
            <span>{row.workTelephone}</span>
          </>
        ),
      },
      {
        title: formatMessage({ id: 'action.operation' }),
        dataIndex: 'operation',
        render: (text, record) => (
          <a onClick={() => this.selectRow(record)}>
            <FormattedMessage id="action.choose" />
          </a>
        ),
      },
    ];
    return columns;
  };

  render() {
    const { list, loading, pagination, visible } = this.state;
    const columns = this.getColumns();

    return (
      <Modal
        title={formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_rep' })}
        visible={visible}
        width="1200px"
        onCancel={() => this.changeVisible(false)}
        footer={null}
      >
        <Table
          rowKey="code"
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
