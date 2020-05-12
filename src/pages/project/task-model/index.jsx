/** 任务模型 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Form,
  Button,
  // Card,
  Col,
  Tag,
  Select,
  Divider,
  Badge,
  Menu,
  Dropdown,
  // Spin,
  message,
  Modal,
  Avatar,
} from 'antd';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import TableSearchForm from '@/components/TableSearchForm';
import { DateUI } from '@/pages/project/components/AntdSearchUI';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import router from 'umi/router';
import { formatter, getOperates, cutString } from '@/utils/utils';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/upload_middle.png';
import ProTable from '@ant-design/pro-table';
// import StandardTable from '../components/StandardTable';
import TaskModelView from './taskModelView';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 任务模型列表页面
 */
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

  /** 组件加载时 */
  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  /**
   * 获取表格数据
   * @param {object} options table数据获取条件
   */
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
    console.log(formData);
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

  /**
   * 状态筛选
   * @param {Object} pagination 页码对象
   * @param {Object} filters 所有选择的状态对象
   */
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

  /**
   * 搜索任务模型用户键入时请求模糊数据
   * @param {String} value 用户键入的值
   */
  fetchCodeData = value => {
    api.searchTaskModel(value).then(res => {
      this.setState({ modelSearchOptions: res || [] });
    });
  };

  /**
   * 用户选择模型，设置选择的值
   * @param {String} value 用户选择的一条数据
   */
  handleSearchCodeChange = value => {
    const { pagination } = this.state;
    const page = {
      current: 1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      searchCodevalue: value && value.value,
      pagination: page,
    });
  };

  /**
   * 发布人模糊搜索
   * @param {String} value 用户键入的值
   */
  fetchPublisherData = value => {
    api.searchPublisherName(value).then(res => {
      this.setState({
        publisherOptions: res || [],
      });
    });
  };

  /**
   * 选中发布人
   * @param {String} value 用户选择的一条数据
   */
  handlePubisherChange = v => {
    const { pagination } = this.state;
    const page = {
      current: 1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      searchPublisherValue: v && v.value,
      pagination: page,
    });
  };

  /**
   * 简单表单模式DOM结构
   */
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
              // style={{ width: '100%' }}
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

  /**
   * 关闭查看参数抽屉
   */
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * 新建模型
   */
  handleAdd = () => {
    router.push('/project/task-model/add');
  };

  /**
   * 修改模型
   */
  goToEdit = id => {
    router.push(`/project/task-model/edit/${id}`);
  };

  /**
   * 查看模型
   */
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

  /**
   * 发布模型
   */
  publishModel = v => {
    api.publishTaskModel(v.id).then(() => {
      message.success('任务模型发布成功!');
      this.tableSearchFormRef.current.reload();
      // this.updateListData(v.id);
    });
  };

  /**
   * 禁用模型
   */
  forbiddenModel = id => {
    api.forbiddenTaskModel(id).then(() => {
      message.success('任务模型已禁用!');
      this.tableSearchFormRef.current.reload();
      // this.updateListData(id);
    });
  };

  /**
   * 子组件要求父组件关闭抽屉
   * @param {Boolean} v 是否关闭
   * @param {String} id 禁用id
   */
  reGetData = (v, id) => {
    if (v) {
      this.setState({
        visible: false,
        loading: true,
      });

      if (id) this.forbiddenModel(id);
    }
  };

  /**
   * 删除模型
   */
  deleteModel = id => {
    api.deleteTaskModel(id).then(() => {
      message.success('任务模型删除成功!');
      this.getTableData();
    });
  };

  /**
   * 升级模型
   */
  upgradeModel = id => {
    router.push(`/project/task-model/up/${id}-up`);
  };

  /**
   * 根据操作字段，做相应操作
   * @param {String} op 操作
   * @param {Object} v 每行数据
   */
  operate = (op, v) => {
    // op: 操作  v: 每行的数据
    if (op === '发布') {
      this.publishModel(v);
    } else if (op === '修改') {
      this.goToEdit(v.id);
    } else if (op === '删除') {
      this.confirm(v.id);
    } else if (op === '查看') {
      this.viewDetails(v);
    } else if (op === '升级') {
      this.upgradeModel(v.id);
    } else if (op === '禁用') {
      this.forbiddenModel(v.id);
    }
  };

  /**
   * 列表查询数据的处理
   * @param {object} params request返回的数据
   */
  getParamData = params => {
    const newObj = {
      page: params.current,
      rows: params.pageSize,
      status: params.status ? params.status : '',
      code: params.name ? params.name.value : '',
      publisherCode: params.publisherName ? params.publisherName.value : '',
      publishBeginDate: params.publishDate ? params.publishDate[0] : '',
      publicEndDate: params.publishDate ? params.publishDate[1] : '',
    };
    Object.getOwnPropertyNames(newObj).forEach(key => {
      if (!newObj[key]) {
        delete newObj[key];
      }
    });
    console.log(newObj);
    return newObj;
  };

  /**
   * 状态的值处理
   */
  statusValue = () => {
    const { status } = this.props;
    // 状态的值
    let statusValue = {};
    status.forEach(item => {
      statusValue = { ...statusValue, [item.value]: { text: item.text, status: item.status } };
    });
    return statusValue;
  };

  /**
   * 设置表格的colums
   */
  columns = () => {
    const { modelSearchOptions, publisherOptions } = this.state;
    const { taskModel } = this.props;
    const { taskModelStatusOptions } = taskModel;
    return [
      {
        title: '编号/名称',
        dataIndex: 'codeAndName',
        width: 250,
        key: 'codeAndName',
        hideInSearch: true,
        render: (text, row) => (
          <div style={{ display: 'flex' }}>
            <div style={{ width: 46 }}>
              <Avatar
                src={
                  row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
                }
                style={{ float: 'left', width: '46px', height: '46px' }}
              />
            </div>

            <div style={{ marginLeft: 10 }}>
              <div style={{ color: '#545454' }}>{cutString(row.name, 15)}</div>
              <div style={{ color: '#888' }}>{row.code}</div>
            </div>
          </div>
        ),
      },
      {
        title: '任务模型',
        dataIndex: 'name',
        hideInTable: true,
        renderFormItem: (item, { onChange }) => (
          <Select
            allowClear
            showSearch
            showArrow={false}
            labelInValue
            filterOption={false}
            onSearch={this.fetchCodeData}
            // onChange={this.handleSearchCodeChange}
            onChange={onChange}
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
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 400,
        render: value => <div title={value}>{cutString(value, 115)}</div>,
        hideInSearch: true,
      },
      {
        title: '发布人/时间',
        dataIndex: 'publisherName',
        width: 200,
        hideInSearch: true,
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
        width: 140,
        hideInSearch: true,
        render: value => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            {value}
          </Tag>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        valueEnum: this.statusValue(),
        render: value => (
          <>
            <Badge
              status={formatter(taskModelStatusOptions, value, 'value', 'status')}
              text={formatter(taskModelStatusOptions, value, 'value', 'label')}
            />
          </>
        ),
      },
      {
        title: '发布人',
        dataIndex: 'publisherName',
        width: 200,
        renderFormItem: (item, { onChange }) => (
          <Select
            allowClear
            showSearch
            showArrow={false}
            labelInValue
            filterOption={false}
            onSearch={this.fetchPublisherData}
            onChange={onChange}
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
        ),
        hideInTable: true,
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.publishDate}</div>
          </>
        ),
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
        width: 200,
        hideInTable: true,
        valueType: 'dateRange',
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.publishDate}</div>
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
                    // eslint-disable-next-line react/no-array-index-key
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
  };

  /**
   * 模型删除确认
   * @param {String} id 删除模型的id
   */
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
    const { visible, viewId } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          actionRef={this.tableSearchFormRef}
          headerTitle={
            <Button type="primary" onClick={() => this.handleAdd()}>
              <PlusOutlined />
              新建
            </Button>
          }
          rowKey="id"
          request={params =>
            api
              .getTaskModels(this.getParamData(params))
              .then(res => ({ data: res.rows, total: res.total, success: true }))
          }
          columns={this.columns()}
          options={false}
          pagination={{
            defaultPageSize: 10,
          }}
        />
        {visible && (
          <TaskModelView
            visible={visible}
            onClose={this.onClose}
            viewId={viewId}
            reload={this.reGetData}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ taskModel, global }) => ({
  taskModel,
  status: taskModel.taskModelStatusOptions,
  languageCode: global.languageCode,
}))(TaskModel);
