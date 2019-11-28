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
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import _ from 'lodash';
import DetailsList from './components/details';
import api from '@/api';

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

@connect(({ partnerMaintainEdit }) => ({ status: partnerMaintainEdit.operationStatus }))
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
    api.bp.getPartnerName({ code_or_name: value }).then(res => {
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

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { typeValue, partnerVal } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">{getFieldDecorator('code')(<Input />)}</FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="业务伙伴">
              {getFieldDecorator('bpId')(
                <AutoComplete
                  onSearch={this.inputValue}
                  dataSource={partnerVal.map(renderOption)}
                  placeholder="请输入"
                  optionLabelProp="text"
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator(
                'type',
                typeValue ? { initialValue: typeValue } : 'type',
              )(
                <Select>
                  {/* <Select mode="multiple" showArrow> */}
                  <Option value="1">新建</Option>
                  <Option value="2">修改</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('statusList')(
                <Select mode="multiple" showArrow>
                  <Option value="1">未完成</Option>
                  <Option value="2">部分完成</Option>
                  <Option value="3">已完成</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="完成时间">
              {getFieldDecorator('wanchengshijian')(<RangePicker />)}
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
    const { status } = this.props;
    const dataList = { list, pagination: { current, pageSize, total } };
    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 140,
      },
      {
        title: '业务伙伴',
        dataIndex: 'bpCode',
        render(text, record) {
          return (
            <span style={{ color: '#222222' }}>
              <Icon type="user" />
              {record.bpName} <br />
              <span style={{ color: '#999999' }}>{text}</span>
            </span>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 120,
        filters: [
          {
            value: '1',
            text: '新建',
          },
          {
            value: '2',
            text: '修改',
          },
        ],
        onFilter: (value, record) => record.type.toString().indexOf(value.toString()) === 0,
        render(text) {
          return text === 1 ? '新建' : '修改';
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 200,
        filters: [
          {
            value: '1',
            text: '未完成',
          },
          {
            value: '2',
            text: '部分完成',
          },
          {
            value: '3',
            text: '已完成',
          },
        ],
        onFilter: (value, record) => record.status.toString().indexOf(value.toString()) === 0,
        render(val, record) {
          return (
            <span>
              <Badge status={status[val].value} text={status[val].text} />
              <br />
              <span style={{ marginLeft: 85 }}>{val === 3 ? record.finishDate : ''}</span>
            </span>
          );
        },
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        width: 300,
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
        title: '操作',
        width: 150,
        render: (text, record) => <a onClick={e => this.showDrawer(record, e)}>查看</a>,
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderAdvancedForm()}</div>
            <div className="tableListOperator">
              {/* <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button> */}
            </div>
            <StandardTable
              scroll={{ x: 1300 }}
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
