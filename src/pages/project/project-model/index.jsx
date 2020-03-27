// 项目管理
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Form, Progress, Tag } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import StandardTable from '../components/StandardTable';
// import api from '@/api';
import { InputUI, SelectUI, DataUI } from '../components/AntdSearchUI';
import { DrawerTool } from '../components/AntdUI';

class ProjectManagement extends Component {
  tableSearchFormRef = React.createRef();

  state = {
    pagination: {},
    loading: false,
    visible: false,
    detailValue: {},
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
    // this.setState({ loading: true });
    // const formData = this.tableSearchFormRef.current.getFieldsValue();
    // const { pagination } = this.state;
    // const { current: page, pageSize: rows } = pagination;
    // const data = {
    //   page,
    //   rows,
    //   ...formData,
    //   ...options,
    // };

    // api.peptideBase.getPurity(data, true).then(res => {
    //   this.setState({
    //     list: res.rows,
    //     pagination: {
    //       current: data.page,
    //       pageSize: data.rows,
    //       total: res.total,
    //     },
    //     loading: false,
    //     editIndex: -1,
    //   });
    // });
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
          data={[
            { value: 1, data: '状态一', key: '1' },
            { value: 2, data: '状态二', key: '2' },
            { value: 3, data: '状态三', key: '3' },
          ]}
        />
        <DataUI
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
    console.log('新增');
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 查看详情
  searchDetails = value => {
    this.setState({
      visible: true,
      detailValue: value,
    });
  };

  render() {
    const { pagination, list, loading, visible, detailValue } = this.state;
    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
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
        render: value => <Progress percent={value} size="small" />,
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
      {
        title: '项目模型名称/版本',
        dataIndex: 'projectModelName',
        render: (value, row) => (
          <>
            {value}
            <br />
            <Tag color="success">&nbsp;&nbsp;V{row.copyRight}&nbsp;&nbsp;</Tag>
          </>
        ),
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
        title: '操作',
        width: 200,
        fixed: 'right',
        render: value => (
          <>
            <a onClick={() => console.log(111)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(222)}>作废</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(333)}>开始</a>
            <Divider type="vertical" />
            <a onClick={() => this.searchDetails(value)}>查看</a>
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
                // expandable={{
                //   // 用方法创建子table
                //   expandedRowRender: value => expandedRowRender(value.list, sonTablecolumns),
                //   rowExpandable: record => !!record.list,
                // }}
              />
            </Form>
            <DrawerTool visible={visible} onClose={this.onClose} detailValue={detailValue} />
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
