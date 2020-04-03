// 项目管理：新建项目：添加流程
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  // Input,
  Card,
  Form,
  Divider,
  Tag,
  Modal,
  Button,
  Col,
  Row,
  Avatar,
  Table,
  // Badge,
} from 'antd';
import { PlusOutlined, SlidersOutlined } from '@ant-design/icons';
// import router from 'umi/router';
// import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
// import { formatter } from '@/utils/utils';
// import api from '@/pages/project/api/processModel/';
import api from '@/pages/project/project-manage/api/projectManageModel/';
// import ChooseProcessModel from '@/components/ChooseProcessModel';

// const FormItem = Form.Item;

class Test extends Component {
  // tableSearchFormRef = React.createRef();

  // state = { visible: false, viewvisible: false };

  // 表单默认值
  initialValues = {
    status: 1,
    page: 1,
    pageSize: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      // pagination: {},
      // loading: false,
      visible: false,
      viewvisible: false,
    };
    // 异步验证做节流处理
    // this.callParter = _.debounce(this.callParter, 500);
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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  viewModal = () => {
    console.log(111);
    this.setState({
      viewvisible: true,
    });
  };

  vieweOk = e => {
    console.log(e);
    this.setState({
      viewvisible: false,
    });
  };

  viewCancel = e => {
    console.log(e);
    this.setState({
      viewvisible: false,
    });
  };

  // 点击打开关联
  // onOpen = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };

  // 点击关闭关联
  // onClose = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // };

  render() {
    // const { status } = this.props;

    const { pagination, list, loading } = this.state;
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
        render: () => <SlidersOutlined style={{ fontSize: '25px' }} />,
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
        width: 200,
        render: value => (
          <>
            <a onClick={() => console.log(111)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.upgrade(value)}>修改</a>
          </>
        ),
      },
    ];

    const columnView = [
      {
        title: '任务',
        dataIndex: 'task',
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
      {
        title: '版本',
        dataIndex: 'version',
      },
    ];

    const data = [
      {
        key: '1',
        task: 'John Brown',
        describe: '心灵鸡汤来一碗,心灵鸡汤来两碗',
        version: 'v1.2',
      },
      {
        key: '2',
        task: 'John Brown',
        describe: '心灵鸡汤来一碗,心灵鸡汤来两碗',
        version: 'v1.2',
      },
      {
        key: '3',
        task: 'John Brown',
        describe: '心灵鸡汤来一碗,心灵鸡汤来两碗',
        version: 'v1.2',
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
            <Button type="primary" style={{ float: 'right', marginTop: '-16px' }} htmlType="submit">
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
              paddingBottom: '100px',
            }}
          >
            <Button
              type="dashed"
              onClick={this.showModal}
              icon={<PlusOutlined />}
              style={{
                width: '100%',
                marginTop: 16,
                paddingBottom: 8,
              }}
            >
              选择流程模型
            </Button>
            <div>
              <Modal
                title="选择流程模型"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={1200}
              >
                <div>
                  <Row gutter={16} style={{ margin: '0' }}>
                    <Col
                      span={7}
                      style={{ padding: '0', marginBottom: '10px', marginRight: '10px' }}
                    >
                      <Card bodyStyle={{ width: '300px', padding: '0' }}>
                        <div style={{ height: '80px', width: '300px', padding: '5px' }}>
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            style={{ float: 'left', marginRight: '10px' }}
                            size="large"
                          />
                          <div
                            style={{
                              float: 'left',
                              height: '50px',
                              width: '100px',
                              textAlign: 'center',
                            }}
                          >
                            <ul style={{ padding: '0', textAlign: 'center' }}>
                              <li>某某某</li>
                              <li>
                                <Tag color="green" style={{ width: '50px', height: '20px' }}>
                                  v1.2
                                </Tag>
                              </li>
                            </ul>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              float: 'right',
                              color: '#005bc3',
                              marginRight: '10px',
                            }}
                          >
                            <Button
                              onClick={this.viewModal}
                              style={{ border: '0', color: '#005bc3' }}
                            >
                              查看
                            </Button>
                            <Modal
                              title="查看流程模型"
                              visible={this.state.viewvisible}
                              onOk={this.vieweOk}
                              onCancel={this.viewCancel}
                              width={600}
                            >
                              <div style={{ height: '320px' }}>
                                {/* 上部 */}
                                <div style={{ height: '50px' }}>
                                  <Avatar
                                    src="https://zos.alipayobjects.com/rmsportal
                                        /ODTLcjxAfvqbxHnVXCYX.png"
                                    style={{ float: 'left', marginRight: '10px' }}
                                    size="large"
                                  />
                                  <div
                                    style={{
                                      float: 'left',
                                      height: '50px',
                                      width: '100px',
                                      textAlign: 'center',
                                      marginRight: '20px',
                                    }}
                                  >
                                    <ul style={{ padding: '0', textAlign: 'center' }}>
                                      <li>565656443464</li>
                                      <li style={{ height: '20px', border: '1px' }}>某某某</li>
                                    </ul>
                                  </div>

                                  <div style={{ float: 'left' }}>
                                    <Tag color="green" style={{ width: '40px', height: '20px' }}>
                                      v1.2
                                    </Tag>
                                  </div>
                                </div>
                                {/* 描述 */}
                                <div style={{ fontSize: '14px', padding: '5px' }}>
                                  心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗,心灵鸡汤来一碗,
                                  心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                                </div>
                                {/* 表格 */}
                                <div>
                                  <Table columns={columnView} dataSource={data} size="small" />
                                </div>
                              </div>
                            </Modal>
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', padding: '10px' }}>
                          心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                        </div>
                      </Card>
                    </Col>
                    <Col
                      span={7}
                      style={{ padding: '0', marginBottom: '10px', marginRight: '10px' }}
                    >
                      <Card bodyStyle={{ width: '300px', padding: '0' }}>
                        <div style={{ height: '80px', width: '300px', padding: '5px' }}>
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            style={{ float: 'left', marginRight: '10px' }}
                            size="large"
                          />
                          <div
                            style={{
                              float: 'left',
                              height: '50px',
                              width: '100px',
                              textAlign: 'center',
                            }}
                          >
                            <ul style={{ padding: '0', textAlign: 'center' }}>
                              <li>某某某</li>
                              <li>
                                <Tag color="green" style={{ width: '50px', height: '20px' }}>
                                  v1.2
                                </Tag>
                              </li>
                            </ul>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              float: 'right',
                              color: '#005bc3',
                              marginRight: '10px',
                            }}
                          >
                            查看
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', padding: '10px' }}>
                          心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                        </div>
                      </Card>
                    </Col>
                    <Col span={7} style={{ padding: '0', marginBottom: '10px' }}>
                      <Card bodyStyle={{ width: '300px', padding: '0' }}>
                        <div style={{ height: '80px', width: '300px', padding: '5px' }}>
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            style={{ float: 'left', marginRight: '10px' }}
                            size="large"
                          />
                          <div
                            style={{
                              float: 'left',
                              height: '50px',
                              width: '100px',
                              textAlign: 'center',
                            }}
                          >
                            <ul style={{ padding: '0', textAlign: 'center' }}>
                              <li>某某某</li>
                              <li>
                                <Tag color="green" style={{ width: '50px', height: '20px' }}>
                                  v1.2
                                </Tag>
                              </li>
                            </ul>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              float: 'right',
                              color: '#005bc3',
                              marginRight: '10px',
                            }}
                          >
                            查看
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', padding: '5px' }}>
                          心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                        </div>
                      </Card>
                    </Col>
                    <Col
                      span={7}
                      style={{ padding: '0', marginBottom: '10px', marginRight: '10px' }}
                    >
                      <Card bodyStyle={{ width: '300px', padding: '0' }}>
                        <div style={{ height: '80px', width: '300px', padding: '5px' }}>
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            style={{ float: 'left', marginRight: '10px' }}
                            size="large"
                          />
                          <div
                            style={{
                              float: 'left',
                              height: '50px',
                              width: '100px',
                              textAlign: 'center',
                            }}
                          >
                            <ul style={{ padding: '0', textAlign: 'center' }}>
                              <li>某某某</li>
                              <li>
                                <Tag color="green" style={{ width: '50px', height: '20px' }}>
                                  v1.2
                                </Tag>
                              </li>
                            </ul>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              float: 'right',
                              color: '#005bc3',
                              marginRight: '10px',
                            }}
                          >
                            查看
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', padding: '10px' }}>
                          心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                        </div>
                      </Card>
                    </Col>
                    <Col
                      span={7}
                      style={{ padding: '0', marginBottom: '10px', marginRight: '10px' }}
                    >
                      <Card bodyStyle={{ width: '300px', padding: '0' }}>
                        <div style={{ height: '80px', width: '300px', padding: '5px' }}>
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            style={{ float: 'left', marginRight: '10px' }}
                            size="large"
                          />
                          <div
                            style={{
                              float: 'left',
                              height: '50px',
                              width: '100px',
                              textAlign: 'center',
                            }}
                          >
                            <ul style={{ padding: '0', textAlign: 'center' }}>
                              <li>某某某</li>
                              <li>
                                <Tag color="green" style={{ width: '50px', height: '20px' }}>
                                  v1.2
                                </Tag>
                              </li>
                            </ul>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              float: 'right',
                              color: '#005bc3',
                              marginRight: '10px',
                            }}
                          >
                            查看
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', padding: '10px' }}>
                          心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                        </div>
                      </Card>
                    </Col>
                    <Col span={7} style={{ padding: '0', marginBottom: '10px' }}>
                      <Card bodyStyle={{ width: '300px', padding: '0' }}>
                        <div style={{ height: '80px', width: '300px', padding: '5px' }}>
                          <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            style={{ float: 'left', marginRight: '10px' }}
                            size="large"
                          />
                          <div
                            style={{
                              float: 'left',
                              height: '50px',
                              width: '100px',
                              textAlign: 'center',
                            }}
                          >
                            <ul style={{ padding: '0', textAlign: 'center' }}>
                              <li>某某某</li>
                              <li>
                                <Tag color="green" style={{ width: '50px', height: '20px' }}>
                                  v1.2
                                </Tag>
                              </li>
                            </ul>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              float: 'right',
                              color: '#005bc3',
                              marginRight: '10px',
                            }}
                          >
                            查看
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', padding: '10px' }}>
                          心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Modal>
            </div>
          </div>
        </Card>
        {/* <ChooseProcessModel visible={visible} onClose={this.onClose} /> */}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global }) => ({
  languageCode: global.languageCode,
}))(Test);
