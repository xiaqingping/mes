// 项目管理
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Divider,
  Form,
  // Progress,
  Tag,
} from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import router from 'umi/router';
import StandardTable from '../components/StandardTable';
// import api from '@/api';
import { InputUI, SelectUI, DateUI } from '../components/AntdSearchUI';
// import { DrawerTool } from '../components/AntdUI';
// import { expandedRowRender } from '../functions';

class ProjectManagement extends Component {
  tableSearchFormRef = React.createRef();

  state = {
    pagination: {},
    loading: false,
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  // 获取表格数据
  getTableData = (options = {}) => {
    const data = this.props.project.projectManage;
    this.setState({
      list: data,
      pagination: {
        current: options.page,
        pageSize: options.rows,
        total: data.total,
      },
      loading: false,
    });
    // console.log(this.props.project.projectManage);
  };

  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  simpleForm = () => {
    const { languageCode } = this.props;
    return (
      <>
        <InputUI
          languageCode={languageCode}
          label="创建人"
          name="creatorName"
          placeholder="请输入"
        />
        <SelectUI
          languageCode={languageCode}
          label="状态"
          name="status"
          mode="multiple"
          allowClear
          data={[
            { value: 1, data: '未开始', key: '1' },
            { value: 2, data: '进行中', key: '2' },
            { value: 3, data: '已完成', key: '3' },
            { value: 4, data: '已终止', key: '4' },
            { value: 5, data: '待处理', key: '5' },
          ]}
        />
        <DateUI
          languageCode={languageCode}
          label="时间"
          name="times"
          placeholder={['开始时间', '结束时间']}
        />
      </>
    );
  };

  // 新增
  handleAdd = () => {
    // console.log(123);
    router.push('/project/project-manage/add');
  };

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
        render: value => (
          <>
            {value.map(item => (
              <Tag key={item} color={item}>
                {item}
              </Tag>
            ))}
          </>
        ),
      },
      {
        title: '成员数',
        dataIndex: 'memberNumber',
      },
      // {
      //   title: '项目模型名称/版本',
      //   dataIndex: 'projectModelName',
      //   render: (value, row) => (
      //     <>
      //       {value}
      //       <br />
      //       <Tag color="success">&nbsp;&nbsp;V{row.copyRight}&nbsp;&nbsp;</Tag>
      //     </>
      //   ),
      // },
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
        render: () => (
          <>
            {/* <a onClick={() => console.log(111)}>修改</a>
            <Divider type="vertical" /> */}
            <a onClick={() => console.log(222)}>删除</a>
            <Divider type="vertical" />
            {/* <a onClick={() => console.log(333)}>开始</a> */}
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
        <Card bordered={false}>
          <div className="tableList">
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
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
}))(ProjectManagement);
