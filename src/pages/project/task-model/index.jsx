// 任务模型
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Form,
  Button,
  Card,
  Col,
  Tag,
  Select,
  Divider,
  Badge,
  Menu,
  Dropdown,
  AutoComplete,
  Spin,
  message,
  Modal,
  Avatar,
} from 'antd';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TableSearchForm from '@/components/TableSearchForm';
import { DateUI } from '@/pages/project/components/AntdSearchUI';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import router from 'umi/router';
import { formatter, getOperates } from '@/utils/utils';
import api from '@/pages/project/api/taskmodel';
import TaskModelView from './taskModelView';
import StandardTable from '../components/StandardTable';
import disk from '@/pages/project/api/disk';

const FormItem = Form.Item;
const { Option } = Select;

class TaskModel extends Component {
  tableSearchFormRef = React.createRef();

  initialValues = {
    page: 1,
    rows: 10,
  };

  operaList = [];

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      pagination: {},
      visible: false, // 点击查看抽屉是否显示
      viewId: '',
      nameCodeVal: [],
      nameCodeValPublish: [],
      filtersData: null,
    };
    this.callParter = debounce(this.callParter, 500);
    this.callPublish = debounce(this.callPublish, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  getTableData = (options = {}) => {
    const { pagination } = this.state;
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    const { current: page, pageSize: rows } = pagination;
    let newData = [];
    console.log(formData);
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
    console.log(data);
    api
      .getTaskModels(data)
      .then(res => {
        const uuids = (res.rows || []).map(e => e.picture);
        disk
          .getFiles({
            sourceCode: uuids.join(','),
            sourceKey: 'project_task_model',
          })
          .then(v => {
            const newList = (res.rows || []).map(e => {
              const filterItem = (v || []).filter(item => item.sourceCode === e.picture) || [];
              const fileId = filterItem[0] && filterItem[0].id;
              return {
                ...e,
                fileId,
              };
            });
            this.setState({
              list: newList,
            });
          });
        this.setState({
          // list: res.rows,
          pagination: {
            current: data.page,
            pageSize: data.rows,
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

  // 筛选状态
  handleStandardTableChange = (pagination, filters) => {
    const { filtersData } = this.state;
    let filterData = {};
    const page = pagination;
    if (filters) {
      if (filters.status && filters.status[0]) {
        filterData.status = filters.status.join(',');
      }
      this.setState({
        filtersData: filterData,
      });
      page.current = 1;
      page.pageSize = 10;
    } else if (filtersData) {
      filterData = filtersData;
    }

    this.getTableData({
      page: page.current,
      rows: page.pageSize,
      ...filterData,
    });
  };

  // ------------------------------------------------------------------------
  callParter = value => {
    console.log(value);

    api.searchTaskModel(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  callPublish = value => {
    api.searchPublisherName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  // -------------------------------------------------------------------------

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
      if (item.name.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeVal: arr,
      // allowClear: 'ture',
    });
    return true;
  };

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
      if (item.name.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeValPublish: arr,
      // allowClear: 'ture',
    });
    return true;
  };

  renderOption = item => ({
    value: item.code,
    label: (
      <div style={{ display: 'flex' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    ),
  });

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

  simpleForm = () => {
    const { languageCode, status } = this.props;
    const { nameCodeVal } = this.state;
    console.log(nameCodeVal);

    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="任务模型" name="code">
            <AutoComplete
              style={{ width: 260 }}
              onSearch={this.inputValue}
              options={nameCodeVal.map(this.renderOption)}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              // optionLabelProp="text"
            />
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="状态" name="status">
            <Select mode="multiple" maxTagCount={2} maxTagTextLength={3} style={{ width: 260 }}>
              {status.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 0}>
          <FormItem label="发布人" name="publisherCode">
            <AutoComplete
              style={{ width: 260 }}
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
    const { languageCode } = this.props;
    return (
      <DateUI
        languageCode={languageCode}
        label="发布时间"
        name="publishDate"
        placeholder={['开始时间', '结束时间']}
      />
    );
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

  // 发布
  publishModel = v => {
    api.publishTaskModel(v.id).then(() => {
      message.success('任务模型发布成功!');
      this.getTableData();
      // this.updateListData(v.id);
    });
  };

  // 更新某行数据
  // updateListData = id => {
  //   const { list } = this.state;
  //   api.getTaskModelDetail(id).then(res => {
  //     let lists = [...list];
  //     lists = lists.map(item => {
  //       if (item.id === id) {
  //         const fileId = '';
  //         item = res;
  //         item.fileId = fileId;
  //       }
  //       return item;
  //     });
  //     this.setState({
  //       list: lists,
  //     });
  //   });
  // };

  // 禁用模型
  forbiddenModel = id => {
    api.forbiddenTaskModel(id).then(res => {
      message.success('任务模型已禁用!');
      this.getTableData();
      // this.updateListData(id);
    });
  };

  // 删除模型
  deleteModel = id => {
    api.deleteTaskModel(id).then(() => {
      message.success('任务模型删除成功!');
      this.getTableData();
    });
  };

  // 升级
  upgradeModel = id => {
    router.push(`/project/task-model/up/${id}-up`);
  };

  operate = (op, v) => {
    // op: 操作  v: 每行的数据
    if (op === '发布') {
      this.publishModel(v);
    } else if (op === '修改') {
      this.goToEdit(v.id);
    } else if (op === '删除') {
      this.confirm(v.id);
      // this.deleteModel(v.id);
    } else if (op === '查看') {
      this.viewDetails(v);
    } else if (op === '升级') {
      this.upgradeModel(v.id);
    } else if (op === '禁用') {
      this.forbiddenModel(v.id);
    }
  };

  confirm(id) {
    Modal.confirm({
      title: '是否确定删除?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteModel(id),
    });
  }

  render() {
    const { visible } = this.state;
    const { taskModel } = this.props;
    const { taskModelStatusOptions } = taskModel;
    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'codeAndName',
        width: 250,
        key: 'codeAndName',
        render: (text, row) => (
          <div style={{ display: 'flex' }}>
            <Avatar
              src={row.fileId ? disk.downloadFiles(row.fileId, { view: true }) : ''}
              style={{ float: 'left', width: '46px', height: '46px' }}
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
        width: 400,
        dataIndex: 'describe',
        key: 'describe',
      },
      {
        title: '发布人/时间',
        width: 200,
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
        width: 140,
        key: 'version',
        dataIndex: 'version',
        render: value => <>{value && <Tag color="green">{value}</Tag>}</>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
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
        width: 200,
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
                          this.operate(item, value);
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
              <a
                onClick={() => {
                  this.operate(operaList[0], value);
                }}
              >
                {operaList[0]}
              </a>
              <Divider type="vertical" />
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多
                  <DownOutlined />
                </a>
              </Dropdown>
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
        <Spin spinning={loading} size="large">
          <Card bordered={false} className="task_model_list_form_body">
            <div className="tableList">
              <TableSearchForm
                ref={this.tableSearchFormRef}
                initialValues={this.initialValues}
                getTableData={this.getTableData}
                simpleForm={this.simpleForm}
                advancedForm={this.advancedForm}
              />
            </div>
          </Card>
          <Card style={{ marginTop: 24 }}>
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
              // loading={loading}
              data={{ list, pagination }}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
            {/* </div> */}
          </Card>
        </Spin>
        {visible && <TaskModelView visible={visible} onClose={this.onClose} viewId={viewId} />}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ taskModel, global }) => ({
  taskModel,
  status: taskModel.taskModelStatusOptions,
  languageCode: global.languageCode,
}))(TaskModel);
