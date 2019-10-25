import {
  Form,
  Card,
  Col,
  Row,
  Button,
  Icon,
  Input,
  DatePicker,
  Select,
  Cascader,
  Modal,
} from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
/** 测试数据 */
const optionsTry = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const brands = [
  { code: '001', name: '进口分装' },
  { code: '002', name: '生工' },
  { code: '003', name: 'Worthington' },
  { code: '004', name: 'G-Bios' },
  { code: '005', name: '进口' },
  { code: '006', name: '国产' },
  { code: '007', name: 'HANNA' },
  { code: '008', name: '康宁' },
  { code: '009', name: '耶拿' },
  { code: '010', name: '大龙' },
  { code: '011', name: '复日科技' },
  { code: '012', name: 'KleanAB' },
  { code: '013', name: '康健' },
  { code: '014', name: '振威' },
  { code: '015', name: '双杰' },
  { code: '016', name: '杭州仪表' },
  { code: '017', name: '虹益' },
  { code: '018', name: '天达' },
  { code: '019', name: '沪西' },
  { code: '020', name: '华利达' },
  { code: '021', name: '百晶' },
  { code: '022', name: 'QSP' },
  { code: '023', name: 'Simport' },
  { code: '024', name: '3M' },
  { code: '025', name: 'Amresco' },
  { code: '026', name: 'Spetrum' },
  { code: '027', name: 'Parafilm' },
  { code: '028', name: '欧西亚' },
  { code: 'BBI', name: 'BBI' },
  { code: 'MBI', name: 'MBI' },
]

const applyColumns = [
  {
    title: '员工',
    dataIndex: 'employeeCode',
  },
  {
    title: '编号',
    dataIndex: 'loginCode',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '角色',
    dataIndex: 'roleID',
  },
  {
    title: '大区',
    dataIndex: 'regionCode',
  },
  {
    title: '网点',
    dataIndex: 'officeCode',
  },
  {
    title: '客户',
    dataIndex: 'customerCode',
  },
  {
    title: '测序点',
    dataIndex: 'cxPointId',
  },
  {
    title: '仓库',
    dataIndex: 'storageCode',
  },
]

const productColumns = [
  {
    title: '编号',
    dataIndex: 'code',
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
]

const proDetailColumns = [
  {
    title: '仓库',
    dataIndex: 'cangku',
  },
  {
    title: '数量',
    dataIndex: 'shuliang',
  },
]

const ChoseApplyNameModel = Form.create()(
  class extends React.Component {
    constructor (props) {
      super(props);
      // 无用状态
      this.state = {}
    }

    render() {
      const {
        applyNameModal,
        closeApplyNameModal,
        form,
        searchApplyName,
        regions,
        offices,
        applyLoading,
        applyData,
        applySelectRows,
        applyChange,
        applyRows,
        applyReset,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="选择申请人"
          footer={null}
          width={1130}
          visible={applyNameModal}
          onCancel={closeApplyNameModal}
        >
          <Form onSubmit={searchApplyName} layout="inline">
            <Row>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="编号" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('loginCode')(<Input placeholder="请输入" size="small" style={{ width: '100%' }}/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="姓名" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('name')(<Input placeholder="请输入" size="small"/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="角色" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('roleID', { initialValue: '' })(
                    <Select placeholder="请选择" size="small" style={{ width: 197 }}>
                      <Option value="">全部</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="大区" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('regionCode', { initialValue: '' })(
                    <Select placeholder="请选择" size="small" style={{ width: 197 }}>
                      <Option value=""> 全部 </Option>
                      {
                        (regions.length > 0) && regions.map(region =>
                          <Option
                            key={ region.code}
                            value={region.code}>{region.code}-{region.name} </Option>,
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="网点" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('officeCode', { initialValue: '' })(
                    <Select placeholder="请选择" size="small" style={{ width: 197 }}>
                    <Option value=""> 全部 </Option>
                      {
                        (offices.length > 0) && offices.map(office =>
                          <Option
                            key={ office.code}
                            value={office.code}>{office.code}-{office.name} </Option>,
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="员工" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('employeeCode')(
                    <Input placeholder="请输入" size="small"/>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={applyReset}>
                  重置
                </Button>
              </div>
            </div>
          </Form>
          <StandardTable
              selectedRows= {applyRows}
              loading={applyLoading}
              data={applyData}
              columns={applyColumns}
              onSelectRow={applySelectRows}
              onChange={applyChange}
            />
        </Modal>
      )
    }
  },
)

const ChoseProductForm = Form.create()(
  class extends React.Component {
    constructor (props) {
      // 无用状态
      super(props);
      this.state = {}
    }

    render() {
      const {
        form,
        productModal,
        closeProductModal,
        searchProduct,
        getSalesRange,
        factorys,
        productReset,
        productLoading,
        procductList,
        productRows,
        productSelectRows,
        productChange,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="产品列表"
          footer={null}
          width={1130}
          visible= { productModal }
          onCancel= { closeProductModal }
        >
          <Form onSubmit={searchProduct} layout="inline" labelAlign="left">
            <Row>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="编号" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('code')(<Input placeholder="请输入" size="small" style={{ width: '100%' }}/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="产品名称" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('desc')(<Input placeholder="请输入" size="small"/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="英文名称" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('edesc')(<Input placeholder="请输入" size="small"/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="旧物料号" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('oldCode')(<Input placeholder="请输入" size="small"/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="客户编号" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('customerCode')(<Input placeholder="请输入" size="small" disabled/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="负责人编号" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('subcustomerCode')(<Input placeholder="请输入" size="small" disabled/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="销售大区" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('regionCode')(<Input placeholder="请输入" size="small" disabled/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="销售网点" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('officeCode')(<Input placeholder="请输入" size="small" disabled/>)}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="销售范围" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('range')(
                    <Select placeholder="请选择" size="small" style={{ width: 150 }} disabled>
                      <Option value="">全部</Option>
                      {
                        (getSalesRange.length > 0) && getSalesRange.map(range =>
                          <Option
                            key={ range.channel}
                            value={range.channel}>
                            {range.channelName}-{range.organizationName}
                          </Option>,
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="工厂" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('factory', { initialValue: '3100' })(
                    <Select placeholder="请选择" size="small" style={{ width: 147 }}>
                      <Option value=""> 全部 </Option>
                      {
                        (factorys.length > 0) && factorys.map(factory =>
                          <Option
                            key={ factory.code}
                            value={factory.code}>{factory.code}-{factory.name} </Option>,
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={6} md={8} sm={12}>
                <FormItem label="品牌" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                  {getFieldDecorator('brandCode', { initialValue: '' })(
                    <Select placeholder="请选择" size="small" style={{ width: 147 }}>
                    <Option value=""> 全部 </Option>
                      {
                        (brands.length > 0) && brands.map(bramd =>
                          <Option
                            key={ bramd.code}
                            value={bramd.code}>{bramd.code}-{bramd.name} </Option>,
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>

            </Row>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={productReset}>
                  重置
                </Button>
              </div>
            </div>
          </Form>
          <Row>
            <Col span={18}>
              <StandardTable
                scroll={{ x: 2000 }}
                selectedRows= {productRows}
                loading={productLoading}
                data={procductList}
                columns={productColumns}
                onSelectRow={productSelectRows}
                onChange={productChange}
              />
            </Col>
            <Col span={6}>
            <StandardTable
                columns={proDetailColumns}
                data={procductList}
                selectedRows= {productRows}
                loading={productLoading}
                onSelectRow={productSelectRows}
                onChange={productChange}
              />
            </Col>
          </Row>

        </Modal>
      )
    }
  },
)
class PurchaseApply extends React.Component {
  allPartner = [
    {
      value: 96806578,
      text: '王二狗',
    },
    {
      value: 54056143,
      text: '李大郎',
    },
  ];

  constructor (props) {
    super(props);
    this.getRoles();
  }

  state = {
    loading: false,
    expandForm: false,
    selectedRows: [],
    data: {},
    applyNameModal: false,
    productModal: false,
    text: '',
    regions: [],
    offices: [],
    applyLoading: false,
    applyData: {},
    applyRows: [],
    productRows: [],
    getSalesRange: [],
    factorys: [],
    procductList: [],
    productLoading: false,
  };

  /** 第一次渲染之后调用 */
  componentDidMount(event) {
    this.handleSearch(event)
  }

  /** 自定义联动框 测试数据  */
  choseAddress = (value, selectedOptions) => {
    this.setState({
      text: selectedOptions.map(o => o.label).join(', '),
    });
  }

  /** 自定义联动框 测试数据 */
  getCode = () => ({
    filterDropdown: () => (
      <div style={{ padding: 30, paddingLeft: 5 }}>
        {this.state.text}
      </div>
    ),
    filterIcon: filtered => (
        <Cascader options={optionsTry} onChange={this.choseAddress} placeholder="请选择">
          <Icon type="filter" style={{ color: filtered ? '#1890ff' : undefined }} />
        </Cascader>
    ),
  });

  /** table数据源 */
  getData = allValue => {
    api.basic.getPurReqList(allValue).then(res => {
      this.setState({
        loading: false,
        data: {
          pagination: {
            pageSize: 10,
          },
          list: res.rows,
        },
      });
    })
  }

  choseApplyName = () => {
    this.getRegions();
    this.getOffices();
    this.setState({
      applyNameModal: true,
    });
  }

  choseProCode = () => {
    this.getSalesRange();
    this.getFactorys();
    this.setState({
      productModal: true,
    });
  }

  closeApplyNameModal = () => {
    this.setState({
      applyNameModal: false,
    });
  }

  closeProductModal = () => {
    this.setState({
      productModal: false,
    });
  }

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    // format rangeDataPicker
    // form.validateFields((err, fieldsValue) => {
    //   if (!err) {
    //     const rangeValue = fieldsValue['range-picker'];
    //     if (rangeValue[0] !== undefined) {
    //       const values = {
    //         ...fieldsValue,
    //         'range-picker': [rangeValue[0].format('YYYY-MM-DD'),
                    // rangeValue[1].format('YYYY-MM-DD')] 把这一行敲上去
    //     }
    //   }
    // })
    const allValue = form.getFieldsValue();
    this.setState({
      loading: true,
    });
    this.getData(allValue);
  };

  searchApplyName = e => {
    e.preventDefault();
    const { form } = this.formRef.props;
    const allValue = form.getFieldsValue();
    this.setState({
      applyLoading: true,
    });
    api.user.getUserList(allValue).then(data => {
      this.setState({
        applyLoading: false,
        applyData: {
          pagination: {
            pageSize: 10,
          },
          list: data.rows,
        },
      });
    })
  }

  searchProduct = e => {
    e.preventDefault();
    const { form } = this.procductRef.props;
    const allValue = form.getFieldsValue(['code', 'desc', 'edesc', 'oldCode', 'factory', 'brandCode']);
    this.setState({
      productLoading: true,
    });
    api.basic.getProducts(allValue).then(data => {
      this.setState({
        productLoading: false,
        procductList: {
          pagination: {
            pageSize: 10,
          },
          list: data,
        },
      });
    })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }

  applySelectRows = rows => {
    this.setState({
      applyRows: rows,
    });
  }

  productSelectRows = rows => {
    this.setState({
      productRows: rows,
    });
  }

  handleStandardTableChange = () => {
  }

  applyChange = () => {
  }

  productChange =() => {
  }

  applyReset = event => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.searchApplyName(event);
  }

  productReset = event => {
    const { form } = this.procductRef.props;
    form.resetFields();
    this.searchProduct(event);
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  preStateChange = value => {
    console.log(value);
  }

  getRoles = () => {
  }

  getRegions = () => {
    api.basic.getRegions().then(data => {
      this.setState({
        regions: data,
      });
    });
  }

  getOffices = () => {
    api.basic.getOffices().then(data => {
      this.setState({
        offices: data,
      });
    });
  }

  getSalesRange = () => {
    api.basic.getSalesRanges().then(data => {
      this.setState({
        getSalesRange: data,
      });
    });
  }

  getFactorys = () => {
    api.basic.getFactorys().then(data => {
      this.setState({
        factorys: data,
      });
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  }

  saveProductRef = formRef => {
    this.procductRef = formRef;
  }

  /** 部分筛选条件 */
  renderSimpleForm () {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="申请人">
              {getFieldDecorator('requestName')(
                <Search
                  placeholder="请输入"
                  onSearch={value => this.choseApplyName(value)}
                />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
          <FormItem label="申请日期">
              {getFieldDecorator('finishTime')(
                <RangePicker format="YYYY-MM-DD"/>,
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }

  /** 完整筛选条件 */
  renderAdvancedForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
        <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="申请人">
              {getFieldDecorator('requestName')(
                <Search
                  placeholder="请输入"
                  onSearch={value => this.choseApplyName(value)}
                />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
          <FormItem label="申请日期">
              {getFieldDecorator('finishTime')(
                <RangePicker />,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="物料号">
              {getFieldDecorator('productCode')(
                <Search
                  placeholder="请输入"
                  onSearch={value => this.choseProCode(value)}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="需求跟踪号">
              {getFieldDecorator('requirementTrackingNumber')(
                <Input placeholder="请输入"/>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="工厂">
              {getFieldDecorator('factoryCode')(
                <Input placeholder="请输入"/>,
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
    )
  }

  render() {
    const {
      loading,
      data,
      selectedRows,
      regions,
      offices,
      applyLoading,
      applyData,
      applyRows,
      productModal,
      getSalesRange,
      factorys,
      procductList,
      productLoading,
      productRows,
    } = this.state;
    const columns = [
      {
        title: '采购申请编号',
        dataIndex: 'code',
        ...this.getCode('code'),
      },
      {
        title: '采购申请项目编号',
        dataIndex: 'itemId',
      },
      {
        title: '采购申请凭证类型',
        dataIndex: 'prType',
      },
      {
        title: '删除标识',
        dataIndex: 'isDel',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '采购组',
        dataIndex: 'purchasingGroup',
      },
      {
        title: '创建人',
        dataIndex: 'createName',
      },
      {
        title: '申请人',
        dataIndex: 'requestName',
      },
      {
        title: '请求日期',
        dataIndex: 'requestDate',
      },
      {
        title: '物料号',
        dataIndex: 'productCode',
      },
      {
        title: '短文本',
        dataIndex: 'productName',
      },
      {
        title: '工厂',
        dataIndex: 'factoryCode',
      },
      {
        title: '库存地点',
        dataIndex: 'storageCode',
      },
      {
        title: '采购申请数量',
        dataIndex: 'requestCount',
      },
      {
        title: '采购申请单位',
        dataIndex: 'unit',
      },
      {
        title: '采购申请处理状态',
        dataIndex: 'processingStatus',
      },
      {
        title: '已采购数量',
        dataIndex: 'purchaseCount',
      },
    ]
    return (
      /** 表格渲染 */
      <PageHeaderWrapper title="采购申请">
        <Card bordered={false}>
        <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
            </div>
            <StandardTable
              scroll={{ x: 2500 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <ChoseApplyNameModel
            wrappedComponentRef = { this.saveFormRef }
            applyNameModal={this.state.applyNameModal}
            closeApplyNameModal={this.closeApplyNameModal}
            searchApplyName={this.searchApplyName}
            offices = { offices }
            regions = { regions }
            applyLoading = { applyLoading }
            applyData = { applyData }
            applySelectRows = { this.applySelectRows}
            applyChange = { this.applyChange }
            applyReset = { this.applyReset }
            applyRows = { applyRows }
          />
          <ChoseProductForm
            wrappedComponentRef = { this.saveProductRef }
            productModal = { productModal }
            closeProductModal = { this.closeProductModal }
            searchProduct = { this.searchProduct }
            getSalesRange = { getSalesRange }
            factorys = { factorys }
            productReset = { this.productReset }
            procductList = { procductList }
            productLoading = { productLoading }
            productSelectRows = { this.productSelectRows}
            productRows = { productRows }
            productChange = { this.productChange }
            />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(PurchaseApply);
