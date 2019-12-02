/**
 * 选择收票方
 */
import { Modal, Button, AutoComplete, Input, Icon, Table } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import bp from '@/api/bp';
import { formatter } from '@/utils/utils';

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
    bp.getInvoiceParty(query)
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

  handleStandardTableChange = ({ current, pageSize, total }) => {
    const pagination = { current, pageSize, total };
    this.setState({ pagination }, () => {
      this.getTableData();
    });
  };

  selectRow = row => {
    this.props.selectChooseModalData(row);
    this.setState({ visible: false });
  };

  tableChange = ({ current, pageSize, total }) => {
    const pagination = { current, pageSize, total };
    this.setState({ pagination }, () => {
      this.getTableData();
    });
  };

  getColumns = () => {
    const { BpCertificationStatus, SalesOrderBlock, CustomerDataStatus } = this.props;
    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.bill_to_party' }),
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
        filters: SalesOrderBlock.map(e => ({
          value: e.id,
          text: e.name,
        })),
        render: text => formatter(SalesOrderBlock, text),
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.complete' }),
        dataIndex: 'customerDataStatus',
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
