import React, { Component } from 'react';
import { Progress, Button } from 'antd';
import api from '@/pages/project/api/projectManageDetail';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

/**
 * 流程进度局部刷新
 */
class ProgressMould extends Component {
  state = {
    percent: this.props.percentData.processProgress,
    status: this.props.percentData.status,
    percentData: this.props.percentData,
  };

  /** 组件加载 */
  componentDidMount() {
    this.getDelayData()
  }

  /** 定时器 */
  // eslint-disable-next-line react/sort-comp
  getDelayData = () => {
    const { percentData } = this.props;
    if (percentData.status === 2) {
      this.interval = setInterval(() => {
        console.log(123);
        this.getProcessesProgressData(percentData);
      }, 10000);
    }
  };

  /**
   * 查询流程进度及状态
   * @param {object} percentData 回传数据
   *  */
  getProcessesProgressData = percentData => {
    const { setStatus } = this.props
    api.getProcessesProgress({ processIds: [percentData.id].join(',') }).then(res => {
      if (res[0].status === 4) {
        clearInterval(this.interval);
        setStatus()
      }
      this.setState({
        percent: res[0].processProgress,
        status: res[0].status,
      });
    });
  };

  /**
   * 流程进度开始
   * @param {object} row 回传数据
   */
  processStart = row => {
    const { percentData } = this.props;
    api.startProcessesProcess(row.id).then(() => {
      this.getProcessesProgressData(percentData);
      this.interval = setInterval(() => {
        this.getProcessesProgressData(percentData);
      }, 1000)
    })
  }

  /**
   * 流程进度暂停
   * @param {object} row 回传数据
   */
  processPause = row => {
    const { percentData } = this.props;
    api.pauseProcessesProcess(row.id).then(() => {
      this.getProcessesProgressData(percentData);
    });
  };

  /** 组件销毁前 */
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { percent, status, percentData } = this.state;
    if (percent === '' || percent === undefined || percent === null) return false;
    const val = percent.toFixed(2) * 100;
    if (status === 1) {
      return (
        <Button
          onClick={() => this.processStart(percentData)}
          type="primary"
          style={{ borderRadius: '50px' }}
        >
          运行
        </Button>
      );
    }
    if (status === 2) {
      return (
        <>
          <Progress percent={val} size="small" style={{ float: 'left', width: '80%' }} />
          <PauseCircleOutlined
            style={{ marginLeft: '10px' }}
            onClick={() => this.processPause(percentData)}
          />
        </>
      );
    }
    if (status === 3) {
      return (
        <>
          <Progress percent={val} size="small" style={{ float: 'left', width: '80%' }} />
          <PlayCircleOutlined
            style={{ marginLeft: '10px' }}
            onClick={() => this.processStart(percentData)}
          />
        </>
      );
    }
    return <Progress percent={val} size="small" style={{ float: 'left', width: '80%' }} />;
  }
}

export default ProgressMould
