import { Card, Col, Form, Input } from 'antd';
import * as React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
// import _ from 'lodash';
import DetailsList from './components/details';
import TableSearchForm from '@/components/TableSearchForm';
import api from '@/api';
import './style.less';

const FormItem = Form.Item;

class Operation extends React.Component {
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
      // editIndex: -1,
      // partnerVal: [],
    };
    // this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  // 业务伙伴查询
  // callParter = value => {
  //   api.bp.getBPByCodeOrName({ code_or_name: value }).then(res => {
  //     this.setState({ partnerVal: res });
  //   });
  // };

  // handleSearch = e => {
  //   if (e) e.preventDefault();
  //   const val = this.props.form.getFieldsValue();
  //   this.getTableData({ page: 1, ...val });
  // };

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
    // const {
    //   formValues: { pageSize },
    // } = this.state;

    // const query = Object.assign({}, { page: 1, pageSize, languageCode: 'CN' }, options);
    // this.setState({
    //   formValues: query,
    //   loading: true,
    // });
    // const { languageCode } = this.props;
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
    };

    api.operation
      .getOperationTypes(data)
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

  /** 部分筛选条件 */
  simpleForm = () => {
    const { languageCode } = this.props;
    // const formItemLayout = {
    //   labelCol: { span: 16 },
    //   wrapperCol: { span: 8, offset: 1 },
    // };
    return (
      <>
        <Col xxl={8} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'operation.operationType.actionRecordTypeNumber' })}
            name="code"
            className="eightWord"
          >
            <Input />
          </FormItem>
        </Col>
        <Col xxl={8} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem
            label={formatMessage({ id: 'operation.operationType.descriptionOfActionRecordType' })}
            name="describe"
            className="eightWord"
          >
            <Input />
          </FormItem>
        </Col>
      </>
    );
  };

  render() {
    const { pagination, list, loading, selectedRows } = this.state;
    const { languageCode } = this.props;
    // const dataList = { list, pagination: { current, pageSize, total } };
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
            <div className="tableListForm">
              {' '}
              <TableSearchForm
                ref={this.tableSearchFormRef}
                initialValues={this.initialValues}
                getTableData={this.getTableData}
                simpleForm={this.simpleForm}
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

export default connect(({ global }) => ({
  // status: operation.operationStatus,
  languageCode: global.languageCode,
}))(Operation);
