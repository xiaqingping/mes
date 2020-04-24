import React, { Component } from 'react';
import { Progress, Button } from 'antd';
import api from '@/pages/project/api/projectManageDetail';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';

/**
 * 流程进度局部刷新
 */
class ProgressMould extends Component {
  state = {
    percent: this.props.percentData.processProgress,
    status: this.props.percentData.status,
    percentData: this.props.percentData,
  };

  componentDidMount() {
    const { percentData } = this.props;
    if (percentData.status === 2) {
      this.interval = setInterval(() => {
        api.getProcessesProgress({ processIdList: [percentData.id].join(',') }).then(res => {
          this.setState({
            percent: res[0].processProgress,
            status: res[0].status,
          });
        });
      }, 10000);
    }
  }

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
          onClick={() => this.props.processStart(percentData)}
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
            onClick={() => this.props.processPause(percentData)}
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
            onClick={() => this.props.processStart(percentData)}
          />
        </>
      );
    }
    return <ProgressMould percentData={percentData} />;
  }
}

export default ProgressMould;
