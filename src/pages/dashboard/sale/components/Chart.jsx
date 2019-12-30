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
  // eslint-disable-next-line consistent-return
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
          data.length !== 0 ? data[0].format('YYYYMM') : `${new Date().getFullYear()}01`,
        monthDateEnd:
          data.length !== 0 ? data[1].format('YYYYMM') : `${new Date().getFullYear()}12`,
      });
      xField = 'monthDate';
    }

    // 季度添加到条件里
    if (parseInt(type, 10) === 2) {
      let quarterStart = '';
      let quarterEnd = '';
      if (data.length === 0) {
        quarterStart = `${new Date().getFullYear()}1`;
        quarterEnd = `${new Date().getFullYear()}4`;
      } else {
        quarterStart =
          (parseInt(data[0].format('YYYYMM').slice(-2), 10) + 2) % 3
            ? ''
            : `${data[0].format('YYYYMM').slice(0, 4)}${(parseInt(
                data[0].format('YYYYMM').slice(-2),
                10,
              ) +
                2) /
                3}`;
        quarterEnd =
          parseInt(data[1].format('YYYYMM').slice(-2), 10) % 3
            ? ''
            : `${data[1].format('YYYYMM').slice(0, 4)}${parseInt(
                data[1].format('YYYYMM').slice(-2),
                10,
              ) / 3}`;
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
        halfStart = `${new Date().getFullYear()}1`;
        halfEnd = `${new Date().getFullYear()}2`;
      } else {
        if (parseInt(data[0].format('YYYYMM').slice(-2), 10) === 1) {
          halfStart = `${data[0].format('YYYYMM').slice(0, 4)}1`;
        }
        if (parseInt(data[0].format('YYYYMM').slice(-2), 10) === 7) {
          halfStart = `${data[0].format('YYYYMM').slice(0, 4)}2`;
        }
        if (parseInt(data[1].format('YYYYMM').slice(-2), 10) === 6) {
          halfEnd = `${data[1].format('YYYYMM').slice(0, 4)}1`;
        }
        if (parseInt(data[1].format('YYYYMM').slice(-2), 10) === 12) {
          halfEnd = `${data[1].format('YYYYMM').slice(0, 4)}2`;
        }
      }

      if (!halfStart) {
        message.error('开始月份请选择1,7月份');
        return false;
      }

      if (!halfEnd) {
        message.error('结束月份请选择6,12月份');
        return false;
      }

      Object.assign(params, {
        halfYearBegin: halfStart,
        halfYearEnd: halfEnd,
      });
      xField = 'halfYear';
    }

    // 整年添加到条件里
    if (parseInt(type, 10) === 4) {
      // if (data.length === 0) {
      //   message.error('请选择年');
      //   return false;
      // }
      Object.assign(params, {
        yearBegin: data.length !== 0 ? data[0].format('YYYY') : new Date().getFullYear(),
        yearEnd: data.length !== 0 ? data[1].format('YYYY') : new Date().getFullYear(),
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

    if (parseInt(selectType, 10) === 2) {
      api.temporary.getSalesAnalysisOffice(params).then(res => {
        const newData = [];
        res.forEach(item => {
          newData.push({
            officeCode: formatter(offices, item.officeCode, 'code'),
            amount: parseInt(item.amount, 10),
            monthDate: this.xFieldName(item[xField], type),
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
            // monthDate: item[xField],
            monthDate: this.xFieldName(item[xField], type),
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
    // return '';
  };

  // x轴的名称处理
  xFieldName = (val, type) => {
    if (parseInt(type, 10) === 2) {
      return `${val.slice(0, 4)}第${val.slice(-1)}季度`;
    }
    if (parseInt(type, 10) === 3) {
      if (parseInt(val.slice(-1), 10) === 1) {
        return `${val.slice(0, 4)}上半年`;
      }
      if (parseInt(val.slice(-1), 10) === 2) {
        return `${val.slice(0, 4)}下半年`;
      }
    }
    return val;
  };

  // 图表的加载
  loadChart = () => {
    api.temporary
      .getSalesAnalysisRegion({
        monthDateBegin: `${new Date().getFullYear() - 1}${new Date().getMonth() + 1}`,
        monthDateEnd: `${new Date().getFullYear()}${new Date().getMonth() + 1}`,
        companyCodeList: '3100',
      })
      .then(res => {
        api.basic.getRegions().then(regions => {
          const data = [];
          if (!(res instanceof Array)) return null;
          res.forEach(item => {
            data.push({
              regionCode: formatter(regions, item.regionCode, 'code'),
              amount: parseInt(item.amount, 10),
              // amount: item.amount,
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
            // meta: {
            //   amount: {
            //     range: [0, 1],
            //   },
            // },
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
              // min: 0,
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
            groupField: 'regionCode',
          });

          this.setState({
            columnPlot,
          });

          this.props.dispatch({
            type: 'dashboard/setChartData',
            payload: data,
          });
          columnPlot.render();
          return '';
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
