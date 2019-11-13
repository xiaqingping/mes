import {
  Form,
  Card,
  Col,
  Row,
  Button,
  Icon,
  Input,
  Badge,
  DatePicker,
  Select,
} from 'antd';
import React, { Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import CheckModal from '@/components/CheckModal';
import styles from './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const preStateAll = [
  {
    value: 1,
    text: '已完成',
    status: 'success',
  },
  {
    value: 2,
    text: '验证中',
    status: 'warning',
  },
  {
    value: 3,
    text: '审核中',
    status: 'warning',
  },
]
  /** 类型数据 */
const preTypeAll = [
    {
      value: 1,
      text: '变更验证邮箱',
      status: 'warning',
    },
    {
      value: 2,
      text: '变更验证手机',
      status: 'warning',
    },
    {
      value: 3,
      text: '认证',
      status: 'warning',
    },
    {
      value: 4,
      text: '绑定售达方',
      status: 'warning',
    },
    {
      value: 5,
      text: '验证手机',
      status: 'warning',
    },
    {
      value: 6,
      text: '验证邮箱',
      status: 'warning',
    },
  ]
class Verification extends React.Component {
  /** table属性数据 */
  columns = [
    {
      title: '编号/操作编号',
      dataIndex: 'code',
      // width: 150,
      render (value, record) {
        return <><div>{value}</div><div>{record.operationRecordCode}</div></>
      },
    },
    // {
    //   title: '操作编号',
    //   dataIndex: 'actCode',
    // },
    {
      title: '业务伙伴',
      dataIndex: 'bpId',
      // width: 150,
      render(value, record) {
        return <>
          <div className={styles.partName}><Icon type="user" /> <span>{record.bpName}</span></div>
          <div className={styles.partCode}>{record.bpCode}</div>
        </>
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      filters: preTypeAll,
      // width: 150,
      render(value) {
        return <Badge status= {preTypeAll[value].status} text={preTypeAll[value].text} />
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: preStateAll,
      // width: 150,
      render(value, record) {
        return <>
        <Badge status={preStateAll[value].status} text={preStateAll[value].text} />
        <div>{record.operationDate}</div>
        </>
      },
    },
    // {
    //   title: '完成时间',
    //   dataIndex: 'finishTime',
    // },
    {
      title: '过期时间',
      dataIndex: 'expireDate',
      // width: 140,
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      render(value, record) {
        return <><div>{value}</div> <div>{record.operationDate}</div></>
      },
    },
    {
      fiexd: 'right',
      title: '操作',
      width: 150,
      render: (text, record) => {
        // const { preState } = record;
        // const check = <a href="#" onClick={ e => { this.verifyPartner(record, e) }}>审核</a>;
        // const view = <a href="#" onClick={ e => { this.checkPartner(record, e) }} >查看</a>;
        const view = <a href="#" onClick={ e => { this.checkShow.visibleShow(record, '01', true) }} >查看</a>;
        // const allAction = <Fragment><a href="#"
        // onClick={ e => { this.checkPartner(record, e) }}>查看</a><a herf="#"
        // onClick={ e => { this.verifyPartner(record, e) }}>审核</a></Fragment>;
        // if (preState === 2) {
        //   return allAction;
        // } if (preState === 1) {
        //   return view;
        // }
        //   return check;
        return view;
      },
    },
  ]

  /** 业务伙伴数据 */
  allPartner = [
    {
      value: 96806578,
      text: '王二狗',
    },
    {
      value: 54056143,
      text: '李大郎',
    },
  ]

  /** 类型数据 */
  // preType = [
  //   {
  //     value: 1,
  //     text: '变更验证邮箱',
  //   },
  //   {
  //     value: 2,
  //     text: '变更验证手机',
  //   },
  //   {
  //     value: 3,
  //     text: '认证',
  //   },
  //   {
  //     value: 4,
  //     text: '绑定售达方',
  //   },
  //   {
  //     value: 5,
  //     text: '验证手机',
  //   },
  //   {
  //     value: 6,
  //     text: '验证邮箱',
  //   },
  // ]

  /** 状态数据 */
  // preState = [
  //   {
  //     value: 1,
  //     text: '已完成',
  //     status: 'success',
  //   },
  //   {
  //     value: 2,
  //     text: '验证中',
  //     status: 'warning',
  //   },
  //   {
  //     value: 3,
  //     text: '审核中',
  //     status: 'warning',
  //   },
  // ]

  /** 状态 */
  state = {
    expandForm: false,
    selectedRows: [],
    data: {},
    allPartner: this.allPartner,
    inputPartner: undefined,
    showModal: false,
    recordMsg: undefined,
    clickType: '',
  };

  /** 第一次渲染之后调用 */
  componentDidMount() {
    this.getData();
  }

  /** table数据源 */
  getData = () => {
    const data = [];
    const { formValues } = this.state;
    console.log(formValues);
    for (let i = 0; i < 6; i++) {
      data.push({
        id: i + 1,
        code: 100000 + (i + 1),
        bpOperationRecordCode: 200000,
        operationRecordCode: 123456,
        bpName: `name${i}`,
        bpCode: '123456789',
        type: i,
        status: 2,
        expireDate: '2019-09-05 16:30:28',
        finishDate: '2019-09-06',
        operatorName: `张${i}`,
        operationDate: '2016-6-17 16:30:28',
      });
    }
    this.setState({
      data: {
        pagination: {
          pageSize: 10,
        },
        list: data,
      },
    });
  }

  /** 审核Table */
  verifyPartner = (record, event) => {
    event.preventDefault();
    this.setState({
      showModal: true,
      recordMsg: record,
      clickType: '02',
    });
  }

  /** 查看Table */
  checkPartner = (record, event) => {
    event.preventDefault();
    this.setState({
      showModal: true,
      recordMsg: record,
      clickType: '01',
    });
  }

  /** 查询 */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const allValue = form.getFieldsValue();
    console.log(allValue);
    this.setState({
      formValues: allValue,
    });
    this.getData();
  };

  /** 选中table事件 */
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /** 选中项发生变化时的回调 */
  handleStandardTableChange = () => {
    console.log(3);
  };

  /** 筛选条件显示与隐藏 */
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
      recordMsg: undefined,
    })
  }

  /** 渲染筛选条件 */
  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  /** 业务伙伴输入框查询 */
  searchPartner = value => {
    this.fetch(value, data => {
      this.setState({ allPartner: data })
    })
  };

  /** 请求业务伙伴数据 */
  fetch = (value, callback) => {
    if (value === '') return;
    callback([
      {
        value: 96806578,
        text: '王二狗',
      },
    ]);
  }

  /** 业务伙伴输入事件 */
  valueChange = value => {
    this.setState({ inputPartner: value })
  }

  /** 类型输入事件 */
  preTypeChange = value => {
    console.log(value);
  }

  /** 状态输入事件 */
  preStateChange = value => {
    console.log(value);
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  }

  /** 部分筛选条件 */
  renderSimpleForm () {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const options = this.state.allPartner.map(d =>
      <Option key={d.value}>
        <Fragment>
          <span> <Icon type="user" /> </span> &nbsp;&nbsp;
          <span> {d.value} </span> &nbsp;&nbsp;
          <span> {d.text} </span>
        </Fragment>
      </Option>,
    )
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="操作编号">
              {getFieldDecorator('bpOperationRecordCode')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="业务伙伴">
              {getFieldDecorator('bpId', { initialValue: this.state.inputPartner })(
                <Select
                 showSearch
                 placeholder="请输入"
                 defaultActiveFirstOption={false}
                 showArrow={false}
                 filterOption={false}
                 onSearch={this.searchPartner}
                 onChange={this.valueChange}
                 notFoundContent = { <a> 没有找到该业务伙伴 </a>}>
                    { options }
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
    const options = this.state.allPartner.map(d =>
      <Option key={d.value}>
        <Fragment>
          <span> <Icon type="user" /> </span>
          <span> {d.value} </span>
          <span> {d.text} </span>
        </Fragment>
      </Option>,
    )
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="操作编号">
              {getFieldDecorator('bpCode')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="业务伙伴">
            {getFieldDecorator('bpId', { initialValue: this.state.inputPartner })(
                <Select
                 showSearch
                 placeholder="请输入"
                 defaultActiveFirstOption={false}
                 showArrow={false}
                 filterOption={false}
                 onSearch={this.searchPartner}
                 onChange={this.valueChange}
                 notFoundContent = { <a> 没有找到该业务伙伴 </a>}>
                    { options }
                 </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  onChange={this.preTypeChange}
                  optionLabelProp="label">
                  {
                    preTypeAll.map(state => <Option
                              key={state.value}
                              value={state.value}
                              label={state.text}> {state.text}
                            </Option>)
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('statusList')(
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  onChange={this.preStateChange}
                  optionLabelProp="label">
                  {
                    preStateAll.map(state =>
                        <Option
                        key={state.value}
                        value={state.value}
                        label={state.text}>
                        {state.text}
                        </Option>)
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="完成时间">
              {getFieldDecorator('finishTime')(
                <RangePicker />,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="过期时间">
              {getFieldDecorator('overTime')(
                <DatePicker placeholder="请选择" style={{ width: '100%' }}/>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="审核人">
              {getFieldDecorator('approverCode')(
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
    const { data, selectedRows } = this.state;
    const loading = false;
    const { showModal, clickType, recordMsg } = this.state;
    return (
      <PageHeaderWrapper title="验证记录">
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible()}>
                新建
              </Button> */}
            </div>
            <StandardTable
              scroll={{ x: 1300 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              className={styles.dataTable}
            />
          </div>
        </Card>
        <CheckModal
          // showModal={showModal}
          // recordMsg={recordMsg}
          // clickType={clickType}
          onRef = { ref => {this.checkShow = ref}}
          wrappedComponentRef={this.saveFormRef}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Verification);
