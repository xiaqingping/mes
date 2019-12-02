/**
 * 选择送达方
 */
import { Modal, Table, Button, AutoComplete, Input, Icon } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import bp from '@/api/bp';

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
class ChooseShipToParty extends React.Component {
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
    bp.getShipToParty(query)
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
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.ship_to_party' }),
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
          const mobilePhoneArr = [];
          if (row.mobilePhoneCountryCode) mobilePhoneArr.push(row.mobilePhoneCountryCode);
          if (row.mobilePhone) mobilePhoneArr.push(row.mobilePhone);
          return (
            <>
              {mobilePhoneArr.length > 0 ? (
                <>
                  <span>{mobilePhoneArr.join('-')}</span>
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
        title={formatMessage({ id: 'bp.maintain_details.sales_distribution.ship_to_party' })}
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

export default ChooseShipToParty;
