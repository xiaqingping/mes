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
import { formatMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import CheckModel from './components/CheckModel';
import _ from 'lodash';
import styles from './index.less';
import api from '@/api';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ bp, global }) => ({
  preTypeAll: bp.VerifyRecordType,
  preStateAll: bp.VerifyRecordStatus,
  languageCode: global.languageCode,
}))
class Verification extends React.Component {
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
    api.bp.getBPByCodeOrName({ code_or_name: value }).then(res => {
      this.setState({ partnerVal: res });
    });
  };

  /** table数据源 */
  getData = (options = {}) => {
    const {
      formValues: { pageSize },
    } = this.state;
    let newData = [];

    if (options.statusList) {
      newData = { ...newData, statusList: options.statusList.join(',') };
    }

    if (options.wanchengshijian) {
      newData = {
        ...newData,
        beginFinishDate: options.wanchengshijian[0].format('YYYY-MM-DD'),
        endFinishDate: options.wanchengshijian[1].format('YYYY-MM-DD'),
      };
      // eslint-disable-next-line no-param-reassign
      delete options.wanchengshijian;
    }

    if (options.overTime) {
      newData = {
        ...newData,
        beginExpireDate: options.overTime[0].format('YYYY-MM-DD'),
        endExpireDate: options.overTime[1].format('YYYY-MM-DD'),
      };
      // eslint-disable-next-line no-param-reassign
      delete options.overTime;
    }
    const query = Object.assign({}, { page: 1, pageSize }, options, newData);
    this.setState({
      formValues: query,
      loading: true,
    });

    api.bp
      .getVerifyRecords(query)
      .then(res => {
        this.setState({
          list: res.results,
          total: res.total,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  /** 查询 */
  handleSearch = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.getData({ page: 1, ...val });
  };

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
        ...this.props.form.getFieldsValue(),
        ...filtersArg,
      });
    }
  };

  /** 筛选条件显示与隐藏 */
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
      // recordMsg: undefined,
    });
  };

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
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  renderOption = item => (
    <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>
          <Icon type="user" />
        </span>
        &nbsp;&nbsp;
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    </Option>
  );

  // 业务伙伴筛选
  // eslint-disable-next-line consistent-return
  inputValue = value => {
    const arr = [];
    if (!value) {
      return false;
    }
    this.callParter(value);
    this.state.partnerVal.forEach(item => {
      if (item.name.indexOf(value) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item)) {
        arr.push(item);
      }
    });
    this.setState({
      partnerVal: arr,
      // allowClear: 'ture',
    });
  };

  /** 部分筛选条件 */
  renderSimpleForm = () => {
    const { form, languageCode } = this.props;
    const { partnerVal } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.customerID' })}>
              {getFieldDecorator('code')(
                <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.operationCode' })}>
              {getFieldDecorator('bpOperationRecordCode')(
                <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.businessPartner' })}>
              {getFieldDecorator('bpId')(
                <AutoComplete
                  onSearch={this.inputValue}
                  dataSource={partnerVal.map(this.renderOption)}
                  placeholder={formatMessage({ id: 'bp.inputHere' })}
                  optionLabelProp="text"
                />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'bp.verification.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'bp.verification.reset' })}
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {formatMessage({ id: 'bp.verification.open' })} <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  /** 完整筛选条件 */
  renderAdvancedForm = () => {
    const {
      form: { getFieldDecorator },
      preTypeAll,
      preStateAll,
      languageCode,
    } = this.props;
    const { partnerVal } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.customerID' })}>
              {getFieldDecorator('code')(
                <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.operationCode' })}>
              {getFieldDecorator('bpCode')(
                <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.businessPartner' })}>
              {getFieldDecorator('bpId')(
                <AutoComplete
                  onSearch={this.inputValue}
                  dataSource={partnerVal.map(this.renderOption)}
                  placeholder={formatMessage({ id: 'bp.inputHere' })}
                  optionLabelProp="text"
                />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.type' })}>
              {getFieldDecorator('type')(
                <Select
                  placeholder={formatMessage({ id: 'bp.pleaseSelect' })}
                  optionLabelProp="label"
                >
                  {preTypeAll.map(state => (
                    <Option key={state.value} value={state.value} label={state.text}>
                      {' '}
                      {state.text}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.status' })}>
              {getFieldDecorator('statusList')(
                <Select
                  mode="multiple"
                  placeholder={formatMessage({ id: 'bp.pleaseSelect' })}
                  optionLabelProp="label"
                >
                  {preStateAll.map(state => (
                    <Option key={state.value} value={state.value} label={state.text}>
                      {state.text}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.completeTime' })}>
              {getFieldDecorator('finishTime')(<RangePicker />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.expiryDate' })}>
              {getFieldDecorator('overTime')(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.apprpvalBy' })}>
              {getFieldDecorator('finisherCode')(
                <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'bp.verification.search' })}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {formatMessage({ id: 'bp.verification.reset' })}
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              {formatMessage({ id: 'bp.verification.retract' })} <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  };

  detailsValue = (record, type) => {
    this.setState({
      record,
      type,
    });
  };

  render() {
    const {
      formValues: { page: current, pageSize },
      list,
      selectedRows,
      total,
      loading,
      record,
      type,
    } = this.state;
    const { preTypeAll, preStateAll, languageCode } = this.props;
    const data = { list, pagination: { current, pageSize, total } };
    const columns = [
      {
        title: `${formatMessage({ id: 'bp.customerID' })}
               /${formatMessage({ id: 'bp.verification.operationCode' })}`,
        dataIndex: 'code',
        // width: 150,
        // eslint-disable-next-line no-shadow
        render(value, record) {
          return (
            <>
              <div>{value}</div>
              <div>{record.bpOperationRecordCode}</div>
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.verification.businessPartner' }),
        dataIndex: 'bpId',
        // width: 150,
        render(value, records) {
          return (
            <>
              <div className={styles.partName}>
                <Icon type={records.bpType === 1 ? 'user' : 'home'} /> <span>{records.bpName}</span>
              </div>
              <div className={styles.partCode}>{records.bpCode}</div>
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.verification.type' }),
        dataIndex: 'type',
        filters: preTypeAll,
        width: 150,
        onFilter: (value, records) => records.type.toString().indexOf(value.toString()) === 0,
        render: value => preTypeAll[value - 1].text,
      },
      {
        title: formatMessage({ id: 'bp.verification.status' }),
        dataIndex: 'status',
        filters: preStateAll,
        width: 150,
        onFilter: (value, records) => records.status.toString().indexOf(value.toString()) === 0,
        render(value, records) {
          return (
            <>
              <Badge status={preStateAll[value - 1].status} text={preStateAll[value - 1].text} />
              {value === 1 ? '' : <div>{records.finishDate}</div>}
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.verification.expiryDate' }),
        dataIndex: 'expireDate',
        // width: 140,
      },
      {
        title: formatMessage({ id: 'bp.verification.operator' }),
        dataIndex: 'operatorName',
        render(value, records) {
          return (
            <>
              <div>{value}</div> <div>{records.operationDate}</div>
            </>
          );
        },
      },
      {
        fiexd: 'right',
        title: formatMessage({ id: 'bp.verification.operation' }),
        width: 150,
        fixed: 'right',
        render: (text, records) => {
          const view = (
            <a
              onClick={() => {
                this.checkShow.visibleShow(
                  records,
                  records.type,
                  true,
                  this.detailsValue(records, records.type),
                );
              }}
            >
              {formatMessage({ id: 'menu.bp.maintain.details' })}
            </a>
          );
          return view;
        },
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false} className={languageCode === 'EN' ? 'mySet' : ''}>
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator"></div>
            <StandardTable
              scroll={{ x: 1300 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CheckModel
          onRef={ref => {
            this.checkShow = ref;
          }}
          record={record}
          type={type}
          getData={this.getData}
          wrappedComponentRef={this.saveFormRef}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Verification);
