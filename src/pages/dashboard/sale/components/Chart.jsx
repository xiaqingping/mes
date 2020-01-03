import { message, Empty, Spin, Icon } from 'antd';
import React from 'react';
import { GroupColumn } from '@antv/g2plot';
import api from '@/api';
import { connect } from 'dva';
import { formatter } from '@/utils/utils';

@connect(({ global, basicCache }) => {
  const offices = basicCache.offices.filter(e => e.languageCode === global.languageCode);
  const regions = basicCache.regions.filter(e => e.languageCode === global.languageCode);
  return {
    offices: offices || [],
    regions: regions || [],
  };
})
class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnPlot: undefined,
      // selectType: '',
      err: false,
      loadingPage: true,
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
          data.length !== 0 ? data[0].format('YYYYMM') : `${new Date().getFullYear() - 1}01`,
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
        quarterStart = `${new Date().getFullYear() - 1}1`;
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
        halfStart = `${new Date().getFullYear() - 1}1`;
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
        yearBegin: data.length !== 0 ? data[0].format('YYYY') : new Date().getFullYear() - 1,
        yearEnd: data.length !== 0 ? data[1].format('YYYY') : new Date().getFullYear(),
      });

      xField = 'year';
    }

    // 大区模式
    if (parseInt(selectType, 10) === 1) {
      Object.assign(params, {
        regionCodeList: chartData.regionsList.length !== 0 ? chartData.regionsList.join(',') : '',
      });
      if (regions.length === 0) return null;
      api.temporary.getSalesAnalysisRegion(params).then(res => {
        const newData = [];
        res.forEach(item => {
          newData.push({
            regionCode: formatter(regions, item.regionCode, 'code'),
            amount: parseFloat(item.amount),
            // monthDate: item[xField],
            monthDate: this.xFieldName(item[xField], type),
          });
        });
        if (columnPlot) {
          columnPlot.updateConfig({
            groupField: 'regionCode',
            data: newData,
            width: document.body.clientWidth < 1300 ? 780 : 1000,
          });
          columnPlot.render();
        } else {
          const plot = new GroupColumn(document.getElementById('container'), {
            title: {
              visible: true,
              text: '销售额趋势',
            },
            forceFit: false,
            data: newData,
            width: document.body.clientWidth < 1300 ? 780 : 1000,
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
          plot.render();
        }

        this.props.dispatch({
          type: 'dashboard/setChartData',
          payload: newData,
        });
        this.setState({ err: false, loadingPage: false });
      });
    }

    // 网点模式
    if (parseInt(selectType, 10) === 2) {
      Object.assign(params, {
        officeCodeList: chartData.officesList.length !== 0 ? chartData.officesList.join(',') : '',
      });
      if (offices.length === 0) return null;
      api.temporary.getSalesAnalysisOffice(params).then(res => {
        const newData = [];
        res.forEach(item => {
          newData.push({
            officeCode: formatter(offices, item.officeCode, 'code'),
            amount: parseFloat(item.amount),
            monthDate: this.xFieldName(item[xField], type),
          });
        });

        if (columnPlot) {
          columnPlot.updateConfig({
            groupField: 'officeCode',
            data: newData,
            width: document.body.clientWidth < 1300 ? 780 : 1000,
          });
          columnPlot.render();
        } else {
          const plot = new GroupColumn(document.getElementById('container'), {
            title: {
              visible: true,
              text: '销售额趋势',
            },
            forceFit: false,
            data: newData,
            width: document.body.clientWidth < 1300 ? 780 : 1000,
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
            groupField: 'officeCode',
          });

          this.setState({
            columnPlot,
          });

          this.props.dispatch({
            type: 'dashboard/setChartData',
            payload: data,
          });
          plot.render();
        }
        this.props.dispatch({
          type: 'dashboard/setChartData',
          payload: newData,
        });
        this.setState({ err: false, loadingPage: false });
      });
    }

    // 销售员模式
    if (parseInt(selectType, 10) === 3) {
      if (!chartData.salersList) {
        message.error('请选择一个销售员');
        return false;
      }
      Object.assign(params, {
        salerCode: chartData.salersList,
      });
      api.temporary.getSalesAnalysisSaler(params).then(res => {
        const newData = [];
        res.forEach((item, index) => {
          newData.push({
            salerCode: index,
            amount: parseFloat(item.amount),
            monthDate: this.xFieldName(item[xField], type),
          });
        });

        if (columnPlot) {
          columnPlot.updateConfig({
            groupField: 'salerCode',
            data: newData,
            width: document.body.clientWidth < 1300 ? 780 : 1000,
          });
          columnPlot.render();
        } else {
          const plot = new GroupColumn(document.getElementById('container'), {
            title: {
              visible: true,
              text: '销售额趋势',
            },
            forceFit: false,
            data: newData,
            width: document.body.clientWidth < 1300 ? 780 : 1000,
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
            groupField: 'salerCode',
          });

          this.setState({
            columnPlot,
          });

          this.props.dispatch({
            type: 'dashboard/setChartData',
            payload: data,
          });
          plot.render();
        }
        this.props.dispatch({
          type: 'dashboard/setChartData',
          payload: newData,
        });
        this.setState({ err: false, loadingPage: false });
      });
    }
  };

  // x轴的名称处理
  xFieldName = (val, type) => {
    if (parseInt(type, 10) === 1) {
      return `${val.slice(0, 4)}-${val.slice(-2)}`;
    }
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
    // const { regions } = this.props;
    api.temporary
      .getSalesAnalysisRegion({
        monthDateBegin: new Date().getFullYear() - 1 + `0${new Date().getMonth() + 1}`.slice(-2),
        monthDateEnd: new Date().getFullYear() + `0${new Date().getMonth() + 1}`.slice(-2),
        companyCodeList: '3100',
      })
      .then(res => {
        api.basic
          .getRegions()
          .then(regions => {
            const data = [];
            if (!(res instanceof Array)) return null;
            res.forEach(item => {
              data.push({
                regionCode: formatter(regions, item.regionCode, 'code'),
                amount: parseFloat(item.amount),
                // amount: item.amount,
                monthDate: this.xFieldName(item.monthDate, 1),
              });
            });
            const columnPlot = new GroupColumn(document.getElementById('container'), {
              title: {
                visible: true,
                text: '销售额趋势',
              },
              forceFit: false,
              data,
              width: document.body.clientWidth < 1300 ? 780 : 1000,
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
              interactions: [
                {
                  type: 'slider',
                  cfg: {
                    start: 0.3,
                    end: 0.8,
                  },
                },
              ],
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
            this.setState({ err: false, loadingPage: false });
            return '';
          })
          .catch(() => {
            this.props.errorPage(true);
            this.setState({ err: true });
          });
      })
      .catch(() => {
        this.props.errorPage(true);
        this.setState({ err: true });
      });
  };

  loadingPageSetting = () => {
    const { err, loadingPage } = this.state;
    if (loadingPage && !err) {
      return (
        <Spin
          indicator={<Icon type="redo" style={{ fontSize: 24 }} spin />}
          tip="正在加载中，请耐心等待..."
          style={{ margin: '100px 220px' }}
        />
      );
    }
    return '';
  };

  render() {
    const { err } = this.state;
    return (
      <>
        {this.loadingPageSetting()}
        {err ? (
          <>
            <h3 style={{ paddingTop: '50px', fontWeight: 'bold' }}>销售额趋势</h3>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingRight: '935px' }} />
          </>
        ) : (
          <div id="container"></div>
        )}
      </>
    );
  }
}

export default Chart;
