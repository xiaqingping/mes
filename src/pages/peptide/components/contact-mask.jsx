// 订货人弹框
import { Col, Form, Input, Select, Table, Modal } from 'antd';
import React, { Component } from 'react';

import api from '@/api';
import './style.less';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';

const FormItem = Form.Item;
const { Option } = Select;

class Customer extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    visible: false, // 遮罩层的判断
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  visibleShow = visible => {
    this.setState({ visible });
    this.getTableData(this.initialValues());
  };

  initialValues = () => {
    const { subCustomerCode } = this.props;
    return {
      payMethodCode: '',
      payTermsCode: '',
      rangeOrganization: '3110-10',
      page: 1,
      rows: 10,
      subcustomerCode: subCustomerCode,
    };
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
    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    const range = formData
      ? formData.rangeOrganization.split('-')
      : options.rangeOrganization.split('-');
    const rangeData = {
      rangeChannel: range[1],
      rangeGroup: '00',
      rangeOrganization: range[0],
    };
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
      ...rangeData,
    };

    api.basic.getContacts(data).then(res => {
      this.setState({
        list: res,
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.length,
        },
        loading: false,
      });
    });
  };

  simpleForm = () => {
    const {
      peptide: { salesRanges },
    } = this.props;
    return (
      <>
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
          <FormItem label="负责人编号" className="fiveWord" name="subcustomerCode">
            <Input style={{ width: '182px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="负责人名称" className="fiveWord" name="subcustomerName">
            <Input style={{ width: '182px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售范围" name="rangeOrganization">
            <Select style={{ width: '192px' }}>
              {/* <Option value="">全部</Option> */}
              {salesRanges.map(item => (
                <Option
                  key={`${item.organization}${item.channel}`}
                  value={`${item.organization}-${item.channel}`}
                >
                  {`${item.channelName} - ${item.organizationName}`}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

  render() {
    const { pagination, list, loading, visible } = this.state;
    let tableWidth = 0;

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 120,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '负责人',
        dataIndex: 'subcustomerCode',
        width: 120,
      },
      {
        title: '负责人',
        dataIndex: 'subcustomerName',
        width: 200,
      },
      {
        title: '电话',
        dataIndex: 'telNo',
        width: 150,
      },
      {
        title: '分机号',
        dataIndex: 'extension',
        width: 100,
      },
      {
        title: '手机',
        dataIndex: 'mobNo',
        width: 120,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 200,
      },
      {
        title: '国家/地区',
        dataIndex: 'countryName',
        width: 100,
      },
      {
        title: '省',
        dataIndex: 'provinceName',
        width: 100,
      },
      {
        title: '市',
        dataIndex: 'city',
        width: 100,
      },
      {
        title: '区',
        dataIndex: 'county',
        width: 100,
      },
      {
        title: '街道',
        dataIndex: 'street',
        width: 200,
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 300,
      },
      {
        title: '销售冻结(当前渠道)',
        dataIndex: 'customerRangeFrozen',
        width: 160,
      },
      {
        title: '销售冻结(所有渠道)',
        dataIndex: 'customerFrozen',
        width: 160,
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

    return (
      <div>
        <Modal
          width="1200px"
          title="订货人列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues()}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
          <div className="tableListOperator" />
          <Table
            dataSource={list}
            columns={columns}
            scroll={{ x: tableWidth, y: 300 }}
            pagination={pagination}
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
