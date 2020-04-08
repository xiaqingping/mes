// 流程模型的编辑
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Upload,
  message,
  Input,
  Tag,
  Table,
  Button,
  Form,
  Badge,
  Switch,
  Popconfirm,
  Spin,
} from 'antd';
import { LoadingOutlined, SettingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import './index.less';
import { guid, formatter, versionFun } from '@/utils/utils';
import BeforeTask from './components/beforeTask';
import ArgumentModel from './components/argumentModel';
import classNames from 'classnames';
import router from 'umi/router';
import disk from '@/pages/project/api/disk';
import api from '@/pages/project/api/taskmodel';

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
    // 根据-分割传过来的id, 如果长度为0 则为新增, 为1则未编辑, 为2则为升级.
    let data = [];
    if (nextProps.match.params.id) {
      data = nextProps.match.params.id.split('-');
    }

    if (data.length !== 0) {
      return { id: data[0], pageModel: data.length };
    }
    return { id: '' };
  }

  constructor(props) {
    super(props);
    const guuid = guid();
    this.state = {
      imageUrl: '',
      loading: false,
      tableLoading: false,
      id: '',
      visible: false,
      tableData: [],
      argumentVisible: false, // 参数弹框是否显示
      checked: false,
      guuid,
      editOriginModelData: {}, // 修改时进页面时候的任务模型详细数据
      isAdd: this.props.match.path.indexOf('add') > 0,
      pageModel: 0,
      versionType: null, // 可以选择的版本
      versionOpen: false, // 升级版本可以选择
      selectVersion: '', // 选择的版本值
      sonIds: [], // 所有前置任务的id
      ids: [], // 所有选择的id
    };
  }

  componentDidMount() {
    const { editOriginModelData } = this.props.taskModel;
    const { isAdd, id } = this.state;
    if (isAdd) {
      // 如果是新增
      this.setState({
        tableData: [],
      });
    } else {
      this.setState({
        loading: true,
      });
      api.getTaskModelDetail(id).then(res => {
        this.setState({
          loading: false,
        });
        console.log(res);
        const { dispatch } = this.props;
        dispatch({
          type: 'taskModel/getEditOriginModelData',
          payload: res,
        });
        (this.tableSearchFormRef.current || {}).setFieldsValue(res);
        if (res.version) {
          this.setState({
            versionType: versionFun(res.version),
          });
        }
      });

      this.setState({
        checked: editOriginModelData.isAutomatic * 1 === 1,
      });

      this.getTableData(id);
    }
  }

  getTableData = id => {
    this.setState({
      tableLoading: true,
    });
    api.getPreTasks(id).then(res => {
      // console.log(res);
      this.setState({
        tableData: res,
        tableLoading: false,
      });
    });
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

  // 导航列表title样式
  navContent = () => {
    const { pageModel } = this.state;
    const { editOriginModelData } = this.props.taskModel;

    if (pageModel) {
      return <div>{`${editOriginModelData.name} ${editOriginModelData.id}`}</div>;
    }
    return '';
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
    const { checked, tableData, imageUrl, guuid, pageModel, id, selectVersion } = this.state;
    const ids = [];
    const { argumentList } = this.props.taskModel;
    const { dispatch } = this.props;

    const form = this.tableSearchFormRef.current.getFieldsValue();
    form.isAutomatic = checked ? 1 : 2;
    form.params = argumentList;
    tableData.map(item => {
      return ids.push(item.id);
    });
    form.parentIds = ids;
    form.version = 'V1.0';
    if (imageUrl) {
      form.picture = guuid;
    }
    form.version = selectVersion || 'V1.0';
    console.log(form);
    this.setState({
      loading: true,
    });
    const dispatchList = () => {
      dispatch({
        type: 'taskModel/getArgumentsList',
        payload: null,
      });
    };
    if (pageModel === 0) {
      api.createTaskModel(form).then(() => {
        message.success('任务模型创建成功!');
        dispatchList();
        router.push('/project/task-model');
      });
    }
    if (pageModel === 1) {
      form.id = id;
      api.editTaskModel(form).then(() => {
        message.success('任务模型修改成功!');
        dispatchList();
        router.push('/project/task-model');
      });
    }
    if (pageModel === 2) {
      console.log(id);
      form.id = id;
      api.upgradeTaskModel(id, form).then(() => {
        message.success('任务模型升级成功!');
        dispatchList();
        router.push('/project/task-model');
      });
    }
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
  onClose = (row, select) => {
    const { tableData } = this.state;
    const tableData1 = [...tableData];
    this.setState({
      visible: false,
    });
    if (select) {
      tableData1.push(row);
      this.setState({
        tableData: tableData1,
      });
    }
  };

  handleDelete = row => {
    // console.log(row);
    const { tableData } = this.state;
    let list = [...tableData];
    list = list.filter(item => {
      return item.id !== row.id;
    });
    this.setState({
      tableData: list,
    });
  };

  openArgumentModel = () => {
    const { dispatch } = this.props;
    const { id } = this.state;
    this.setState({
      argumentVisible: true,
    });
    dispatch({
      type: 'taskModel/setEditTaskModelId',
      payload: id,
    });
  };

  onArgumentClose = () => {
    this.setState({
      argumentVisible: false,
    });
  };

  switchChange = e => {
    this.setState({
      checked: e,
    });
  };

  // 获取子级数据
  getData = async value => {
    const { tableData, ids, sonIds } = this.state;
    let data = tableData;
    const idsData = ids;
    const sonIdsData = sonIds;
    data = [...tableData, ...value];
    value.forEach(item => {
      idsData.push(item.id);
      sonIdsData.push(...item.preTaskIds);
    });

    this.setState({
      tableData: data,
      ids: idsData,
      sonIds: sonIdsData,
    });
  };

  // 删除确认
  confirm = value => {
    const { tableData, ids, sonIds } = this.state;
    const data = tableData;
    const idsData = ids;
    const sonIdsData = sonIds;
    const newData = data.filter(item => item.id !== value.id);
    const newIdsData = idsData.filter(item => item !== value.id);
    let newSonIdsData = [];
    if ((value.preTaskIds || []).length !== 0) {
      value.preTaskIds.forEach(i => {
        newSonIdsData = sonIdsData.filter(item => item !== i);
      });
    }
    this.setState({
      tableData: newData,
      ids: newIdsData,
      sonIds: newSonIdsData,
    });
  };

  render() {
    const { taskModel } = this.props;
    const { taskModelStatusOptions, editOriginModelData } = taskModel;
    const {
      tableData,
      visible,
      argumentVisible,
      tableLoading,
      guuid,
      selectVersion,
      versionOpen,
      versionType,
      pageModel,
      loading,
      sonIds,
      ids,
    } = this.state;

    const uploadButton = (
      <div style={{ borderRadius: '50%' }}>
        {this.state.loading ? <LoadingOutlined /> : ''}
        {/* <div className="ant-upload-text">Upload</div> */}
      </div>
    );
    const { imageUrl, checked } = this.state;
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
        render: (value, row) => {
          if (!sonIds.includes(row.id)) {
            return (
              <>
                <Popconfirm
                  placement="topLeft"
                  title="确定要删除吗？"
                  onConfirm={() => this.confirm(row)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined />
                </Popconfirm>
              </>
            );
          }
          return true;
        },
      },
    ];

    const uploadUrl = disk.uploadMoreFiles('project_process_model', guuid);
    console.log(this.state.editOriginModelData);
    return (
      <PageHeaderWrapper title={this.navContent()}>
        <Card>
          <div
            className={classNames(
              { task_model_isHidden: !loading },
              'task_model_add_loading_style',
            )}
          >
            <Spin />
          </div>
        </Card>

        <Form
          className={classNames({ task_model_isHidden: loading })}
          onFinish={this.onFinish}
          initialValues={this.state.editOriginModelData}
          ref={this.tableSearchFormRef}
          onFinishFailed={this.onFinishFailed}
        >
          <Card className="process-model-edit">
            <div style={{ float: 'left', marginLeft: '20px' }}>
              {/* <Form.Item name="uploadPIc"> */}
              <Upload
                name="picture"
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
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: '请输入任务名称',
                  },
                ]}
              >
                <Input placeholder="请输入任务名称" />
              </Form.Item>
              <Form.Item name="describe">
                <Input.TextArea placeholder="请输入任务描述" rows={4} />
              </Form.Item>
              <Form.Item
                name="taskFlag"
                rules={[
                  {
                    required: true,
                    message: '请输入标识',
                  },
                ]}
              >
                <Input placeholder="请输入标识" />
              </Form.Item>
            </div>

            {/* 版本选择 */}
            <div style={{ float: 'left' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginLeft: '30px' }}>
                <Tag
                  color="green"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.setState({
                      versionOpen: !versionOpen,
                    });
                  }}
                >
                  {pageModel ? selectVersion || editOriginModelData.version : 'V1.0'}
                  {/* {selectVersion || processDetail.version} */}
                </Tag>
                {versionOpen && pageModel === 2 && (
                  <Card
                    style={{ position: 'absolute', zIndex: '100', top: '28px' }}
                    hoverable
                    className="padding-none"
                  >
                    {versionType.length !== 0 &&
                      versionType.map(item => (
                        <Tag
                          key={item}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            this.setState({
                              selectVersion: item,
                              versionOpen: !versionOpen,
                            });
                          }}
                        >
                          {item}
                        </Tag>
                      ))}
                  </Card>
                )}
              </div>
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
                <Switch checked={checked} onChange={this.switchChange} />
              </Form.Item>
            </div>
          </Card>

          <Card style={{ marginTop: '24px' }} title={this.titleContent()}>
            <Table
              rowKey="id"
              dataSource={tableData}
              columns={columns}
              rowClassName="editable-row"
              pagination={false}
              loading={tableLoading}
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
              前置任务
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
              >
                提交
              </Button>
            </Form.Item>
          </Card>
        </Form>
        <BeforeTask
          visible={visible}
          onClose={this.onClose}
          getData={v => this.getData(v)}
          ids={ids}
        />

        {argumentVisible && (
          <ArgumentModel visible={argumentVisible} onClose={this.onArgumentClose} />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, taskModel, user }) => ({
  languageCode: global.languageCode,
  taskModel,
  authorization: user.currentUser.authorization,
}))(TaskModel);
