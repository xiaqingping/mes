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
  AutoComplete,
} from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import CheckModel from './components/CheckModel';
import _ from 'lodash';
import styles from './index.less';
import api from '@/api';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ partnerMaintainEdit }) => ({
  preTypeAll: partnerMaintainEdit.VerifyRecordType,
  preStateAll: partnerMaintainEdit.VerifyRecordStatus,
}))
class Verification extends React.Component {
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


  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
      list: [],
      total: 0,
      record: [],
      type: null,
      loading: false,
      formValues: {
        page: 1,
        pageSize: 10,
      },
      partnerVal: [],
    };
    this.callParter = _.debounce(this.callParter, 500);
  }

  /** 第一次渲染之后调用 */
  componentDidMount() {
    this.getData();
  }

  // 业务伙伴查询
  callParter = value => {
    api.bp.getPartnerName({ code_or_name: value })
    .then(res => { this.setState({ partnerVal: res }) })
  }

  /** table数据源 */
  getData = (options = {}) => {
    const { formValues: { pageSize } } = this.state;
    let newData = [];

    if (options.statusList) {
      newData = { ...newData, statusList: options.statusList.join(',') }
    }

    if (options.wanchengshijian) {
      newData = {
        ...newData,
        beginFinishDate: options.wanchengshijian[0].format('YYYY-MM-DD'),
        endFinishDate: options.wanchengshijian[1].format('YYYY-MM-DD'),
      }
      // eslint-disable-next-line no-param-reassign
      delete options.wanchengshijian
    }

    if (options.overTime) {
      newData = {
        ...newData,
        beginExpireDate: options.overTime[0].format('YYYY-MM-DD'),
        endExpireDate: options.overTime[1].format('YYYY-MM-DD'),
      }
      // eslint-disable-next-line no-param-reassign
      delete options.overTime
    }
    const query = Object.assign({}, { page: 1, pageSize }, options, newData);
    this.setState({
      formValues: query,
      loading: true,
    });

    api.bp.getVerifyRecords(query).then(res => {
      this.setState({
        list: res.results,
        total: res.total,
        loading: false,
      });
    }).catch(() => {
      this.setState({
        loading: false,
      })
    });
  }

  /** 查询 */
  handleSearch = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.getData({ page: 1, ...val });
  }

  /** 选中table事件 */
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /** 选中项发生变化时的回调 */
  handleStandardTableChange = (pagination, filtersArg) => {
    if (JSON.stringify(pagination) !== '{}') {
      this.getData({
        page: pagination.current,
        rows: pagination.pageSize,
        ...filtersArg,
      });
    }
  }

  /** 筛选条件显示与隐藏 */
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
      // recordMsg: undefined,
    })
  }

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    // this.setState({
    //   typeValue: [],
    // })
  };

  /** 渲染筛选条件 */
  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  }

  renderOption = item => (
      <Option key={item.id} text={item.name}>
        <div style={{ display: 'flex' }}>
          <span><Icon type="user" /></span>&nbsp;&nbsp;
          <span>{item.code}</span>&nbsp;&nbsp;
          <span>{item.name}</span>
        </div>
      </Option>
    )

      // 业务伙伴筛选
  // eslint-disable-next-line consistent-return
  inputValue = value => {
    const arr = []
    if (!value) {
      return false
    }
    this.callParter(value)
    this.state.partnerVal.forEach(item => {
      if (item.name.indexOf(value) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item)) { arr.push(item); }
    })
    this.setState({
      partnerVal: arr,
      // allowClear: 'ture',
    });
  }

  /** 部分筛选条件 */
  renderSimpleForm = () => {
    const { form } = this.props;
    const { partnerVal } = this.state;
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
            <FormItem label="操作编号">
              {getFieldDecorator('bpOperationRecordCode')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
          <FormItem label="业务伙伴">
              {getFieldDecorator('bpId')(
              <AutoComplete
                onSearch={this.inputValue}
                dataSource={partnerVal.map(this.renderOption)}
                placeholder="请输入"
                optionLabelProp="text"
                />)}
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
      form: { getFieldDecorator }, preTypeAll, preStateAll,
    } = this.props;
    const { partnerVal } = this.state;

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
              {getFieldDecorator('bpId')(
              <AutoComplete
                onSearch={this.inputValue}
                dataSource={partnerVal.map(this.renderOption)}
                placeholder="请输入"
                optionLabelProp="text"
                />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select
                  placeholder="请选择"
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

  detailsValue = (record, type) => {
    this.setState({
      record,
      type,
    })
  }

  render() {
    const { formValues: { page: current, pageSize },
    list, selectedRows, total, loading, record, type } = this.state;
    const { preTypeAll, preStateAll } = this.props
    const data = { list, pagination: { current, pageSize, total } };
    const columns = [
      {
        title: '编号/操作编号',
        dataIndex: 'code',
        // width: 150,
        // eslint-disable-next-line no-shadow
        render (value, record) {
          return <><div>{value}</div><div>{record.bpOperationRecordCode}</div></>
        },
      },
      {
        title: '业务伙伴',
        dataIndex: 'bpId',
        // width: 150,
        // eslint-disable-next-line no-shadow
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
        width: 150,
        // eslint-disable-next-line no-shadow
        onFilter: (value, record) => record.type.toString().indexOf(value.toString()) === 0,
        render: value => preTypeAll[value - 1].text,
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: preStateAll,
        width: 150,
        // eslint-disable-next-line no-shadow
        onFilter: (value, record) => record.status.toString().indexOf(value.toString()) === 0,
        // eslint-disable-next-line no-shadow
        render(value, record) {
          return <>
          <Badge status={preStateAll[value - 1].status} text={preStateAll[value - 1].text} />
          {value === 2 ? <div>{record.operationDate}</div> : ''}
          </>
        },
      },
      {
        title: '完成时间',
        dataIndex: 'finishTime',
      },
      {
        title: '过期时间',
        dataIndex: 'expireDate',
        // width: 140,
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        // eslint-disable-next-line no-shadow
        render(value, record) {
          return <><div>{value}</div> <div>{record.operationDate}</div></>
        },
      },
      {
        fiexd: 'right',
        title: '操作',
        width: 150,
        fixed: 'right',
        // eslint-disable-next-line no-shadow
        render: (text, record) => {
          // const { preState } = record;
          // const check = <a href="#" onClick={ e => { this.verifyPartner(record, e) }}>审核</a>;
          // const view = <a href="#" onClick={ e => { this.checkPartner(record, e) }} >查看</a>;
          const view = <a href="#" onClick={ () => {
            this.checkShow.visibleShow(record, record.type, true,
              this.detailsValue(record, record.type))
          }} >查看</a>;
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
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              className={styles.dataTable}
            />
          </div>
        </Card>
        <CheckModel
          onRef = { ref => { this.checkShow = ref }}
          record = {record}
          type = {type}
          wrappedComponentRef={this.saveFormRef}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Verification);
