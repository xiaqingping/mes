/**
 * 选择销售员
 */
import { Modal, Table, Button, AutoComplete, Input, Cascader } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import debounce from 'lodash/debounce';
import employees from '@/api/employees';

@connect(
  ({ bp }) => ({
    BpCertificationStatus: bp.BpCertificationStatus,
    SalesOrderBlock: bp.SalesOrderBlock,
    CustomerDataStatus: bp.CustomerDataStatus,
  }),
  null,
  null,
  { forwardRef: true },
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
      filterData: {},
      salesPerson: [],
    };
    // 异步验证做节流处理
    this.searchSalesPerson = debounce(this.searchSalesPerson, 800);
  }

  changeVisible = visible => {
    this.setState({ visible });
    if (visible) this.getTableData({ page: 1 });
  };

  getTableData = (options = {}) => {
    const { pagination, filterData } = this.state;
    const query = {
      ...{
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
      ...filterData,
      ...options,
    };

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

  selectRow = row => {
    this.props.selectChooseModalData(row);
    this.setState({ visible: false });
  };

  tableChange = ({ current, pageSize, total }, filters) => {
    const pagination = { current, pageSize, total };
    const filterData = {};

    if (filters.contactInfo) {
      const { contactInfo } = filters;
      if (contactInfo.indexOf('@') > -1) {
        filterData.email = contactInfo;
      } else {
        filterData.mobilePhone = contactInfo;
      }
    }
    if (filters.name) {
      filterData.code = filters.name;
    }

    this.setState({ pagination, filterData }, () => {
      this.getTableData();
    });
  };

  searchSalesPerson = value => {
    if (!value) {
      this.setState({ salesPerson: [] });
      return;
    }
    employees.getSaler({ code_or_name: value }).then(res => {
      this.setState({ salesPerson: res });
    });
  };

  renderSalesPerson = item => (
    <AutoComplete.Option key={item.code} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    </AutoComplete.Option>
  );

  getColumns = () => {
    const { salesPerson } = this.state;
    const columns = [
      {
        // TODO: 未完成
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_rep' }),
        dataIndex: 'name',
        filterIcon: filtered => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <AutoComplete
              style={{ width: 188, marginBottom: 8, display: 'block' }}
              dataSource={salesPerson.map(this.renderSalesPerson)}
              onSearch={this.searchSalesPerson}
              optionLabelProp="text"
              value={selectedKeys}
              onChange={value => setSelectedKeys(value)}
            />
            <Button
              type="primary"
              onClick={confirm}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              <FormattedMessage id="action.search" />
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              <FormattedMessage id="action.reset" />
            </Button>
          </div>
        ),
      },
      {
        // TODO: 未完成
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_area' }),
        dataIndex: 'area',
        filterIcon: filtered => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <Cascader style={{ width: 188, marginBottom: 8, display: 'block' }} options={[]} />
            <Button
              type="primary"
              onClick={() => this.getTableData(selectedKeys, confirm)}
              icon={<SearchOutlined />}
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
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <Input
              style={{ width: 188, marginBottom: 8, display: 'block' }}
              value={selectedKeys}
              onChange={e => setSelectedKeys(e.target.value)}
            />
            <Button
              type="primary"
              onClick={confirm}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              <FormattedMessage id="action.search" />
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
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
