// 项目管理
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  // Divider,
  Form,
  Select,
  Popconfirm,
  // Progress,
  // Tag,
} from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import router from 'umi/router';
import StandardTable from '../components/StandardTable';
// import api from '@/api';
import api from '@/pages/project/project-manage/api/projectManageModel/';
import {
  InputUI,
  // SelectUI,
  DateUI,
} from '../components/AntdSearchUI';

const { Option } = Select;
const FormItem = Form.Item;

class ProjectManagement extends Component {
  tableSearchFormRef = React.createRef();
  // tableFormRef = React.createRef();

  state = {
    pagination: {},
    loading: false,
    list: [],
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  // 获取表格数据
  getTableData = (options = {}) => {
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize } = pagination;
    const data = {
      page,
      pageSize,
      ...formData,
      ...options,
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
    // console.log(list);
  };

  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  simpleForm = () => {
    const { languageCode } = this.props;
    // console.log(this.props);
    return (
      <>
        <InputUI
          languageCode={languageCode}
          label="项目"
          name="name"
          placeholder="请输入项目名称"
        />
        <FormItem label="状态" name="status">
          <Select
            mode="multiple"
            style={{ width: '200px' }}
            allowClear
            placeholder="请选择"
            // defaultValue={['a10', 'c12']}
            onChange={this.handleChange}
          >
            {this.props.statusview.map(e => (
              <Option value={e.id} key={e.id}>
                {e.name}
              </Option>
            ))}
          </Select>
        </FormItem>

        <InputUI
          languageCode={languageCode}
          label="创建人"
          name="creatorName"
          placeholder="请输入"
        />
      </>
    );
  };

  // 完整查询条件
  advancedForm = () => {
    const { languageCode } = this.state;
    return (
      <DateUI
        languageCode={languageCode}
        label="创建时间"
        name="times"
        placeholder={['开始时间', '结束时间']}
      />
    );
  };

  // 状态多选框
  handleChange = () => {
    console.log('状态多选框');
  };

  // 新增
  handleAdd = () => {
    // console.log(123);
    router.push('/project/project-manage/add');
  };

  // 项目管理详情页面
  searchDetails = () => {
    router.push('/project/project-manage/detail');
  };

  // 删除数据
  deleteRow = row => {
    api.deleteProjectManage(row.id).then(() => {
      this.getTableData();
    });
    console.log(row);
  };

  // 修改数据
  // resumeRow = row => {
  //   api.peptideBase.resumePurity(row.id).then(() => {
  //     this.getTableData();
  //   });
  // };

  render() {
    const { pagination, list, loading } = this.state;
    let tableWidth = 0;

    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        render: value => (
          <>
            <a onClick={() => this.searchDetails(value)}>{value}</a>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
      {
        title: '创建人/时间',
        dataIndex: 'creatorName',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.creatorTime}
          </>
        ),
      },
      {
        title: '修改人/时间',
        dataIndex: 'changerName',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.changerTime}
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '80px',
        render: text => {
          if (text === 1) return '未开始';
          if (text === 2) return '进行中';
          if (text === 3) return '已完成';
          if (text === 4) return '已终止';
          if (text === 5) return '待处理';
          return '';
        },
      },
      {
        title: '标签',
        dataIndex: 'label',
        // render: value => (
        //   <>
        //     {value.map(item => (
        //       <Tag key={item} color={item}>
        //         {item}
        //       </Tag>
        //     ))}
        //   </>
        // ),
      },
      {
        title: '成员数',
        dataIndex: 'memberCount',
      },
      {
        title: '开始-截止时间',
        dataIndex: 'StartTime',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.endTime}
          </>
        ),
      },
      {
        fixed: 'right',
        title: '操作',
        // render: () => (
        //   <>
        //     {/* <a onClick={() => console.log(111)}>修改</a>
        //     <Divider type="vertical" /> */}
        //     <a onClick={() => this.deleteRow(results)}>删除</a>
        //     <Divider type="vertical" />
        //     {/* <a onClick={() => console.log(333)}>开始</a> */}
        //   </>
        // ),
        render: (value, row, index) => {
          const { editIndex } = this.state;
          let actions;
          if (editIndex !== index) {
            if (row.status === 1) {
              actions = (
                <Popconfirm title="确定删除数据？" onConfirm={() => this.deleteRow(row)}>
                  <a>删除</a>
                </Popconfirm>
              );
            } else {
              actions = (
                <Popconfirm title="确定恢复数据？" onConfirm={() => this.resumeRow(row)}>
                  <a>恢复</a>
                </Popconfirm>
              );
            }
          }
          return actions;
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

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
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
            <Form ref={this.tableFormRef}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                selectedRows=""
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </Form>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, project }) => ({
  languageCode: global.languageCode,
  project,
  statusview: project.status,
}))(ProjectManagement);
