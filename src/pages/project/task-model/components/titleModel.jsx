import React from 'react';
import { Avatar, Tag, Spin, message, Popover } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import { versionSort } from '@/utils/utils';
import ArgumentModel from './argumentModel';
import '../index.less';

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
              item = `V${item}`;
              return item;
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

  // 切换版本
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

  // 点击禁用， 禁用任务
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
        // this.updateListData(id);
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
        this.props.reload(null);
      });
    // this.props.reload('1', id);
  };

  // 根据code和版本获取详细信息

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

  onViewClose = () => {
    this.setState({
      viewVisible: false,
      toViewArgument: false,
    });
  };

  popoverContent = (versionType, selectVersion, viewData) => {
    console.log(versionType);
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
          <div style={{ marginLeft: '50px', color: '#858585', fontSize: '14px', marginBottom: 20 }}>
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
