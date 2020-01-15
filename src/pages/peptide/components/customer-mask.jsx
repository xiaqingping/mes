// 客户弹框
import { Button, Col, Form, Input, Row, Select, Table, Modal } from 'antd';
import React, { Component } from 'react';

import api from '@/api';
import './style.less';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 页面顶部筛选表单
 */
@Form.create()
@connect(({ peptide, global }) => ({
  peptide,
  language: global.languageCode,
}))
class Search extends Component {
  componentDidMount() {
    this.submit();
  }

  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1, ...val });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      peptide: { payMethods, payTerms, salesRanges },
      peptide,
      language,
    } = this.props;

    const regions = peptide.regions.filter(e => e.languageCode === language);
    const offices = peptide.offices.filter(e => e.languageCode === language);

    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input style={{ width: '192px' }} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input style={{ width: '192px' }} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="电话">
              {getFieldDecorator('telNo')(<Input style={{ width: '192px' }} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="手机">
              {getFieldDecorator('mobNo')(<Input style={{ width: '192px' }} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="邮箱">
              {getFieldDecorator('email')(<Input style={{ width: '192px' }} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="大区">
              {getFieldDecorator('regionCode', { initialValue: '' })(
                <Select style={{ width: '192px' }}>
                  <Option value="">全部</Option>
                  {regions.map(item => (
                    <Option key={item.code} value={item.code}>
                      {`${item.code}-${item.name}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="网点">
              {getFieldDecorator('officeCode', { initialValue: '' })(
                <Select style={{ width: '192px' }}>
                  <Option value="">全部</Option>
                  {offices.map(item => (
                    <Option key={item.code} value={item.code}>
                      {`${item.code}-${item.name}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="付款方式">
              {getFieldDecorator('payMethodCode', { initialValue: '' })(
                <Select style={{ width: '192px' }}>
                  <Option value="">全部</Option>
                  {payMethods.map(item => (
                    <Option key={item.code} value={item.code}>
                      {`${item.code}-${item.name}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="付款条件">
              {getFieldDecorator('payTermsCode', { initialValue: '' })(
                <Select style={{ width: '192px' }}>
                  <Option value="">全部</Option>
                  {payTerms.map(item => (
                    <Option key={item.code} value={item.code}>
                      {`${item.code}-${item.name}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售范围">
              {getFieldDecorator('rangeOrganization', { initialValue: '' })(
                <Select style={{ width: '192px' }}>
                  <Option value="">全部</Option>
                  {salesRanges.map(item => (
                    <Option
                      key={`${item.organization}${item.channel}`}
                      value={`${item.channelName} - ${item.organizationName}`}
                    >
                      {`${item.channelName} - ${item.organizationName}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员编号">
              {getFieldDecorator('salerCode')(<Input style={{ width: '192px' }} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员名称">
              {getFieldDecorator('salerName')(<Input style={{ width: '192px' }} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return <div className="tableListForm">{this.renderForm()}</div>;
  }
}

@connect(({ peptide }) => ({
  peptide,
}))
class Customer extends Component {
  state = {
    formValues: {
      page: 1,
      rows: 10,
    },
    list: [],
    total: 0,
    loading: false,
    visible: false, // 遮罩层的判断
    modificationType: [],
  };

  componentDidMount() {
    this.props.onRef(this);
  }
  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     visible: nextProps.visible,
  //   })
  // }

  visibleShow = visible => {
    this.setState({ visible });
  };

  handleSelect = data => {
    this.props.getData(data);
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.peptideBase.getModifications(query, true).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
      });
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      list,
      total,
      loading,
      visible,
      modificationType,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };
    const {
      peptide: { commonData },
    } = this.props;
    let tableWidth = 0;

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '公司',
        dataIndex: 'name',
        width: 350,
      },
      {
        title: '电话',
        dataIndex: 'telNo',
        width: 100,
      },
      {
        title: '手机',
        dataIndex: 'mobNo',
        width: 100,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 100,
      },
      {
        title: '分类',
        dataIndex: 'type',
        width: 100,
      },
      {
        title: '大区',
        dataIndex: 'regionCode',
        width: 100,
      },
      {
        title: '网点',
        dataIndex: 'officeCode',
        width: 100,
      },
      {
        title: '币种',
        dataIndex: 'currency',
        width: 100,
      },
      {
        title: '付款方式',
        dataIndex: 'payMethodCode',
        width: 100,
      },
      {
        title: '付款条件',
        dataIndex: 'payTermsCode',
        width: 100,
      },
      {
        title: '销售员名称',
        dataIndex: 'salerName',
        width: 120,
      },
      {
        title: '销售冻结(当前渠道)',
        dataIndex: 'customerRangeFrozen',
        width: 200,
      },
      {
        title: '销售冻结(所有渠道)',
        dataIndex: 'customerFrozen',
        width: 200,
      },
      {
        title: '客户性质',
        dataIndex: 'industryText',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        render: (text, record) => <a onClick={() => this.handleSelect(record)}>选择</a>,
      },
    ];

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      return col;
    });

    // const rowSelection = {
    //   type: 'radio',
    //   onChange: (selectedRowKeys, selectedRows) => {
    //       this.setState({
    //           data: selectedRows[0],
    //         })
    //     },
    // }

    return (
      <div>
        <Modal
          width="1200px"
          title="客户列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Search
            getTableData={this.getTableData}
            status={commonData.status}
            modificationType={modificationType}
          />
          <div className="tableListOperator"></div>
          <Table
            dataSource={data.list}
            columns={columns}
            scroll={{ x: tableWidth, y: 300 }}
            pagination={data.pagination}
            rowKey="code"
            // rowSelection={rowSelection}
            loading={loading}
            onChange={this.handleStandardTableChange}
          />
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Customer);
