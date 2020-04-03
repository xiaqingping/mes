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
} from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import TableSearchForm from '@/components/TableSearchForm';
import { DateUI } from '@/pages/project/components/AntdSearchUI';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import router from 'umi/router';
import TaskModelView from './taskModelView';
import { formatter, getOperates } from '@/utils/utils';
import api from '@/pages/project/api/taskmodel';
import StandardTable from '../components/StandardTable';

const FormItem = Form.Item;
const { Option } = Select;

class TaskModel extends Component {
  tableSearchFormRef = React.createRef();

  initialValues = {
    page: 1,
    rows: 10,
  };

  state = {
    loading: false,
    list: [],
    pagination: {},
    visible: false, // 点击查看抽屉是否显示
    viewId: '',
    nameCodeVal: [],
    nameCodeValPublish: [],
  };

  operaList = [];

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  getTableData = (options = {}) => {
    const { pagination } = this.state;
    this.setState({ loading: true });
    console.log(this.tableSearchFormRef);
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
    api.getTaskModels(data).then(res => {
      console.log(res);
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

  handleStandardTableChange = (pagination, filters) => {
    console.log(pagination);
    console.log(filters);
    // this.getTableData({
    //   page: pagination.current,
    //   rows: pagination.pageSize,
    // });
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

  callParter = debounce(this.callParter, 500);

  callPublish = debounce(this.callPublish, 500);
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
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 0}>
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

  operate = (op, v) => {
    if (op === '发布') {
      console.log('发布');
    } else if (op === '修改') {
      console.log('修改');
    } else if (op === '删除') {
      console.log('delete');
    } else if (op === '查看') {
      this.viewDetails(v);
    }
  };

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
        render: (text, row) => {
          return (
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
        render: value => <>{value && <Tag color="green">{value}</Tag>}</>,
      },
      {
        title: '状态',
        dataIndex: 'status',

        filters: taskModelStatusOptions,
        render: value => {
          // console.log(value);
          return (
            <>
              <Badge
                status={formatter(taskModelStatusOptions, value, 'value', 'status')}
                text={formatter(taskModelStatusOptions, value, 'value', 'label')}
              />
            </>
          );
        },
      },
      {
        title: '操作',

        fixed: 'right',
        render: value => {
          const text = value.status;
          const operaList = getOperates(text);
          const menu = (
            <Menu>
              {operaList.map((item, index) => {
                return (
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
                  )
                );
              })}
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
        <Card bordered={false} className="taskmodel">
          <Spin spinning={loading} size="large">
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
                // loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Spin>
        </Card>
        <TaskModelView visible={visible} onClose={this.onClose} viewId={viewId} />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ taskModel, global }) => ({
  taskModel,
  status: taskModel.taskModelStatusOptions,
  languageCode: global.languageCode,
}))(TaskModel);
