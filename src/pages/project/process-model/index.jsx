// 流程模型
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Divider,
  Form,
  Col,
  AutoComplete,
  Avatar,
  Tag,
  Badge,
  Select,
  Input,
} from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import _ from 'lodash';
import { DateUI } from '@/pages/project/components/AntdSearchUI';
import { formatter } from '@/utils/utils';
import api from '@/pages/project/api/processModel/';
import StandardTable from '../components/StandardTable';
import { DrawerTool } from './components/Details';

const FormItem = Form.Item;
const { Option } = Select;
class ProcessModel extends Component {
  tableSearchFormRef = React.createRef();

  // 顶部表单默认值
  initialValues = {
    page: 1,
    rows: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      loading: false,
      visible: false,
      detailValue: {},
      nameCodeVal: [],
      nameCodeValPublish: [],
    };
    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
    this.callPublish = _.debounce(this.callPublish, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  callParter = value => {
    api.getProcessCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  callPublish = value => {
    api.getProcessPublisherCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current.getFieldsValue();

    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;

    let newData = [];
    if (formData.status) {
      newData = { ...newData, status: formData.status.join(',') };
      delete formData.status;
    }

    if (formData.publishDate) {
      newData = {
        ...newData,
        publishBeginDate: formData.publishDate[0].format('YYYY-MM-DD'),
        publicEndDate: formData.publishDate[1].format('YYYY-MM-DD'),
      };
      delete formData.publishDate;
    }
    const data = {
      page,
      rows,
      ...newData,
      ...formData,
      ...options,
    };
    api.getProcess(data).then(res => {
      this.setState({
        list: res.rows,
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
      });
    });
  };

  renderOption = item => ({
    value: item.code,
    label: (
      // <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
      // </Option>
    ),
  });

  // 筛选值
  inputValue = value => {
    const { nameCodeVal } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callParter(value);
    if (nameCodeVal.length === 0) {
      return false;
    }
    nameCodeVal.forEach(item => {
      if (item.name.indexOf(value) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item)) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeVal: arr,
      // allowClear: 'ture',
    });
    return true;
  };

  renderOptionPublish = item => ({
    value: item.publisherCode,
    label: (
      // <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.publisherName}</span>
      </div>
      // </Option>
    ),
  });

  // 筛选值
  inputValuePublish = value => {
    const { nameCodeValPublish } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callPublish(value);
    if (nameCodeValPublish.length === 0) {
      return false;
    }
    nameCodeValPublish.forEach(item => {
      if (item.name.indexOf(value) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item)) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeValPublish: arr,
      // allowClear: 'ture',
    });
    return true;
  };

  // 分页
  handleStandardTableChange = (pagination, filters) => {
    // 获取搜索值
    console.log(filters);
    // this.getTableData({
    //   page: pagination.current,
    //   rows: pagination.pageSize,
    // });
  };

  simpleForm = () => {
    const { languageCode, status } = this.props;
    const { nameCodeVal } = this.state;
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="流程模型" name="code">
            <AutoComplete
              onSearch={this.inputValue}
              options={nameCodeVal.map(this.renderOption)}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              // optionLabelProp="text"
            />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="状态" name="status">
            <Select mode="multiple" maxTagCount={2} maxTagTextLength={3}>
              {status.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="发布人" name="publisherCode">
            <AutoComplete
              onSearch={this.inputValuePublish}
              options={nameCodeVal.map(this.renderOptionPublish)}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              placeholder="发布人"
            />
          </FormItem>
        </Col>
      </>
    );
  };

  /** 完整筛选条件 */
  advancedForm = () => {
    const { languageCode } = this.state;
    return (
      <DateUI
        languageCode={languageCode}
        label="发布时间"
        name="publishDate"
        placeholder={['开始时间', '结束时间']}
      />
    );
  };

  // 新增
  handleAdd = () => {
    console.log('新增');
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 更换版本
  handleChangeVersion = v => {
    api.getProcessChangeVersion(v).then(res => {
      this.setState({
        detailValue: res,
      });
    });
  };

  // 新建
  handleModalVisible = () => {
    router.push('/project/process-model/add');
  };

  // 升级
  upgrade = value => {
    router.push(`/project/process-model/edit/${value.id}`);
  };

  // 查看详情
  searchDetails = value => {
    api.getProcessDetail(value.id).then(res => {
      this.setState({
        visible: true,
        detailValue: res,
      });
    });
  };

  render() {
    const { pagination, list, loading, visible, detailValue } = this.state;
    const { status } = this.props;
    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        render: (value, row) => (
          <>
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              style={{ float: 'left' }}
              size="large"
            />
            <div style={{ float: 'left' }}>
              <div>{value}</div>
              <div>{row.name}</div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
      {
        title: '发布人/时间',
        dataIndex: 'publisherName',
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.publishDate}</div>
          </>
        ),
      },
      {
        title: '版本',
        dataIndex: 'version',
        render: () => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            V1.0
          </Tag>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: status,
        render: value => (
          <Badge
            status={formatter(status, value, 'value', 'status')}
            text={formatter(status, value, 'value', 'text')}
          />
        ),
      },
      {
        title: '操作',
        width: 200,
        render: value => (
          <>
            <a onClick={() => console.log(111)}>变更</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(111)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(111)}>升级</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(111)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.searchDetails(value)}>查看</a>
          </>
        ),
      },
    ];

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
              advancedForm={this.advancedForm}
            />
            <div className="tableListOperator">
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                <PlusOutlined />
                新建
              </Button>
            </div>
            <Form ref={this.tableFormRef}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                selectedRows=""
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                // expandable={{
                //   // 用方法创建子table
                //   expandedRowRender: value => expandedRowRender(value.list, sonTablecolumns),
                //   rowExpandable: record => !!record.list,
                // }}
              />
            </Form>
            <DrawerTool
              visible={visible}
              // visible
              onClose={this.onClose}
              detailValue={detailValue}
              status={status}
              handleChangeVersion={v => this.handleChangeVersion(v)}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, processModel, project }) => ({
  languageCode: global.languageCode,
  processModel,
  status: project.status,
}))(ProcessModel);
