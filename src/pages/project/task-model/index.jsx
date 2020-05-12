/** 任务模型 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Tag, Select, Divider, Menu, Dropdown, message, Modal, Avatar } from 'antd';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import router from 'umi/router';
import { getOperates, cutString } from '@/utils/utils';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/upload_middle.png';
import ProTable from '@ant-design/pro-table';
import TaskModelView from './taskModelView';

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
      // loading: false,
      // list: [],
      // pagination: {},
      visible: false, // 点击查看抽屉是否显示
      viewId: '',
      // filtersData: null,
      // processCode: '', // 任务模型code
      // publisherCode: '',
      modelSearchOptions: [], // 任务模型模糊搜素options
      publisherOptions: [], // 发布人模糊搜索options
      // searchCodevalue: null, // 模糊搜索code值
      // searchPublisherValue: null, // 模糊搜索发布人值
    };
    this.fetchCodeData = debounce(this.fetchCodeData, 500);
    this.fetchPublisherData = debounce(this.fetchPublisherData, 500);
  }

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
    });
  };

  /**
   * 禁用模型
   */
  forbiddenModel = id => {
    api.forbiddenTaskModel(id).then(() => {
      message.success('任务模型已禁用!');
      this.tableSearchFormRef.current.reload();
    });
  };

  /**
   * 子组件要求父组件关闭抽屉
   * @param {Boolean} v 是否关闭
   * @param {String} id 禁用id
   */
  reGetData = v => {
    if (v) {
      this.setState({
        visible: false,
      });
      this.tableSearchFormRef.current.reload();
    }
  };

  /**
   * 删除模型
   */
  deleteModel = id => {
    api.deleteTaskModel(id).then(() => {
      message.success('任务模型删除成功!');
      this.tableSearchFormRef.current.reload();
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
      status: params.status && params.status.length ? params.status.join(',') : '',
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
    console.log(statusValue);
    return statusValue;
  };

  /**
   * 设置表格的colums
   */
  columns = () => {
    const { modelSearchOptions, publisherOptions } = this.state;
    const { status } = this.props;
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
              <div style={{ color: '#545454' }} title={row.name}>
                {cutString(row.name, 15)}
              </div>
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
        render: value => <div title={value}>{cutString(value, 50)}</div>,
        hideInSearch: true,
      },
      {
        title: '发布人/时间',
        dataIndex: 'publisherName',
        width: 200,
        hideInSearch: true,
        render: (value, row) => (
          <>
            <div title={value}>{value}</div>
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
        renderFormItem: (item, { onChange }) => (
          <Select
            mode="multiple"
            maxTagCount={1}
            maxTagTextLength={3}
            onChange={onChange}
            allowClear
          >
            {status.map(it => (
              <Option key={it.value} value={it.value}>
                {it.text}
              </Option>
            ))}
          </Select>
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
        width: 200,
        // fixed: 'right',
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
