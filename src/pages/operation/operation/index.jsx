import { Card, Col, DatePicker, Form, Input, Select } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
// import _ from 'lodash';
import DetailsList from './components/details';
import api from '@/api';
import './style.less';
import TableSearchForm from '@/components/TableSearchForm';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Operation extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  initialValues = {
    page: 1,
    pageSize: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      list: [],
      loading: false,
      selectedRows: [],
      // expandForm: false,
      // editIndex: -1,
      // partnerVal: [],
    };
    // this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    const { languageCode } = this.props;
    api.operation.getOperationTypesAll({ languageCode }).then(res => {
      this.props.dispatch({
        type: 'operation/setRecordType',
        payload: res,
      });
    });
    this.getTableData(this.initialValues);
  }

  // 业务伙伴查询
  // callParter = value => {
  //   api.bp.getBPByCodeOrName({ code_or_name: value }).then(res => {
  //     this.setState({ partnerVal: res });
  //   });
  // };

  handleSearch = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.getTableData({ page: 1, ...val });
  };

  // 分页
  // handleStandardTableChange = (pagination, filtersArg) => {
  //   if (JSON.stringify(pagination) !== '{}') {
  //     this.getTableData({
  //       page: pagination.current,
  //       rows: pagination.pageSize,
  //       ...this.props.form.getFieldsValue(),
  //       ...filtersArg,
  //     });
  //   }
  // };
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    // const { languageCode } = this.props;
    const op = options;
    let newData = [];
    if (op.operationDate) {
      newData = {
        ...newData,
        operationDateBegin: op.operationDate[0].format('YYYY-MM-DD'),
        operationDateEnd: op.operationDate[1].format('YYYY-MM-DD'),
      };
      delete op.operationDate;
    }
    if (op.statusList) {
      newData = { ...newData, statusList: op.statusList.join(',') };
    }

    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize } = pagination;
    const data = {
      page,
      pageSize,
      languageCode: 'CN',
      ...formData,
      ...options,
      ...newData,
    };

    api.operation
      .getOperationRecords(data)
      .then(res => {
        this.setState({
          list: res.results,
          pagination: {
            current: data.page,
            pageSize: data.pageSize,
            total: res.total,
          },
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  // 业务伙伴筛选
  // eslint-disable-next-line consistent-return
  // inputValue = value => {
  //   const arr = [];
  //   if (!value) {
  //     return false;
  //   }
  //   this.callParter(value);
  //   this.state.partnerVal.forEach(item => {
  //     if (item.name.indexOf(value) !== -1) {
  //       arr.push(item);
  //     }
  //     if (item.code.indexOf(value) !== -1 && arr.indexOf(item)) {
  //       arr.push(item);
  //     }
  //   });
  //   this.setState({
  //     partnerVal: arr,
  //     // allowClear: 'ture',
  //   });
  // };

  // toggleForm = () => {
  //   const { expandForm } = this.state;
  //   this.setState({
  //     expandForm: !expandForm,
  //   });
  // };

  advancedForm = () => {
    const { languageCode, recordType } = this.props;
    return (
      <>
        {/* 操作记录类型 */}
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'operation.operation.operationType' })}
            name="operationTypeId"
          >
            <Select placeholder={formatMessage({ id: 'bp.pleaseSelect' })}>
              {/* <Select mode="multiple" showArrow> */}
              {recordType.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.describe}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        {/* 操作人编号 */}
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'operation.operatorNumber' })}
            name="operatorCode"
            className="fiveWord"
          >
            <Input />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'operation.operationTime' })} name="operationDate">
            <RangePicker style={{ width: '299px' }} />
          </FormItem>
        </Col>
      </>
    );
  };

  /** 部分筛选条件 */
  simpleForm = () => {
    const { languageCode } = this.props;
    return (
      <>
        {/* 编号 */}
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.customerID' })} name="code">
            <Input />
          </FormItem>
        </Col>
        {/* 来源编号 */}
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'operation.operation.sourceCode' })}
            name="sourceCode"
          >
            <Input />
          </FormItem>
        </Col>
        {/* 来源名称 */}
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 0}>
          <FormItem
            label={formatMessage({ id: 'operation.operation.sourceName' })}
            name="sourceName"
          >
            <Input />
          </FormItem>
        </Col>
        {/* <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <span className="submitButtons">
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'bp.maintain.search' })}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {formatMessage({ id: 'bp.maintain.reset' })}
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              {formatMessage({ id: 'bp.verification.open' })} <Icon type="down" />
            </a>
          </span>
        </Col> */}
      </>
    );
  };

  render() {
    const { pagination, list, loading, selectedRows } = this.state;
    const { languageCode } = this.props;
    const columns = [
      {
        title: formatMessage({ id: 'bp.customerID' }),
        dataIndex: 'code',
        width: 140,
      },
      {
        title: `${formatMessage({ id: 'operation.operation.sourceCode' })}/${formatMessage({
          id: 'operation.operation.sourceName',
        })}`,
        dataIndex: 'sourceCode',
        render(text, record) {
          return (
            <span style={{ color: '#222222' }}>
              <span>{text}</span> <br />
              <span style={{ color: '#999999' }}>{record.sourceName}</span>
            </span>
          );
        },
      },
      {
        title: formatMessage({ id: 'operation.actionTypePropertyDescription' }),
        dataIndex: 'operationTypeDescribe',
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
            <div className="tableListForm">
              <TableSearchForm
                ref={this.tableSearchFormRef}
                initialValues={this.initialValues}
                getTableData={this.getTableData}
                simpleForm={this.simpleForm}
                advancedForm={this.advancedForm}
              />
            </div>
            <div className="tableListOperator">
              {/* <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button> */}
            </div>
            <StandardTable
              scroll={{ x: 1000 }}
              selectedRows={selectedRows}
              loading={loading}
              data={{ list, pagination }}
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

export default connect(({ operation, global }) => ({
  recordType: operation.recordType,
  languageCode: global.languageCode,
}))(Operation);
