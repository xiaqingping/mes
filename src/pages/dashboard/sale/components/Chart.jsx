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
      errs: false,
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
  passData = (chartData, data, selectType) => {
    const { columnPlot } = this.state;
    const { regions, offices, type } = this.props;
    let xField = '';
    const params = {
      companyCodeList: chartData.companyList.length !== 0 ? chartData.companyList.join(',') : '',
      profitCenterCodeList:
        chartData.profitCenterList.length !== 0 ? chartData.profitCenterList.join(',') : '',
    };

    // let beginTime = '';
    // let endTime = '';

    // 月份添加到条件里
    if (parseInt(type, 10) === 1) {
      Object.assign(params, {
        monthDateBegin:
          data.length !== 0 ? data[0].format('YYYYMM') : `${new Date().getFullYear() - 1}01`,
        monthDateEnd:
          data.length !== 0 ? data[1].format('YYYYMM') : `${new Date().getFullYear()}12`,
      });
      xField = 'monthDate';
      // beginTime = params.monthDateBegin;
      // endTime = params.monthDateEnd;
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
      // beginTime = params.quarterDateBegin;
      // endTime = params.quarterDateEnd;
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

      // beginTime = params.halfYearBegin;
      // endTime = params.halfYearEnd;
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
      // beginTime = params.yearBegin;
      // endTime = params.yearEnd;
    }

    // 大区模式
    if (parseInt(selectType, 10) === 1) {
      Object.assign(params, {
        regionCodeList: chartData.regionsList.length !== 0 ? chartData.regionsList.join(',') : '',
      });
      if (regions.length === 0) return null;

      api.temporary.getSalesAnalysisRegion(params).then(res => {
        const newData = [];
        // const resData = this.setNewData(
        //   res,
        //   regions,
        //   beginTime,
        //   endTime,
        //   parseInt(type, 10),
        //   'regionCode',
        // );
        res.forEach(item => {
          newData.push({
            regionCode: formatter(regions, item.regionCode, 'code'),
            amount: parseFloat(item.amount),
            monthDate: item[xField],
            // monthDate: this.xFieldName(item[xField], type),
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
        this.setState({ errs: false, loadingPage: false });
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
        // const resData = this.setNewData(
        //   res,
        //   offices,
        //   beginTime,
        //   endTime,
        //   parseInt(type, 10),
        //   'officeCode',
        // );
        res.forEach(item => {
          newData.push({
            officeCode: formatter(offices, item.officeCode, 'code'),
            amount: parseFloat(item.amount),
            monthDate: item[xField],
            // monthDate: this.xFieldName(item[xField], type),
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
        this.setState({ errs: false, loadingPage: false });
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
        // if (res.length === 0) {
        //   this.setState({
        //     errs: true,
        //   });
        //   return false;
        // }
        const newData = [];
        // const resData = this.setNewData(
        //   res,
        //   offices,
        //   beginTime,
        //   endTime,
        //   parseInt(type, 10),
        //   'salerCode',
        // );
        res.forEach((item, index) => {
          newData.push({
            salerCode: index,
            amount: parseFloat(item.amount),
            // monthDate: this.xFieldName(item[xField], type),
            monthDate: item[xField],
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
        this.setState({ errs: false, loadingPage: false });
      });
    }
    return null;
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

  /** 设值，如果没有的值变成0
   * @param {Array} res 接口返回的数据
   * @param {Array} reg 接口返回的大区值
   * @param {String} btime 开始时间
   * @param {String} etime 结束时间
   * @param {int} type 1-月份，2-季度，3-半年，4-整年
   */
  setNewData = (res, reg, btime, etime, type = 1, key = 'regionCode') => {
    let yearBtime = 0;
    let yearEtime = 0;
    let monthBtime = 0;
    let monthEtime = 0;
    if (type === 4) {
      yearBtime = btime;
      yearEtime = etime;
    } else {
      yearBtime = parseInt(btime.slice(0, 4), 10);
      yearEtime = parseInt(etime.slice(0, 4), 10);
      monthBtime = parseInt(btime.slice(4), 10);
      monthEtime = parseInt(etime.slice(4), 10);
    }
    const newDate = [];
    let gapYear = 12;
    let xField = 'monthDate';
    if (type === 2) {
      gapYear = 4;
      xField = 'quarterDate';
    }
    if (type === 3) {
      gapYear = 2;
      xField = 'halfYear';
    }
    if (type === 4) {
      gapYear = 1;
      xField = 'year';
    }
    // if (yearBtime !== yearEtime) {
    const yearNum = yearEtime - yearBtime;
    // const num = type === 1 ? yearNum * 12 : yearNum;
    const num = yearNum * gapYear;
    if (monthBtime) {
      for (let i = monthBtime; i <= monthEtime + num; i++) {
        let newTime = '';
        if (i >= gapYear) {
          newTime = `${
            i % gapYear === 0
              ? yearBtime + parseInt(i / (gapYear + 1), 10)
              : yearBtime + parseInt(i / gapYear, 10)
          }${i % gapYear ? `${0}${i % gapYear}`.slice(-2) : gapYear}`;
        } else {
          newTime = yearBtime + `0${i}`.slice(-2);
        }
        if (type !== 1) {
          newTime = `${newTime}`.slice(0, 4) + `${newTime}`.slice(-1);
        }

        reg.forEach(item => {
          newDate.push({
            [key]: item.code,
            amount: '0',
            [xField]: newTime,
          });
        });
      }
    } else {
      for (let i = yearBtime; i <= yearEtime; i++) {
        reg.forEach(item => {
          newDate.push({
            [key]: item.code,
            amount: '0',
            [xField]: i.toString(),
          });
        });
      }
    }
    res.forEach(item => {
      newDate.forEach(it => {
        if (item[key] === it[key] && item[xField] === it[xField]) {
          // eslint-disable-next-line no-param-reassign
          it.amount = item.amount;
        }
      });
    });
    return newDate;
  };

  // 图表的加载
  loadChart = () => {
    const { regions } = this.props;
    const monthDateBegin = `${new Date().getFullYear() - 1}01`;
    const monthDateEnd = `${new Date().getFullYear()}12`;
    api.temporary
      .getSalesAnalysisRegion({
        monthDateBegin,
        monthDateEnd,
        companyCodeList: '3100',
      })
      .then(res => {
        //
        if (regions.length !== 0) {
          const data = [];
          if (!(res instanceof Array)) return null;
          const resData = this.setNewData(res, regions, monthDateBegin, monthDateEnd);
          resData.forEach(item => {
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
              // line: {
              //   visible: true,
              // },
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
                  start: 0,
                  end: 0.5,
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
          this.setState({ errs: false, loadingPage: false });
          return '';
        }
        api.basic
          .getRegions()
          .then(reg => {
            const data = [];
            if (!(res instanceof Array)) return null;
            const resData = this.setNewData(res, reg, monthDateBegin, monthDateEnd);
            resData.forEach(item => {
              data.push({
                regionCode: formatter(reg, item.regionCode, 'code'),
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
                    start: 0,
                    end: 0.5,
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
            this.setState({ errs: false, loadingPage: false });
            this.props.errorPage(false);
            return null;
          })
          .catch(() => {
            this.props.errorPage(true);
            this.setState({ errs: true });
          });
        return null;
      })
      .catch(() => {
        console.log(123);
        this.props.errorPage(true);
        this.setState({ errs: true });
      });
  };

  loadingPageSetting = () => {
    const { errs, loadingPage } = this.state;
    if (loadingPage && !errs) {
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
    const { errs } = this.state;
    return (
      <>
        {this.loadingPageSetting()}
        {errs ? (
          <>
            <h3 style={{ paddingTop: '50px', fontWeight: 'bold' }}>销售额趋势</h3>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '68%' }} />
          </>
        ) : (
          <div id="container"></div>
        )}
      </>
    );
  }
}

export default Chart;
