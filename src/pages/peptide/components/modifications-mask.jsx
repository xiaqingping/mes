// 多肽修饰弹框
import { Col, Form, Input, Select, Table, Modal } from 'antd';
import React, { Component } from 'react';

import api from '@/api';
import './style.less';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';

const FormItem = Form.Item;
const { Option } = Select;

class Order extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    visible: false, // 遮罩层的判断
    modificationType: [],
  };

  // 顶部表单默认值
  initialValues = {
    modificationTypeID: '0',
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   api.peptideBase.getModificationTypes().then(res => {
  //     this.setState({
  //       modificationType: res,
  //     });
  //   });
  //   this.setState({
  //     visible: nextProps.visible,
  //   });
  // }

  visibleShow = visible => {
    api.peptideBase.getModificationTypes().then(res => {
      this.setState({
        modificationType: res,
      });
    });
    this.setState({
      visible,
    });
    this.getTableData(this.initialValues);
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
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
      });
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  simpleForm = () => {
    const { modificationType } = this.state;
    const {
      peptide: {
        commonData: { status },
      },
    } = this.props;
    return (
      <>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="编号" name="code">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="修饰类型" name="modificationTypeID">
            <Select>
              <Option value="0">全部</Option>
              {modificationType.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.modificationType}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="状态" name="status">
            <Select>
              {status.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

  render() {
    const { pagination, list, loading, visible, modificationType } = this.state;
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
        title: '修饰名称',
        dataIndex: 'name',
        width: 300,
      },
      {
        title: '修饰代码',
        dataIndex: 'modificationCode',
        width: 100,
      },
      {
        title: '修饰位置',
        dataIndex: 'modificationPosition',
        width: 100,
        render: text => {
          let val = null;
          commonData.modificationPosition.forEach(item => {
            if (item.id === text) {
              val = item.name;
            }
          });
          return val;
        },
      },
      {
        title: '独立修饰',
        dataIndex: 'isIndependentModification',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
      },
      {
        title: '修饰类别',
        dataIndex: 'modificationTypeID',
        width: 250,
        render: text => {
          let val = null;
          modificationType.forEach(item => {
            if (item.id === text) {
              val = item.modificationType;
            }
          });
          return val;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: text => {
          if (text === 1) return '正常';
          if (text === 2) return '已删除';
          return '';
        },
      },
      {
        title: '创建人',
        dataIndex: 'creatorName',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 200,
      },
      {
        title: '删除人',
        dataIndex: 'cancelName',
        width: 100,
      },
      {
        title: '删除时间',
        dataIndex: 'cancelDate',
        width: 200,
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
          title="多肽修饰列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
          <div className="tableListOperator" />
          <Table
            dataSource={list}
            columns={columns}
            scroll={{ x: tableWidth, y: 400 }}
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
}))(Order);
