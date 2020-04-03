// 任务模型
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Button, Card, Col, Tag, Select, Divider, Badge, Menu, Dropdown } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import TableSearchForm from '@/components/TableSearchForm';

import { connect } from 'dva';
import debounce from 'lodash/debounce';
import router from 'umi/router';
import { formatter, getOperates } from '@/utils/utils';
import api from '@/pages/project/api/taskmodel';
import TaskModelView from './taskModelView';
import StandardTable from '../components/StandardTable';
import { SelectUI } from '../components/AntdSearchUI';

const FormItem = Form.Item;
const { Option } = Select;

class TaskModel extends Component {
  tableSearchFormRef = React.createRef();

  initialValues = {
    page: 1,
    rows: 10,
  };

  // constructor(props) {
  //   super(props);

  // }

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

  operaList = [];

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  getTableData = (options = {}) => {
    this.setState({ loading: true });
    api.getTaskModels().then(res => {
      console.log(res);
      this.setState({
        list: res.rows,
        loading: false,
      });
    });
    // const formData = this.tableSearchFormRef.current.getFieldsValue();
    // console.log(formData);
    // const data = this.props.taskModel.taskModelList;
    // this.setState({
    //   list: data,
    //   pagination: {
    //     current: options.page,
    //     pageSize: options.rows,
    //     total: data.total,
    //   },
    //   loading: false,
    // });
  };

  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  // 任务模型当键盘敲下时候的值 在这里请求后台接口查询
  fetchSearchList = (v, type) => {
    // 根据不同的条目请求不同接口
    const taskModelSearchObj = {
      taskModel: 'searchTaskModel',
      publisher: 'searchPublisherName',
    };
    api[taskModelSearchObj[type]](v).then(res => {
      if (type === 'taskModel') {
        this.setState({
          taskModelOptions: res || [],
        });
      } else if (type === 'publisher') {
        this.setState({
          taskModelPublisherOptions: res || [],
        });
      }
    });
  };

  handleItemSearch = (v, type) => {
    console.log(v, type);
  };

  // 当 选择项目时候的值
  handleSearchChange = (value, type) => {
    const taskModelSearchObj = {
      taskModel: 'searchTaskModel',
      publisher: 'searchPublisherName',
    };
    api[taskModelSearchObj[type]](value).then(res => {
      console.log(res);
    });
    // console.log(value, type);
    // api.taskmodel.searchTaskModel();
  };

  simpleForm = () => {
    const { languageCode } = this.props;
    // 获取options TODO 看后台返回数据结果taskModelOptions
    const taskModelOptions = this.state.taskModelOptions.map(item => (
      <Option value={item.code} key={item.code}>
        {item.name}
      </Option>
    ));

    const taskModelPublisherOptions = this.state.taskModelPublisherOptions.map(item => (
      <Option value={item.code} key={item.code}>
        {item.name}
      </Option>
    ));
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="任务模型" name="code">
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
          data={this.props.taskModel.taskModelStatusOptions}
        />
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="发布人" name="publishName">
            <Select
              showSearch
              value={this.state.publisherName}
              placeholder="请输入"
              showArrow={false}
              filterOption={false}
              onSearch={v => this.fetchSearchList(v, 'publisher')}
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
    const { dispatch } = this.props;
    dispatch({
      type: 'taskModel/setViewId',
      payload: v.id,
    });
    this.setState({
      visible: true,
      viewId: v.id,
    });
  };

  fetchSearchList = debounce(this.fetchSearchList, 500);

  handleSearchChange = debounce(this.handleSearchChange, 500);

  render() {
    const { visible } = this.state;
    const { taskModel } = this.props;
    const { taskModelStatusOptions } = taskModel;
    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'codeAndName',
        key: 'codeAndName',
        render: (text, row) => (
          <div style={{ display: 'flex' }}>
            <img
              src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2912333032,1411506376&fm=26&gp=0.jpg"
              alt=""
              height="40"
              width="40"
              style={{ borderRadius: '2px' }}
            />
            <div style={{ marginLeft: 10 }}>
              <div style={{ color: '#545454' }}>{row.name}</div>
              <div style={{ color: '#888' }}>{row.code}</div>
            </div>
          </div>
        ),
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

        filters: taskModelStatusOptions,
        render: value => (
          // console.log(value);
          <>
            <Badge
              status={formatter(taskModelStatusOptions, value, 'value', 'status')}
              text={formatter(taskModelStatusOptions, value, 'value', 'label')}
            />
          </>
        ),
      },
      {
        title: '操作',

        fixed: 'right',
        render: value => {
          const text = value.status;
          const operaList = getOperates(text);
          const menu = (
            <Menu>
              {operaList.map(
                (item, index) =>
                  index && (
                    <Menu.Item key={index}>
                      <a
                        className="task_model_add_argument_list"
                        onClick={() => {
                          // this.toggleChildrenDrawer(true, item);
                        }}
                      >
                        {item}
                      </a>
                    </Menu.Item>
                  ),
              )}
            </Menu>
          );

          return (
            <>
              <a onClick={() => console.log(333)}>{operaList[0]}</a>
              <Divider type="vertical" />
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多
                  <DownOutlined />
                </a>
              </Dropdown>

              {/* {(text * 1 === 1 || text * 1 === 3) && <a onClick={() => console.log(333)}>发布</a>}
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
              <a onClick={() => this.viewDetails(value)}>查看</a> */}
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
