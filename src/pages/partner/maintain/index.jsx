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
import querystring from 'querystring';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import ChangeModal from './components/ChangeModal';
import styles from './index.less';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

// 认证
const renzhengMap = {
  1: {
    value: 'default',
    text: '未认证',
  },
  2: {
    value: 'processing',
    text: '审核中',
  },
  4: {
    value: 'success',
    text: '已认证',
  },
  3: {
    value: 'warning',
    text: '部分认证',
  },
};

// 冻结
const dongjieMap = {
  1: {
    value: 'error',
    text: '冻结',
  },
  2: {
    value: 'success',
    text: '活跃',
  },
};

// 完整
const wanzhengMap = {
  2: {
    value: 'default',
    text: '不完整',
  },
  1: {
    value: 'success',
    text: '完整',
  },
};

// 移动电话
const mobileIden = {
  0: {
    value: 'default',
    text: '未认证',
  },
  1: {
    value: 'success',
    text: '已认证',
  },
};

// 邮箱
const emailIden = {
  0: {
    value: 'default',
    text: '未认证',
  },
  1: {
    value: 'success',
    text: '已认证',
  },
};

// 区域
const quyuoptions = [
  {
    value: 'huadong',
    label: '华东大区',
    children: [
      {
        value: 'anhui',
        label: '安徽分点',
      },
      {
        value: 'shanghai',
        label: '上海分点',
      },
    ],
  },
  {
    value: 'dongbei',
    label: '东北大区',
    children: [
      {
        value: 'changchun',
        label: '长春分点',
      },
    ],
  },
];

function renderOption(item) {
  return (
    <Option key={item.value} text={item.value}>
      <div style={{ display: 'flex' }}>
        <span style={{ flexGrow: 1 }}>{item.code}</span>
        <span style={{ flexGrow: 1 }}>{item.value}</span>
      </div>
    </Option>
  );
}

@connect(({ basicCache }) => basicCache)
class Maintain extends React.Component {
  state = {
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
    changeModal: false,
    recordMesg: undefined,
    loading: false,
  };

  columns = [
    {
      title: '业务伙伴',
      dataIndex: 'code',
      width: 250,
      render(val, record) {
        return (
          <Link className={styles.partNer} to={`/partner/maintain/details/${record.id}`}>
            <Icon type={record.type === 1 ? 'user' : 'home'} /> &nbsp;{record.name}
            <div className={styles.partCode}>{val}</div>
          </Link>
        );
      },
    },
    {
      title: '认证',
      dataIndex: 'certificationStatus',
      // width: 100,
      filters: [
        {
          value: 'default',
          text: '未认证',
        },
        {
          value: 'processing',
          text: '审核中',
        },
        {
          value: 'success',
          text: '已认证',
        },
        {
          value: 'warning',
          text: '部分认证',
        },
      ],
      render(val) {
        return <Badge status={renzhengMap[val].value} text={renzhengMap[val].text} />;
      },
    },
    {
      title: '冻结',
      dataIndex: 'salesOrderBlock',
      // width: 100,
      filters: [
        {
          value: 'error',
          text: '冻结',
        },
        {
          value: 'success',
          text: '活跃',
        },
      ],
      filterMultiple: false,
      render: val => {
        if (val) {
          return <Badge status={dongjieMap[val].value} text={dongjieMap[val].text} />;
        }
        return null;
      },
    },
    {
      title: '客户',
      dataIndex: 'customerDataStatus',
      // width: 100,
      filters: [
        {
          value: 'default',
          text: '不完整',
        },
        {
          value: 'success',
          text: '完整',
        },
      ],
      filterMultiple: false,
      render(val) {
        return <Badge status={wanzhengMap[val].value} text={wanzhengMap[val].text} />;
      },
    },
    {
      title: '供应商',
      dataIndex: 'vendorDataStatus',
      // width: 100,
      filters: [
        {
          value: 'default',
          text: '不完整',
        },
        {
          value: 'success',
          text: '完整',
        },
      ],
      filterMultiple: false,
      render(val) {
        return <Badge status={wanzhengMap[val].value} text={wanzhengMap[val].text} />;
      },
    },
    {
      title: '联系方式',
      dataIndex: 'mobilePhone',
      // width: 100,
      render(val, records) {
        return (
          <>
            <div>
              {val}
              &nbsp;&nbsp;
              {records.mobilePhoneVerifyStatus === 1 ? (
                <Badge status={mobileIden[records.mobilePhoneVerifyStatus].value} />
              ) : (
                ''
              )}
            </div>
            <div>
              {records.email}
              &nbsp;&nbsp;
              {records.emailVerifyStatus === 1 ? <Badge status={emailIden[records.emailVerifyStatus].value} /> : ''}
            </div>
          </>
        );
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      // width: 200,
      render(val) {
        return <div className={styles.hideAdress}>{val}</div>;
      },
    },
    {
      fixed: 'right',
      title: '操作',
      width: 170,
      render: (text, record) => {
        const { id } = record;
        const menu = (
          <Menu style={{ padding: 0 }}>
            {record.salesOrderBlock === 1 ? (
              <Menu.Item>
                <a
                  href="#"
                  onClick={e => {
                    this.cancelFreeze(e, record);
                  }}
                >
                  取消冻结
                </a>
              </Menu.Item>
            ) : (
              <Menu.Item>
                <a
                  href="#"
                  onClick={e => {
                    this.freezePartner(e, record);
                  }}
                >
                  冻结
                </a>
              </Menu.Item>
            )}
            {record.certificationStatus === 4 ? (
              <Menu.Item>
                <a
                  href="#"
                  onClick={e => {
                    this.cancelIdent(e, record);
                  }}
                >
                  取消认证
                </a>
              </Menu.Item>
            ) : (
              ''
            )}
            {record.certificationStatus === 4 ? (
              <Menu.Item>
                <a
                  href="#"
                  onClick={e => {
                    this.changeIdent(e, record);
                  }}
                >
                  变更认证
                </a>
              </Menu.Item>
            ) : (
              ''
            )}
            {record.certificationStatus === 1 ? (
              <Menu.Item>
                <a
                  href="#"
                  onClick={() => {
                    this.showChange.visibleShow(true, record);
                  }}
                >
                  认证
                </a>
              </Menu.Item>
            ) : (
              ''
            )}
          </Menu>
        );
        const link = `/partner/maintain/edit/${id}?${querystring.stringify({
          type: record.type,
          customerDataStatus: record.customerDataStatus,
          vendorDataStatus: record.vendorDataStatus,
        })}`;
        return (
          <>
            <Link to={link}>修改</Link>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link">
                更多操作 <Icon type="down" />
              </a>
            </Dropdown>
          </>
        );
      },
    },
  ];

  componentDidMount() {
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'industryCategories' },
    });
    this.getTableData();
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
    console.log(record);
  };

  /** 变更认证 */
  changeIdent = (e, record) => {
    e.preventDefault();
    this.setState({
      changeModal: true,
      recordMesg: record,
    });
  };

  /** 认证 */
  // identificate = (e, record) => {
  //   e.preventDefault();
  //   this.setState(
  //     {
  //       changeModal: true,
  //       recordMesg: record,
  //     },
  //   )
  // }

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
      }
      // const values = {
      //   ...fieldsValue,
      //   // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      // };
      // console.log(values)
      // this.setState({
      //   formValues: values,
      // });
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
    });
  };

  handleModalVisible = () => {
    router.push('/partner/maintain/add');
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  /** 查询销售归属 */
  xiaoshuoguishuSearch = value => {
    this.setState({
      xiaoshuoguishu: [
        {
          id: 1,
          code: 11111,
          value: `第一个${value}`,
        },
        {
          id: 2,
          code: 22222,
          value: `第二个${value}`,
        },
      ],
    });
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

  // form in modal
  perSaveFormRef = formRef => {
    this.performRef = formRef;
  };

  // get values of form in modal
  getValues = () => {
    const { form } = this.performRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
    });

    const allValues = form.getFieldsValue();
    console.log(allValues);
  };

  // close the modal
  closeModal = () => {
    this.setState({
      changeModal: false,
      recordMesg: undefined,
    });
  };

  /** 完整筛选条件 */
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { xiaoshuoguishu } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={8}>
            <FormItem label="编号">{getFieldDecorator('code')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="名称">{getFieldDecorator('name')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="移动电话">{getFieldDecorator('mobilePhone')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="Email">{getFieldDecorator('email')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="认证状态">
              {getFieldDecorator('certificationStatusList')(
                <Select placeholder="请选择" maxTagCount={1} mode="multiple">
                  <Option value="1">未认证</Option>
                  <Option value="4">已认证</Option>
                  <Option value="2">审核中</Option>
                  <Option value="3">部分认证</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="销售冻结">
              {getFieldDecorator('salesOrderBlock')(
                <Select placeholder="请选择">
                  <Option value="2">冻结</Option>
                  <Option value="1">活跃</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="客户数据">
              {getFieldDecorator('customerDataStatus')(
                <Select placeholder="请选择">
                  <Option value="1">完整</Option>
                  <Option value="2">不完整</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="供应商数据">
              {getFieldDecorator('vendorDataStatus')(
                <Select placeholder="请选择">
                  <Option value="1">完整</Option>
                  <Option value="2">不完整</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="区域归属">
              {getFieldDecorator('regionalAttr')(<Cascader options={quyuoptions} placeholder="请选择" />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="销售归属">
              {getFieldDecorator('salerCode')(
                <AutoComplete
                  dataSource={xiaoshuoguishu.map(renderOption)}
                  onSearch={this.xiaoshuoguishuSearch}
                  optionLabelProp="text"
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="收票方">
              {getFieldDecorator('invoicePartyId')(
                <AutoComplete
                  dataSource={xiaoshuoguishu.map(renderOption)}
                  onSearch={this.xiaoshuoguishuSearch}
                  optionLabelProp="text"
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
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
            <FormItem label="编号">{getFieldDecorator('code')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="名称">{getFieldDecorator('name')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col xxl={6} lg={0}>
            <FormItem label="移动电话">{getFieldDecorator('mobilePhone')(<Input placeholder="请输入" />)}</FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
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
      changeModal,
      recordMesg,
      loading,
      total,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              className={styles.dataTable}
              scroll={{ x: 1600 }}
              selectedRows={selectedRows}
              loading={loading}
              rowKey={record => record.code}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <ChangeModal
          wrappedComponentRef={this.perSaveFormRef}
          changeModal={changeModal}
          recordMsg={recordMesg}
          onRef={ref => {
            this.showChange = ref;
          }}
          getValues={this.getValues}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Maintain);
