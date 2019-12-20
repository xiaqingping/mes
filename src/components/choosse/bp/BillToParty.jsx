/**
 * 选择收票方
 */
import { Modal, Button, AutoComplete, Input, Icon, Table } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import debounce from 'lodash/debounce';
import bpAPI from '@/api/bp';
import { formatter } from '@/utils/utils';

@connect(
  ({ bp }) => ({
    BpCertificationStatus: bp.BpCertificationStatus,
    SalesOrderBlock: bp.salesOrderBlock,
    CustomerDataStatus: bp.CustomerDataStatus,
  }),
  null,
  null,
  { withRef: true },
)
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
      filterData: {
        // certificationStatusList: '',
        // salesOrderBlock: '',
        // customerDateStatus: '',
        // telephone: '',
        // email: '',
      },
      billToParty: [],
    };
    // 异步验证做节流处理
    this.searchBillToParty = debounce(this.searchBillToParty, 800);
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
    bpAPI
      .getInvoiceParty(query)
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

    if (filters.certificationStatus && filters.certificationStatus[0]) {
      filterData.certificationStatusList = filters.certificationStatus.join(',');
    }
    if (filters.customerDataStatus && filters.customerDataStatus[0]) {
      filterData.customerDataStatus = filters.customerDataStatus.join(',');
    }
    if (filters.salesOrderBlock && filters.salesOrderBlock[0]) {
      filterData.salesOrderBlock = filters.salesOrderBlock.join(',');
    }
    if (filters.contactInfo) {
      const { contactInfo } = filters;
      if (contactInfo.indexOf('@') > -1) {
        filterData.email = contactInfo;
      } else {
        filterData.phone = contactInfo;
      }
    }
    if (filters.name) {
      filterData.id = filters.name;
    }

    this.setState({ pagination, filterData }, () => {
      this.getTableData();
    });
  };

  searchBillToParty = value => {
    if (!value) {
      this.setState({ billToParty: [] });
      return;
    }
    bpAPI.getOrgCustomerByCodeOrName({ code_or_name: value }).then(res => {
      this.setState({ billToParty: res });
    });
  };

  renderBillToParty = item => (
    <AutoComplete.Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    </AutoComplete.Option>
  );

  getColumns = () => {
    const { BpCertificationStatus, SalesOrderBlock, CustomerDataStatus } = this.props;
    const { billToParty } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.bill_to_party' }),
        dataIndex: 'name',
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <AutoComplete
              style={{ width: 188, marginBottom: 8, display: 'block' }}
              dataSource={billToParty.map(this.renderBillToParty)}
              onSearch={this.searchBillToParty}
              optionLabelProp="text"
              value={selectedKeys}
              onChange={value => setSelectedKeys(value)}
            />
            <Button
              type="primary"
              onClick={confirm}
              icon="search"
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
            <span style={{ color: '#222' }}>
              <Icon type={row.type === 1 ? 'user' : 'home'} /> {row.name}
            </span>
            <br />
            <span style={{ color: '#999' }}>{row.code}</span>
          </>
        ),
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.verification_status' }),
        dataIndex: 'certificationStatus',
        filters: BpCertificationStatus.map(e => ({
          value: e.id,
          text: e.name,
        })),
        render: text => formatter(BpCertificationStatus, text),
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.block' }),
        dataIndex: 'salesOrderBlock',
        filterMultiple: false,
        filters: SalesOrderBlock.map(e => ({
          value: e.id,
          text: e.name,
        })),
        render: text => formatter(SalesOrderBlock, text),
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.complete' }),
        dataIndex: 'customerDataStatus',
        filterMultiple: false,
        filters: CustomerDataStatus.map(e => ({
          value: e.id,
          text: e.name,
        })),
        render: text => formatter(CustomerDataStatus, text),
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.contact_information' }),
        dataIndex: 'contactInfo',
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
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
              icon="search"
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
        render: (text, row) => {
          const telephoneArr = [];
          if (row.telephoneCountryCode) telephoneArr.push(row.telephoneCountryCode);
          if (row.telephoneAreaCode) telephoneArr.push(row.telephoneAreaCode);
          if (row.telephone) telephoneArr.push(row.telephone);
          if (row.telephoneExtension) telephoneArr.push(row.telephoneExtension);
          return (
            <>
              {telephoneArr.length > 0 ? (
                <>
                  <span>{telephoneArr.join('-')}</span>
                  <br />
                </>
              ) : null}
              <span>{row.email}</span>
            </>
          );
        },
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
        title={formatMessage({ id: 'bp.maintain_details.sales_distribution.bill_to_party' })}
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

export default ChooseInvoiceParty;
