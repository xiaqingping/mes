// 任务模型
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Button, Card, Col, Tag, Select, Divider, Badge } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';

import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import router from 'umi/router';
import TaskModelView from './taskModelView';

import api from '@/api';
import StandardTable from '../components/StandardTable';
import { SelectUI } from '../components/AntdSearchUI';

const FormItem = Form.Item;
const { Option } = Select;

class TaskModel extends Component {
  tableSearchFormRef = React.createRef();

  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  constructor(props) {
    super(props);
    this.fetchSearchList = debounce(this.fetchSearchList, 500);
  }

  state = {
    name: '', // 搜素-任务模型值
    // 搜素-状态值
    publisherName: '', // 搜素-发布人值
    // 任务模型列表
    taskModelOptions: [],
    // 发布人列表
    taskModelPublisherOptions: [],
    loading: false,
    list: [],
    pagination: {},
    visible: false, // 点击查看抽屉是否显示
    viewId: '',
  };

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  getTableData = (options = {}) => {
    // this.setState({ loading: true });
    // const formData = this.tableSearchFormRef.current.getFieldsValue();
    // console.log(formData);
    const data = this.props.taskModel.taskModelList;
    this.setState({
      list: data,
      pagination: {
        current: options.page,
        pageSize: options.rows,
        total: data.total,
      },
      loading: false,
    });
  };

  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  // 当键盘敲下时候的值 在这里请求后台接口查询
  fetchSearchList = (v, type) => {
    // 根据不同的条目请求不同接口
    const taskModelSearchObj = {
      taskModel: 'searchTaskModel',
      publisher: 'searchPublisherName',
    };
    // api.taskModel.searchTaskModel(v);
    api.taskModel[taskModelSearchObj[type]](v);
  };

  // 当 选择项目时候的值

  handleSearchChange = (value, type) => {
    console.log(value, type);
  };

  simpleForm = () => {
    const { languageCode } = this.props;
    // 获取options TODO 看后台返回数据结果taskModelOptions
    const taskModelOptions = this.state.taskModelOptions.map(item => <Option>{item.label}</Option>);

    const taskModelPublisherOptions = this.state.taskModelPublisherOptions.map(item => (
      <Option>{item.label}</Option>
    ));
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="任务模型">
            <Select
              showSearch
              value={this.state.name}
              placeholder="请输入"
              showArrow={false}
              filterOption={false}
              // TODO这个方法需要进行封装， 传参
              onSearch={v => this.fetchSearchList(v, 'taskModel')}
              onChange={v => this.handleSearchChange(v, 'taskModel')}
              // notFoundContent={null}
            >
              {taskModelOptions}
            </Select>
          </FormItem>
        </Col>
        <SelectUI
          languageCode={languageCode}
          label="状态"
          name="status"
          data={this.props.taskModel.statusList}
        />
        {/* <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="状态">
            <Select
              showSearch
              value={this.state.status}
              placeholder="请输入"
              showArrow={false}
              filterOption={false}
              // TODO这个方法需要进行封装， 传参
              onSearch={v => this.fetchSearchList(v, 'status')}
              onChange={v => this.handleSearchChange(v, 'status')}
              // notFoundContent={null}
            >
              {taskModelStatusOptions}
            </Select>
          </FormItem>
        </Col> */}
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="发布人">
            <Select
              showSearch
              value={this.state.publisherName}
              placeholder="请输入"
              showArrow={false}
              filterOption={false}
              onSearch={v => this.handleItemSearch(v, 'taskModel')}
              onChange={v => this.handleSearchChange(v, 'publisher')}
              // notFoundContent={null}
            >
              {taskModelPublisherOptions}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

  advancedForm = () => {
    // const { languageCode } = this.props;
    // return <div></div>;
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  // 新建模型

  handleAdd = () => {
    router.push('/project/task-model/add');
  };

  goToEdit = id => {
    router.push(`/project/task-model/edit/${id}`);
  };

  viewDetails = v => {
    console.log('object');
    this.setState({
      visible: true,
      viewId: v.id,
    });
  };

  render() {
    const { visible } = this.state;
    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'codeAndName',
        key: 'codeAndName',
        render: (text, row) => {
          return (
            <div style={{ display: 'flex' }}>
              <img
                src="http://img1.imgtn.bdimg.com/it/u=1828061713,3436718872&fm=26&gp=0.jpg"
                alt=""
                height="50"
                width="50"
                style={{ borderRadius: '2px' }}
              />
              <div style={{ marginLeft: 10 }}>
                <h4 style={{ color: '#545454' }}>{row.name}</h4>
                <div style={{ color: '#888' }}>{row.code}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '描述',
        dataIndex: 'describe',
        key: 'describe',
      },
      {
        title: '发布人/时间',
        dataIndex: 'publisherAndPublishTime',
        key: 'publisherAndPublishTime',
        render: (value, row) => (
          <>
            {row.publisherName}
            <br />
            {row.publishDate}
          </>
        ),
      },
      {
        title: '版本',
        key: 'version',
        dataIndex: 'version',
        render: value => (
          <>
            <Tag color="green">{value}</Tag>
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '80px',
        render: value => {
          try {
            const { taskModel } = this.props;
            const { statusObj } = taskModel;
            return (
              <>
                <Badge status={statusObj[value].badgeStatus} text={statusObj[value].label} />
              </>
            );
          } catch (error) {
            return console.log(error);
          }
        },
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: value => {
          const text = value.status;

          return (
            <>
              {(text * 1 === 1 || text * 1 === 3) && <a onClick={() => console.log(333)}>发布</a>}
              {text * 1 === 1 && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => this.goToEdit(value.id)}>修改</a>
                </>
              )}
              {(text * 1 === 2 || text * 1 === 3) && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => console.log(111)}>升级</a>
                </>
              )}
              {(text * 1 === 2 || text * 1 === 4) && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => console.log(111)}>禁用</a>
                </>
              )}
              {text * 1 === 1 && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => console.log(111)}>删除</a>
                </>
              )}
              <Divider type="vertical" />
              <a onClick={() => this.viewDetails(value)}>查看</a>
            </>
          );
        },
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
    const { loading, list, pagination, viewId } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} className="taskmodel">
          <div className="tableList">
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
              advancedForm={this.advancedForm}
            />
            <div className="tableListOperator">
              <Button type="primary" onClick={() => this.handleAdd()}>
                <PlusOutlined />
                新建
              </Button>
            </div>
            <StandardTable
              scroll={{ x: tableWidth }}
              rowClassName="editable-row"
              selectedRows=""
              loading={loading}
              data={{ list, pagination }}
              columns={columns}
              // onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              // expandable={{
              //   // 用方法创建子table
              //   expandedRowRender: value => expandedRowRender(value.list, sonTablecolumns),
              //   rowExpandable: record => !!record.list,
              // }}
            />
          </div>
        </Card>
        <TaskModelView visible={visible} onClose={this.onClose} viewId={viewId} />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ taskModel, global }) => ({
  taskModel,
  languageCode: global.languageCode,
}))(TaskModel);
