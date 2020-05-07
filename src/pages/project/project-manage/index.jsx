// 项目列表
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Divider,
  Form,
  Select,
  Popconfirm,
  Col,
  // AutoComplete,
  Menu,
  Dropdown,
  Input,
  Tag,
  // Progress,
  // Tag,
} from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
// import _ from 'lodash';
import router from 'umi/router';
import StandardTable from '@/pages/project/components/StandardTable';
import { formatter } from '@/utils/utils';
import api from '@/pages/project/api/projectManage';
import { DateUI } from '../components/AntdSearchUI';
import './index.less';

const { Option } = Select;
const FormItem = Form.Item;

class ProjectManagement extends Component {
  tableSearchFormRef = React.createRef();

  // 顶部表单默认值
  initialValues = {
    // status: 1,
    page: 1,
    pageSize: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      loading: false,
      list: [],
      projectIds: '', // 模糊搜索id值
      modelSearchOptions: [], // 项目管理模糊搜素options
    };
    // 异步验证做节流处理
    this.fetchCodeData = debounce(this.fetchCodeData, 500);
  }

  // 组件加载时
  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  // 异步节流处理的方法
  fetchCodeData = value => {
    api.gettProjectManageCodeAndName(value).then(res => {
      this.setState({ modelSearchOptions: res || [] });
    });
  };


/**
 * 获取表格数据
 * @param {string} formData 表单数据
 * @param {string} pagination 分页
 * @param {string} projectIds 模糊搜索id值
 * @param {Array} data 获取表格数据传入的值
 *  */
  getTableData = (options = {}) => {
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination, projectIds } = this.state;
    const { current: page, pageSize } = pagination;

    let newData = [];

    let changePage = false;
    // 状态
    if (formData.status) {
      changePage = true;
      newData = { ...newData, status: formData.status.join(',') };
      delete formData.status;
    }

    // 创建时间
    if (formData.createDate) {
      changePage = true;
      newData = {
        ...newData,
        beginDate: formData.createDate[0].format('YYYY-MM-DD'),
        endDate: formData.createDate[1].format('YYYY-MM-DD'),
      };
      delete formData.createDate;
    }

    const newPage = changePage ? { page: 1 } : page;

    const data = {
      ...newPage,
      page,
      pageSize,
      ...newData,
      ...formData,
      ...options,
      id: projectIds,
    };
    api.getProjectManage(data, true).then(res => {
      this.setState({
        list: res.results,
        pagination: {
          current: data.page,
          pageSize: data.pageSize,
          total: res.total,
        },
        loading: false,
      });
    });
  };

/**
 * 项目管理的搜索功能的筛选
 * @param {string} value 用户选择的一条数据
 *  */
  handleSearchCodeChange = value => {
    const { pagination } = this.state;
    const page = {
      current: 1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      pagination: page,
      projectIds: value.value,
    });
  };



/**
 * 分页
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
      pageSize: page.pageSize,
      ...filterData,
    });
  };


/**
 * 简单查询条件
 * @param  fetchCodeData 异步节流处理的方法
 * @param handleSearchCodeChange 搜索功能
 * @param modelSearchOptions 项目管理模糊搜索
 */
  simpleForm = () => {
    const { languageCode, status } = this.props;
    const { modelSearchOptions } = this.state;
    return (
      <>
        <Col xxl={6} xl={8} lg={languageCode === 'EN' ? 12 : 12}>
          <FormItem label="项目" name="id">
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
                <Option key={d.code} value={d.id} label={d.name}>
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
        <Col xxl={6} xl={8} lg={languageCode === 'EN' ? 12 : 0}>
          <FormItem label="创建人" name="creatorName">
            <Input placeholder="请输入创建人" />
          </FormItem>
        </Col>
      </>
    );
  };


/**
 * 完整查询条件
 */
  advancedForm = () => {
    const { languageCode } = this.state;
    return (
      <DateUI
        languageCode={languageCode}
        label="创建时间"
        name="createDate"
        placeholder={['开始时间', '结束时间']}
      />
    );
  };


/**
 * 新建项目
 * @param {object} data 点击新建项目时传入的类型
 */
  handleAdd = () => {
    const data = { requestType: 'addProject' };
    this.props.dispatch({
      type: 'projectManage/setProjectData',
      payload: data,
    });
    router.push('/project/project-manage/add');
  };

/**
 * 修改项目信息
 * @param {string} requestType 点击新建项目时传入的类型
 * @param ModifyProject 存入sessionStorage的方法名（项目基础信息）
 *  */
  editRow = row => {
    const data = row;
    data.requestType = 'editProject';
    this.props.dispatch({
      type: 'projectManage/setProjectData',
      payload: data,
    });
    sessionStorage.setItem('ModifyProject', JSON.stringify(row));
    const projectId = row.id;
    router.push(`/project/project-manage/edit/${projectId}`);
  };


/**
 * 项目管理详情页面
 * @param {object} projectId 当前数据的id
 * */
  searchDetails = row => {
    const projectId = row.id;
    router.push(`/project/project-manage/detail/${projectId}`);
  };

/**
 * 删除
 * @param {Array} row 当前数据
 * */
  deleteRow = row => {
    api.deleteProjectManage(row.id).then(() => {
      this.getTableData();
    });
  };


/**
 * 修改项目状态
 * @param {Array} row 当前数据
 * @param {object} type 类型
 * */
  handleUpdateStatus = (row, type) => {
    if (!(row.status === type)) {
      const data = {
        id: row.id,
        status: type,
      };
      api.updateProjectStatus(data).then(() => {
        this.getTableData(this.initialValues);
      });
    }
  };

  // 状态下拉列表
  menuList = row => (
    <Menu>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 1)}>未开始</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 2)}>进行中</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 3)}>已完成</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 4)}>已终止</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 5)}>待处理</a>
      </Menu.Item>
    </Menu>
  );

  render() {
    const {
      pagination,
      list,
      loading,
      // statusVisible ,statusId
    } = this.state;
    const { status, labels } = this.props;
    let tableWidth = 0;

    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: '200px',
        render: (value, row) => (
          <>
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{row.name}</div>
              <div>
                <a onClick={() => this.searchDetails(row)}>{value}</a>
              </div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: '400px',
      },
      {
        title: '创建人/时间',
        dataIndex: 'creatorName',
        width: '200px',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.createDate}
          </>
        ),
      },
      {
        title: '修改人/时间',
        width: '200px',
        dataIndex: 'changerName',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.changeDate}
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '200px',
        filters: status,
        render: (value, row) => {
          const color = formatter(status, value, 'value', 'color');
          return (
            <Dropdown overlay={this.menuList(row)} className="classmenulist">
              <Button
                style={{
                  background: color,
                  color: '#fff',
                  borderRadius: '12px',
                  textAlign: 'center',
                  width: '60px',
                  height: '24px',
                }}
                size="small"
              >
                {formatter(status, value, 'value', 'text')}
              </Button>
            </Dropdown>
          );
        },
      },
      {
        title: '标签',
        dataIndex: 'labels',
        width: 250,
        render: value => {
          const arr = [];
          if (value) {
            value.forEach(item => {
              labels.forEach(i => {
                if (i.id === item) {
                  arr.push(
                    <Tag color={i.color} key={i.id}>
                      {i.name} {i.text}
                    </Tag>,
                  );
                }
              });
            });
          }
          return <>{arr}</>;
        },
      },
      {
        title: '成员数',
        dataIndex: 'memberCount',
      },
      {
        title: '开始-截止时间',
        dataIndex: 'beginDate',
        width: '200px',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.endDate}
          </>
        ),
      },
      {
        fixed: 'right',
        title: '操作',
        render: row => (
          <>
            <Popconfirm title="确定删除数据？" onConfirm={() => this.deleteRow(row)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.editRow(row)}>修改</a>
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
        <Card bordered={false} className="setSearchCard">
          <div>
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
              advancedForm={this.advancedForm}
            />
          </div>
        </Card>
        <Card style={{ marginTop: '24px' }}>
          <div>
            <Button type="primary" onClick={() => this.handleAdd()}
              style={{ marginBottom: '35px' }}>
              <PlusOutlined />
              新建
            </Button>
          </div>
          <Form ref={this.tableFormRef}>
            <StandardTable
              scroll={{ x: tableWidth }}
              rowClassName="editable-row"
              // rowKey="id"
              loading={loading}
              data={{ list, pagination }}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, projectManage }) => ({
  languageCode: global.languageCode,
  projectManage,
  status: projectManage.status,
  labels: projectManage.labels,
}))(ProjectManagement);
