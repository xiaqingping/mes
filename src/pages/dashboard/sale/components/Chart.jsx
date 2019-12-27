import { message } from 'antd';
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
      // selectType: '',
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
  passData = (chartData, data, selectType) => {
    const { columnPlot } = this.state;
    const { regions, offices, type } = this.props;
    let xField = '';
    const params = {
      companyCodeList: chartData.companyList.length !== 0 ? chartData.companyList.join(',') : '',
      profitCenterCodeList:
        chartData.profitCenterList.length !== 0 ? chartData.profitCenterList.join(',') : '',
    };

    // 月份添加到条件里
    if (parseInt(type, 10) === 1) {
      Object.assign(params, {
        monthDateBegin:
          data.length !== 0 ? data[0].format('YYYYMM') : `${new Date().getFullYear()}01}`,
        monthDateEnd:
          data.length !== 0 ? data[1].format('YYYYMM') : `${new Date().getFullYear()}12}`,
      });
      xField = 'monthDate';
    }

    // 季度添加到条件里
    if (parseInt(type, 10) === 2) {
      let quarterStart = '';
      let quarterEnd = '';
      if (data.length === 0) {
        quarterStart = `${new Date().getFullYear()}1}`;
        quarterEnd = `${new Date().getFullYear()}4}`;
      } else {
        quarterStart =
          (parseInt(data[0].format('YYYYMM').slice(-2), 10) + 2) % 3
            ? ''
            : `${new Date().getFullYear()}${parseInt(data[0].format('YYYYMM').slice(-2), 10) / 3}`;
        quarterEnd =
          parseInt(data[1].format('YYYYMM').slice(-2), 10) % 3
            ? ''
            : `${new Date().getFullYear()}${parseInt(data[1].format('YYYYMM').slice(-2), 10) / 3}`;
      }
      if (!quarterStart) {
        message.error('开始月份请选择1,4,7,10月份');
        return false;
      }
      if (!quarterEnd) {
        message.error('结束月份请选择3,6,9,12月份');
        return false;
      }

      Object.assign(params, {
        quarterDateBegin: quarterStart,
        quarterDateEnd: quarterEnd,
      });
      xField = 'quarterDate';
    }

    // 半年添加到条件里
    if (parseInt(type, 10) === 3) {
      let halfStart = '';
      let halfEnd = '';
      if (data.length === 0) {
        halfStart = `${new Date().getFullYear()}1}`;
        halfEnd = `${new Date().getFullYear()}2}`;
      } else {
        if (parseInt(data[0].format('YYYYMM').slice(-2), 10) === 1) {
          halfStart = `${data[0].format('YYYYMM').slice(0, 4)}1`;
        }
        if (parseInt(data[0].format('YYYYMM').slice(-2), 10) === 6) {
          halfStart = `${data[0].format('YYYYMM').slice(0, 4)}2`;
        }
        if (parseInt(data[1].format('YYYYMM').slice(-2), 10) === 7) {
          halfEnd = `${data[1].format('YYYYMM').slice(0, 4)}1`;
        }
        if (parseInt(data[1].format('YYYYMM').slice(-2), 10) === 12) {
          halfEnd = `${data[1].format('YYYYMM').slice(0, 4)}2`;
        }
      }

      if (!halfStart) {
        message.error('开始月份请选择1,6月份');
        return false;
      }

      if (!halfEnd) {
        message.error('结束月份请选择7,12月份');
        return false;
      }

      Object.assign(params, {
        halfYearBegin: `${data[0].format('YYYYMM').slice(0, 4)}${halfStart}`,
        halfYearEnd: `${data[0].format('YYYYMM').slice(0, 4)}${halfEnd}`,
      });
      xField = 'halfYear';
    }

    // 整年添加到条件里
    if (parseInt(type, 10) === 4) {
      if (data.length === 0) {
        message.error('请选择年');
        return false;
      }
      Object.assign(params, {
        yearBegin: data[0].format('YYYY'),
        yearEnd: data[1].format('YYYY'),
      });

      xField = 'year';
    }

    if (parseInt(selectType, 10) === 1) {
      Object.assign(params, {
        regionCodeList: chartData.regionsList.length !== 0 ? chartData.regionsList.join(',') : '',
      });
    }

    if (parseInt(selectType, 10) === 2) {
      Object.assign(params, {
        officeCodeList: chartData.officesList.length !== 0 ? chartData.officesList.join(',') : '',
      });
    }

    // console.log(params)
    // return false
    if (parseInt(selectType, 10) === 2) {
      api.temporary.getSalesAnalysisOffice(params).then(res => {
        const newData = [];
        res.forEach(item => {
          newData.push({
            officeCode: formatter(offices, item.officeCode, 'code'),
            amount: parseInt(item.amount, 10),
            monthDate: item[xField],
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
      api.temporary.getSalesAnalysisRegion(params).then(res => {
        const newData = [];
        res.forEach(item => {
          newData.push({
            regionCode: formatter(regions, item.regionCode, 'code'),
            amount: parseInt(item.amount, 10),
            monthDate: item[xField],
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
    return '';
  };

  // 图表的加载
  loadChart = () => {
    const { offices } = this.props;
    api.temporary
      .getSalesAnalysisOffice({
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
