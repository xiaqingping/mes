// 项目管理：新建项目：添加流程
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  // Input,
  Card,
  Form,
  // Divider,
  Tag,
  // Modal,
  Button,
  // Col,
  // Row,
  Avatar,
  // Table,
  // Badge,
} from 'antd';
import { PlusOutlined, SlidersOutlined } from '@ant-design/icons';
import router from 'umi/router';
// import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
// import { formatter } from '@/utils/utils';
import api from '@/pages/project/api/projectManage';
import ChooseProcessModel from '../components/ChooseProcessModel';

// const FormItem = Form.Item;

class Test extends Component {
  // tableSearchFormRef = React.createRef();

  // state = { visible: false, viewvisible: false };

  // 表单默认值
  initialValues = {
    status: 1,
    page: 1,
    pageSize: 5,
  };

  constructor(props) {
    super(props);
    this.state = {
      // pagination: {},
      loading: false,
      visible: false,
      // requestType：'edit',
    };
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  // 跳转到新建项目页面
  handleAdd = () => {
    // router.push('/project/project-manage/add');
    console.log('跳转到新建项目页面');
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const data = {
      ...options,
    };
    api.getProjectManage(data, true).then(res => {
      this.setState({
        list: res.results,
        loading: false,
      });
    });
    // console.log(list);
  };

  // 分页
  handleStandardTableChange = (pagination, filters) => {
    // 获取搜索值
    console.log(filters);
    // this.getTableData({
    //   page: pagination.current,
    //   rows: pagination.pageSize,
    // });
  };

  // 点击打开关联
  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  // 点击关闭关联
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 删除数据
  deleteRow = row => {
    console.log(row);
    // api.deleteAddProcess(row.id).then(() => {
    //   this.getTableData();
    // });
  };

  // 打开参数
  handleOpen = row => {
    console.log(row);
    const data = row;
    data.requestType = 'addValue';
    router.push('/project/project-manage/process-parameter', { data });
  };

  render() {
    // const { status } = this.props;

    const { pagination, list, loading, visible } = this.state;
    // console.log(this.state);

    let tableWidth = 0;
    let columns = [
      {
        title: '名称/描述',
        dataIndex: 'name',
        width: 300,
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.describe}</div>
          </>
        ),
      },
      {
        title: '流程模型',
        dataIndex: 'name',
        width: 300,
        render: (value, row) => (
          <>
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              style={{ float: 'left' }}
              size="large"
            />
            <div style={{ float: 'left' }}>
              <div>{value}</div>
              <div>{row.code}</div>
            </div>
          </>
        ),
      },
      {
        title: '参数',
        dataIndex: 'parameter',
        width: 100,
        render: (value, row) => (
          <SlidersOutlined onClick={() => this.handleOpen(row)} style={{ fontSize: 20 }} />
        ),
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 100,
        render: () => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            V1.0
          </Tag>
        ),
      },
      {
        title: '操作',
        fixed: 'right',
        width: 200,
        render: row => (
          <>
            <a onClick={() => this.deleteRow(row)}>删除</a>
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
        <Form onFinish={this.onFinish}>
          <Card
            style={{ height: '48px', width: '100%', position: 'fixed', bottom: '0', left: '0' }}
          >
            <Button type="primary" style={{ float: 'right', marginTop: '-16px' }}>
              保存
            </Button>
          </Card>
        </Form>
        <Card bordered={false}>
          <div className="tableList">
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
          <div
            style={{
              width: '100%',
            }}
          >
            <Button
              type="dashed"
              // onClick={this.showModal}
              onClick={this.onOpen}
              icon={<PlusOutlined />}
              style={{
                width: '100%',
                marginTop: 16,
                paddingBottom: 8,
              }}
            >
              选择流程模型
            </Button>
          </div>
        </Card>
        <ChooseProcessModel visible={visible} onClose={this.onClose} />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global }) => ({
  languageCode: global.languageCode,
}))(Test);
