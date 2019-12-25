import React from 'react';
import { GroupColumn } from '@antv/g2plot';
import api from '@/api';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnPlot: undefined,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    api.temporary.getXXX({
      monthDateBegin: '201901', monthDateEnd: '201912',
    }).then(res => {
      const columnPlot = new GroupColumn(document.getElementById('container'), {
        title: {
          visible: true,
          text: '销售额趋势',
        },
        forceFit: false,
        data: res,
        width: 800,
        height: 500,
        xField: 'monthDate',
        yField: 'amount',
        xAxis: {
          line: {
            visible: true,
          },
          title: {
            text: '年月份',
          },
        },
        yAxis: {
          line: {
            visible: true,
          },
          tickInterval: 10,
          title: {
            text: '销售额',
          },
        },
        legend: {
          visible: true,
          position: 'right-center',
        },
        // grid: {
        //   visible: true,
        // },
      });
      this.setState({
        columnPlot,
      });
      columnPlot.render();
    })
  }

  // 接收父组件的参数
  passData = data => {
    const { columnPlot } = this.state;
    columnPlot.changeData(data);
  };

  render() {
    return (
      <>
        <div id="container"></div>
      </>
    );
  }
}
export default Chart;
