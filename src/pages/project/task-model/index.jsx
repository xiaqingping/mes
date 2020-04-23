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
import SampleSelect from '@/pages/project/components/SampleSelect';
import SampleGroup from '@/pages/project/components/SampleGroup';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/upload_middle.png';
import StandardTable from '../components/StandardTable';
import TaskModelView from './taskModelView';

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
      filtersData: null,
      processCode: '', // 任务模型code
      publisherCode: '',
      modelSearchOptions: [], // 任务模型模糊搜素options
      publisherOptions: [], // 发布人模糊搜索options
      searchCodevalue: null, // 模糊搜索code值
      searchPublisherValue: null, // 模糊搜索发布人值
    };
    this.fetchCodeData = debounce(this.fetchCodeData, 500);
    this.fetchPublisherData = debounce(this.fetchPublisherData, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  getTableData = (options = {}) => {
    const {
      pagination,
      processCode,
      publisherCode,
      searchCodevalue,
      searchPublisherValue,
    } = this.state;
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
    if (formData.name) {
      newData = { ...newData, code: processCode };
      delete formData.name;
    }
    if (formData.publisherName) {
      newData = { ...newData, publisherCode };
      delete formData.publisherName;
    }
    const data = {
      page,
      rows,
      ...newData,
      code: formData.code && searchCodevalue,
      publisherCode: formData.publisherCode && searchPublisherValue,
      ...options,
    };
    console.log(data);
    api
      .getTaskModels(data)
      .then(res => {
        this.setState({
          list: res.rows,
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

  fetchCodeData = value => {
    api.searchTaskModel(value).then(res => {
      this.setState({ modelSearchOptions: res || [] });
    });
  };

  handleSearchCodeChange = value => {
    const { pagination } = this.state;
    console.log(pagination);
    const page = {
      current: 1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      searchCodevalue: value && value.value,
      pagination: page,
    });
  };

  fetchPublisherData = value => {
    api.searchPublisherName(value).then(res => {
      this.setState({
        publisherOptions: res || [],
      });
    });
  };

  handlePubisherChange = v => {
    const { pagination } = this.state;
    console.log(pagination);
    const page = {
      current: 1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      searchPublisherValue: v && v.value,
      pagination: page,
    });
  };

  // ---------------------------------------------------------------------------------

  simpleForm = () => {
    const { languageCode, status } = this.props;
    const { modelSearchOptions, publisherOptions } = this.state;

    return (
      <>
        <Col xxl={6} xl={8} lg={languageCode === 'EN' ? 12 : 12}>
          <FormItem label="任务模型" name="code">
            <Select
              allowClear
              showSearch
              showArrow={false}
              labelInValue
              filterOption={false}
              onSearch={this.fetchCodeData}
              onChange={this.handleSearchCodeChange}
              style={{ width: '100%' }}
              optionFilterProp="children" // 对子元素--option进行筛选
              optionLabelProp="label" // 回填的属性
            >
              {modelSearchOptions.map(d => (
                <Option key={d.code} value={d.code} label={d.name}>
                  {d.code}&nbsp;&nbsp;{d.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} xl={8} lg={languageCode === 'EN' ? 12 : 0}>
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
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 0}>
          <FormItem label="发布人" name="publisherCode">
            <Select
              allowClear
              showSearch
              showArrow={false}
              labelInValue
              filterOption={false}
              onSearch={this.fetchPublisherData}
              onChange={this.handlePubisherChange}
              style={{ width: '100%' }}
              optionFilterProp="children" // 对子元素--option进行筛选
              optionLabelProp="label" // 回填的属性
            >
              {publisherOptions.map(d => (
                <Option key={d.publisherCode} value={d.publisherCode} label={d.publisherName}>
                  {d.publisherCode}&nbsp;&nbsp;{d.publisherName}
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

  // 禁用模型
  forbiddenModel = id => {
    api.forbiddenTaskModel(id).then(() => {
      message.success('任务模型已禁用!');
      this.getTableData();
      // this.updateListData(id);
    });
  };

  reGetData = (v, id) => {
    if (v) {
      this.setState({
        visible: false,
        loading: true,
      });
      this.forbiddenModel(id);
    }
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
              src={
                row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
              }
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
        {visible && (
          <TaskModelView
            visible={visible}
            onClose={this.onClose}
            viewId={viewId}
            reload={this.reGetData}
          />
        )}
        <SampleSelect />
        <SampleGroup />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ taskModel, global }) => ({
  taskModel,
  status: taskModel.taskModelStatusOptions,
  languageCode: global.languageCode,
}))(TaskModel);
