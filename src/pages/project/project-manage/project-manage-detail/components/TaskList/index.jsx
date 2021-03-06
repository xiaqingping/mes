/** 任务列表 抽屉 */
import React, { Component } from 'react';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import { formatter } from '@/utils/utils';
import { Drawer, Card, List, Avatar, Table, Badge, Tooltip, Tag } from 'antd';
import {
  DownOutlined,
  UpOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';

/** 静态资源 */
import canshu from '@/assets/imgs/canshu@1x.png';
import clock from '@/assets/imgs/clock.png';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';

import { calculateTimeDifference } from '../../functions';
import TaskExecRecordParam from '../TaskExecRecordParam';

/** 自定义样式 */
import style from './index.less';

class TaskList extends Component {
  state = {
    visibleParam: false,
    openId: [],
    // 任务执行记录参数 所需数据
    paramForData: [],
  };

  /** 获取此页面需要用到的基础数据 */
  getCacheData = () => {};

  /**
   * 是否显示执行记录表
   * @param {string} id 数据listId
   * @param {string} type 类型
   */
  showTable = (id, type) => {
    const { openId } = this.state;
    const newData = openId;

    if (type === 1) {
      newData.push(id);
    }
    if (type === 2) {
      let index = null;
      openId.forEach((item, ind) => {
        if (item === id) {
          index = ind;
        }
      });
      newData.splice(index, 1);
    }

    this.setState({
      openId: newData,
    });
  };

  /**
   * 提示框 时间信息
   * @param {object} row 回传数据
   */
  time = row => {
    if (row.status === 1) {
      return <span>未开始</span>;
    }
    if (row.status === 4) {
      return (
        <>
          <span>开始：{row.beginDate}</span>
          <br />
          <span>结束：{row.endDate}</span>
        </>
      );
    }
    return <span>开始：{row.beginDate}</span>;
  };

  /** 任务执行记录开始运行 */
  startExecRecord = row => {
    api.startExecRecord(row.id).then(() => {
      this.props.onClose();
    });
  };

  /** 任务执行记录暂停运行 */
  pauseExecRecord = row => {
    api.pauseExecRecord(row.id).then(() => {
      this.props.onClose();
    });
  };

  /**
   * 查看任务执行记录参数
   * @param {object} row 行数据
   */
  searchParameter = row => {
    const data = {
      paramValues: row.taskExecRecordParams,
      taskExecRecordId: row.id,
      taskModelId: row.taskModelId,
    };
    this.setState({ visibleParam: true, paramForData: data });
  };

  /** 关闭 任务执行记录参数抽屉 */
  onCloseParam = () => {
    this.setState({
      visibleParam: false,
    });
  };

  render() {
    const { visibleParam, openId, paramForData } = this.state;
    const { detailList, taskList, visible } = this.props;
    const { execRecordStatus } = this.props.projectDetail;

    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 180,
        render: (value, row) => (
          <>
            <span>{value}</span>
            <img
              src={canshu}
              alt=""
              className={style.canshu}
              onClick={() => this.searchParameter(row)}
            />
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 180,
        render: (value, row) => {
          const name = formatter(execRecordStatus, value);
          const status = formatter(execRecordStatus, value, 'id', 'status');
          return (
            <>
              <Badge status={status} text={name} />
              <Tooltip title={this.time(row)}>
                <img src={clock} alt="" className={style.clock} />
              </Tooltip>
            </>
          );
        },
      },
      {
        title: '',
        dataIndex: 'status',
        width: 60,
        render: (value, row) => {
          const duration = calculateTimeDifference(row.beginDate, row.endDate);
          if (value === 4) {
            return duration;
          }
          if (value === 1) {
            return <PauseCircleOutlined onClick={() => this.pauseExecRecord(row)} />;
          }
          if (value === 3) {
            return (
              <PlayCircleOutlined
                style={{ color: '#1890ff' }}
                onClick={() => this.startExecRecord(row)}
              />
            );
          }
          return '';
        },
      },
    ];
    return (
      <>
        <Drawer
          width="500px"
          title={detailList.name}
          closable={false}
          onClose={this.props.onClose}
          visible={visible}
          className="classDrawerTaskList"
        >
          <List
            dataSource={taskList}
            split={false}
            renderItem={item => (
              <List.Item key={item}>
                <Card hoverable style={{ width: '100%' }}>
                  <div className={style.FMLeft}>
                    <Avatar
                      src={
                        item.picture
                          ? disk.downloadFiles(item.picture, { view: true })
                          : DefaultHeadPicture
                      }
                      size="large"
                      className={style.floatLeft}
                    />
                    <div
                      style={{
                        position: 'relative',
                        top: -1,
                        left: 10,
                        paddingBottom: -5,
                      }}
                    >
                      <div>{item.code}</div>
                      <div className={style.name}>{item.name}</div>
                      <div className={style.version}>
                        <Tag color="green">{item.taskModelVersion}</Tag>
                      </div>
                    </div>
                  </div>
                  <div className={style.describe}>{item.describe}</div>

                  <div className={style.open}>
                    {openId.filter(i => i === item.id).length !== 0 ? (
                      <div>
                        <a onClick={() => this.showTable(item.id, 2)} style={{ float: 'right' }}>
                          <UpOutlined />
                        </a>
                        <div className={style.taskExecRecordTable}>
                          <Table
                            size="small"
                            columns={columns}
                            rowKey="id"
                            dataSource={item.taskExecRecords}
                            pagination={false}
                          />
                        </div>
                      </div>
                    ) : (
                      <a onClick={() => this.showTable(item.id, 1)}>
                        <DownOutlined />
                      </a>
                    )}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Drawer>
        {/* 任务执行记录参数 */}
        {visibleParam ? (
          <TaskExecRecordParam
            visible={visibleParam}
            paramList={paramForData}
            onClose={this.onCloseParam}
          />
        ) : (
          ''
        )}
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(TaskList);
