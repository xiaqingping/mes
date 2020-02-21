// 客户弹框
import { Button, Col, Form, Input, Row, Select, Table, Modal } from 'antd';
import React, { Component } from 'react';

import api from '@/api';
import './style.less';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 页面顶部筛选表单
 */
class Customer extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {
      // current: 1,
      // pageSize: 10,
      // total: 0,
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
    this.setState({ loading: true });

    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
    };

    api.peptideBase.getModifications(data, true).then(res => {
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

  // 渲染表单
  renderForm = () => {
    const {
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
            <FormItem label="编号" name="code">
              <Input style={{ width: '192px' }} />
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="名称" name="name">
              <Input style={{ width: '192px' }} />
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="电话" name="telNo">
              <Input style={{ width: '192px' }} />
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="手机" name="mobNo">
              <Input style={{ width: '192px' }} />
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="邮箱" name="email">
              <Input style={{ width: '192px' }} />
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="大区" name="regionCode">
              <Select style={{ width: '192px' }}>
                <Option value="">全部</Option>
                {regions.map(item => (
                  <Option key={item.code} value={item.code}>
                    {`${item.code}-${item.name}`}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="网点" name="officeCode">
              <Select style={{ width: '192px' }}>
                <Option value="">全部</Option>
                {offices.map(item => (
                  <Option key={item.code} value={item.code}>
                    {`${item.code}-${item.name}`}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="付款方式" name="payMethodCode">
              <Select style={{ width: '192px' }}>
                <Option value="">全部</Option>
                {payMethods.map(item => (
                  <Option key={item.code} value={item.code}>
                    {`${item.code}-${item.name}`}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="付款条件" name="payTermsCode">
              <Select style={{ width: '192px' }}>
                <Option value="">全部</Option>
                {payTerms.map(item => (
                  <Option key={item.code} value={item.code}>
                    {`${item.code}-${item.name}`}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售范围" name="rangeOrganization">
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
              </Select>
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员编号" name="salerCode">
              <Input style={{ width: '192px' }} />
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员名称" name="salerName">
              <Input style={{ width: '192px' }} />
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
    const {
      formValues: { page: current, rows: pageSize },
      list,
      total,
      loading,
      visible,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };
    // const {
    //   peptide: { commonData },
    // } = this.props;
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
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            renderForm={this.renderForm}
          />
          <div className="tableListOperator" />
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

export default connect(({ peptide }) => ({
  peptide,
}))(Customer);
