// 流程模型的编辑
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Upload,
  message,
  Input,
  Tag,
  Switch,
  Table,
  Button,
  Popconfirm,
  Form,
  Badge,
  Avatar,
  Spin,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import './index.less';
// eslint-disable-next-line max-len
import AssociatedProcessModel from '@/pages/project/process-model/components/AssociatedProcessModel';
import Parameter from '@/pages/project/process-model/components/Parameter';
import { guid, formatter, versionFun, isEmpty } from '@/utils/utils';
import disk from '@/pages/project/api/disk';
import api from '@/pages/project/api/processModel/';
import router from 'umi/router';
import deletePic from '@/assets/imgs/delete@1x.png';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';

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
    let data = [];
    if (nextProps.match.params.id) {
      data = nextProps.match.params.id.split('-');
    }

    if (data.length !== 0) {
      return { id: data[0], pageModel: data.length, loading: false };
    }
    return { id: '', loading: false };
  }

  // pageModel 0 新增默认，1修改，2升级
  constructor(props) {
    super(props);
    const guuid = guid();
    this.state = {
      pageModel: 0,
      imageUrl: '',
      loading: false,
      id: '',
      guuid,
      visible: false,
      parameterVisible: false,
      paramter: [], // 用于保存参数
      taskList: [],
      ids: [],
      sonIds: [],
      versionOpen: false, // 升级版本可以选择
      selectVersion: '', // 选择的版本值
      versionType: null, // 可以选择的版本
      picture: '',
      processData: [],
      buttonLoading: false,
      taskLoading: false,
      pageLoading: true,
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getDetails();
    } else {
      this.setState({
        paramter: [
          {
            sortNo: '',
            groupName: 'no',
            groupDesc: '',
            params: [],
          },
        ],
      });
      setTimeout(
        () =>
          this.setState({
            pageLoading: false,
          }),
        500,
      );
    }
  }

  getDetails = () => {
    const data = this.props.match.params.id.split('-');
    api.getProcessDetail(data[0]).then(res => {
      let itemIndex = 0;
      if (res.groups) {
        res.groups.map((item, index) => {
          if (item.groupName === 'no') {
            itemIndex = index;
          }
          return true;
        });
      }

      if (itemIndex) {
        const itemData = res.groups.splice(itemIndex, 1);
        res.groups.unshift(itemData[0]);
      }
      this.getData(res.taskModels);
      this.setState({
        paramter: res.groups ? res.groups : [],
        taskList: res.taskModels,
        picture: res.picture,
        loading: true,
        processData: res,
        pageLoading: false,
        imageUrl: disk.downloadFiles(res.picture, { view: true }),
      });
      this.props.dispatch({
        type: 'processModel/setProcessDetail',
        payload: {
          ...res,
        },
      });

      if (res.version) {
        this.setState({
          versionType: versionFun(res.version),
        });
      }
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
          picture: info.file.response[0],
        }),
      );
    }
  };

  // 导航列表title样式
  navContent = processData => {
    const { pageModel } = this.state;
    if (pageModel) {
      return <div>{`${processData.name} ${processData.id}`}</div>;
    }
    return '';
  };

  // 流程模型列表title样式
  titleContent = () => <div style={{ fontWeight: 'bolder', padding: '8px' }}>任务列表</div>;

  // 提交上传
  onFinish = values => {
    this.setState({
      buttonLoading: true,
    });
    const {
      imageUrl,
      guuid,
      taskList,
      selectVersion,
      pageModel,
      id,
      picture,
      paramter,
    } = this.state;
    // const { processAddData } = this.props;
    const data = {};
    const taskModelIds = [];
    taskList.forEach(item => {
      taskModelIds.push({ taskModelId: item.id, automatic: item.automatic });
    });
    if (imageUrl) {
      data.picture = guuid;
    }
    data.name = values.name.trim();
    data.describe = values.describe.trim();
    data.interactionAnalysis = values.interactionAnalysis ? 1 : 2;
    data.version = selectVersion || 'V1.0';
    data.taskModels = taskModelIds;
    data.picture = picture;
    data.groups = paramter;
    delete data.taskModelIds;

    try {
      if (isEmpty(data.picture)) throw new Error('图片不能为空！');
      if (isEmpty(data.name)) throw new Error('流程名称不能为空！');
      if (isEmpty(data.describe)) throw new Error('流程描述不能为空！');
    } catch (e) {
      this.setState({
        buttonLoading: false,
      });
      return message.error(e.message);
    }

    if (pageModel === 1) {
      data.id = id;
      api
        .changeProcess(data)
        .then(() => {
          this.setState({
            buttonLoading: false,
          });
          router.push('/project/process-model');
        })
        .catch(() => {
          this.setState({
            buttonLoading: false,
          });
        });
    }
    if (pageModel === 2) {
      api
        .upgradeProcess(id, data)
        .then(() => {
          this.setState({
            buttonLoading: false,
          });
          router.push('/project/process-model');
        })
        .catch(() => {
          this.setState({
            buttonLoading: false,
          });
        });
    }
    if (!pageModel) {
      api
        .addProcess(data)
        .then(() => {
          this.setState({
            buttonLoading: false,
          });
          router.push('/project/process-model');
        })
        .catch(() => {
          this.setState({
            buttonLoading: false,
          });
        });
    }
    return true;
  };

  // 点击打开关联
  onOpen = () => {
    this.setState({
      visible: true,
      parameterVisible: false,
    });
  };

  // 点击关闭关联
  onClose = v => {
    if (v === 'close') {
      this.setState({
        taskLoading: !!v,
        visible: false,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  };

  // 打开参数
  handleOpen = () => {
    const { paramter } = this.state;
    if (paramter) {
      this.setState({
        parameterVisible: true,
      });
    } else {
      message.warning('没有参数可以分类');
    }
  };

  // 关闭参数
  handleClose = value => {
    const newData = value.map((item, index) => ({ ...item, sortNo: index }));
    const sonData = newData;
    newData.map((item, index) => {
      sonData[index].params = item.params.map((i, ind) => {
        const iLength = item.params.length;
        return { ...i, sortNo: iLength - ind };
      });
      return true;
    });
    sonData[0].sortNo = 0;
    this.setState({
      parameterVisible: false,
      paramter: sonData,
    });
  };

  // 删除任务
  handleDelete = value => {
    const { taskList, ids, sonIds, paramter } = this.state;
    const data = taskList;
    // const { ids, sonIds } = this.props;
    const idsData = ids;
    const sonIdsData = sonIds;
    const { preTaskIds } = value;
    // data = [...taskList, ...value];
    // value.forEach(item => {
    //   idsData.push(item.id);
    //   sonIdsData.push(...item.preTaskIds);
    // });
    const newData = data.filter(item => item.id !== value.id);
    const newIdsData = idsData.filter(item => item !== value.id);

    if (preTaskIds.length !== 0) {
      preTaskIds.forEach(i => {
        sonIdsData.some((item, index) => {
          if (i === item) {
            sonIdsData.splice(index, 1);
          }
          return true;
        });
      });
    }
    // 删除参数分类里的数据
    // let paramterData = paramter;
    if (paramter) {
      const paramterData = paramter.map(item => {
        const params = item.params.filter(i => i.taskModelId !== value.id);
        return { ...item, params };
      });
      this.setState({
        paramter: paramterData,
      });
    }

    this.setState({
      taskList: newData,
      ids: newIdsData,
      sonIds: sonIdsData,
    });
  };

  // 获取子级数据
  getData = value => {
    const { taskList, ids, sonIds, paramter } = this.state;
    // const { processAddData } = this.props;
    this.setState({
      taskLoading: true,
    });
    const oldModelProcess = paramter;
    let data = taskList;
    const idsData = ids;
    const sonIdsData = sonIds;
    data = [...taskList, ...value];
    value.forEach(item => {
      if (item.params && item.params.length !== 0) {
        item.params.forEach(i => {
          if (i.paramId) {
            oldModelProcess[0].params.push({
              paramId: i.paramId,
              paramName: i.paramName,
              taskModelId: i.taskModelId,
            });
          }
        });
      }
    });
    value.forEach(item => {
      idsData.push(item.id);
      sonIdsData.push(...item.preTaskIds);
    });

    const uuids = data.map(e => e.picture);
    disk
      .getFiles({
        sourceCode: uuids.join(','),
        sourceKey: 'project_process_model',
      })
      .then(v => {
        if (v) {
          const newList = data.map(e => {
            const filterItem = v.filter(item => item.sourceCode === e.picture);
            const fileId = filterItem[0] && filterItem[0].id;
            return {
              ...e,
              fileId,
            };
          });
          this.setState({
            taskList: newList,
          });
        } else {
          const newList = data.map(e => {
            const fileId = '';
            return {
              ...e,
              fileId,
            };
          });
          this.setState({
            taskList: newList,
          });
        }
      });

    this.setState({
      taskList: data,
      ids: idsData,
      sonIds: sonIdsData,
      paramter: oldModelProcess,
      taskLoading: false,
    });
  };

  // 修改任务列表的开关
  changeIsAutomatic = (row, index) => {
    const { taskList } = this.state;
    const newTaskList = taskList;
    if (newTaskList[index].automatic === 1) {
      newTaskList[index].automatic = 2;
    } else {
      newTaskList[index].automatic = 1;
    }
    this.setState({
      taskList: newTaskList,
    });
  };

  render() {
    const uploadButton = (
      <div style={{ borderRadius: '50%' }}>
        {this.state.loading ? <LoadingOutlined /> : ''}
        {/* <div className="ant-upload-text">Upload</div> */}
      </div>
    );

    const {
      imageUrl,
      visible,
      parameterVisible,
      guuid,
      taskList,
      sonIds,
      ids,
      pageModel,
      selectVersion,
      versionOpen,
      versionType,
      paramter,
      processData,
      buttonLoading,
      taskLoading,
      pageLoading,
    } = this.state;

    const {
      project: { status },
    } = this.props;
    if (pageModel !== 0 && processData.length === 0) {
      return false;
    }
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 320,
        render: (value, row) => (
          <>
            <Avatar
              src={row.fileId ? disk.downloadFiles(row.fileId, { view: true }) : DefaultHeadPicture}
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{value}</div>
              <div style={{ color: '#B9B9B9' }}>{row.name}</div>
            </div>
          </>
        ),
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 300,
        render: value => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            {value}
          </Tag>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 240,
        render: value => (
          <Badge
            status={formatter(status, value, 'value', 'status')}
            text={formatter(status, value, 'value', 'text')}
          />
        ),
      },
      {
        title: '自动运行',
        dataIndex: 'isAutomatic',
        width: 250,
        render: (value, row, index) => (
          <Switch
            disabled={value === 2}
            defaultChecked={row.automatic === 1}
            onChange={() => this.changeIsAutomatic(row, index)}
          />
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
                  onConfirm={() => this.handleDelete(row)}
                  okText="Yes"
                  cancelText="No"
                >
                  <a>
                    <img src={deletePic} alt="" width="16" height="16" />
                  </a>
                </Popconfirm>
              </>
            );
          }
          return true;
        },
      },
    ];

    const uploadUrl = disk.uploadMoreFiles('project_process_model', guuid);

    // 设置默认值
    const initialValues = () => {
      if (pageModel) {
        const defaultData = {
          name: processData.name,
          describe: processData.describe,
          interactionAnalysis: processData.interactionAnalysis === 1,
        };
        return defaultData;
      }
      return '';
    };
    return (
      <PageHeaderWrapper title={this.navContent(processData)}>
        <Spin spinning={pageLoading}>
          <Form onFinish={this.onFinish} initialValues={initialValues()}>
            <Card className="process-model-edit" style={{ paddingTop: '5px', height: '220px' }}>
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
                  style={{ width: '60px', height: '60px' }}
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
              <div style={{ float: 'left', width: '620px', marginLeft: '20px' }}>
                <Form.Item name="name">
                  <Input placeholder="请输入流程名称" />
                </Form.Item>
                <Form.Item name="describe">
                  <Input.TextArea placeholder="请输入流程描述" rows={4} />
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
                    {pageModel ? selectVersion || processData.version : 'V1.0'}
                    {/* {selectVersion || processDetail.version} */}
                  </Tag>
                  {versionOpen && pageModel === 2 ? (
                    <Card
                      style={{ position: 'absolute', zIndex: '100', top: '28px' }}
                      hoverable
                      className="padding-none"
                    >
                      {versionType.length !== 0
                        ? versionType.map(item => (
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
                          ))
                        : ''}
                    </Card>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              {/* 交互分析 */}
              <div style={{ float: 'right', marginRight: '80px', marginTop: '5px' }}>
                <span style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '10px' }}>
                  交互分析：
                </span>
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
              {/* 参数 */}
              <div
                style={{ float: 'right', marginRight: '40px', fontSize: '16px', marginTop: '5px' }}
              >
                <a
                  onClick={() => {
                    this.handleOpen();
                  }}
                  style={{ marginLeft: '10px', marginRight: '20px', fontSize: '16px' }}
                >
                  参数
                </a>
              </div>
            </Card>

            <Card
              style={{ marginTop: '24px' }}
              title={this.titleContent()}
              className="table-style-set taskList"
            >
              <Spin spinning={taskLoading}>
                <Table
                  rowKey="id"
                  dataSource={taskList}
                  columns={columns}
                  rowClassName="editable-row"
                  pagination={false}
                />
              </Spin>
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
                选择任务模型
              </Button>
            </Card>

            <Card
              style={{ height: '48px', width: '100%', position: 'fixed', bottom: '0', left: '0' }}
            >
              <Button
                type="primary"
                style={{ float: 'right', marginTop: '-16px' }}
                htmlType="submit"
                loading={buttonLoading}
              >
                提交
              </Button>
            </Card>
          </Form>
          {visible ? (
            <div>
              <AssociatedProcessModel
                visible={visible}
                onClose={v => this.onClose(v)}
                getData={v => this.getData(v)}
                ids={ids}
              />
            </div>
          ) : (
            ''
          )}
          {/* 参数弹框 */}
          {parameterVisible ? (
            <Parameter
              visible={parameterVisible}
              handleClose={value => this.handleClose(value)}
              paramter={paramter}
            />
          ) : (
            ''
          )}
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, user, project, processModel }) => ({
  languageCode: global.languageCode,
  authorization: user.currentUser.authorization,
  project,
  // processAddData: processModel.processAddData,
  processDetail: processModel.processDetail,
  // ids: processModel.ids,
  // sonIds: processModel.sonIds,
}))(ProcessEdit);
