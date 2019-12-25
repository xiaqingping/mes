import { Card, Tabs, Select, DatePicker, Radio } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Chart from './components/Chart';
import List from './components/List';
import api from '@/api';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ global, basicCache }) => {
  const companys = basicCache.companys.filter(e => e.languageCode === global.languageCode);
  return {
    companys,
    languageCode: global.languageCode,
  };
})
class Sale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTime: [],
      type: '1',
      chartData: [],
      profitCenterName: [],
      profitCenter: [],
      profitCenterData: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'companys' },
    });
    api.temporary.getProfitCenterCompany().then(res => {
      this.setState({
        profitCenterName: res,
      });
    });
    api.temporary.getProfitCenter().then(res => {
      this.setState({
        profitCenter: res,
      });
    });
  }

  // 面板选择
  handlePanelChange = data => {
    // const { type } = this.state;
    // this.chart.passData([
    //   {
    //     name: 'London',
    //     月份: 'Jan.',
    //     月均降雨量: 100.9,
    //   },
    //   {
    //     name: 'London',
    //     月份: 'Feb.',
    //     月均降雨量: 200.8,
    //   },
    //   {
    //     name: 'London',
    //     月份: 'Mar.',
    //     月均降雨量: 300.3,
    //   },
    //   {
    //     name: 'London',
    //     月份: 'Apr.',
    //     月均降雨量: 8.4,
    //   },
    //   {
    //     name: 'London',
    //     月份: 'May',
    //     月均降雨量: 4,
    //   },
    //   {
    //     name: 'London',
    //     月份: 'Jun.',
    //     月均降雨量: 2.3,
    //   },
    //   {
    //     name: 'London',
    //     月份: 'Jul.',
    //     月均降雨量: 2,
    //   },
    //   {
    //     name: 'London',
    //     月份: 'Aug.',
    //     月均降雨量: 3.6,
    //   },
    //   {
    //     name: 'Berlin',
    //     月份: 'Jan.',
    //     月均降雨量: 12.4,
    //   },
    //   {
    //     name: 'Berlin',
    //     月份: 'Feb.',
    //     月均降雨量: 23.2,
    //   },
    //   {
    //     name: 'Berlin',
    //     月份: 'Mar.',
    //     月均降雨量: 34.5,
    //   },
    //   {
    //     name: 'Berlin',
    //     月份: 'Apr.',
    //     月均降雨量: 99.7,
    //   },
    //   {
    //     name: 'Berlin',
    //     月份: 'May',
    //     月均降雨量: 52.6,
    //   },
    //   {
    //     name: 'Berlin',
    //     月份: 'Jun.',
    //     月均降雨量: 35.5,
    //   },
    //   {
    //     name: 'Berlin',
    //     月份: 'Jul.',
    //     月均降雨量: 37.4,
    //   },
    //   {
    //     name: 'Berlin',
    //     月份: 'Aug.',
    //     月均降雨量: 42.4,
    //   },
    //   {
    //     name: 'Lon',
    //     月份: 'Jan.',
    //     月均降雨量: 18.9,
    //   },
    //   {
    //     name: 'Lon',
    //     月份: 'Feb.',
    //     月均降雨量: 28.8,
    //   },
    //   {
    //     name: 'Lon',
    //     月份: 'Mar.',
    //     月均降雨量: 39.3,
    //   },
    //   {
    //     name: 'Lon',
    //     月份: 'Apr.',
    //     月均降雨量: 81.4,
    //   },
    //   {
    //     name: 'Lon',
    //     月份: 'May',
    //     月均降雨量: 47,
    //   },
    //   {
    //     name: 'Lon',
    //     月份: 'Jun.',
    //     月均降雨量: 20.3,
    //   },
    //   {
    //     name: 'Lon',
    //     月份: 'Jul.',
    //     月均降雨量: 24,
    //   },
    //   {
    //     name: 'Lon',
    //     月份: 'Aug.',
    //     月均降雨量: 35.6,
    //   },
    //   {
    //     name: 'Ber',
    //     月份: 'Jan.',
    //     月均降雨量: 12.4,
    //   },
    //   {
    //     name: 'Ber',
    //     月份: 'Feb.',
    //     月均降雨量: 23.2,
    //   },
    //   {
    //     name: 'Ber',
    //     月份: 'Mar.',
    //     月均降雨量: 34.5,
    //   },
    //   {
    //     name: 'Ber',
    //     月份: 'Apr.',
    //     月均降雨量: 99.7,
    //   },
    //   {
    //     name: 'Ber',
    //     月份: 'May',
    //     月均降雨量: 52.6,
    //   },
    //   {
    //     name: 'Ber',
    //     月份: 'Jun.',
    //     月均降雨量: 35.5,
    //   },
    //   {
    //     name: 'Ber',
    //     月份: 'Jul.',
    //     月均降雨量: 37.4,
    //   },
    //   {
    //     name: 'Ber',
    //     月份: 'Aug.',
    //     月均降雨量: 42.4,
    //   },
    // ]);
    this.setState({
      dataTime: data,
    });
    // api.chartData
    //   .getSalesAnalysisMonth({
    //     monthDateBegin:
    //       parseInt(type, 10) === 1 ? data[0].format('YYYYMM') : data[0].format('YYYY'),
    //     monthDateEnd: parseInt(type, 10) === 1 ? data[1].format('YYYYMM') : data[1].format('YYYY'),
    //   })
    //   .then(res => {
    //     this.chart.passData(res);
    //   });
  };

  // 选择变更模式
  handleDateChange = e => {
    this.setState({
      dataTime: [],
      type: e.target.value,
    });
  };

  companyChange = v => {
    const { profitCenterName, profitCenter } = this.state;
    const data = profitCenterName.filter(e => e.companyCode === v);
    const newData = [];
    data.forEach(item => {
      profitCenter.forEach(i => {
        console.log(123)
        if (item.profitCenterCode === i.code) {
          newData.push(i);
        }
      });
    });
    this.setState({
      profitCenterData: newData,
    });
  };

  operations = () => {
    const { dataTime, type, profitCenterData } = this.state;
    const { companys } = this.props;
    console.log(profitCenterData);
    return (
      <div style={{ marginRight: '100px' }}>
        <Select defaultValue="3100" style={{ width: 280 }} onChange={v => this.companyChange(v)}>
          {companys.map(item => (
            <Option key={item.code} value={item.code}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Select defaultValue="销售员" style={{ width: 120, margin: '0 50px' }}>
          <Option value="销售员">销售员</Option>
          <Option value="大区">大区</Option>
          <Option value="网点">网点</Option>
        </Select>

        <Radio.Group value={type} onChange={this.handleDateChange}>
          <Radio.Button value="1">月</Radio.Button>
          <Radio.Button value="2" style={{ margin: '0 50px' }}>
            年
          </Radio.Button>
        </Radio.Group>
        <RangePicker
          placeholder={
            parseInt(type, 10) === 1 ? ['开始月份', '结束月份'] : ['开始年份', '结束年份']
          }
          format={parseInt(type, 10) === 1 ? 'YYYY-MM' : 'YYYY'}
          value={dataTime}
          mode={parseInt(type, 10) === 1 ? ['month', 'month'] : ['year', 'year']}
          style={{ width: '230px' }}
          onPanelChange={this.handlePanelChange}
        />
      </div>
    );
  };

  render() {
    const { chartData } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} style={{ width: '1600px' }}>
          <Tabs tabBarExtraContent={this.operations()}>
            <TabPane tab="销售额" key="1">
              <div style={{ position: 'relative' }}>
                <Chart
                  chartData={chartData}
                  onRef={ref => {
                    this.chart = ref;
                  }}
                />
                <List />
              </div>
            </TabPane>
            <TabPane tab="订单量" key="2">
              Content of tab 2
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Sale;
