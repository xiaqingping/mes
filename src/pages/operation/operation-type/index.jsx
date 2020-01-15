import { Button, Card, Col, Form, Input, Row } from 'antd';
import * as React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import _ from 'lodash';
import DetailsList from './components/details';
import api from '@/api';
import './style.less';

const FormItem = Form.Item;

@connect(({ operation, global }) => ({
  status: operation.operationStatus,
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
      // editIndex: -1,
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

    const query = Object.assign({}, { page: 1, pageSize, languageCode: 'CN' }, options);
    this.setState({
      formValues: query,
      loading: true,
    });
    api.operation
      .getOperationTypes(query)
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

  /** 部分筛选条件 */
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      languageCode,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 16 },
      wrapperCol: { span: 8, offset: 1 },
    };
    return (
      <Form onSubmit={this.handleSearch} {...formItemLayout} layout="inline" className="longLabel">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={8} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem
              label={formatMessage({ id: 'operation.operationType.actionRecordTypeNumber' })}
            >
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={8} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem
              label={formatMessage({ id: 'operation.operationType.descriptionOfActionRecordType' })}
            >
              {getFieldDecorator('describe')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={8} lg={languageCode === 'EN' ? 12 : 8}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'bp.maintain.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {formatMessage({ id: 'bp.maintain.reset' })}
              </Button>
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
    } = this.state;
    const { languageCode } = this.props;
    const dataList = { list, pagination: { current, pageSize, total } };
    const columns = [
      {
        title: formatMessage({ id: 'bp.customerID' }),
        dataIndex: 'code',
      },
      {
        title: formatMessage({ id: 'operation.operationType.descriptionOfActionRecordType' }),
        dataIndex: 'describe',
        render(text) {
          return (
            <div
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
              title={text}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: `${formatMessage({ id: 'operation.operatorNumber' })}/${formatMessage({
          id: 'operation.operatorName',
        })}`,
        dataIndex: 'operatorCode',
        render(text, record) {
          return (
            <span style={{ color: '#222222' }}>
              <span>{text}</span> <br />
              <span style={{ color: '#999999' }}>{record.operatorName}</span>
            </span>
          );
        },
      },
      {
        title: formatMessage({ id: 'operation.operationTime' }),
        dataIndex: 'operationDate',
      },
      {
        fixed: 'right',
        title: formatMessage({ id: 'action.operation' }),
        width: 150,
        render: (text, record) => (
          <a
            onClick={() => {
              this.DetailsList.passData(true, record);
            }}
          >
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
          onRef={ref => {
            this.DetailsList = ref;
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Operation);
