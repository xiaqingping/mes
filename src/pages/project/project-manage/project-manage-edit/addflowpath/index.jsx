// 项目管理：新建项目：添加流程
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Tag, Button, Avatar, Table, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManage';
import ChooseProcessModel from '../components/ChooseProcessModel';
// import ParamPic from '@/assets/imgs/canshu@1x.png';

class Test extends Component {
  // 表单默认值
  initialValues = {
    status: 1,
    page: 1,
    pageSize: 5,
  };

  constructor(props) {
    super(props);
    const { processSelectedList, paramList, projectInfor } = this.props.projectManage;

    this.state = {
      list: processSelectedList,
      loading: false,
      visible: false,
      projectInfor,
      paramList,
    };
  }

  componentDidMount() {
    this.getData();
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
  deleteRow = value => {
    const tableData = this.state.list;
    const newData = tableData.filter(item => item.id !== value.id);
    this.setState({
      list: newData,
    });
  };

  // 打开参数
  handleOpen = row => {
    const { paramList } = this.props.projectManage;

    let data = {};
    if (paramList.length === 0 && paramList.processModelId === undefined) {
      // 添加 参数值
      data = {
        requestType: 'addParam',
        processModelId: row.id,
      }
    } else {
      // 修改 参数值
      data = {
        requestType: 'updateParam',
        processModelId: row.id,
        params: paramList.params,
      }
    }

    this.props.dispatch({
      type: 'projectDetail/setUserForParam',
      payload: data
    })
    router.push('/project/project-manage/process-parameter');
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

  // 保存
  handleSave = () => {
    const { list, projectInfor, paramList } = this.state;
    let status = false;
    if (list === '' || list === undefined) {
      status = true;
    }
    if (projectInfor === '' || projectInfor === undefined) {
      status = true;
    }
    if (paramList === '' || paramList === undefined) {
      status = true;
    }
    if (status) return message.error('数据为空');

    // 设置好的参数追加在流程列表数据中
    const newList = [];
    list.forEach(item => {
      let newItem = {};
      newItem = {
        describe: item.describe,
        name: item.name,
        processModelId: item.id,
      };
      if (item.id === paramList.processId) {
        newItem.processesParamList = paramList.params;
      }
      newList.push(newItem);
    });

    projectInfor.processList = newList;
    const data = projectInfor;

    api.addProjects(data).then(() => router.push('/project/project-manage'));
    return '';
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
          // <SlidersOutlined onClick={() => this.handleOpen(row)} style={{ fontSize: 20 }} />
          // <div onClick={() => this.handleOpen(row)} style={{ fontSize: 20 }}>
          //   {/* <img src={ParamPic} alt=""/> */}
          // </div>
          <div className="task_model_add_task_icon" onClick={() => this.handleOpen(row)} />
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
        render: value => (
          <>
            <a onClick={() => this.deleteRow(value)}>删除</a>
            <Popconfirm
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.confirm(value)}
              okText="确定"
              cancelText="取消"
            >
              {/* <div
                    style={{ width: 20, height: 20 }}
                    className="task_model_add_model_delet_icon"
                  /> */}
            </Popconfirm>
          </>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Form onFinish={this.handleSave}>
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
                rowKey="id"
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
