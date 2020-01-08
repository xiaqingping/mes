// 产品弹框
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
@connect(({ peptide }) => ({
  peptide,
}))
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factorys: [],
    };
  }

  componentDidMount() {
    this.submit();
    api.basic.getPlants().then(data => {
      this.setState({
        factorys: data,
      });
    });
  }

  componentWillReceiveProps() {}

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
      brands,
      peptide: { salesRanges },
    } = this.props;
    const { factorys } = this.state;

    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">{getFieldDecorator('code')(<Input />)}</FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="产品名称">{getFieldDecorator('desc')(<Input />)}</FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="英文名称">{getFieldDecorator('edesc')(<Input />)}</FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="旧物料号">{getFieldDecorator('oldCode')(<Input />)}</FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="客户编号">{getFieldDecorator('customerCode')(<Input />)}</FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="负责人编号">
              {getFieldDecorator('subcustomerCode')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售大区">{getFieldDecorator('regionCode')(<Input />)}</FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售网点">{getFieldDecorator('officeCode')(<Input />)}</FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售范围">
              {getFieldDecorator('range_area', { initialValue: '10-3110' })(
                <Select style={{ width: '192px' }}>
                  <Option value="">全部</Option>
                  {salesRanges.map(item => (
                    <Option
                      key={`${item.organization}${item.channel}`}
                      value={`${item.channel}-${item.organization}`}
                    >
                      {`${item.channelName} - ${item.organizationName}`}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="工厂">
              {getFieldDecorator('stock_factory', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  {factorys.map(item => (
                    <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="品牌">
              {getFieldDecorator('brandCode', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  {brands.map(item => (
                    <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>
                  ))}
                </Select>,
              )}
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
    dataSon: [],
    loadingSon: false,
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  visibleShow = visible => {
    this.setState({
      visible,
    });
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

  // 设置子值
  dataSon = v => {
    this.setState({
      loadingSon: true,
    });

    setTimeout(() => {
      this.setState({
        dataSon: v.stock ? v.stock.storages : [],
        loadingSon: false,
      });
    }, 500);
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
    const conditions = [];
    conditions['range.channel'] = options.range_area ? options.range_area.split('-')[0] : '';
    conditions['range.organization'] = options.range_area ? options.range_area.split('-')[1] : '';
    conditions['stock.factory'] = options.stock_factory ? options.stock_factory : 3100;
    const query = Object.assign({}, formValues, options, conditions);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.basic.getProducts(query).then(data => {
      this.setState({
        list: data,
        total: data.length,
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
      dataSon,
      loadingSon,
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
        width: 150,
      },
      {
        title: '产品名称',
        dataIndex: 'desc',
        width: 250,
      },
      {
        title: '英文名称',
        dataIndex: 'edesc',
        width: 250,
      },
      {
        title: '旧物料号',
        dataIndex: 'oldCode',
        width: 150,
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        width: 100,
      },
      {
        title: '包装',
        dataIndex: 'packing',
        width: 100,
      },
      {
        title: '销售单位',
        dataIndex: 'salesUnit',
        width: 200,
      },
      {
        title: '采购单位',
        dataIndex: 'purchaseUnit',
        width: 200,
      },
      {
        title: '温度条件',
        dataIndex: 'temperatureCode',
        width: 200,
        render: (text, record) =>
          `${record.temperatureCode ? `${record.temperatureCode}-` : ''}${record.temperature}`,
      },
      {
        title: '危险品标识',
        dataIndex: 'cas',
        width: 120,
      },
      {
        title: '产品价格',
        dataIndex: 'listPrice',
        width: 100,
      },
      {
        title: '客户折扣',
        dataIndex: 'custDiscount',
        width: 100,
      },
      {
        title: '客户价格',
        dataIndex: 'custPrice',
        width: 100,
      },
      {
        title: '促销价格',
        dataIndex: 'promPrice',
        width: 100,
      },
      {
        title: '库存',
        dataIndex: 'stock',
        width: 100,
        render: (text, record) => record.saleCount,
      },
      {
        title: '到货周期',
        dataIndex: 'deliPeriod',
        width: 100,
        render: (text, record) => {
          if (record.deliPeriod === 0 && record.prodPeriod === 0) {
            if (record.stock) {
              if (record.stock.saleCount > 0) {
                return '现货';
              }
            }
            return '无货';
          }
          return `预计${Math.max(record.deliPeriod, record.prodPeriod)}天到货`;
        },
      },
      {
        title: '状态',
        dataIndex: 'saleStatus',
        width: 150,
        render: text => {
          if (text === 'Z1') return '暂停销售';
          return '状态异常(促销)';
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        render: (text, record) => <a onClick={() => this.handleSelect(record)}>选择</a>,
      },
    ];

    const columnSon = [
      {
        title: '仓库',
        dataIndex: 'storageName',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'saleCount',
        width: 100,
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
    //    },
    // }

    return (
      <div>
        <Modal
          width="1200px"
          title="产品列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Search
            getTableData={this.getTableData}
            brands={commonData.brands}
            rangeArea={commonData.rangeArea}
          />
          <div className="tableListOperator"></div>

          <Table
            style={{ width: '800px', height: '100%', display: 'inline-block' }}
            bordered
            dataSource={data.list}
            columns={columns}
            scroll={{ x: tableWidth, y: 350 }}
            rowKey="code"
            // rowSelection={rowSelection}
            loading={loading}
            onChange={this.handleStandardTableChange}
            onRow={record => ({ onClick: e => this.dataSon(record, e) })}
            pagination={false}
          />

          <Table
            style={{
              width: '300px',
              height: '100%',
              display: 'inline-block',
              marginLeft: '50px',
              verticalAlign: 'top',
            }}
            bordered
            dataSource={dataSon}
            columns={columnSon}
            scroll={{ x: 250, y: 350 }}
            rowKey="storage"
            loading={loadingSon}
            pagination={false}
          />
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Order);
