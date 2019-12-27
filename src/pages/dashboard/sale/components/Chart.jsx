import React from 'react';
import { GroupColumn } from '@antv/g2plot';
import api from '@/api';
import { connect } from 'dva';
import { formatter } from '@/utils/utils';

@connect(({ global, basicCache }) => {
  const offices = basicCache.offices.filter(e => e.languageCode === global.languageCode);
  const regions = basicCache.regions.filter(e => e.languageCode === global.languageCode);
  return {
    offices,
    regions,
  };
})
class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnPlot: undefined,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'offices' },
    });
    this.loadChart();
  }

  // 接收父组件的参数
  passData = (chartData, data) => {
    const { columnPlot } = this.state;
    const { regions, offices, selectType } = this.props;
    if (parseInt(selectType, 10) === 2) {
      api.temporary
        .getXXX({
          monthDateBegin: data.length !== 0 ? data[0].format('YYYYMM') : '',
          monthDateEnd: data.length !== 0 ? data[1].format('YYYYMM') : '',
          companyCodeList:
            chartData.length !== 0 && chartData.companyList.length !== 0
              ? chartData.companyList.join(',')
              : '',
          profitCenterCodeList:
            chartData.length !== 0 && chartData.profitCenterList.length !== 0
              ? chartData.profitCenterList.join(',')
              : '',
          officeCodeList: chartData.length !== 0 ? chartData.officesList.join(',') : '',
        })
        .then(res => {
          const newData = [];
          res.forEach(item => {
            newData.push({
              officeCode: formatter(offices, item.officeCode, 'code'),
              amount: parseInt(item.amount, 10),
              monthDate: item.monthDate,
            });
          });
          columnPlot.updateConfig({ groupField: 'officeCode', data: newData });
          columnPlot.render();
          this.props.dispatch({
            type: 'dashboard/setChartData',
            payload: newData,
          });
        });
    }

    if (parseInt(selectType, 10) === 1) {
      api.temporary
        .getSalesAnalysisRegion({
          monthDateBegin: data.length !== 0 ? data[0].format('YYYYMM') : '',
          monthDateEnd: data.length !== 0 ? data[1].format('YYYYMM') : '',
          companyCodeList:
            chartData.length !== 0 && chartData.companyList.length !== 0
              ? chartData.companyList.join(',')
              : '',
          profitCenterCodeList:
            chartData.length !== 0 && chartData.profitCenterList.length !== 0
              ? chartData.profitCenterList.join(',')
              : '',
          regionCodeList: chartData.length !== 0 ? chartData.regionsList.join(',') : '',
        })
        .then(res => {
          const newData = [];
          res.forEach(item => {
            newData.push({
              regionCode: formatter(regions, item.regionCode, 'code'),
              amount: parseInt(item.amount, 10),
              monthDate: item.monthDate,
            });
          });
          columnPlot.updateConfig({ groupField: 'regionCode', data: newData });
          columnPlot.render();
          this.props.dispatch({
            type: 'dashboard/setChartData',
            payload: newData,
          });
        });
    }
  };

  // 图表的加载
  loadChart = () => {
    const { offices } = this.props;
    api.temporary
      .getXXX({
        monthDateBegin: `${new Date().getFullYear() - 1}${new Date().getMonth() + 1}`,
        monthDateEnd: `${new Date().getFullYear()}${new Date().getMonth() + 1}`,
        companyCodeList: '3100',
      })
      .then(res => {
        const data = [];
        res.forEach(item => {
          data.push({
            officeCode: formatter(offices, item.officeCode, 'code'),
            amount: parseInt(item.amount, 10),
            monthDate: item.monthDate,
          });
        });
        const columnPlot = new GroupColumn(document.getElementById('container'), {
          title: {
            visible: true,
            text: '销售额趋势',
          },
          forceFit: false,
          data,
          width: 1000,
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
            min: 0,
            line: {
              visible: true,
            },
            tickInterval: 10,
            title: {
              text: '销售额(CNY)',
            },
          },
          legend: {
            visible: true,
            position: 'right-center',
          },
          // grid: {
          //   visible: true,
          // },
          groupField: 'officeCode',
        });
        this.setState({
          columnPlot,
        });
        columnPlot.render();
        this.props.dispatch({
          type: 'dashboard/setChartData',
          payload: data,
        });
      });
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
