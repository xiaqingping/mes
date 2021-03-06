import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Row,
  Select,
  AutoComplete,
} from 'antd';
import * as React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import _ from 'lodash';
import api from '@/api';
import DetailsList from './components/details';
import './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

function renderOption(item) {
  return (
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
}

@connect(({ bp, global }) => ({
  operationStatus: bp.operationStatus,
  languageCode: global.languageCode,
}))
class Operation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        page: 1,
        pageSize: 10,
      },
      list: [],
      total: 0,
      loading: false,
      selectedRows: [],
      expandForm: false,
      detailsVisible: false,
      detailsValue: null,
      // editIndex: -1,
      typeValue: [],
      partnerVal: [],
    };
    this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    this.getTableData();
  }

  // 业务伙伴查询
  callParter = value => {
    api.bp.getBPByCodeOrName({ code_or_name: value }).then(res => {
      this.setState({ partnerVal: res });
    });
  };

  // 弹窗显示和详情数据保存
  showDrawer = (record, e) => {
    e.preventDefault();
    this.setState({
      detailsVisible: true,
      detailsValue: record,
    });
  };

  handleSearch = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.getTableData({ page: 1, ...val });
  };

  // 分页
  handleStandardTableChange = (pagination, filtersArg) => {
    if (JSON.stringify(pagination) !== '{}') {
      this.getTableData({
        page: pagination.current,
        rows: pagination.pageSize,
        ...this.props.form.getFieldsValue(),
        ...filtersArg,
      });
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const {
      formValues: { pageSize },
    } = this.state;
    // const query = Object.assign({}, { page: 1, pageSize }, options);
    let newData = [];
    if (options.wanchengshijian) {
      newData = {
        ...newData,
        beginFinishDate: options.wanchengshijian[0].format('YYYY-MM-DD'),
        endFinishDate: options.wanchengshijian[1].format('YYYY-MM-DD'),
      };
      // eslint-disable-next-line no-param-reassign
      delete options.wanchengshijian;
    }
    if (options.statusList) {
      newData = { ...newData, statusList: options.statusList.join(',') };
    }
    const query = Object.assign({}, { page: 1, pageSize }, options, newData);
    this.setState({
      formValues: query,
      loading: true,
    });
    api.bp
      .getOperationRecords(query)
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

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState({
      typeValue: [],
    });
  };

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  };

  // 展开还是收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 弹框关闭
  detailsVisibleClose = v => {
    this.setState({
      detailsVisible: v,
    });
  };

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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      languageCode,
    } = this.props;
    const { typeValue, partnerVal } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.customerID' })}>
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.operation.businessPartners' })}>
              {getFieldDecorator('bpId')(
                <AutoComplete
                  onSearch={this.inputValue}
                  dataSource={partnerVal.map(renderOption)}
                  placeholder={formatMessage({ id: 'bp.inputHere' })}
                  optionLabelProp="text"
                />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.operation.type' })}>
              {getFieldDecorator(
                'type',
                typeValue ? { initialValue: typeValue } : 'type',
              )(
                <Select placeholder={formatMessage({ id: 'bp.pleaseSelect' })}>
                  {/* <Select mode="multiple" showArrow> */}
                  <Option value="1">{formatMessage({ id: 'bp.operation.newlyBuild' })}</Option>
                  <Option value="2">{formatMessage({ id: 'bp.operation.modify' })}</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.operation.state' })}>
              {getFieldDecorator('statusList')(
                <Select
                  mode="multiple"
                  showArrow
                  placeholder={formatMessage({ id: 'bp.pleaseSelect' })}
                >
                  <Option value="1">{formatMessage({ id: 'bp.operation.unfinished' })}</Option>
                  <Option value="2">
                    {formatMessage({ id: 'bp.operation.partiallyCompleted' })}
                  </Option>
                  <Option value="3">{formatMessage({ id: 'bp.operation.finished' })}</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.operation.completionTime' })}>
              {getFieldDecorator('wanchengshijian')(<RangePicker />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'bp.operation.query' })}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {formatMessage({ id: 'bp.operation.reset' })}
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              {formatMessage({ id: 'bp.maintain.putAway' })} <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  /** 部分筛选条件 */
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      languageCode,
    } = this.props;
    const { typeValue, partnerVal } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.customerID' })}>
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.operation.businessPartners' })}>
              {getFieldDecorator('bpId')(
                <AutoComplete
                  onSearch={this.inputValue}
                  dataSource={partnerVal.map(renderOption)}
                  placeholder={formatMessage({ id: 'bp.inputHere' })}
                  optionLabelProp="text"
                />,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 0}>
            <FormItem label={formatMessage({ id: 'bp.operation.type' })}>
              {getFieldDecorator(
                'type',
                typeValue ? { initialValue: typeValue } : 'type',
              )(
                <Select placeholder={formatMessage({ id: 'bp.pleaseSelect' })}>
                  {/* <Select mode="multiple" showArrow> */}
                  <Option value="1">{formatMessage({ id: 'bp.operation.newlyBuild' })}</Option>
                  <Option value="2">{formatMessage({ id: 'bp.operation.modify' })}</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'bp.maintain.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'bp.maintain.reset' })}
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                {formatMessage({ id: 'bp.maintain.putAway' })} <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      formValues: { page: current, pageSize },
      list,
      total,
      loading,
      selectedRows,
      detailsVisible,
      detailsValue,
    } = this.state;
    const { operationStatus, languageCode } = this.props;
    const dataList = { list, pagination: { current, pageSize, total } };
    const columns = [
      {
        title: formatMessage({ id: 'bp.customerID' }),
        dataIndex: 'code',
        width: 140,
      },
      {
        title: formatMessage({ id: 'bp.operation.businessPartners' }),
        dataIndex: 'bpCode',
        render(text, record) {
          return (
            <span style={{ color: '#222222' }}>
              <Icon type={record.bpType === 1 ? 'user' : 'home'} /> {record.bpName} <br />
              <span style={{ color: '#999999' }}>{text}</span>
            </span>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.operation.type' }),
        dataIndex: 'type',
        width: 120,
        filters: [
          {
            value: '1',
            text: formatMessage({ id: 'bp.operation.newlyBuild' }),
          },
          {
            value: '2',
            text: formatMessage({ id: 'bp.operation.modify' }),
          },
        ],
        onFilter: (value, record) => record.type.toString().indexOf(value.toString()) === 0,
        render(text) {
          // eslint-disable-next-line max-len
          return text === 1
            ? formatMessage({ id: 'bp.operation.newlyBuild' })
            : formatMessage({ id: 'bp.operation.modify' });
        },
      },
      {
        title: formatMessage({ id: 'bp.operation.state' }),
        dataIndex: 'status',
        width: 200,
        filters: [
          {
            value: '1',
            text: formatMessage({ id: 'bp.operation.unfinished' }),
          },
          {
            value: '2',
            text: formatMessage({ id: 'bp.operation.partiallyCompleted' }),
          },
          {
            value: '3',
            text: formatMessage({ id: 'bp.operation.finished' }),
          },
        ],
        onFilter: (value, record) => record.status.toString().indexOf(value.toString()) === 0,
        render(val, record) {
          if (val) {
            return (
              <span>
                <Badge
                  status={operationStatus[val].value}
                  text={formatMessage({ id: operationStatus[val].i18n })}
                />
                <br />
                <span>{val === 3 ? record.finishDate : ''}</span>
              </span>
            );
          }
          return val;
        },
      },
      {
        title: formatMessage({ id: 'bp.operation.operator' }),
        dataIndex: 'operatorName',
        width: 100,
        className: 'marginLeft',
        render(val, record) {
          return (
            <span style={{ color: '#222222' }}>
              {val}
              <br />
              <span style={{ color: '#666666' }}>{record.operatorDate}</span>
            </span>
          );
        },
      },
      {
        fixed: 'right',
        title: formatMessage({ id: 'bp.operation.operation' }),
        width: 150,
        render: (text, record) => (
          <a onClick={e => this.showDrawer(record, e)}>
            {formatMessage({ id: 'menu.bp.maintain.details' })}
          </a>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false} className={languageCode === 'EN' ? 'mySet' : ''}>
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
              {/* <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button> */}
            </div>
            <StandardTable
              scroll={{ x: 1000 }}
              selectedRows={selectedRows}
              loading={loading}
              data={dataList}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <DetailsList
          detailsVisible={detailsVisible}
          detailsVisibleClose={v => {
            this.detailsVisibleClose(v);
          }}
          detailsValue={detailsValue}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Operation);
