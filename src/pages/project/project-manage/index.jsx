// 项目列表
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  // Card,
  Divider,
  // Form,
  Select,
  Popconfirm,
  // Col,
  Badge,
  AutoComplete,
  Menu,
  Dropdown,
  // Input,
  Tag,
  // Progress,
  // Tag,
} from 'antd';
// import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import _ from 'lodash';
import router from 'umi/router';
import ProTable from '@ant-design/pro-table';
// import StandardTable from '@/pages/project/components/StandardTable';
import { formatter } from '@/utils/utils';
import api from '@/pages/project/api/projectManage';
// import { DateUI } from '../components/AntdSearchUI';
import './index.less';

const { Option } = Select;
// const FormItem = Form.Item;

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
      nameCodeVal: [],
      projectId: '', // 模糊搜索id值
    };
    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
  }

  callParter = value => {
    console.log(value)
    api.gettProjectManageCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res|| [] },() => {
        console.log(this.state)
      });
    });
  };

  /**
   *  流程模型筛选值
   *  @param {string} value input搜索的值
   */
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
    console.log(arr)
    this.setState({
      nameCodeVal: arr,
      // allowClear: 'ture',
    });
    return true;
  };


  /**
   * 列表查询数据的处理
   * @param {object} params request返回的数据
   */
  getParamData = params => {
    console.log(params);
    const { processCode } = this.state;
    const newObj = {
      page: params.current,
      pageSize: params.pageSize,
      status: params.status ? params.status : '',
      id: params.name ? processCode : '',
      beginDate: params.beginDate ? params.beginDate[0]: '',
      endDate: params.beginDate ? params.beginDate[1]: '',
    };
    Object.getOwnPropertyNames(newObj).forEach(key => {
      // console.log(key)
      if (!newObj[key]) {
        delete newObj[key];
      }
    });
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

  /**
   * 设置表格的colums
   */

  columns = () => {
    const { nameCodeVal } = this.state;
    console.log(nameCodeVal)
    const { status ,labels} = this.props;
    const children = nameCodeVal.map(item => (
      <Option key={item.code} value={item.name}>
        <div
          onClick={() => {
            this.setState({
              projectId: item.id,
            });
          }}
        >
          {item.code} {item.name}
        </div>
      </Option>
    ));
    // console.log(children)
    return [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: '200px',
        hideInSearch: true,
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
        hideInSearch: true,
      },
      {
        title: '创建人/时间',
        dataIndex: 'creatorName',
        width: '200px',
        hideInSearch: true,
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
        hideInSearch: true,
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.changeDate}
          </>
        ),
      },
      {
        title: '项目',
        dataIndex: 'id',
        hideInTable: true,
        renderFormItem: (item, { onChange }) => (
          <AutoComplete onSearch={this.inputValue} spellCheck="false" onChange={onChange}>
            {children}
          </AutoComplete>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '200px',
        filters: status,
        hideInSearch: true,
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
        title: '状态',
        dataIndex: 'status',
        width: 150,
        hideInTable: true,
        valueEnum: this.statusValue(),
        render: value => (
          <Badge
            status={formatter(status, value, 'value', 'status')}
            text={formatter(status, value, 'value', 'text')}
          />
        ),
      },
      {
        title: '创建人',
        dataIndex: 'creatorName',
        hideInTable: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
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
        title: '标签',
        dataIndex: 'labels',
        width: 250,
        hideInSearch: true,
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
        width: '100px',
        hideInSearch: true,
      },
      {
        title: '时间',
        dataIndex: 'beginDate',
        width: '200px',
        hideInSearch: true,
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
        hideInSearch: true,
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
    ]
  };

  render() {
    console.log(this.state)
    return (
      <PageHeaderWrapper>
        <ProTable
          actionRef={this.ref}
          headerTitle={
            <Button type="primary" onClick={() => this.handleAdd()}>
              <PlusOutlined />
              新建
            </Button>
          }
          rowKey="id"
          request={params =>
            api
              .getProjectManage(this.getParamData(params))
              .then(res => ({ data: res.results, total: res.total, success: true }))
          }
          columns={this.columns()}
          options={false}
          pagination={{
            defaultPageSize: 10,
          }}
        />
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
