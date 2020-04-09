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
  Avatar,
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
      picture: '',
    };
  }

  componentDidMount() {
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
      api
        .getTaskModelDetail(id)
        .then(res => {
          this.setState({
            checked: res.isAutomatic * 1 === 1,
            loading: false,
            picture: res.picture,
          });
          console.log(res);
          const { dispatch } = this.props;
          // dispatch({
          //   type: 'taskModel/getEditOriginModelData',
          //   payload: res,
          // });
          (this.tableSearchFormRef.current || {}).setFieldsValue(res);
          disk
            .getFiles({
              sourceCode: res.picture,
              sourceKey: 'project_task_model',
            })
            .then(v => {
              this.setState({
                imageUrl: v.length !== 0 ? disk.downloadFiles(v[0].id, { view: true }) : '',
              });
              dispatch({
                type: 'taskModel/getEditOriginModelData',
                payload: { ...res, fileId: v.length !== 0 ? v[0].id : '' },
              });
              // this.props.dispatch({
              //   type: 'processModel/setProcessDetail',
              //   payload: {
              //     ...res,
              //     fileId: v.length !== 0 ? v[0].id : '',
              //   },
              // });
            });
          if (res.version) {
            this.setState({
              versionType: versionFun(res.version),
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
          });
        });

      this.getTableData(id);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskModel/getArgumentsList',
      payload: null,
    });
    // this.onFinish
  }

  getTableData = id => {
    this.setState({
      tableLoading: true,
    });
    api
      .getPreTasks(id)
      .then(res => {
        console.log(res);
        const uuids = (res || []).map(e => e.picture);
        disk
          .getFiles({
            sourceCode: uuids.join(','),
            sourceKey: 'project_task_model',
          })
          .then(v => {
            const newList = (res || []).map(e => {
              const filterItem = (v || []).filter(item => item.sourceCode === e.picture) || [];
              const fileId = filterItem[0] && filterItem[0].id;
              return {
                ...e,
                fileId,
              };
            });
            this.setState({
              tableData: newList,
              tableLoading: false,
            });
          });
      })
      .catch(() => {
        this.setState({
          tableLoading: false,
        });
      });
  };

  // 图片上传
  handleChange = info => {
    const { guuid } = this.state;
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
          picture: guuid,
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
    const {
      checked,
      tableData,
      imageUrl,
      guuid,
      pageModel,
      id,
      selectVersion,
      picture,
    } = this.state;
    const ids = [];
    const { argumentList } = this.props.taskModel;

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
    form.picture = picture;
    form.version = selectVersion || 'V1.0';
    console.log(form);
    this.setState({
      loading: true,
    });

    if (pageModel === 0) {
      api
        .createTaskModel(form)
        .then(() => {
          message.success('任务模型创建成功!');
          // dispatchList();
          router.push('/project/task-model');
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    }
    if (pageModel === 1) {
      form.id = id;
      api
        .editTaskModel(form)
        .then(() => {
          message.success('任务模型修改成功!');
          // dispatchList();
          router.push('/project/task-model');
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    }
    if (pageModel === 2) {
      console.log(id);
      form.id = id;
      api
        .upgradeTaskModel(id, form)
        .then(() => {
          message.success('任务模型升级成功!');
          // dispatchList();
          router.push('/project/task-model');
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
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
    (value || []).forEach(item => {
      idsData.unshift(item.id);
      sonIdsData.unshift(...item.preTaskIds);
    });

    const uuids = (data || []).map(e => e.picture);
    disk
      .getFiles({
        sourceCode: uuids.join(','),
        sourceKey: 'project_task_model',
      })
      .then(v => {
        const newList = (data || []).map(e => {
          const filterItem = (v || []).filter(item => item.sourceCode === e.picture) || [];
          const fileId = filterItem[0] && filterItem[0].id;
          return {
            ...e,
            fileId,
          };
        });
        this.setState({
          tableData: newList,
          tableLoading: false,
        });
      });

    this.setState({
      // tableData: data,
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
              <Avatar
                src={row.fileId ? disk.downloadFiles(row.fileId, { view: true }) : ''}
                style={{ float: 'left', width: '46px', height: '46px', marginRight: 10 }}
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
                text={formatter(taskModelStatusOptions, value, 'value', 'label')}
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

    const uploadUrl = disk.uploadMoreFiles('project_task_model', guuid);
    console.log(uploadUrl);

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
