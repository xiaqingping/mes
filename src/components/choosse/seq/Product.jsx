/**
 * 选择 SAP 产品
 */
import {
  Modal,
  Table,
  Button,
  Layout,
  Col,
  Form,
  Input,
  Row,
  Select,
  Icon,
} from 'antd';
import React from 'react';
// import { connect } from 'dva';

import api from '@/api';
// import { formatter } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { Sider, Content } = Layout;

@Form.create()
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    }
  }

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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={8}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="产品名称">
              {getFieldDecorator('desc')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="英文名称">
              {getFieldDecorator('edesc')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="旧物料号">
              {getFieldDecorator('oldCode')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="客户编号">
              {getFieldDecorator('customerCode')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="负责人编号">
              {getFieldDecorator('subcustomerCode')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="销售大区">
              {getFieldDecorator('regionCode')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="销售大区">
              {getFieldDecorator('officeCode')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="销售范围">
              {getFieldDecorator('range')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="工厂">
              {getFieldDecorator('factory')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="品牌">
              {getFieldDecorator('brandCode')(<Input />)}
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

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={8}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="产品名称">
              {getFieldDecorator('desc')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={0}>
            <FormItem label="英文名称">
              {getFieldDecorator('edesc')(<Input />)}
            </FormItem>
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

  // 渲染表单
  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    return (
      <div className="tableListForm">
        {this.renderForm()}
      </div>
    );
  }
}

class ChooseProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      table1Data: [],
      table2Data: [],
    }
  }

  changeVisible = visible => {
    this.setState({ visible });
  }

  getTableData = () => {
    this.setState({ loading: true });

    api.basic.getProducts({
      page: 1,
      rows: 10,
    }).then(res => {
      this.setState({
        table1Data: res,
        loading: false,
      })
    });
  }

  selectRow = row => {
    this.props.selectChooseModalData(row);
    this.setState({ visible: false });
  }

  // 设置表格1的列属性
  setColumnsToTable1 = () => {
    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 150,
      },
      {
        title: '产品名称',
        dataIndex: 'desc',
      },
      {
        title: '英文名称',
        dataIndex: 'edesc',
      },
      {
        title: '旧物料号',
        dataIndex: 'oldCode',
        width: 150,
      },
      {
        title: '品牌',
        dataIndex: 'brand',
      },
      {
        title: '包装',
        dataIndex: 'packing',
      },
      {
        title: '销售单位',
        dataIndex: 'salesUnit',
      },
      {
        title: '采购单位',
        dataIndex: 'purchaseUnit',
      },
      {
        title: '温度条件',
        dataIndex: 'temperatureCode',
      },
      {
        title: '危险品标识',
        dataIndex: 'cas',
        width: 120,
      },
      {
        title: '产品价格',
        dataIndex: 'listPrice',
      },
      {
        title: '客户折扣',
        dataIndex: 'custDiscount',
      },
      {
        title: '客户价格',
        dataIndex: 'custPrice',
      },
      {
        title: '促销价格',
        dataIndex: 'promPrice',
      },
      {
        title: '库存',
        dataIndex: 'stock',
      },
      {
        title: '到货周期',
        dataIndex: 'period',
      },
      {
        title: '状态',
        dataIndex: 'saleStatus',
      },
      {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        render: (text, record) => (
          <a onClick={() => this.selectRow(record)}>选择</a>
        ),
      },
    ];

    let tableWidth = 0;
    columns = columns.map(col => {
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
      };
    });
    return { columns, tableWidth };
  }

  // 设置表格2的列属性
  setColumnsToTable2 = () => {
    const columns = [
      {
        title: '仓库',
        dataIndex: 'storageName',
      },
      {
        title: '数量',
        dataIndex: 'saleCount',
      },
    ];

    return { columns };
  }

  setTable2Data = data => {
    const table2Data = data && data.stock && data.stock.storages ? data.stock.storages : [];
    this.setState({
      table2Data,
    });
  }

  render() {
    const { loading, table1Data, table2Data, visible } = this.state;
    const table1 = this.setColumnsToTable1();
    const table2 = this.setColumnsToTable2();

    return (
      <Modal
        title="产品列表"
        visible={visible}
        width="1200px"
        onCancel={() => this.changeVisible(false)}
        footer={null}
      >
        <Search getTableData={this.getTableData} />
        <Layout>
          <Content style={{ background: '#fff', paddingRight: '10px' }}>
            <Table
              rowKey="id"
              loading={loading}
              scroll={{ x: table1.tableWidth, y: 500 }}
              dataSource={table1Data}
              columns={table1.columns}
              onRow={record => ({
                onClick: () => {
                  this.setTable2Data(record);
                },
              })}
            />
          </Content>
          <Sider style={{ background: '#fff' }}>
            <Table
              rowKey="id"
              scroll={{ y: 500 }}
              dataSource={table2Data}
              columns={table2.columns}
            />
          </Sider>
        </Layout>
      </Modal>
    );
  }
}

export default ChooseProduct;
