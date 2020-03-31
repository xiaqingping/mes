import { Form, Card, Col, Input, Badge, DatePicker, Select, AutoComplete } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import _ from 'lodash';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import CheckModel from './components/CheckModel';
import styles from './index.less';
import api from '@/api';
import TableSearchForm from '@/components/TableSearchForm';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class Verification extends React.Component {
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
      selectedRows: [],
      list: [],
      record: [],
      type: null,
      loading: false,
      partnerVal: [],
    };
    this.callParter = _.debounce(this.callParter, 500);
  }

  /** 第一次渲染之后调用 */
  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  // 业务伙伴查询
  callParter = value => {
    api.bp.getBPByCodeOrName({ code_or_name: value }).then(res => {
      this.setState({ partnerVal: res });
    });
  };

  /** table数据源 */
  getTableData = (options = {}) => {
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

    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize } = pagination;
    const data = {
      page,
      pageSize,
      ...formData,
      ...options,
      ...newData,
    };

    api.bp
      .getVerifyRecords(data)
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

  /** 查询 */
  handleSearch = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.getTableData({ page: 1, ...val });
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
      this.getTableData({
        page: pagination.current,
        rows: pagination.pageSize,
        ...this.tableSearchFormRef.current.getFieldsValue(),
        ...filtersArg,
      });
    }
  };

  /** 筛选条件显示与隐藏 */
  // toggleForm = () => {
  //   const { expandForm } = this.state;
  //   this.setState({
  //     expandForm: !expandForm,
  //     // recordMsg: undefined,
  //   });
  // };

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    // this.setState({
    //   typeValue: [],
    // })
  };

  /** 渲染筛选条件 */
  // renderForm = () => {
  //   const { expandForm } = this.state;
  //   return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  // };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  renderOption = item => ({
    value: item.id,
    label: (
      // <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>
          <UserOutlined />
        </span>
        &nbsp;&nbsp;
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
      // </Option>
    ),
  });

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
  simpleForm = () => {
    const { languageCode, preTypeAll } = this.props;
    const { partnerVal } = this.state;
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.customerID' })} name="code">
            <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
        </Col>
        {/* <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
            <FormItem label={formatMessage({ id: 'bp.verification.operationCode' })}>
              {getFieldDecorator('bpOperationRecordCode')(
                <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />,
              )}
            </FormItem>
          </Col> */}
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.verification.businessPartner' })} name="bpId">
            <AutoComplete
              onSearch={this.inputValue}
              options={partnerVal.map(this.renderOption)}
              placeholder={formatMessage({ id: 'bp.inputHere' })}
              // optionLabelProp="text"
            />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 0}>
          <FormItem label={formatMessage({ id: 'bp.verification.type' })} name="type">
            <Select placeholder={formatMessage({ id: 'bp.pleaseSelect' })} optionLabelProp="label">
              {preTypeAll.map(state => (
                <Option
                  key={state.value}
                  value={state.value}
                  label={formatMessage({ id: state.i18n })}
                >
                  {formatMessage({ id: state.i18n })}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

  /** 完整筛选条件 */
  advancedForm = () => {
    const { preStateAll, languageCode } = this.props;

    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.verification.status' })} name="statusList">
            <Select
              mode="multiple"
              placeholder={formatMessage({ id: 'bp.pleaseSelect' })}
              optionLabelProp="label"
              maxTagCount={1}
              maxTagTextLength={3}
            >
              {preStateAll.map(state => (
                <Option
                  key={state.value}
                  value={state.value}
                  label={formatMessage({ id: state.i18n })}
                >
                  {formatMessage({ id: state.i18n })}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.verification.completeTime' })} name="finishTime">
            <RangePicker style={{ width: '100%' }} />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.verification.expiryDate' })} name="overTime">
            <DatePicker style={{ width: '100%' }} />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label={formatMessage({ id: 'bp.verification.apprpvalBy' })} name="finisherCode">
            <Input placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
        </Col>
      </>
    );
  };

  detailsValue = (record, type) => {
    this.setState({
      record,
      type,
    });
  };

  render() {
    const { pagination, list, selectedRows, loading, record, type } = this.state;
    const { preTypeAll, preStateAll, languageCode } = this.props;
    const preTypeAlls = [];
    const preStateAlls = [];
    preTypeAll.forEach(item => {
      preTypeAlls.push({ value: item.value, text: formatMessage({ id: item.i18n }) });
    });
    preStateAll.forEach(item => {
      preStateAlls.push({ value: item.value, text: formatMessage({ id: item.i18n }) });
    });
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
                {records.bpType === 1 ? <UserOutlined /> : <HomeOutlined />}
                <span>{records.bpName}</span>
              </div>
              <div className={styles.partCode}>{records.bpCode}</div>
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.verification.type' }),
        dataIndex: 'type',
        filters: preTypeAlls,
        width: 150,
        onFilter: (value, records) => records.type.toString().indexOf(value.toString()) === 0,
        render: value => formatMessage({ id: preTypeAll[value - 1].i18n }),
      },
      {
        title: formatMessage({ id: 'bp.verification.status' }),
        dataIndex: 'status',
        filters: preStateAlls,
        width: 150,
        onFilter: (value, records) => records.status.toString().indexOf(value.toString()) === 0,
        render(value, records) {
          return (
            <>
              <Badge
                status={preStateAll[value - 1].status}
                text={formatMessage({ id: preStateAll[value - 1].i18n })}
              />
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
            <div className="tableListForm">
              <TableSearchForm
                ref={this.tableSearchFormRef}
                initialValues={this.initialValues}
                getTableData={this.getTableData}
                simpleForm={this.simpleForm}
                advancedForm={this.advancedForm}
              />
            </div>
            <div className="tableListOperator" />
            <StandardTable
              scroll={{ x: 1300 }}
              selectedRows={selectedRows}
              loading={loading}
              data={{ list, pagination }}
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
          getData={this.getTableData}
          wrappedComponentRef={this.saveFormRef}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ bp, global }) => ({
  preTypeAll: bp.VerifyRecordType,
  preStateAll: bp.VerifyRecordStatus,
  languageCode: global.languageCode,
}))(Verification);
