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
  Table,
  message,
  // Badge,
} from 'antd';
import { PlusOutlined, SlidersOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManage';
import ChooseProcessModel from '../components/ChooseProcessModel';

class Test extends Component {
  // static getDerivedStateFromProps(nextProps) {
  //   console.log(nextProps);
  //   // return {
  //   //   viewlist: nextProps.viewlist || [],
  //   // }
  //   return null
  // }

  // 表单默认值
  initialValues = {
    status: 1,
    page: 1,
    pageSize: 5,
  };

  constructor(props) {
    super(props);
    console.log(this.props);
    const { processSelectedList } = this.props.projectManage;
    console.log(processSelectedList);

    this.state = {
      list: [],
      loading: false,
      visible: false,
      // processesList: [],
    };
  }

  componentDidMount() {
    this.getData();
    // 流程列表 参数数据
    const { paramList } = this.props.projectDetail;
    const { processSelectedList, projectInfor } = this.props.projectManage;
    console.log(paramList);
    console.log(processSelectedList);
    console.log(projectInfor);
  }

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
    api.deleteAddProcess(row.id).then(() => {
      this.getData();
    });
  };

  // 打开参数
  handleOpen = row => {
    // eslint-disable-next-line consistent-return
    api.getProcessParam(row.id).then(res => {
      if (!res || res.length === 0) return message.error('当前流程暂无参数！');
      const data = res;
      data.requestType = 'addParam';
      this.props.dispatch({
        type: 'projectDetail/setProcssesParam',
        payload: data,
      });
      router.push('/project/project-manage/process-parameter');
    });
  };

  // 获取模态框选中的流程模型数据
  getData = value => {
    if (!(value === '' || value === undefined)) {
      this.setState({
        list: value,
      });
      this.props.dispatch({
        type: 'projectManage/setProcessSelectedList',
        payload: value,
      });
    }
  };

  onFinish = values => {
    console.log(values);
  };

  render() {
    const { list, loading, visible } = this.state;
    const columns = [
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

    return (
      <PageHeaderWrapper>
        <Form onFinish={this.onFinish}>
          <Card
            style={{ height: '48px', width: '100%', position: 'fixed', bottom: '0', left: '0' }}
          >
            <Button type="primary" style={{ float: 'right', marginTop: '-16px' }} htmlType="submit">
              保存
            </Button>
          </Card>
        </Form>
        <Card bordered={false}>
          <div className="tableList">
            <Form ref={this.tableFormRef}>
              <Table
                rowClassName="editable-row"
                loading={loading}
                dataSource={list}
                columns={columns}
                pagination={false}
                onSelectRow={this.handleSelectRows}
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
        <ChooseProcessModel
          visible={visible}
          onClose={this.onClose}
          getData={v => this.getData(v)}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, projectDetail, projectManage }) => ({
  languageCode: global.languageCode,
  projectDetail,
  projectManage,
}))(Test);
