// 流程模型的编辑
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Upload, message, Input, Tag, Switch, Table, Button, Popconfirm, Form } from 'antd';
import { LoadingOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import './index.less';
// eslint-disable-next-line max-len
import AssociatedProcessModel from '@/pages/project/process-model/components/AssociatedProcessModel';
import Parameter from '@/pages/project/process-model/components/Parameter';
import { guid } from '@/utils/utils';
import disk from '@/pages/project/api/disk';
import api from '@/pages/project/api/processModel/';

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

class ProcessEdit extends Component {
  tableSearchFormRef = React.createRef();

  static getDerivedStateFromProps(nextProps) {
    return { id: nextProps.match.params.id || '' };
  }

  constructor(props) {
    super(props);
    const guuid = guid();
    this.state = {
      imageUrl: '',
      loading: false,
      id: '',
      guuid,
      visible: false,
      parameterVisible: false,
    };
  }

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

  // 流程模型列表title样式
  titleContent = () => <div style={{ fontWeight: 'bolder' }}>任务列表</div>;

  // 是否可自动运行和交互分析
  onChange = checked => {
    console.log(`switch to ${checked}`);
  };

  // 提交上传
  onFinish = values => {
    const { imageUrl, guuid } = this.state;
    const { processAddData } = this.props;
    const data = processAddData;
    console.log(values);
    if (imageUrl) {
      data.picture = guuid;
    }
    data.name = values.name;
    data.describe = values.describe;
    data.interactionAnalysis = values.interactionAnalysis;
    data.version = '1.0';
    this.props.dispatch({
      type: 'processModel/setProcessAddData',
      payload: {
        ...data,
      },
    });
    api.addProcess(processAddData).then(res => {
      console.log(res);
    });
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

  // 打开参数
  handleOpen = () => {
    this.setState({
      parameterVisible: true,
    });
  };

  // 关闭参数
  handleClose = () => {
    this.setState({
      parameterVisible: false,
    });
  };

  render() {
    const uploadButton = (
      <div style={{ borderRadius: '50%' }}>
        {this.state.loading ? <LoadingOutlined /> : ''}
        {/* <div className="ant-upload-text">Upload</div> */}
      </div>
    );
    const { imageUrl, id, visible, parameterVisible, guuid } = this.state;
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
      },
      {
        title: '版本',
        dataIndex: 'describe',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '自动运行',
        dataIndex: 'status',
        render: () => <Switch />,
      },
      {
        title: '操作',
        render: () => (
          <>
            <Popconfirm
              placement="topLeft"
              title="有前置任务，无法删除。"
              onConfirm={this.confirm}
              okText="Yes"
              cancelText="No"
            >
              选择
            </Popconfirm>
          </>
        ),
      },
    ];

    const uploadUrl = disk.uploadMoreFiles('project_process_model', guuid);

    return (
      <PageHeaderWrapper title={id || ''}>
        <Form onFinish={this.onFinish} initialValues={{ interactionAnalysis: true }}>
          <Card className="process-model-edit">
            <div style={{ float: 'left', marginLeft: '20px' }}>
              {/* <Form.Item name="uploadPIc"> */}
              <Upload
                name="files"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={uploadUrl}
                headers={{ Authorization: this.props.authorization }}
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
              <Form.Item name="name">
                <Input placeholder="请输入任务名称" style={{ marginBottom: '10px' }} />
              </Form.Item>
              <Form.Item name="describe">
                <Input.TextArea placeholder="请输入任务描述" rows={4} />
              </Form.Item>
            </div>
            <div style={{ float: 'left', marginLeft: '20px' }}>
              <Form.Item name="version">
                <Tag color="green">V1.0</Tag>
              </Form.Item>
            </div>
            {/* <div style={{ float: 'left', marginLeft: '88px' }}>
              <span style={{ fontSize: '16px', verticalAlign: 'middle' }}>是否可自动运行：</span>
              <Switch
                style={{ verticalAlign: 'middle', marginLeft: '22px' }}
                defaultChecked
                onChange={this.onChange}
              />
            </div> */}

            <div style={{ float: 'right', marginRight: '80px' }}>
              <span style={{ fontSize: '16px', verticalAlign: 'middle' }}>交互分析：</span>
              <span>
                <Form.Item
                  name="interactionAnalysis"
                  valuePropName="checked"
                  style={{ float: 'right', marginTop: '-4px' }}
                >
                  <Switch style={{ verticalAlign: 'middle' }} defaultChecked />
                </Form.Item>
              </span>
            </div>
            <div style={{ float: 'right', marginRight: '30px', fontSize: '16px' }}>
              <SettingOutlined />
              <a
                onClick={() => {
                  this.handleOpen();
                }}
                style={{ marginLeft: '10px' }}
              >
                参数
              </a>
            </div>
          </Card>

          <Card style={{ marginTop: '24px' }} title={this.titleContent()}>
            <Table
              rowKey="id"
              // dataSource={tableData}
              columns={columns}
              rowClassName="editable-row"
              pagination={false}
            />
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
            <Button type="primary" style={{ float: 'right', marginTop: '-16px' }} htmlType="submit">
              提交
            </Button>
          </Card>
        </Form>
        <AssociatedProcessModel visible={visible} onClose={this.onClose} />
        <Parameter visible={parameterVisible} handleClose={this.handleClose} />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, user, project, processModel }) => ({
  languageCode: global.languageCode,
  authorization: user.currentUser.authorization,
  project,
  processAddData: processModel.processAddData,
}))(ProcessEdit);
