import React, { Component } from 'react';
import { Progress } from 'antd';
import api from '@/pages/project/api/projectManageDetail';


/**
 * 流程进度局部刷新
 */
class ProgressMould extends Component {
  state = {
    percent: this.props.percentData.processProgress,
  };

  componentDidMount() {
    const { percentData } = this.props;
    if (percentData.status === 2 || percentData.status === 3) {
      this.interval = setInterval(() => {
        api.getProcessesProgress({ processIdList: [percentData.id].join(',') }).then(res => {
          this.setState({
            percent: res[0].processProgress,
          });
        });
      }, 10000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { percent } = this.state;
    if (percent === '' || percent === undefined || percent === null ) return false;
    const val = percent.toFixed(2) * 100;
    return <Progress percent={val} size="small" style={{ float: 'left', width: '80%' }} />;
  }
}

export default ProgressMould;
