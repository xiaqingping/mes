import React from 'react';
import { Avatar, Tag, Spin, message, Popover } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import { versionSort } from '@/utils/utils';
import ArgumentModel from './argumentModel';
import '../index.less';

/**
 * 任务模型查看抽屉的title
 */
class TitleModel extends React.Component {
  state = {
    open: false,
    viewData: {},
    versionOpen: false,
    selectVersion: null,
    versionType: [],
    viewVisible: false,
    toViewArgument: false,
    loading: false,
  };

  /**
   * 加载完成，获取当前任务模型的具体信息
   */
  componentDidMount() {
    const { viewId } = this.props.taskModel.taskModel;
    if (viewId) {
      api
        .getTaskModelDetail(viewId)
        .then(res => {
          this.setState({
            loading: true,
          });

          this.setState({
            viewData: res,
          });
          if (res.versions) {
            const vers = versionSort(res.versions).map(item => {
              let newItem = item;
              newItem = `V${item}`;
              return newItem;
            });
            this.setState({
              versionType: vers,
              loading: false,
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
          });
        });
    }
  }

  /**
   * 切换版本
   * @param {String} 版本号
   */
  switchVersion = item => {
    const { versionOpen, viewData } = this.state;

    this.setState(
      {
        selectVersion: item,
        versionOpen: !versionOpen,
      },
      () => {
        this.getDetailByCodeVer(viewData.code, this.state.selectVersion);
      },
    );
  };

  /**
   * 禁用模型
   */
  handleForbidden = id => {
    this.setState({
      loading: true,
    });
    api
      .forbiddenTaskModel(id)
      .then(() => {
        this.setState({
          loading: false,
        });
        message.success('任务模型已禁用!');
        this.props.reload('1', id);
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
        this.props.reload(null);
      });
  };

  /**
   * 根据code和版本获取详细信息
   * @param {String} code 任务模型code
   * @param {String} version 模型版本
   */
  getDetailByCodeVer = (code, version) => {
    const { dispatch } = this.props;
    api.getdetailByCodeVer(code, version).then(res => {
      this.setState({
        viewData: res,
      });
      this.props.emitData(res.id);
      dispatch({
        type: 'taskModel/setViewId',
        payload: res.id,
      });
    });
  };

  /**
   * 设置当前任务模型的参数id
   * @param {Object} item 当前任务模型的详细信息
   */
  viewParams = item => {
    this.setState({
      viewVisible: true,
    });

    const { dispatch } = this.props;

    dispatch({
      type: 'taskModel/setViewParamsId',
      payload: item.id,
    });
    this.setState({
      toViewArgument: true,
    });
  };

  /**
   * 关闭抽屉， 消除数据
   */
  onViewClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskModel/setFirstOpenParams',
      payload: true,
    });
    this.setState({
      viewVisible: false,
      toViewArgument: false,
    });
  };

  /**
   * 切换版本的popover的DOM结构
   * @param {Array} versionType 模型的所有版本号
   * @param {String} selectVersion 选择的版本号
   * @param {Object} viewData 当前模型的详细信息
   */
  popoverContent = (versionType, selectVersion, viewData) => {
    return versionType.map(item => (
      <div>
        <Tag
          key={item}
          color={item === (selectVersion || viewData.version) ? 'green' : ''}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            this.switchVersion(item);
          }}
        >
          {item}
        </Tag>
      </div>
    ));
  };

  render() {
    const {
      viewData,
      open,
      versionOpen,
      selectVersion,
      versionType,
      viewVisible,
      toViewArgument,
      loading,
    } = this.state;

    return loading ? (
      <div style={{ textAlign: 'center' }}>
        <Spin />
      </div>
    ) : (
      <div>
        <div
          style={{
            marginTop: '6px',
            height: 63,
            display: 'flex',
            justifyContent: 'space-between',
          }}
          className="classVersion"
        >
          <div style={{ display: 'flex' }}>
            <div>
              <Avatar
                src={viewData.picture ? disk.downloadFiles(viewData.picture, { view: true }) : ''}
                style={{ marginRight: 10 }}
                size="large"
              />
            </div>
            <div style={{ fontWeight: '900', marginRight: '30px' }}>
              <div style={{ fontWeight: '700' }}>{viewData.code}</div>
              <div style={{ height: '50px', overflow: 'auto' }}>{viewData.name}</div>
            </div>
          </div>

          <div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Popover
                visible={versionOpen && (versionType || []).length > 1}
                overlayClassName="task_model_view_version_tag"
                placement="bottom"
                content={
                  (versionType || []).length > 1 &&
                  this.popoverContent(versionType, selectVersion, viewData)
                }
              >
                <Tag
                  // color="green"
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.setState({ versionOpen: true })}
                >
                  {selectVersion || viewData.version}
                </Tag>
              </Popover>
            </div>
          </div>

          <div style={{ marginLeft: 30 }} onClick={() => this.viewParams(viewData)}>
            <div className="task_model_add_task_icon" />
          </div>

          <div style={{ marginLeft: 40, fontSize: '14px' }}>
            {(viewData.status * 1 === 2 || viewData.status * 1 === 4) && (
              <div
                style={{ marginRight: '16px', color: 'red', cursor: 'pointer', marginLeft: 16 }}
                onClick={() => {
                  this.handleForbidden(viewData.id);
                }}
              >
                禁用
              </div>
            )}
            <div
              style={{ marginTop: 12, fontSize: 13, marginRight: -2, textAlign: 'right' }}
              className="classIsOpen"
            >
              {open ? (
                <a
                  href="#"
                  onClick={() => this.setState({ open: !open })}
                  style={{ marginRight: 7 }}
                >
                  收起
                  <UpOutlined />
                </a>
              ) : (
                <a href="#" onClick={() => this.setState({ open: !open })}>
                  展开 &nbsp;
                  <DownOutlined />
                </a>
              )}
            </div>
          </div>
        </div>
        {open && (
          <div style={{ marginLeft: '62px', color: '#858585', fontSize: '14px', marginBottom: 20 }}>
            <div>{viewData.publisherName}</div>
            <div style={{ marginBottom: '7px' }}>{viewData.publishDate}</div>
            <div style={{ width: '400px' }}>{viewData.describe}</div>
          </div>
        )}

        {toViewArgument && (
          <ArgumentModel visible={viewVisible} onClose={this.onViewClose} fromView />
        )}
      </div>
    );
  }
}

export default connect(taskModel => ({
  taskModel,
}))(TitleModel);
