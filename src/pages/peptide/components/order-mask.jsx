// 多肽订单新增弹框
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
import './style.less';
import { connect } from 'dva';
import AddressMask from './address-mask';
import CustomerMask from '@/pages/peptide/components/customer-mask';
import SubCustomerMask from '@/pages/peptide/components/subCustomer-mask';
import ContactMask from '@/pages/peptide/components/contact-mask';
import SalerMask from '@/pages/peptide/components/saler-mask';
import LoadMask from '@/pages/peptide/components/load-mask'

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

/**
 * 页面顶部筛选表单
 */
@Form.create()
@connect(({ peptide, global }) => ({
  peptide,
  language: global.languageCode,
}))
class AddPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factorys: [],
      plusStatus: false,
    }
  }

  componentDidMount() {
    api.basic.getFactorys().then(data => {
      this.setState({
        factorys: data,
      })
    })
  }

  // 获取批量导入序列
  loadData = v => {
    console.log(v)
  }

  addAddress = () => { console.log(123) }

  handleFormReset = () => {
    this.props.form.resetFields();
  }

  getMaskData = (v, type) => {
    if (type === 'customer') {
      this.props.form.setFieldsValue({
        customerName: v.name,
      });
    }
    if (type === 'subCustomer') {
      this.props.form.setFieldsValue({
        subCustomerName: v.name,
      });
    }
    if (type === 'contact') {
      this.props.form.setFieldsValue({
        contactName: v.name,
      });
    }
    if (type === 'saler') {
      this.props.form.setFieldsValue({
        salerName: v.name,
      });
    }
  }

  // 修改加号颜色
  changePlusStatus = v => {
    this.setState({
      plusStatus: v,
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return
      console.log(values)
    });
  };

  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      peptide: {
        commonData,
        salesRanges,
        invtypes,
        payMethods,
      },
      peptide,
      language,
    } = this.props;
    const { factorys, plusStatus } = this.state;
    const regions = peptide.regions.filter(
      e => e.languageCode === language,
    )
    const offices = peptide.offices.filter(
      e => e.languageCode === language,
    )
    const currencies = peptide.currencies.filter(
      e => e.languageCode === language,
    )
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} className="myForm">
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
              {getFieldDecorator('customerName', {
                 rules: [{ required: true }],
              })(<Search onSearch={() => this.showCustomer.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售范围">
              {getFieldDecorator('rangeOrganization', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  {salesRanges.map(item => <Option key={`${item.organization}${item.channel}`} value={`${item.channelName} - ${item.organizationName}`}>
                  {`${item.channelName} - ${item.organizationName}`}
                  </Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="负责人">
              {getFieldDecorator('subCustomerName', {
                 rules: [{ required: true }],
              })(<Search onSearch={() => this.showSubCustomer.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售大区">
              {getFieldDecorator('regionCode', { initialValue: '3100' })(<Select dropdownMenuStyle={{ display: 'none' }}>
                {regions.map(item =>
                      <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>,
                    )}
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人">
              {getFieldDecorator('contactName', {
                 rules: [{ required: true }],
              })(<Search onSearch={() => this.showContact.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售网点">
              {getFieldDecorator('officeCode', { initialValue: '998' })(<Select dropdownMenuStyle={{ display: 'none' }}>
                {offices.map(item =>
                      <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>,
                    )}
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="配送网点">
              {getFieldDecorator('dofficeCode', {
                 rules: [{ required: true }],
              })(<Select>
                  <Option value="0">全部</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员">
              {getFieldDecorator('salerName', {
                 rules: [{ required: true }],
              })(<Search onSearch={() => this.showSaler.visibleShow(true)} />)}
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
              {getFieldDecorator('invoiceType', { initialValue: '20' })(<Select>
                {invtypes.map(item =>
                      <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>,
                    )}
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
              {getFieldDecorator('paymentMethod', {
                 rules: [{ required: true }],
              })(<Select>
                {payMethods.map(item =>
                      <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>,
                    )}
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
              {getFieldDecorator('paymentTerm', {
                 rules: [{ required: true }],
              })(<Select>
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
              {getFieldDecorator('invoiceByGoods', { initialValue: 0 })(<Select>
                {commonData.invoiceByGoodsStatus.map(item =>
                      <Option key={item.id} value={item.id}>{item.name}</Option>,
                    )}
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
              {getFieldDecorator('deliveryType', { initialValue: '01' })(<Select dropdownMenuStyle={{ display: 'none' }}>
                {commonData.deliveryTypeStatus.map(item =>
                      <Option key={item.id} value={item.id}>{`${item.id}-${item.name}`}</Option>,
                    )}
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
              {getFieldDecorator('factory', { initialValue: '3100' })(<Select dropdownMenuStyle={{ display: 'none' }}>
                {factorys.map(item =>
                      <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>,
                    )}
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="产品金额">
              {getFieldDecorator('productAmount', { initialValue: 9546.23.toFixed(2) })(<Input readOnly/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订单类型">
              {getFieldDecorator('orderTypeStatus', { initialValue: 0 })(<Select>
                {commonData.orderTypeStatus.map(item =>
                      <Option key={item.id} value={item.id}>{item.name}</Option>,
                    )}
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="运费">
              {getFieldDecorator('freight', { initialValue: 0.00.toFixed(2) })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订单金额">
              {getFieldDecorator('amount', { initialValue: (parseFloat(getFieldValue('productAmount')) + parseFloat(getFieldValue('freight'))).toFixed(2) })(<Input readOnly/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人邮箱">
              {getFieldDecorator('contactEmail', {
                 rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人手机">
              {getFieldDecorator('contactMobile', {
                 rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="币种">
              {getFieldDecorator('currency', { initialValue: 'CNY' })(<Select dropdownMenuStyle={{ display: 'none' }}>
                {currencies.map(item =>
                      <Option key={item.code} value={item.code}>{`${item.code}-${item.shortText}`}</Option>,
                    )}
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
              {getFieldDecorator('address')(
                <Select>
                  <Option value="0">全部</Option>
                </Select>)}
                <div style={{ position: 'absolute', top: '-8px', right: '40px', cursor: 'pointer' }} onMouseLeave={() => { this.changePlusStatus(false) }} onMouseEnter={() => { this.changePlusStatus(true) }} onClick={() => this.showAddress.visibleShow(true)}><Icon type="plus" className={plusStatus ? 'select-plus' : ''} style={{ color: 'green', opacity: '0.4' }}/></div>
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
            <FormItem label="完成日期">
              {getFieldDecorator('finishDate')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12} style={{ marginTop: '20px' }}>
            <span className="submitButtons">
              <Button onClick={ () => this.showLoad.visibleShow(true)}>
                批量导入序列
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
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
      <div className="tableListForm">
      {this.renderForm()}
      <CustomerMask
        onRef={ref => { this.showCustomer = ref }}
        getData={v => this.getMaskData(v, 'customer')}
        />
      <SubCustomerMask
        onRef={ref => { this.showSubCustomer = ref }}
        getData={v => this.getMaskData(v, 'subCustomer')}
      />
      <ContactMask
        onRef={ref => { this.showContact = ref }}
        getData={v => this.getMaskData(v, 'contact')}
      />
      <SalerMask
        onRef={ref => { this.showSaler = ref }}
        getData={v => this.getMaskData(v, 'saler')}
      />
      <AddressMask onRef={ref => { this.showAddress = ref }}/>
      <LoadMask onRef={ref => { this.showLoad = ref }} getData={ v => this.loadData(v)}/>
      </div>
    );
  }
}

@connect(({ peptide, global }) => ({
  peptide,
  language: global.languageCode,
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
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  visibleShow = visible => {
    this.setState({ visible })
  }

  handleOk = () => {
    this.handleCancel()
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

    api.basic.getProducts(query).then(data => {
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
              dataSon: selectedRows[0],
              loadingSon: true,
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
            <AddPage
              openAddressMask={this.openAddressMask}
            />
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
                  dataSource={dataSon}
                  columns={columnSon}
                  scroll={{ x: tableWidthSon, y: 400 }}
                  loading={loadingSon}
                  />
            </Col>
          </div>
        </Modal>
    );
  }
}

export default Form.create()(Order);
