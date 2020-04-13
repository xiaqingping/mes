import React from 'react';
import { Avatar, Tag, Card, message, Spin } from 'antd';
import { DownOutlined, UpOutlined, SettingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import router from 'umi/router';
import api from '@/pages/project/api/taskmodel';
import ArgumentModel from './argumentModel';
import disk from '@/pages/project/api/disk';
import { versionSort } from '@/utils/utils';
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
          const uuids = res.picture;
          disk
            .getFiles({
              sourceCode: uuids,
              sourceKey: 'project_task_model',
            })
            .then(v => {
              const newList = { ...res, fileId: (v[0] || {}).id };
              this.setState({
                viewData: newList,
              });
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
    console.log(item);

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
    this.props.reload('1', id);
  };

  // 根据code和版本获取详细信息

  getDetailByCodeVer = (code, version) => {
    console.log(this.props);
    const { dispatch } = this.props;
    console.log(dispatch);
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
    console.log(this.props);
    // TODO 获取数据参数数据
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
    });
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
      // style={{ borderBottom: '1px solid #f0f0f0' }}
      <div>
        <div
          style={{
            marginTop: '6px',
            // overflow: 'auto',
            // position: 'relative',

            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex' }}>
            <div>
              <Avatar
                src={viewData.fileId ? disk.downloadFiles(viewData.fileId, { view: true }) : ''}
                style={{ marginRight: 10 }}
                size="large"
              />
            </div>
            <div style={{ fontWeight: '900' }}>
              <div style={{ fontWeight: '700', width: 170 }}>{viewData.code}</div>
              <div style={{ width: 170, height: '50px' }}>{viewData.name}</div>
            </div>
          </div>

          <div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Tag
                // color="green"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.setState({ versionOpen: !versionOpen });
                }}
              >
                {selectVersion || viewData.version}
                {/* {selectVersion || processDetail.version} */}
              </Tag>
              {versionOpen && (versionType || []).length > 1 && (
                <Card
                  style={{ position: 'absolute', zIndex: '100', top: '28px' }}
                  hoverable
                  className="padding-none"
                >
                  {(versionType || []).length > 1 &&
                    versionType.map(item => (
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
                    ))}
                </Card>
              )}
            </div>
          </div>

          <div style={{ marginLeft: 40 }} onClick={() => this.viewParams(viewData)}>
            <div className="task_model_add_task_icon" />
          </div>

          <div style={{ marginLeft: 68, fontSize: '14px' }}>
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
            <div style={{ marginTop: 12, fontSize: 13, marginRight: -2, textAlign: 'right' }}>
              {open ? (
                <a href="#" onClick={() => this.setState({ open: !open })}>
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
          <div style={{ marginLeft: '40px', color: '#858585', fontSize: '14px', marginBottom: 20 }}>
            <div>某某某发布人</div>
            <div style={{ marginBottom: '20px' }}>(2017-01-12 13:55:34)</div>
            <div style={{ width: '400px' }}>
              该任务旨在分析肠道微生物与肥胖之间的关系。本次实验分析共，该任务旨在分析肠道微生物与肥胖之间的关系。
            </div>
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
