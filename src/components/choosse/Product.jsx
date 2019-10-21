/**
 * SAP 产品
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
import { formatter } from '@/utils/utils';

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
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '1' })(
                <Select>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="SAP编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="样品类型">
              {getFieldDecorator('sampleTypeId')(
                // <Select>
                //   {sampleType.map(e =>
                //     <Option value={e.id} key={e.id}>{e.name}</Option>,
                //   )}
                // </Select>,
                <Input />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="测序类型">
              {getFieldDecorator('seqTypeId')(
                // <Select>
                //   {seqType.map(e =>
                //     <Option value={e.id} key={e.id}>{e.name}</Option>,
                //   )}
                // </Select>,
                <Input />,
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
            <FormItem label="名称">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={0}>
            <FormItem label="样品类型">
              {getFieldDecorator('sampleTypeId', { initialValue: '' })(
                <Select>
                  <Option value="1">PCR产物(已纯化)</Option>
                  <Option value="2">PCR产物(未纯化)</Option>
                </Select>,
              )}
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
      visible: false,
      productList: [],
    }
  }

  getTableData = () => {
    api.basic.getProductList({
      page: 1,
      rows: 10,
    }).then(res => {
      this.setState({
        productList: res,
      })
    });
  }

  render() {
    const { productList } = this.state;
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

    return (
      <Modal
        title="产品列表"
        visible={this.state.visible}
        width="1200px"
      >
        <Search getTableData={this.getTableData} />
        <Layout>
          <Content style={{ background: '#fff', paddingRight: '10px' }}>
            <Table
              rowKey="id"
              scroll={{ x: tableWidth }}
              dataSource={productList}
              columns={columns}
            />
          </Content>
          <Sider style={{ background: '#fff' }}>
            <Table
              rowKey="id"
              scroll={{ x: tableWidth }}
              dataSource={productList}
              columns={columns}
            />
          </Sider>
        </Layout>

      </Modal>
    );
  }
}

export default ChooseProduct;
