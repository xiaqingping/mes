/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/** 流程模型的编辑 */
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
  Row,
  Col,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { guid, formatter, versionFun } from '@/utils/utils';
import classNames from 'classnames';
import router from 'umi/router';
import disk from '@/pages/project/api/disk';
import api from '@/pages/project/api/taskmodel';
import DefaultHeadPicture from '@/assets/imgs/upload_middle.png';
import ArgumentModel from './components/argumentModel';
import BeforeTask from './components/beforeTask';

/** 自定义样式 */
import './index.less';

/**
 *
 * 图片转化成base64
 */
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

/**
 * 上传前的校验
 * @param {Binary} file 上传的文件
 */
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

/**
 * 任务模型的新建，修改，升级， 查看页面
 */
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

  /**
   * 页面渲染时根据url判断是新增，修改，升级，查看里的哪一种
   * 获取相应数据
   */
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

          const { dispatch } = this.props;
          (this.tableSearchFormRef.current || {}).setFieldsValue(res);

          dispatch({
            type: 'taskModel/getEditOriginModelData',
            payload: { ...res },
          });
          dispatch({
            type: 'taskModel/getArgumentsList',
            payload: res.params,
          });
          if (res.version) {
            this.setState({
              versionType: versionFun(res.version),
              imageUrl: disk.downloadFiles(res.picture, { view: true }),
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

  /**
   * 组件销毁清除数据
   */
  componentWillUnmount() {
    this.dispatchStore('getArgumentsList', null);
    this.dispatchStore('setFirstOpenParams', true);
  }

  /**
   * 封装dispatch方法
   * @param {String} func store仓库里的设置相应state的方法名
   * @param {any} value 需要设置store仓库里的设置相应的state值
   */

  dispatchStore = (func, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: `taskModel/${func}`,
      payload: value,
    });
  };

  /**
   * 根据新的id， 获取模型的前置任务和后置任务
   */
  getTableData = id => {
    const preTaskTypes = [];
    this.setState({
      tableLoading: true,
    });
    api
      .getPreTasks(id)
      .then(res => {
        const uuids = [];
        const ids = [];
        (res || []).forEach(item => {
          uuids.push(item.picture);
          ids.push(item.id);
          if (item.params && item.params.length) {
            item.params.forEach(p => {
              preTaskTypes.push(p.type);
            });
          }
        });
        disk
          .getFiles({
            sourceCode: uuids.join(','),
            sourceKey: 'project_task_model',
          })
          .then(v => {
            const newList = (res || []).map(e => {
              const filterItem = (v || []).filter(item => item.sourceCode === e.picture) || [];
              const fileId = (filterItem[0] && filterItem[0].id) || '';
              return {
                ...e,
                fileId,
              };
            });
            this.setState({
              tableData: newList,
              ids,
              tableLoading: false,
            });
          });
        this.getData(res);
        this.dispatchStore('setAllPreTaskParamsType', preTaskTypes);
      })
      .catch(() => {
        this.setState({
          tableLoading: false,
        });
      });
  };

  /**
   * 文件上传过程中的change事件
   * @param {Object} info 文件上传信息
   */
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
          picture: info.file.response[0],
        }),
      );
    }
    if (info.file.status === 'error') {
      this.setState({
        loading: false,
      });
      message.error('图片上传失败!');
    }
  };

  /**
   * 设置页面头部展示信息
   */
  navContent = () => {
    const { pageModel } = this.state;
    const { editOriginModelData } = this.props.taskModel;
    if (pageModel) {
      return <div>{`${editOriginModelData.name} ${editOriginModelData.code}`}</div>;
    }
    return true;
  };

  /**
   * 设置前置任务列表的title
   */
  titleContent = () => (
    <>
      <div style={{ fontWeight: 'bolder', marginTop: 10, fontSize: 16 }}>前置任务列表</div>
    </>
  );

  /**
   * 数据提交
   */
  onFinish = () => {
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
    if (!imageUrl) {
      return message.error('请上传头像!');
    }

    const form = this.tableSearchFormRef.current.getFieldsValue();
    form.isAutomatic = checked ? 1 : 2;
    form.params = argumentList;
    tableData.map(item => ids.push(item.id));
    form.parentIds = ids;
    form.version = 'V1.0';
    if (imageUrl) {
      form.picture = guuid;
    }
    form.picture = picture;
    form.version = selectVersion || 'V1.0';
    this.setState({
      loading: true,
    });

    console.log(form);

    if (pageModel === 0) {
      api
        .createTaskModel(form)
        .then(() => {
          message.success('任务模型创建成功!');
          this.setParamsTypeStore([]);
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
          this.setParamsTypeStore([]);
          router.push('/project/task-model');
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    }
    if (pageModel === 2) {
      form.id = id;
      api
        .upgradeTaskModel(id, form)
        .then(() => {
          message.success('任务模型升级成功!');
          this.setParamsTypeStore([]);
          router.push('/project/task-model');
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    }
    return true;
  };

  /**
   * 设置前置任务参数type store
   * @param {Array} pretaskParamsType 所有前置任务的参数类型
   */
  setParamsTypeStore = pretaskParamsType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskModel/setAllPreTaskParamsType',
      payload: pretaskParamsType,
    });
  };

  /**
   * 校验失败
   */
  onFinishFailed = () => false;

  /**
   * 打开关联模型modal
   */
  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * 点击关闭关联 添加数据到表格
   */
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

  /**
   * 删除某一项前置任务
   * @param {Object} row 需要删除的那一项的数据对象
   */
  handleDelete = row => {
    const { tableData } = this.state;
    let list = [...tableData];
    list = list.filter(item => item.id !== row.id);
    this.setState({
      tableData: list,
    });
  };

  /**
   * 打开参数抽屉， 设置当前参数id
   */
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

  /**
   * 关闭参数抽屉
   */
  onArgumentClose = () => {
    this.setState({
      argumentVisible: false,
    });
  };

  /**
   * 设置开关状态
   */
  switchChange = e => {
    this.setState({
      checked: e,
    });
  };

  /**
   * 获取子级数据
   * @param {Object} value 子组件传过来的数据对象
   */
  getData = async value => {
    const { tableData, ids, sonIds } = this.state;
    let data = tableData;
    const idsData = ids;
    const sonIdsData = sonIds;
    data = [...tableData, ...(value || [])];
    (value || []).forEach(item => {
      idsData.unshift(item.id);
      sonIdsData.unshift(...(item.preTaskIds || []));
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

  /**
   * 删除确认
   */
  confirm = value => {
    const { tableData, ids, sonIds } = this.state;
    const data = tableData;
    const idsData = ids;
    const sonIdsData = sonIds;
    const { preTaskIds } = value;
    const newData = data.filter(item => item.id !== value.id);
    const newIdsData = idsData.filter(item => item !== value.id);
    if (preTaskIds && preTaskIds.length) {
      preTaskIds.forEach(i => {
        sonIdsData.some((item, index) => {
          if (i === item) {
            sonIdsData.splice(index, 1);
            return true;
          }
        });
      });
    }
    this.setState({
      tableData: newData,
      ids: newIdsData,
      sonIds: sonIdsData,
    });
    const { allPreTaskParamsType } = this.props.taskModel;
    let presentType = [];
    const filterTypes = [];
    if (value.params && value.params.length) {
      presentType = value.params.map(item => item.type);
    }
    allPreTaskParamsType.forEach(item => {
      if (!presentType.includes(item)) {
        filterTypes.push(item);
      }
    });

    this.setParamsTypeStore(filterTypes);
  };

  render() {
    const { taskModel } = this.props;
    const { modelStatusOptions, editOriginModelData } = taskModel;
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
        width: 500,
        render: (value, row) => (
          <div style={{ display: 'flex' }}>
            <div style={{ width: 46 }}>
              <Avatar
                src={
                  row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
                }
                style={{ float: 'left', width: '46px', height: '46px', marginRight: 10 }}
              />
            </div>

            <div style={{ marginLeft: 10 }}>
              <h5>{row.code}</h5>
              <div>{row.name}</div>
            </div>
          </div>
        ),
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 400,
        render: value => (
          <>
            <Tag color="green">{value}</Tag>
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 400,
        render: value => (
          <>
            <Badge
              status={formatter(modelStatusOptions, value, 'value', 'status')}
              text={formatter(modelStatusOptions, value, 'value', 'label')}
            />
          </>
        ),
      },
      {
        title: '操作',
        width: 100,
        render: (value, row) => {
          if (!sonIds.includes(row.id)) {
            return (
              <>
                <Popconfirm
                  placement="topLeft"
                  title="确定要删除吗？"
                  onConfirm={() => this.confirm(row)}
                  okText="确定"
                  cancelText="取消"
                >
                  <div
                    style={{ width: 20, height: 20 }}
                    className="task_model_add_model_delet_icon"
                  />
                </Popconfirm>
              </>
            );
          }
          return true;
        },
      },
    ];

    const uploadUrl = disk.uploadMoreFiles('project_task_model', guuid);

    return (
      <PageHeaderWrapper title={this.navContent()} className="classAddTaskModel">
        <div
          className={classNames({ task_model_isHidden: !loading }, 'task_model_add_loading_style')}
        >
          <Card>
            <Spin />
          </Card>
        </div>

        <Form
          className={classNames({ task_model_isHidden: loading })}
          onFinish={this.onFinish}
          initialValues={this.state.editOriginModelData}
          ref={this.tableSearchFormRef}
          onFinishFailed={this.onFinishFailed}
        >
          <Card className="process-model-edit">
            <Row>
              <Col xxl={14}>
                <div style={{ float: 'left', marginLeft: '1%' }}>
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
                </div>
                <div style={{ float: 'left', width: '62%', minWidth: '500px', marginLeft: '20px' }}>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: '请输入任务名称',
                      },
                      {
                        max: 50,
                        message: '最多输入50个字符',
                      },
                    ]}
                  >
                    <Input placeholder="请输入任务名称" />
                  </Form.Item>
                  <Form.Item
                    name="describe"
                    rules={[
                      {
                        required: true,
                        message: '请输入任务描述',
                      },
                      {
                        max: 255,
                        message: '最多输入255个字符',
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="请输入任务描述" rows={4} />
                  </Form.Item>
                  <Form.Item
                    name="taskFlag"
                    rules={[
                      {
                        required: true,
                        message: '请输入标识',
                      },
                      {
                        max: 50,
                        message: '最多输入50个字符!',
                      },
                    ]}
                  >
                    <Input placeholder="请输入标识" />
                  </Form.Item>
                </div>

                {/* 版本选择 */}
                <div style={{ float: 'left', width: '10%' }}>
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      marginLeft: '30px',
                    }}
                  >
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
                    </Tag>
                    {versionOpen && pageModel === 2 && (
                      <Card
                        style={{ position: 'absolute', zIndex: '100', top: '28px', padding: 10 }}
                        hoverable
                        className="project_task_model_addtask_tag_padding"
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
              </Col>
              <Col xxl={10}>
                <div
                  style={{
                    float: 'right',
                    marginRight: '100px',
                    fontSize: '16px',
                    verticalAlign: 'middle',
                  }}
                >
                  <Form.Item valuePropName="checked">
                    <span style={{ fontSize: '16px', marginRight: 10 }}>是否可自动运行：</span>
                    <Switch checked={checked} onChange={this.switchChange} />
                  </Form.Item>
                </div>

                <div
                  style={{ float: 'right', marginRight: '40px', marginTop: 3, fontSize: '16px' }}
                >
                  <a href="#" style={{ marginLeft: '10px' }} onClick={this.openArgumentModel}>
                    参数
                  </a>
                </div>
              </Col>
            </Row>
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
                marginTop: 40,
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
            <Button type="primary" style={{ float: 'right', marginTop: '-16px' }} htmlType="submit">
              提交
            </Button>
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
