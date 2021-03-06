/**
 * 选择送达方
 */
import { Modal, Table, Button, AutoComplete, Input } from 'antd';
import { SearchOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import React from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import ContactInformation from '@/pages/partner/maintain_edit/components/ContactInformation';
import bpAPI from '@/api/bp';

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
      filterData: {},
      BP: [],
    };
    // 异步验证做节流处理
    this.searchBP = debounce(this.searchBP, 800);
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
      .getShipToParty(query)
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
      filterData.id = filters.name;
    }

    this.setState({ pagination, filterData }, () => {
      this.getTableData();
    });
  };

  searchBP = value => {
    if (!value) {
      this.setState({ BP: [] });
      return;
    }
    bpAPI.getBPByCodeOrName({ code_or_name: value }).then(res => {
      this.setState({ BP: res });
    });
  };

  renderBP = item => (
    <AutoComplete.Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    </AutoComplete.Option>
  );

  getColumns = () => {
    const { BP } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.ship_to_party' }),
        dataIndex: 'name',
        filterIcon: filtered => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ width: 210, padding: 8 }}>
            <AutoComplete
              style={{ width: 188, marginBottom: 8, display: 'block' }}
              dataSource={BP.map(this.renderBP)}
              onSearch={this.searchBP}
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
        render: (text, row) => (
          <>
            <span style={{ color: '#222' }}>
              {row.type === 1 ? <UserOutlined /> : <HomeOutlined />} {row.name}
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
            <span>{row.email}</span>
            <br />
            <ContactInformation
              data={{
                countryCode: row.mobilePhoneCountryCode,
                code: row.mobilePhone,
                hideFlag: true,
              }}
            />
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
