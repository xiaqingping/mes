// 多肽修饰弹框
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  Modal,
} from 'antd';
import React, { Component } from 'react';

import api from '@/api';
import './style.less'
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 页面顶部筛选表单
 */
@Form.create()
class Search extends Component {
  componentDidMount() {
    this.submit();
  }

  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1, ...val });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  }

  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      modificationType,
      status,
    } = this.props;
    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="修饰类型">
              {getFieldDecorator('modificationTypeID', { initialValue: '0' })(
                <Select>
                  <Option value="0">全部</Option>
                  {modificationType.map(item => <Option key={item.id} value={item.id}>
                  {item.modificationType}
                  </Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
            {getFieldDecorator('status', { initialValue: 1 })(
                <Select>
                    {status.map(item =>
                      <Option key={item.id} value={item.id}>{item.name}</Option>,
                    )}
                  </Select>)}
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
  }

  render() {
    return (
      <div className="tableListForm">{this.renderForm()}</div>
    );
  }
}

@connect(({ peptide }) => ({
  peptide,
}))
class Order extends Component {
  state = {
    formValues: {
      page: 1,
      rows: 10,
    },
    list: [],
    total: 0,
    loading: false,
    visible: false, // 遮罩层的判断
    data: [],
    modificationType: [],
  }

  componentWillReceiveProps(nextProps) {
    api.peptideBase.getModificationTypesAll().then(res => {
      this.setState({
        modificationType: res,
      })
    })
    this.setState({
      visible: nextProps.visible,
    })
  }

  handleOk = () => {
    this.props.getData(this.state.data);
  };

  handleCancel = () => {
    this.props.closeMask(false);
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
  }

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.peptideBase.getModifications(query).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
      });
    });
  }

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
    const { peptide: { commonData } } = this.props
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
              val = item.name
            }
          })
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
              val = item.modificationType
            }
          })
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
          return ''
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
    ];

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      return col
    });

    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
              data: selectedRows[0],
            })
        },
    }

    return (
      <div>
        <Modal
          width="1200px"
          title="多肽修饰列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <Search getTableData={this.getTableData} status={commonData.status}
             modificationType={ modificationType }/>
            <div className="tableListOperator">
            </div>
            <Table
              dataSource={data.list}
              columns={columns}
              scroll={{ x: tableWidth, y: 400 }}
              pagination={data.pagination}
              rowKey="code"
              rowSelection={rowSelection}
              loading={loading}
              onChange={this.handleStandardTableChange}
              />
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Order);
