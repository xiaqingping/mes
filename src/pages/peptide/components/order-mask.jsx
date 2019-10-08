// 产品弹框
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  Modal,
  Icon,
} from 'antd';
import React, { Component } from 'react';

import api from '@/api';
import './style.less'
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

/**
 * 页面顶部筛选表单
 */
@Form.create()
class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factorys: [],
    }
  }

  addAddress = () => { console.log(123) }


  handleFormReset = () => {
    this.props.form.resetFields();
  }

  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      brands,
      rangeArea,
    } = this.props;
    const { factorys } = this.state;

    return (
      <Form layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订单编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售类型">
              {getFieldDecorator('salesType')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="客户">
              {getFieldDecorator('customerName')(<Search />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售范围">
              {getFieldDecorator('range', { initialValue: '10-3110' })(<Select>
                  {rangeArea.map(item =>
                      <Option key={item.id} value={item.id}>{item.name}</Option>,
                    )}
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="负责人">
              {getFieldDecorator('subCustomerName')(<Search />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售大区">
              {getFieldDecorator('regionCode')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人">
              {getFieldDecorator('contactName')(<Search />)}
            </FormItem>
          </Col>

          <Col lg={6} md={8} sm={12}>
            <FormItem label="配送网点">
              {getFieldDecorator('dofficeCode')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售网点">
              {getFieldDecorator('dofficeCode')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员">
              {getFieldDecorator('salerName')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售部门">
              {getFieldDecorator('departmentCode')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="信用额度">
              {getFieldDecorator('credit')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="开票方式">
              {getFieldDecorator('invoiceType')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="信用余额">
              {getFieldDecorator('balance')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="付款方式">
              {getFieldDecorator('paymentMethod')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="专项经费">
              {getFieldDecorator('depositBalance')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="付款条件">
              {getFieldDecorator('paymentTerm')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="SAP销售订单编号">
              {getFieldDecorator('sapOrderCode')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="随货开票">
              {getFieldDecorator('invoiceByGoods')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="SAP交货单号">
              {getFieldDecorator('sapDeliveryCode')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="sap采购申请单号">
              {getFieldDecorator('sapProcureApplyCode')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="客户订单号">
              {getFieldDecorator('customerPoCode')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="客户订单日期">
              {getFieldDecorator('customerPoDate')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="交货方式">
              {getFieldDecorator('deliveryType')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="仓库">
              {getFieldDecorator('storageCode')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="SAP交货单号">
              {getFieldDecorator('sapDeliveryCode')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="工厂">
              {getFieldDecorator('factory')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="产品金额">
              {getFieldDecorator('productAmount')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订单类型">
              {getFieldDecorator('orderType')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="运费">
              {getFieldDecorator('freight')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订单金额">
              {getFieldDecorator('amount')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人邮箱">
              {getFieldDecorator('contactEmail')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人手机">
              {getFieldDecorator('contactMobile')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="币种">
              {getFieldDecorator('currency')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="备注">
              {getFieldDecorator('remark')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="地址">
              {getFieldDecorator('address')(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
                <div style={{ position: 'absolute', top: '-8px', right: '40px' }} onClick={() => { this.addAddress() }}><Icon type="plus" /></div>
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="创建人">
              {getFieldDecorator('creatorName')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="创建日期">
              {getFieldDecorator('createDate')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="修改人">
              {getFieldDecorator('changerName')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="修改日期">
              {getFieldDecorator('changeDate')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="审核人">
              {getFieldDecorator('checkName')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="审核日期">
              {getFieldDecorator('checkDate')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="完成人">
              {getFieldDecorator('finishName')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="币种">
              {getFieldDecorator('currency')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="完成日期">
              {getFieldDecorator('finishDate')(<Input />)}
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
    dataSon: [],
    loadingSon: false,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    })
  }

  handleOk = () => {
    this.props.getData(this.state.data);
  };

  handleCancel = () => {
    this.props.closeMask(false)
    this.setState({
      visible: false,
    });
  };

    // 设置子值
    dataSon = v => {
      this.setState({
        loadingSon: true,
      })
      setTimeout(() => {
          this.setState({
            dataSon: v.stock.storages,
            loadingSon: false,
          })
        }, 500)
    }

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
    const conditions = [];
    conditions['range.channel'] = options.range_area ? options.range_area.split('-')[0] : '';
    conditions['range.organization'] = options.range_area ? options.range_area.split('-')[1] : '';
    conditions['stock.factory'] = options.stock_factory ? options.stock_factory : 3100;
    const query = Object.assign({}, formValues, options, conditions);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.basic.getProductList(query).then(data => {
      this.setState({
        list: data,
        total: data.length,
        loading: false,
      });
    });
  }

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
    const { peptide: { commonData } } = this.props
    let tableWidth = 0;
    let tableWidthSon = 0;

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '多肽名称',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '提供总量(mg)',
        dataIndex: 'providerTotalAmount',
        width: 150,
      },
      {
        title: '提供总量(mg)',
        dataIndex: 'isNeedDesalting',
        width: 150,
      },
      {
        title: '纯度',
        dataIndex: 'peptidePurityId',
        width: 100,
      },
      {
        title: '序列',
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: '氨基酸数',
        dataIndex: 'aminoAcidCount',
        width: 100,
      },
      {
        title: '氨基端修饰',
        dataIndex: 'aminoModificationName',
        width: 120,
      },
      {
        title: '氨基端修饰金额',
        dataIndex: 'aminoModificationPrice',
        width: 150,
      },
      {
        title: '氨基端修饰SAP产品编号',
        dataIndex: 'aminoSapProductCode',
        width: 200,
      },
      {
        title: '氨基端修饰SAP产品名称',
        dataIndex: 'aminoSapProductName',
        width: 200,
      },
      {
        title: '羧基端修饰',
        dataIndex: 'carboxyModificationName',
        width: 120,
      },
      {
        title: '羧基端修饰金额',
        dataIndex: 'carboxyModificationPrice',
        width: 170,
      },
      {
        title: '羧基端修饰SAP产品编号',
        dataIndex: 'carboxySapProductCode',
        width: 200,
      },
      {
        title: '羧基端修饰SAP产品名称',
        dataIndex: 'carboxySapProductName',
        width: 200,
      },
      {
        title: '中间修饰',
        dataIndex: 'middleModification',
        width: 100,
      },
      {
        title: '中间修饰数量',
        dataIndex: 'middleModificationDetailCount',
        width: 150,
      },
      {
        title: '二硫键',
        dataIndex: 'middleModificationDetailAmount',
        width: 100,
      },
      {
        title: '二硫键数量',
        dataIndex: 'disulfideBondDetailCount',
        width: 120,
      },
      {
        title: '二硫键金额',
        dataIndex: 'disulfideBondDetailAmount',
        width: 120,
      },
      {
        title: '分装管数',
        dataIndex: 'subpackage',
        width: 100,
      },
      {
        title: '金额',
        dataIndex: 'totalAmount',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'notes',
        width: 100,
      },
    ];

    let columnSon = [
        {
        title: '氨基酸',
        dataIndex: 'aminoAcidID',
        width: 80,
      },
      {
        title: '类型',
        dataIndex: 'aminoAcidType',
        width: 80,
      },
      {
        title: '长代码',
        dataIndex: 'longCode',
        width: 80,
      },
      {
        title: '短代码',
        dataIndex: 'shortCode',
        width: 80,
      },
      {
        title: '单价',
        dataIndex: 'price',
        width: 80,
      },
      {
        title: 'SAP产品编号',
        dataIndex: 'sapProductCode',
        width: 130,
      },
      {
        title: 'SAP产品名称',
        dataIndex: 'sapProductName',
        width: 130,
      },
    ];


    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      return col
    });

    columnSon = columnSon.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidthSon += col.width;
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
        <Modal
          width="100%"
          title="多肽合成订单编辑页面"
          style={{ top: '0', padding: '0', border: 'none' }}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          keyboard={false}
          className="orderMask"
        >
          <div>
            <SearchPage rangeArea={commonData.rangeArea}/>
            <Col span={14}>
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
            </Col>
            <Col span={1}></Col>
            <Col span={9}>
              <Table
                  dataSource={data.list}
                  columns={columnSon}
                  scroll={{ x: tableWidthSon, y: 400 }}
                  loading={loading}
                  />
            </Col>
          </div>
        </Modal>
    );
  }
}

export default Form.create()(Order);
