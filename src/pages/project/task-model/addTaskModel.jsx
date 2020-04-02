// 流程模型的编辑
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Upload, message, Input, Tag, Table, Button, Form, Badge, Switch, Spin } from 'antd';
import { LoadingOutlined, SettingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import './index.less';

import BeforeTask from './components/beforeTask';
import ArgumentModel from './components/argumentModel';
import { formatter } from '@/utils/utils';
import api from '@/api';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class TaskModel extends Component {
  tableSearchFormRef = React.createRef();

  static getDerivedStateFromProps(nextProps) {
    return { id: nextProps.match.params.id || '' };
  }

  state = {
    imageUrl: '',
    loading: false,
    tableLoading: false,
    id: '',
    visible: false,
    tableData: [],
    argumentVisible: false, // 参数弹框是否显示
    page: 1,
    rows: 100,
  };

  componentDidMount() {
    const isAdd = this.props.match.path.indexOf('add');
    if (isAdd) {
      // 如果是新增
      this.setState({
        tableData: [],
      });
    } else {
      this.getTableData();
    }
  }

  getTableData = () => {
    this.setState({
      tableLoading: true,
    });
    const { page, rows } = this.state;

    api.getTaskModels();
  };

  // 图片上传
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  // 任务模型列表title样式
  titleContent = () => {
    return (
      <>
        <div style={{ fontWeight: 'bolder' }}>前置任务列表</div>
      </>
    );
  };

  // 是否可自动运行和交互分析
  onChange = checked => {
    console.log(`switch to ${checked}`);
  };

  // 提交上传
  onFinish = values => {
    const { imageUrl } = this.state;
    console.log(imageUrl, values);
  };

  onFinishFailed = () => {
    return false;
  };

  // 点击打开关联
  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  // 点击关闭关联 添加数据到表格
  onClose = row => {
    this.setState({
      visible: false,
    });
    const tableData = [...this.state.tableData];
    tableData.unshift(row);
    this.setState({
      tableData,
    });
    
  };

  handleDelete = row => {
    // console.log(row);
    let list = [...this.state.tableData];
    list = list.filter(item => {
      return item.id !== row.id;
    });
    this.setState({
      tableData: list,
    });
  };

  openArgumentModel = () => {
    this.setState({
      argumentVisible: true,
    });
  };

  onArgumentClose = () => {
    this.setState({
      argumentVisible: false,
    });
  };

  // 提交
  handleSubmit = () => {
    console.log('object');
  };

  render() {
    const { taskModel } = this.props;
    const { taskModelStatusOptions } = taskModel;
    const { tableData, visible, argumentVisible, tableLoading } = this.state;

    const uploadButton = (
      <div style={{ borderRadius: '50%' }}>
        {this.state.loading ? <LoadingOutlined /> : ''}
        {/* <div className="ant-upload-text">Upload</div> */}
      </div>
    );
    const { imageUrl, id } = this.state;
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        render: (value, row) => {
          return (
            <div style={{ display: 'flex' }}>
              <img
                src="http://img1.imgtn.bdimg.com/it/u=1828061713,3436718872&fm=26&gp=0.jpg"
                alt=""
                width={40}
                height={40}
                style={{ borderRadius: '2px' }}
              />
              <div>
                <h5>{row.code}</h5>
                <div>{row.name}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: '版本',
        dataIndex: 'version',
        render: value => (
          <>
            <Tag color="green">{value}</Tag>
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        // width: '80px',
        render: value => {
          return (
            <>
              <Badge
                status={formatter(taskModelStatusOptions, value, 'value', 'status')}
                text={formatter(taskModelStatusOptions, value, 'value', 'data')}
              />
            </>
          );
        },
      },
      {
        title: '操作',
        render: row => (
          <>
            <DeleteOutlined onClick={() => this.handleDelete(row)} />
            {/* <a onClick={() => this.handleDelete(row)}>删除</a> */}
          </>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title={id || ''}>
        <Form
          onFinish={this.onFinish}
          ref={this.tableSearchFormRef}
          onFinishFailed={this.onFinishFailed}
        >
          <Card className="process-model-edit">
            <div style={{ float: 'left', marginLeft: '20px' }}>
              {/* <Form.Item name="uploadPIc"> */}
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{ width: '56px', height: '56px', borderRadius: '50%' }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
              {/* </Form.Item> */}
            </div>
            <div style={{ float: 'left', width: '552px', marginLeft: '20px' }}>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: '请输入参数名称',
                  },
                ]}
              >
                <Input
                  placeholder="请输入任务名称"
                  style={{ marginBottom: '10px' }}
                  defaultValue={this.state.taskModelName}
                />
              </Form.Item>
              <Form.Item name="describe">
                <Input.TextArea
                  placeholder="请输入任务描述"
                  rows={4}
                  defaultValue={this.state.taskModelName}
                />
              </Form.Item>
            </div>
            <div style={{ float: 'left', marginLeft: '20px' }}>
              <Form.Item name="version">
                <Tag color="green">V1.1</Tag>
              </Form.Item>
            </div>

            <div style={{ float: 'right', marginRight: '142px', fontSize: '16px' }}>
              <SettingOutlined />
              <a href="#" style={{ marginLeft: '10px' }} onClick={this.openArgumentModel}>
                参数
              </a>
            </div>

            <div style={{ float: 'right', marginRight: '100px', fontSize: '16px' }}>
              <Form.Item name="isAutomatic" valuePropName="checked">
                <span style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: 10 }}>
                  是否可自动运行：
                </span>
                <Switch />
              </Form.Item>
            </div>
          </Card>

          <Card style={{ marginTop: '24px' }} title={this.titleContent()}>
            {tableLoading ? <Spin/>
            :
            <Table
              rowKey="id"
              dataSource={tableData}
              columns={columns}
              rowClassName="editable-row"
              pagination={false}
            />}
            <Button
              style={{
                width: '100%',
                marginTop: 16,
                marginBottom: 8,
              }}
              type="dashed"
              onClick={this.onOpen}
              icon={<PlusOutlined />}
            >
              新增
            </Button>
          </Card>

          <Card
            style={{ height: '48px', width: '100%', position: 'fixed', bottom: '0', left: '0' }}
          >
            <Form.Item>
              <Button
                type="primary"
                style={{ float: 'right', marginTop: '-32px' }}
                htmlType="submit"
                onClick={() => {
                  this.handleSubmit();
                }}
              >
                提交
              </Button>
            </Form.Item>
          </Card>
        </Form>
        <BeforeTask visible={visible} onClose={this.onClose} />
        <ArgumentModel visible={argumentVisible} onClose={this.onArgumentClose} />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, taskModel }) => ({
  languageCode: global.languageCode,
  taskModel,
}))(TaskModel);
