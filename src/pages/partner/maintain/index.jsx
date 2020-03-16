/* eslint-disable prefer-destructuring */
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  Select,
  Cascader,
  AutoComplete,
} from 'antd';
import React from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatter } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import _ from 'lodash';
import { formatMessage } from 'umi/locale';
import { PlusOutlined, HomeOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import ChangeModal from './components/ChangeModal';
import styles from './index.less';
import api from '@/api';
import TableSearchForm from '@/components/TableSearchForm';

const FormItem = Form.Item;
const { Option } = Select;

// 冻结
const dongjieMap = {
  1: {
    value: 'error',
    text: formatMessage({ id: 'bp.block' }),
  },
  2: {
    value: 'success',
    text: formatMessage({ id: 'bp.maintain.actived' }),
  },
};

// 完整
const wanzhengMap = {
  2: {
    value: 'default',
    text: formatMessage({ id: 'bp.maintain.incomplete' }),
  },
  1: {
    value: 'success',
    text: formatMessage({ id: 'bp.maintain.completed' }),
  },
};

function renderOption(item) {
  return (
    <Option key={item.code} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    </Option>
  );
}

class Maintain extends React.Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  // 顶部表单默认值
  initialValues = {
    page: 1,
    pageSize: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      selectedRows: [],
      expandForm: false,
      list: [],
      // formValues: {},
      xiaoshuoguishu: [],
      // kaipiaofang: [],
      receivingParty: [], // 收票方
      loading: false,
      searchVal: {},
    };
    this.callSaler = _.debounce(this.callSaler, 500);
    this.callCustomer = _.debounce(this.callCustomer, 500);
  }

  componentDidMount() {
    const basicCacheList = [
      { type: 'countrys' }, // 国家
      { type: 'countryDiallingCodes' }, // 国家拨号代码
      { type: 'industryCategories' }, // 行业类别
      { type: 'salesPaymentMethods' }, // 付款方式
      { type: 'currencies' }, // 货币
      { type: 'paymentTerms' }, // 付款条件
      { type: 'purchaseGroups' }, // 采购组
      { type: 'purchaseOrganizations' }, // 采购组织
      { type: 'salesOrganizations' }, // 销售组织
      { type: 'distributionChannels' }, // 分销渠道
      { type: 'regions' },
      { type: 'offices' },
      { type: 'regionOffice' },
    ];
    basicCacheList.forEach(item => {
      this.props.dispatch({
        type: 'basicCache/getCache',
        payload: item,
      });
    });
    this.getTableData(this.initialValues);
  }

  // 销售归属查询
  callSaler = value => {
    api.employees.getSaler({ code_or_name: value }).then(res => {
      this.setState({
        xiaoshuoguishu: res,
      });
    });
  };

  // 收票方查询
  callCustomer = value => {
    api.bp.getOrgCustomerByCodeOrName({ code_or_name: value }).then(res => {
      this.setState({
        receivingParty: res,
      });
    });
  };

  /** 激活 */
  cancelFreeze = (e, record) => {
    e.preventDefault();
    api.bp.customerSalesActivation(record.id).then(() => {
      this.getTableData();
    });
  };

  /** 冻结 */
  freezePartner = (e, record) => {
    e.preventDefault();
    api.bp.customerSalesOrderBlock(record.id).then(() => {
      this.getTableData();
    });
  };

  /** 取消认证 */
  cancelIdent = (e, record) => {
    e.preventDefault();
    if (record.type === 2) {
      api.bp.cancelBPOrgCertification(record.id).then(() => {
        this.getTableData();
      });
    }
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.certificationStatusList) {
        if (fieldsValue.certificationStatusList[0]) {
          // eslint-disable-next-line no-param-reassign
          fieldsValue.certificationStatusList = fieldsValue.certificationStatusList.join(',');
        }
      }
      if (fieldsValue.regionalAttr) {
        if (fieldsValue.regionalAttr[0]) {
          // eslint-disable-next-line no-param-reassign
          fieldsValue.regionCode = fieldsValue.regionalAttr[0];
        }
        if (fieldsValue.regionalAttr[1]) {
          // eslint-disable-next-line no-param-reassign
          fieldsValue.officeCode = fieldsValue.regionalAttr[1];
        }
        // eslint-disable-next-line no-param-reassign
        delete fieldsValue.regionalAttr;
      }
      this.setState({
        searchVal: fieldsValue,
      });
      this.getTableData(fieldsValue);
    });
  };

  /** table数据 */
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize } = pagination;
    const data = {
      page,
      pageSize,
      ...formData,
      ...options,
    };

    api.bp
      .getBPList(data)
      .then(res => {
        this.setState({
          list: res.results,
          pagination: {
            current: data.page,
            pageSize: data.pageSize,
            total: res.total,
          },
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  handleModalVisible = () => {
    router.push('/bp/maintain/add');
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 分页
  handleStandardTableChange = pagination => {
    if (JSON.stringify(pagination) !== '{}') {
      const { searchVal } = this.state;
      this.getTableData({
        ...searchVal,
        page: pagination.current,
        ...this.props.form.getFieldsValue(),
        pageSize: pagination.pageSize,
      });
    }
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  /** 查询销售归属 */
  searchSaler = value => {
    if (value) {
      this.callSaler(value);
    }
  };

  /** 查询收票方 */
  searchCustomer = value => {
    if (value) {
      this.callCustomer(value);
    }
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  };

  changeShow = (v, data) => {
    this.ChangeModal.visibleShow(v, data);
  };

  /** 完整筛选条件 */
  advancedForm = () => {
    const {
      regionOffice,
      BpCertificationStatus,
      salesOrderBlock,
      CustomerDataStatus,
      languageCode,
    } = this.props;
    const { xiaoshuoguishu, receivingParty } = this.state;
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.maintain.email' })} name="email">
            <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain.verificationStatus' })}
            name="certificationStatusList"
          >
            <Select
              placeholder={formatMessage({ id: 'bp.pleaseSelect' })}
              maxTagCount={1}
              maxTagTextLength={4}
              mode="multiple"
            >
              {BpCertificationStatus.map(item => (
                <Option key={item.id} value={item.id}>
                  {formatMessage({ id: item.i18n })}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain.salesBlocked' })}
            name="salesOrderBlock"
          >
            <Select placeholder={formatMessage({ id: 'bp.pleaseSelect' })}>
              {salesOrderBlock.map(item => (
                <Option key={item.id} value={item.id}>
                  {formatMessage({ id: item.i18n })}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain.customerData' })}
            name="customerDataStatus"
          >
            <Select placeholder={formatMessage({ id: 'bp.pleaseSelect' })}>
              {CustomerDataStatus.map(item => (
                <Option key={item.id} value={item.id}>
                  {formatMessage({ id: item.i18n })}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain.vendorData' })}
            name="vendorDataStatus"
            className="fiveWord"
          >
            <Select placeholder={formatMessage({ id: 'bp.pleaseSelect' })}>
              {CustomerDataStatus.map(item => (
                <Option key={item.id} value={item.id}>
                  {formatMessage({ id: item.i18n })}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.maintain.salesArea' })} name="regionalAttr">
            <Cascader
              options={regionOffice}
              placeholder={formatMessage({ id: 'bp.pleaseSelect' })}
              fieldNames={{ label: 'name', value: 'code', children: 'officeList' }}
            />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.maintain.salesRep' })} name="salerCode">
            <AutoComplete
              dataSource={xiaoshuoguishu.map(renderOption)}
              onSearch={this.searchSaler}
              optionLabelProp="text"
              placeholder={formatMessage({ id: 'bp.inputHere' })}
            />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.maintain.billToParty' })} name="billToPartyId">
            <AutoComplete
              dataSource={receivingParty.map(renderOption)}
              onSearch={this.searchCustomer}
              optionLabelProp="text"
            />
          </FormItem>
        </Col>
      </>
    );
  };

  /** 部分筛选条件 */
  simpleForm = () => {
    const { languageCode } = this.props;
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.customerID' })} name="code">
            <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.maintain.customerName' })} name="name">
            <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 0}>
          <FormItem label={formatMessage({ id: 'bp.mobilePhone' })} name="mobilePhone">
            <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
        </Col>
      </>
    );
  };

  render() {
    const { pagination, list, selectedRows, loading } = this.state;
    const { BpCertificationStatus, salesOrderBlock, CustomerDataStatus, languageCode } = this.props;
    const CertificationStatus = []; // 认证状态
    const salesBlock = []; // 销售冻结
    const CustomerStatus = []; // 客户数据状态

    BpCertificationStatus.forEach(item => {
      CertificationStatus.push({ value: item.id, text: formatMessage({ id: item.i18n }) });
    });
    salesOrderBlock.forEach(item => {
      salesBlock.push({ value: item.id, text: formatMessage({ id: item.i18n }) });
    });
    CustomerDataStatus.forEach(item => {
      CustomerStatus.push({ value: item.id, text: formatMessage({ id: item.i18n }) });
    });

    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain.businessPartner' }),
        dataIndex: 'code',
        width: 250,
        render(val, record) {
          return (
            <Link
              className={styles.partNer}
              // eslint-disable-next-line max-len
              to={`/bp/maintain/details/${record.id}?type=${record.type}&customerDataStatus=${record.customerDataStatus}&vendorDataStatus=${record.vendorDataStatus}`}
            >
              {record.type === 1 ? <UserOutlined /> : <HomeOutlined />} &nbsp;{record.name}
              <div className={styles.partCode}>{val}</div>
            </Link>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.approved' }),
        dataIndex: 'certificationStatus',
        width: 120,
        filters: CertificationStatus,
        onFilter: (value, record) =>
          record.certificationStatus.toString().indexOf(value.toString()) === 0,
        render(val) {
          return (
            <Badge
              status={formatter(BpCertificationStatus, val, 'id', 'badge')}
              text={formatMessage({
                id: formatter(BpCertificationStatus, val, 'id', 'i18n'),
              })}
            />
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.block' }),
        dataIndex: 'salesOrderBlock',
        filters: salesBlock,
        width: 120,
        filterMultiple: false,
        onFilter: (value, record) =>
          record.salesOrderBlock.toString().indexOf(value.toString()) === 0,
        // eslint-disable-next-line consistent-return
        render: val => {
          if (val) {
            return <Badge status={dongjieMap[val].value} text={dongjieMap[val].text} />;
          }
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.customer' }),
        dataIndex: 'customerDataStatus',
        width: 120,
        filters: CustomerStatus,
        filterMultiple: false,
        onFilter: (value, record) =>
          record.customerDataStatus.toString().indexOf(value.toString()) === 0,
        render(val) {
          return <Badge status={wanzhengMap[val].value} text={wanzhengMap[val].text} />;
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.vendor' }),
        dataIndex: 'vendorDataStatus',
        width: 120,
        filters: CustomerStatus,
        filterMultiple: false,
        onFilter: (value, record) =>
          record.vendorDataStatus.toString().indexOf(value.toString()) === 0,
        render(val) {
          return <Badge status={wanzhengMap[val].value} text={wanzhengMap[val].text} />;
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.contactInformation' }),
        dataIndex: 'mobilePhone',
        width: 250,
        render(val, records) {
          return (
            <>
              {records.mobilePhone ? (
                <div>
                  {val}
                  &nbsp;&nbsp;
                  <Badge
                    status={formatter(
                      BpCertificationStatus,
                      records.mobilePhoneVerifyStatus,
                      'id',
                      'badge',
                    )}
                  />
                </div>
              ) : (
                ''
              )}
              {records.email ? (
                <div title={records.email}>
                  <span className={styles.hideAdress}>{records.email}</span>
                  &nbsp;&nbsp;
                  <Badge
                    status={formatter(
                      BpCertificationStatus,
                      records.emailVerifyStatus,
                      'id',
                      'badge',
                    )}
                  />
                </div>
              ) : (
                ''
              )}
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.address' }),
        dataIndex: 'address',
        // width: 200,
        render(val) {
          return (
            <div title={val} className={styles.hideAdress}>
              {val}
            </div>
          );
        },
      },
      {
        fixed: 'right',
        title: formatMessage({ id: 'bp.maintain.operation' }),
        width: 180,
        render: (text, record) => {
          const { id } = record;
          const menu = (
            <Menu style={{ padding: 0 }}>
              {record.salesOrderBlock === 1 ? (
                <Menu.Item>
                  <a
                    onClick={e => {
                      this.cancelFreeze(e, record);
                    }}
                  >
                    {formatMessage({ id: 'bp.maintain.cancelBlock' })}
                  </a>
                </Menu.Item>
              ) : (
                <Menu.Item>
                  <a
                    onClick={e => {
                      this.freezePartner(e, record);
                    }}
                  >
                    {formatMessage({ id: 'bp.maintain.block' })}
                  </a>
                </Menu.Item>
              )}
              {(record.certificationStatus === 4 || record.certificationStatus === 3) &&
              record.type === 2 ? (
                <Menu.Item>
                  <a
                    onClick={e => {
                      this.cancelIdent(e, record);
                    }}
                  >
                    {formatMessage({ id: 'bp.maintain.cancelApproval' })}
                  </a>
                </Menu.Item>
              ) : (
                ''
              )}
              {/* 变更认证：PI除了未认证其他都要显示；组织只显示已认证状态；组织没有部分认证 */}
              {record.certificationStatus === 4 || record.certificationStatus === 3 ? (
                <Menu.Item>
                  <a
                    onClick={() => {
                      this.changeShow(true, record);
                    }}
                  >
                    {formatMessage({ id: 'bp.maintain.changeApproval' })}
                  </a>
                </Menu.Item>
              ) : (
                ''
              )}
              {record.certificationStatus === 1 ? (
                <Menu.Item>
                  <a
                    onClick={() => {
                      this.changeShow(true, record);
                    }}
                  >
                    {formatMessage({ id: 'bp.maintain.approval' })}
                  </a>
                </Menu.Item>
              ) : (
                ''
              )}
            </Menu>
          );
          return (
            <>
              <Link
                // eslint-disable-next-line max-len
                to={`/bp/maintain/edit/${id}?type=${record.type}&customerDataStatus=${record.customerDataStatus}&vendorDataStatus=${record.vendorDataStatus}`}
              >
                {formatMessage({ id: 'bp.maintain.change' })}
              </Link>
              <Divider type="vertical" />
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link">
                  {formatMessage({ id: 'bp.maintain.moreOption' })} <DownOutlined />
                </a>
              </Dropdown>
            </>
          );
        },
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false} className={languageCode === 'EN' ? 'mySet' : ''}>
          <div className="tableList">
            <div className="tableListForm">
              <TableSearchForm
                ref={this.tableSearchFormRef}
                initialValues={this.initialValues}
                getTableData={this.getTableData}
                simpleForm={this.simpleForm}
                advancedForm={this.advancedForm}
              />
            </div>
            <div className="tableListOperator">
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                <PlusOutlined />
                {formatMessage({ id: 'bp.maintain.new' })}
              </Button>
            </div>
            <StandardTable
              // className="titleColor"
              scroll={{ x: 1500 }}
              selectedRows={selectedRows}
              loading={loading}
              rowKey={record => record.id}
              data={{ list, pagination }}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <ChangeModal
          // wrappedComponentRef={this.perSaveFormRef}
          // changeModal={changeModal}
          // recordMsg={recordMesg}
          onRef={ref => {
            this.ChangeModal = ref;
          }}
          changeShow={v => this.changeShow(v)}
          getData={this.getTableData}
          getValues={this.getValues}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ basicCache, global, bp }) => {
  const regionOffice = basicCache.regionOffice.filter(e => e.languageCode === global.languageCode);
  return {
    languageCode: global.languageCode,
    regionOffice,
    BpCertificationStatus: bp.BpCertificationStatus,
    salesOrderBlock: bp.SalesOrderBlock,
    CustomerDataStatus: bp.CustomerDataStatus,
  };
})(Maintain);
