/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
  Cascader,
  AutoComplete,
} from 'antd';
import React from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import _ from 'lodash';
import ChangeModal from './components/ChangeModal';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

// 认证
const renzhengMap = {
  1: {
    value: 'default',
    text: formatMessage({ id: 'bp.maintain.unapproved' }),
  },
  2: {
    value: 'processing',
    text: formatMessage({ id: 'bp.maintain.processing' }),
  },
  4: {
    value: 'success',
    text: formatMessage({ id: 'bp.maintain.approveds' }),
  },
  3: {
    value: 'warning',
    text: formatMessage({ id: 'bp.maintain.partialApproved' }),
  },
};

// 冻结
const dongjieMap = {
  1: {
    value: 'error',
    text: formatMessage({ id: 'bp.maintain.blocked' }),
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

// 移动电话
const mobileIden = {
  0: {
    value: 'default',
    text: formatMessage({ id: 'bp.maintain.unapproved' }),
  },
  1: {
    value: 'success',
    text: formatMessage({ id: 'bp.maintain.approveds' }),
  },
};

// 邮箱
const emailIden = {
  0: {
    value: 'default',
    text: formatMessage({ id: 'bp.maintain.unapproved' }),
  },
  1: {
    value: 'success',
    text: formatMessage({ id: 'bp.maintain.approveds' }),
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

@connect(({ basicCache, global, bp }) => {
  const regionOffice = basicCache.regionOffice.filter(e => e.languageCode === global.languageCode)
  return ({
    regionOffice,
    BpCertificationStatus: bp.BpCertificationStatus,
    salesOrderBlock: bp.salesOrderBlock,
    CustomerDataStatus: bp.CustomerDataStatus,
  })
})
class Maintain extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    formValues: {
      page: 1,
      pageSize: 10,
    },
    selectedRows: [],
    expandForm: false,
    list: [],
    total: 0,
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
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'industryCategories' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'countryDiallingCodes' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'regionOffice' },
    });
    this.getTableData();
  }

  // 销售归属查询
  callSaler = value => {
    api.employees.getSaler({ code_or_name: value }).then(res => {
      this.setState({
        xiaoshuoguishu: res,
      })
    })
  }

  // 收票方查询
  callCustomer = value => {
    api.bp.getOrgCustomerByCodeOrName({ code_or_name: value }).then(res => {
      this.setState({
        receivingParty: res,
      })
    })
  }

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
      api.bp.cancelBPOrgCertification(record.id).then(
        () => {
          this.getTableData()
        },
      )
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
          // eslint-disable-next-line prefer-destructuring
          fieldsValue.regionCode = fieldsValue.regionalAttr[0];
        }
        if (fieldsValue.regionalAttr[1]) {
          // eslint-disable-next-line prefer-destructuring
          fieldsValue.officeCode = fieldsValue.regionalAttr[1];
        }
        delete fieldsValue.regionalAttr
      }
      this.setState({
        searchVal: fieldsValue,
      })
      this.getTableData(fieldsValue);
    });
  };

  /** table数据 */
  getTableData = (options = {}) => {
    const {
      formValues: { pageSize },
    } = this.state;
    const query = Object.assign({}, { page: 1, pageSize }, options);
    this.setState({
      formValues: query,
      loading: true,
    });
    api.bp.getBPList(query).then(res => {
      this.setState({
        list: res.results,
        total: res.total,
        loading: false,
      });
    }).catch(() => {
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
      const { searchVal } = this.state
      this.getTableData({
        ...searchVal,
        page: pagination.current,
        ...this.props.form.getFieldsValue(),
        pageSize: pagination.pageSize,
      });
    }
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  /** 查询销售归属 */
  searchSaler = value => {
    if (value) {
      this.callSaler(value)
    }
  }

  /** 查询收票方 */
  searchCustomer = value => {
    if (value) {
      this.callCustomer(value)
    }
  }

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

  changeShow= (v, data) => {
    this.ChangeModal.visibleShow(v, data)
  }

  /** 完整筛选条件 */
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      regionOffice,
      BpCertificationStatus,
      salesOrderBlock,
      CustomerDataStatus,
    } = this.props;
    const { xiaoshuoguishu, receivingParty } = this.state;
    console.log(receivingParty)
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.customerID' })}>{getFieldDecorator('code')(<Input placeholder={formatMessage({ id: 'bp.maintain.inputHere' })} />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.customerName' })}>{getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'bp.maintain.inputHere' })} />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.mobilePhone' })}>{getFieldDecorator('mobilePhone')(
            <Input placeholder={formatMessage({ id: 'bp.maintain.inputHere' })} />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.email' })}>{getFieldDecorator('email')(
            <Input placeholder={formatMessage({ id: 'bp.maintain.inputHere' })} />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.verificationStatus' })}>
              {getFieldDecorator('certificationStatusList')(
                <Select placeholder={formatMessage({ id: 'bp.maintain.pleaseSelect' })} maxTagCount={1} mode="multiple">
                  {BpCertificationStatus.map(item =>
                    <Option value={item.id}>{item.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.salesBlocked' })}>
              {getFieldDecorator('salesOrderBlock')(
                <Select placeholder={formatMessage({ id: 'bp.maintain.pleaseSelect' })}>
                  {salesOrderBlock.map(item =>
                    <Option value={item.id}>{item.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.customerData' })}>
              {getFieldDecorator('customerDataStatus')(
                <Select placeholder={formatMessage({ id: 'bp.maintain.pleaseSelect' })}>
                  {CustomerDataStatus.map(item =>
                    <Option value={item.id}>{item.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.vendorData' })}>
              {getFieldDecorator('vendorDataStatus')(
                <Select placeholder={formatMessage({ id: 'bp.maintain.pleaseSelect' })}>
                  {CustomerDataStatus.map(item =>
                    <Option value={item.id}>{item.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.salesArea' })}>
              {getFieldDecorator('regionalAttr')(
                <Cascader options={regionOffice} placeholder={formatMessage({ id: 'bp.maintain.pleaseSelect' })}
                fieldNames={{ label: 'name', value: 'code', children: 'officeList' }}/>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.salesRep' })}>
              {getFieldDecorator('salerCode')(
                <AutoComplete
                  dataSource={xiaoshuoguishu.map(renderOption)}
                  onSearch={this.searchSaler}
                  optionLabelProp="text"
                  placeholder={formatMessage({ id: 'bp.maintain.inputHere' })}
                />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.billToParty' })}>
              {getFieldDecorator('billToPartyId')(
                <AutoComplete
                  dataSource={receivingParty.map(renderOption)}
                  onSearch={this.searchCustomer}
                  optionLabelProp="text"
                  // placeholder={formatMessage({ id: 'bp.maintain.inputHere' })}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'bp.maintain.search' })}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {formatMessage({ id: 'bp.maintain.reset' })}
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              {formatMessage({ id: 'bp.maintain.putAway' })} <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  /** 部分筛选条件 */
  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.customerID' })}>{getFieldDecorator('code')(<Input placeholder={formatMessage({ id: 'bp.maintain.inputHere' })} />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.customerName' })}>{getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'bp.maintain.inputHere' })} />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label={formatMessage({ id: 'bp.maintain.mobilePhone' })}>{getFieldDecorator('mobilePhone')(
            <Input placeholder={formatMessage({ id: 'bp.maintain.inputHere' })} />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
              <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'bp.maintain.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'bp.maintain.reset' })}
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {formatMessage({ id: 'bp.maintain.putAway' })} <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      formValues: { page: current, pageSize },
      list,
      selectedRows,
      loading,
      total,
    } = this.state;
    const { BpCertificationStatus, salesOrderBlock, CustomerDataStatus } = this.props;
    const data = { list, pagination: { current, pageSize, total } };

    const CertificationStatus = []; // 认证状态
    const salesBlock = []; // 销售冻结
    const CustomerStatus = []; // 客户数据状态

    BpCertificationStatus.forEach(item => { CertificationStatus.push({ value: item.id, text: item.name }) })
    salesOrderBlock.forEach(item => { salesBlock.push({ value: item.id, text: item.name }) })
    CustomerDataStatus.forEach(item => { CustomerStatus.push({ value: item.id, text: item.name }) })

    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain.businessPartner' }),
        dataIndex: 'code',
        width: 250,
        render(val, record) {
          return (
            <Link className={styles.partNer} to={`/bp/maintain/details/${record.id}?type=${record.type}&customerDataStatus=${record.customerDataStatus}&vendorDataStatus=${record.vendorDataStatus}`}>
              <Icon type={record.type === 1 ? 'user' : 'home'} /> &nbsp;{record.name}
                <div className={styles.partCode}>{val}</div>
            </Link>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.approved' }),
        dataIndex: 'certificationStatus',
        // width: 100,
        filters: CertificationStatus,
        onFilter: (value, record) =>
        record.certificationStatus.toString().indexOf(value.toString()) === 0,
        render(val) {
          return <Badge status={renzhengMap[val].value} text={renzhengMap[val].text} />;
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.block' }),
        dataIndex: 'salesOrderBlock',
        filters: salesBlock,
        filterMultiple: false,
        onFilter: (value, record) =>
        record.salesOrderBlock.toString().indexOf(value.toString()) === 0,
        // eslint-disable-next-line consistent-return
        render: val => {
          if (val) {
            return <Badge status={dongjieMap[val].value} text={dongjieMap[val].text} />
          }
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.customer' }),
        dataIndex: 'customerDataStatus',
        // width: 100,
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
        // width: 100,
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
        // width: 100,
        render(val, records) {
          return <>
                   <div>
                      {val}
                      &nbsp;&nbsp;
                      {records.mobilePhoneVerifyStatus === 1 ? <
                        Badge status={mobileIden[records.mobilePhoneVerifyStatus].value} /> : ''}
                    </div>
                    <div>
                      {records.email}
                      &nbsp;&nbsp;
                      {records.emailVerifyStatus === 1 ?
                      <Badge status={emailIden[records.emailVerifyStatus].value} /> : ''}
                    </div>
                  </>
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain.address' }),
        dataIndex: 'address',
        // width: 200,
        render(val) {
          return <div className={styles.hideAdress}>{val}</div>
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
              {record.salesOrderBlock === 1 ? <Menu.Item>
              <a href="#" onClick={e => { this.cancelFreeze(e, record) }}>{formatMessage({ id: 'bp.maintain.cancelBlock' })}</a>
                </Menu.Item> : <Menu.Item>
                  <a href="#" onClick={ e => { this.freezePartner(e, record) }}>{formatMessage({ id: 'bp.maintain.block' })}</a>
                </Menu.Item>}
              {(record.certificationStatus === 4 || record.certificationStatus === 3) && record.type === 2 ?
                <Menu.Item>
                  <a href="#" onClick={e => { this.cancelIdent(e, record) }}>{formatMessage({ id: 'bp.maintain.cancelBlock' })}</a>
                </Menu.Item>
              : ''
              }
              {/* 变更认证：PI除了未认证其他都要显示；组织只显示已认证状态；组织没有部分认证 */}
              {record.certificationStatus === 4 || record.certificationStatus === 3 ?
                <Menu.Item>
                  <a href="#" onClick={ () => { this.changeShow(true, record) }}>{formatMessage({ id: 'bp.maintain.changeApproval' })}</a>
                </Menu.Item>
              : ''
              }
              {record.certificationStatus === 1 ?
                <Menu.Item><a href="#"
                onClick={ () => { this.changeShow(true, record) }}>{formatMessage({ id: 'bp.maintain.approval' })}</a></Menu.Item>
              : ''
              }
            </Menu>
          );
          return (
            <>
              <Link to={`/bp/maintain/edit/${id}?type=${record.type}&customerDataStatus=${record.customerDataStatus}&vendorDataStatus=${record.vendorDataStatus}`}>{formatMessage({ id: 'bp.maintain.change' })}</Link>
              <Divider type="vertical" />
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link">
                  {formatMessage({ id: 'bp.maintain.moreOption' })} <Icon type="down" />
                </a>
              </Dropdown>
            </>
          );
        },
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false} className="mySet">
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                {formatMessage({ id: 'bp.maintain.new' })}
              </Button>
            </div>
            <StandardTable
              // className={styles.dataTable}
              scroll={{ x: 1600 }}
              selectedRows={selectedRows}
              loading={loading}
              rowKey={record => record.id}
              data={data}
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

export default Form.create()(Maintain);
