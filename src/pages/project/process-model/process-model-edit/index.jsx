// 项目管理
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Upload, message, Input, Tag, Switch, Table, Button, Divider } from 'antd';
import { LoadingOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import './index.less';
// import { expandedRowRender } from '../functions';

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

  state = {
    loading: false,
  };

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

  titleContent = () => <div style={{ fontWeight: 'bolder' }}>流程模型列表</div>;

  onChange = checked => {
    console.log(`switch to ${checked}`);
  };

  render() {
    const uploadButton = (
      <div style={{ borderRadius: '50%' }}>
        {this.state.loading ? <LoadingOutlined /> : ''}
        {/* <div className="ant-upload-text">Upload</div> */}
      </div>
    );
    const { imageUrl } = this.state;
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
        title: '操作',
        render: () => (
          <>
            <a onClick={() => console.log(111)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(222)}>作废</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(333)}>开始</a>
          </>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card className="process-model-edit">
          <div style={{ float: 'left', marginLeft: '20px' }}>
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
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          <div style={{ float: 'left', width: '552px', marginLeft: '20px' }}>
            <Input placeholder="请输入任务名称" style={{ marginBottom: '10px' }} />
            <Input.TextArea placeholder="请输入任务描述" rows={4} />
          </div>
          <div style={{ float: 'left', marginLeft: '20px' }}>
            <Tag color="green">V1.1</Tag>
          </div>
          <div style={{ float: 'left', marginLeft: '142px', fontSize: '16px' }}>
            <SettingOutlined />
            <a href="#" style={{ marginLeft: '10px' }}>
              参数
            </a>
          </div>
          <div style={{ float: 'left', marginLeft: '88px' }}>
            <span style={{ fontSize: '16px', verticalAlign: 'middle' }}>是否可自动运行：</span>
            <Switch
              style={{ verticalAlign: 'middle', marginLeft: '22px' }}
              defaultChecked
              onChange={this.onChange}
            />
          </div>
          <div style={{ float: 'left', marginLeft: '50px' }}>
            <span style={{ fontSize: '16px', verticalAlign: 'middle' }}>交互分析：</span>
            <Switch
              style={{ verticalAlign: 'middle', marginLeft: '22px' }}
              defaultChecked
              onChange={this.onChange}
            />
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
            onClick={this.addRow}
            icon={<PlusOutlined />}
          >
            新增
          </Button>
        </Card>

        <Card style={{ height: '48px', width: '100%', position: 'fixed', bottom: '0', left: '0' }}>
          <Button type="primary" style={{ float: 'right', marginTop: '-16px' }}>
            提交
          </Button>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, project }) => ({
  languageCode: global.languageCode,
  project,
}))(ProcessEdit);
