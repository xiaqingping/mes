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
  Dropdown,
  Menu,
  Modal,
} from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import _ from 'lodash';
import { DateUI } from '@/pages/project/components/AntdSearchUI';
import { formatter, getOperates } from '@/utils/utils';
import api from '@/pages/project/api/processModel/';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import StandardTable from '../components/StandardTable';
import ProcessDetail from './process-model-detail';
import './index.less';

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
      filtersData: null,
      processCode: '',
      publisherCode: '',
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
    const { pagination, processCode, publisherCode } = this.state;
    const { current: page, pageSize: rows } = pagination;
    let newData = [];
    let changePage = false;
    if (formData.status) {
      changePage = true;
      newData = { ...newData, status: formData.status.join(',') };
      delete formData.status;
    }

    if (formData.publishDate) {
      changePage = true;
      newData = {
        ...newData,
        publishBeginDate: formData.publishDate[0].format('YYYY-MM-DD'),
        publicEndDate: formData.publishDate[1].format('YYYY-MM-DD'),
      };
      delete formData.publishDate;
    }

    if (formData.name) {
      changePage = true;
      newData = { ...newData, code: processCode };
      delete formData.name;
    }
    if (formData.publisherName) {
      changePage = true;
      newData = { ...newData, publisherCode };
      delete formData.publisherName;
    }
    const newPage = changePage ? { page: 1 } : page;
    const data = {
      ...newPage,
      rows,
      ...newData,
      ...formData,
      ...options,
    };
    api.getProcess(data).then(res => {
      this.setState({
        list: res.rows,
      });

      this.setState({
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
      });
    });
  };

  // 流程模型选择样式
  renderOption = item => ({
    value: `${item.code}  ${item.name}`,
    label: (
      // <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex', marginLeft: '14px', padding: '6px 0' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
      // </Option>
    ),
  });

  // 流程模型筛选值
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

  // 发布人选择样式
  renderOptionPublish = item => ({
    value: item.publisherName,
    label: (
      // <Option key={item.id} text={item.name}>
      <div
        style={{ display: 'flex' }}
        onClick={() => {
          this.setState({
            publisherCode: item.publisherCode,
          });
        }}
      >
        <span>{item.publisherName}</span>
      </div>
      // </Option>
    ),
  });

  // 发布人筛选值
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

  // 分页
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

  simpleForm = () => {
    const { languageCode, status } = this.props;
    const { nameCodeVal } = this.state;
    const children = nameCodeVal.map(item => (
      <Option key={item.code} value={item.name}>
        <div
          onClick={() => {
            this.setState({
              processCode: item.code,
            });
          }}
        >
          {item.code} {item.name}
        </div>
      </Option>
    ));
    return (
      <>
        <Col xxl={6} xl={8} lg={languageCode === 'EN' ? 12 : 12}>
          <FormItem label="流程模型" name="name">
            <AutoComplete
              onSearch={this.inputValue}
              spellCheck="false"
              onKeyDown={() => {
                this.setState({
                  processCode: '',
                });
              }}
            >
              {children}
            </AutoComplete>
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
          <FormItem label="发布人" name="publisherName">
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

  // 关闭详情抽屉
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 新建
  handleModalVisible = () => {
    router.push('/project/process-model/add');
  };

  // 升级
  handleUpgrade = value => {
    api.getProcessDetail(value.id).then(res => {
      this.props.dispatch({
        type: 'processModel/setProcessDetail',
        payload: {
          ...res,
        },
      });
      router.push(`/project/process-model/up/${value.id}-up`);
    });
  };

  // 修改
  handleChange = value => {
    router.push(`/project/process-model/edit/${value.id}`);
  };

  // 删除
  handleDelete = value => {
    api.deleteProcess(value.id).then(() => {
      this.getTableData(this.initialValues);
    });
  };

  // 发布
  handlePublish = value => {
    api.publishment(value.id).then(() => {
      this.getTableData(this.initialValues);
    });
  };

  // 禁用
  handleUnPublish = value => {
    api.unPublishment(value.id).then(() => {
      this.getTableData(this.initialValues);
    });
  };

  // 查看详情
  searchDetails = value => {
    this.setState({
      visible: true,
      detailValue: value,
    });
  };

  confirm = row => {
    Modal.confirm({
      title: '删除流程模型',
      content: '是否确定删除当前流程模型?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(row),
    });
  };

  // 获取按钮信息
  getButton = (item, row) => {
    if (item === '查看') {
      return this.searchDetails(row);
    }
    if (item === '修改') {
      return this.handleChange(row);
    }
    if (item === '升级') {
      return this.handleUpgrade(row);
    }
    if (item === '删除') {
      return this.confirm(row);
    }
    if (item === '发布') {
      return this.handlePublish(row);
    }
    if (item === '禁用') {
      return this.handleUnPublish(row);
    }
    return true;
  };

  render() {
    const { pagination, loading, visible, detailValue, list } = this.state;
    const { status } = this.props;

    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 300,
        render: (value, row) => (
          <>
            <Avatar
              src={
                row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
              }
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{value}</div>
              <div style={{ color: '#B9B9B9' }}>{row.name}</div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 400,
      },
      {
        title: '发布人/时间',
        dataIndex: 'publisherName',
        width: 200,
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
        fixed: 'right',
        render: (value, row) => {
          const text = row.status;
          const operaList = getOperates(text);
          const menu = (
            <Menu>
              {operaList.map(
                (item, index) =>
                  index && (
                    <Menu.Item key={item}>
                      <a
                        className="task_model_add_argument_list"
                        onClick={() => this.getButton(item, row)}
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
              <a onClick={() => this.getButton(operaList[0], row)}>{operaList[0]}</a>
              <Divider type="vertical" />
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多
                </a>
              </Dropdown>
            </>
          );
        },
      },
    ];

    return (
      <PageHeaderWrapper>
        <div className="tableList processModeltableList">
          <Card bordered={false}>
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
              advancedForm={this.advancedForm}
            />
          </Card>
          <Card style={{ marginTop: '24px' }}>
            <div className="tableListOperator">
              <Button
                type="primary"
                onClick={() => this.handleModalVisible()}
                style={{ marginLeft: '8px' }}
              >
                <PlusOutlined />
                新建
              </Button>
            </div>
            <Form ref={this.tableFormRef} className="table-style-set">
              <StandardTable
                rowClassName="editable-row"
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </Form>
          </Card>
          {visible ? (
            <div>
              <ProcessDetail
                visible={visible}
                // visible
                onClose={this.onClose}
                detailId={detailValue.id}
                status={status}
                handleChangeVersion={v => this.handleChangeVersion(v)}
                handleUnPublish={row => this.handleUnPublish(row)}
              />
            </div>
          ) : null}
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, processModel, project }) => ({
  languageCode: global.languageCode,
  processModel,
  status: project.status,
  processList: project.processList,
}))(ProcessModel);
