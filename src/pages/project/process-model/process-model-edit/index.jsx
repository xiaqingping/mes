/* eslint-disable array-callback-return */
/** 流程模型的编辑 用于新增、修改、升级 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  message,
  Tag,
  Switch,
  Table,
  Button,
  Popconfirm,
  Form,
  Badge,
  Avatar,
  Spin,
  Row,
  Col,
  Menu,
  Dropdown,
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
import TopPages from '@/pages/project/process-model/components/EditTop';

/**
 * 图片转换Base64
 * @param {object} img 图片
 * @param {Function} callback 回调的结果
 */
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
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

  /**
   * 根据URL的ID，去获取详情信息
   */
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

  /**
   * 根据URL的ID，去获取详情信息
   */
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
        type: 'processModel/setValue',
        payload: {
          ...res,
        },
        key: 'processDetail',
      });

      if (res.version) {
        this.setState({
          versionType: versionFun(res.version),
        });
      }
    });
  };

  /**
   * 图片上传
   * @param {object} info 上传的对象
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
  };

  /**
   * 导航列表title样式
   * @param {object} processData 详情数据
   */
  navContent = processData => {
    const { pageModel } = this.state;
    if (pageModel) {
      return <div>{`${processData.name} ${processData.code}`}</div>;
    }
    return '';
  };

  /** 流程模型列表title样式 */
  titleContent = () => <div style={{ fontWeight: 'bolder', padding: '8px' }}>任务列表</div>;

  /**
   * 提交上传
   * @param {object} values 提交保存的数据
   */
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

  /** 点击打开关联 */
  onOpen = () => {
    this.setState({
      visible: true,
      parameterVisible: false,
    });
  };

  /** 点击关闭关联 */
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

  /** 打开参数 */
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

  /**
   * 关闭参数
   * @param {Array} value 参数的数据
   */
  handleClose = value => {
    const newData = value.map((item, index) => ({ ...item, sortNo: index }));
    const sonData = newData;
    newData.map((item, index) => {
      sonData[index].params = item.params.map((i, ind) => ({ ...i, sortNo: ind }));
    });
    sonData[0].sortNo = 0;
    this.setState({
      parameterVisible: false,
      paramter: sonData,
    });
  };

  /**
   * 删除任务
   * @param {object} value 删除的id
   */
  handleDelete = value => {
    const { taskList, ids, sonIds, paramter } = this.state;
    const data = taskList;
    const idsData = ids;
    const sonIdsData = sonIds;
    const { preTaskIds } = value;
    const newData = data.filter(item => item.id !== value.id);
    const newIdsData = idsData.filter(item => item !== value.id);

    if (preTaskIds.length) {
      preTaskIds.forEach(i => {
        // eslint-disable-next-line consistent-return
        sonIdsData.some((item, index) => {
          if (i === item) {
            sonIdsData.splice(index, 1);
            return true;
          }
        });
      });
    }

    // 删除参数分类里的数据
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

  /**
   * 判断有没有重复的样品，分组和环境因子
   * @param {Array} value 新添加的值
   * @param {Array} taskList 原有的值
   */
  judgeFunction = (value, taskList) => {
    const { project } = this.props;
    let flag = false;
    const type = [];
    if (value.length) {
      value.map(item => {
        console.log(item.params);
        item.params.map(it => {
          type.push(it.type);
        });
      });
    }
    if (taskList.length) {
      taskList.map(item => {
        item.params.map(it => {
          type.push(it.type);
        });
      });
    }
    ['sample_select', 'sample_group', 'sample_environment_factor'].forEach(item => {
      if (type.reduce((a, v) => (v === item ? a + 1 : a + 0), 0) > 1) {
        message.error(`${formatter(project.formItemType, item, 'type', 'text')}不能重复添加`);
        flag = true;
      }
    });
    return flag;
  };

  /**
   * 获取子级数据
   * @param {Array} value 任务选择获取的数据
   */
  getData = value => {
    const { taskList, ids, sonIds, paramter } = this.state;
    this.setState({
      taskLoading: true,
    });
    // 判断有没有重复的样品，分组和环境因子
    if (this.judgeFunction(value, taskList)) {
      this.setState({
        taskLoading: false,
      });
      return false;
    }
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

    this.setState({
      taskList: data,
      ids: idsData,
      sonIds: sonIdsData,
      paramter: oldModelProcess,
      taskLoading: false,
    });
  };

  // 修改任务列表的开关
  /**
   * 修改任务列表的开关
   * @param {object} row 当前行的对象
   * @param {Int} index 当前行的键
   */
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
      <div style={{ borderRadius: '50%' }}>{this.state.loading ? <LoadingOutlined /> : ''}</div>
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
    if (pageModel === 2 && !versionType) return false;
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 320,
        render: (value, row) => (
          <>
            <Avatar
              src={
                row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
              }
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
    let menu = '';
    if (pageModel === 2) {
      menu = (
        <Menu>
          {versionType.length !== 0
            ? versionType.map(item => (
                <Menu.Item
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
                </Menu.Item>
              ))
            : ''}
        </Menu>
      );
    }

    // 设置默认值
    const initialValues = () => {
      if (pageModel) {
        return {
          name: processData.name,
          describe: processData.describe,
          interactionAnalysis: processData.interactionAnalysis === 1,
        };
      }
      return {
        interactionAnalysis: processData.interactionAnalysis === undefined,
      };
    };
    return (
      <PageHeaderWrapper title={this.navContent(processData)}>
        <Spin spinning={pageLoading}>
          <Form onFinish={this.onFinish} initialValues={initialValues()}>
            {/* 编辑页面的上部操作部分 */}
            <Card className="process-model-edit" style={{ paddingTop: '5px', minWidth: '600px' }}>
              <Row>
                <Col xxl={14}>
                  {/* 上传和2个输入框 */}
                  <TopPages
                    uploadUrl={uploadUrl}
                    authorization={this.props.authorization}
                    handleChange={this.handleChange}
                    imageUrl={imageUrl}
                    uploadButton={uploadButton}
                  />
                  {/* 版本选择 */}
                  <div style={{ float: 'left', width: '10%' }}>
                    <div
                      style={{ position: 'relative', display: 'inline-block', marginLeft: '30px' }}
                    >
                      {pageModel === 2 ? (
                        <Dropdown overlay={menu} trigger={['click']}>
                          <Tag color="green" style={{ cursor: 'pointer' }}>
                            {pageModel ? selectVersion || processData.version : 'V1.0'}
                          </Tag>
                        </Dropdown>
                      ) : (
                        <Tag color="green" style={{ cursor: 'pointer' }}>
                          {pageModel ? selectVersion || processData.version : 'V1.0'}
                        </Tag>
                      )}
                    </div>
                  </div>
                </Col>
                <Col xxl={10}>
                  {/* 交互分析 */}
                  <div style={{ float: 'right', marginRight: '80px' }}>
                    <span
                      style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '10px' }}
                    >
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
                    style={{
                      float: 'right',
                      marginRight: '40px',
                      fontSize: '16px',
                    }}
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
                </Col>
              </Row>
            </Card>

            {/* 任务table的显示 */}
            <Card style={{ marginTop: '24px', marginBottom: '70px' }} title={this.titleContent()}>
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

            {/* 提交按钮 */}
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
            <AssociatedProcessModel
              visible={visible}
              onClose={v => this.onClose(v)}
              getData={v => this.getData(v)}
              ids={ids}
            />
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
  processDetail: processModel.processDetail,
}))(ProcessEdit);
