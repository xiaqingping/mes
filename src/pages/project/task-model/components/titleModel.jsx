import React from 'react';
import { Avatar, Tag, Card, Badge } from 'antd';
import { DownOutlined, UpOutlined, SettingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import api from '@/pages/project/api/taskmodel';
import ArgumentModel from './argumentModel';
import disk from '@/pages/project/api/disk';
import { formatter } from '@/utils/utils';

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
  };

  componentDidMount() {
    const { viewId } = this.props.taskModel.taskModel;
    if (viewId) {
      api.getTaskModelDetail(viewId).then(res => {
        // this.setState({
        //   viewData: res,
        // });
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

        if (res.version) {
          this.setState({
            versionType: res.versions,
          });
        }
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
    } = this.state;
    const { taskModelStatusOptions } = this.props.taskModel.taskModel;
    // console.log(this.props.taskModel);
    return (
      <>
        <div
          style={{
            marginTop: '25px',
            // overflow: 'auto',
            // position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Avatar
              src={viewData.fileId ? disk.downloadFiles(viewData.fileId, { view: true }) : ''}
              style={{ float: 'left', marginRight: 10 }}
              size="large"
            />
            <div style={{ fontWeight: '900', marginLeft: 10 }}>
              <div style={{ fontWeight: '700' }}>{viewData.code}</div>
              <div style={{ width: '200px', height: '50px', wordWrap: 'break-word' }}>
                {viewData.name}
              </div>
            </div>
          </div>

          <div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Tag
                color="green"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.setState({ versionOpen: !versionOpen });
                }}
              >
                {selectVersion || 'V1.0'}
                {/* {selectVersion || processDetail.version} */}
              </Tag>
              {versionOpen && (versionType || []).length > 1 && (
                <Card
                  style={{ position: 'absolute', zIndex: '10000000000', top: '28px' }}
                  hoverable
                  className="padding-none"
                >
                  {(versionType || []).length > 1 &&
                    versionType.map(item => (
                      <Tag
                        key={item}
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

          <div style={{ marginLeft: 30 }} onClick={() => this.viewParams(viewData)}>
            <SettingOutlined />
          </div>

          <div style={{ marginLeft: '85px', fontSize: '14px' }}>
            <Badge
              status={formatter(taskModelStatusOptions, viewData.status, 'value', 'status')}
              text={formatter(taskModelStatusOptions, viewData.status, 'value', 'label')}
            />
            <div style={{ marginTop: 15, fontSize: 12, marginLeft: 16 }}>
              {open ? (
                <a href="#" onClick={() => this.setState({ open: !open })}>
                  收起
                  <UpOutlined />
                </a>
              ) : (
                <a href="#" onClick={() => this.setState({ open: !open })}>
                  展开
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
      </>
    );
  }
}

export default connect(taskModel => ({
  taskModel,
}))(TitleModel);
