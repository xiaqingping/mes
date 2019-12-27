import { Card, Tabs, Select, DatePicker, Radio } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Chart from './components/Chart';
import List from './components/List';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ global, basicCache, dashboard }) => {
  const companys = basicCache.companys.filter(e => e.languageCode === global.languageCode);
  const profitCenters = dashboard.profitCenters.filter(e => e.languageCode === global.languageCode);
  const offices = basicCache.offices.filter(e => e.languageCode === global.languageCode);
  const regions = basicCache.regions.filter(e => e.languageCode === global.languageCode);
  return {
    companys,
    languageCode: global.languageCode,
    profitCenters,
    profitCenterCompany: dashboard.profitCenterCompany,
    offices,
    regions,
  };
})
class Sale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTime: [],
      type: '1',
      selectType: '2', // 选择大区还是网点
      chartData: [],
      profitCenterData: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'companys' },
    });
    this.props.dispatch({
      type: 'dashboard/getCache',
      payload: { type: 'profitCenterCompany' },
    });
    this.props.dispatch({
      type: 'dashboard/getCache',
      payload: { type: 'profitCenters' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'offices' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'regions' },
    });
  }

  // 面板选择
  handlePanelChange = data => {
    this.setState({
      dataTime: data,
    });
  };

  // 选择变更模式
  handleDateChange = e => {
    this.setState({
      dataTime: [],
      type: e.target.value,
    });
  };

  // 公司选择
  companyChange = v => {
    const { profitCenterCompany, profitCenters } = this.props;
    const newData = [];
    profitCenterCompany.forEach(item => {
      profitCenters.forEach(i => {
        v.forEach(vi => {
          if (item.companyCode === vi) {
            if (
              item.profitCenterCode === i.code &&
              item.controllingAreaCode === i.controllingAreaCode
            ) {
              newData.push(i);
            }
          }
        });
      });
    });
    this.setState({
      profitCenterData: newData,
      chartData: { companyList: v },
    });
  };

  // 利润中心选择
  profitCenterChange = v => {
    const { chartData } = this.state;
    this.setState({
      chartData: { ...chartData, profitCenterList: v },
    });
  };

  // 网点选择
  officesChange = v => {
    const { chartData } = this.state;
    this.setState({
      chartData: { ...chartData, officesList: v },
    });
  };

  // 大区选择
  regionsChange = v => {
    const { chartData } = this.state;
    this.setState({
      chartData: { ...chartData, regionsList: v },
    });
  };

  // 关闭时间面板回调
  closePanel = v => {
    const { chartData, dataTime } = this.state;
    if (!v) {
      this.chart.passData(chartData, dataTime);
    }
  };

  // 选择网点还是大区
  selectTypeChange = v => {
    this.setState({
      selectType: v,
    });
  };

  operations = () => {
    const { dataTime, type, profitCenterData, selectType } = this.state;
    const { companys, offices, regions } = this.props;

    return (
      <div style={{ marginRight: '100px' }}>
        <Select
          style={{ width: '400px' }}
          onChange={v => this.companyChange(v)}
          mode="multiple"
          maxTagCount={2}
          maxTagTextLength={6}
          allowClear
          placeholder="请选择公司名称"
        >
          <Option key="" value="">
              全选
          </Option>
          {companys.map(item => (
            <Option key={item.code} value={item.code}>
              {item.name}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: '350px', margin: '0 40px' }}
          mode="multiple"
          onChange={v => this.profitCenterChange(v)}
          maxTagCount={2}
          maxTagTextLength={6}
          allowClear
          placeholder="请选择利润中心"
        >
          <Option key="" value="">
              全选
          </Option>
          {profitCenterData.map(item => (
            <Option key={item.code} value={item.code}>
              {item.name}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 110 }}
          defaultValue={selectType}
          onChange={v => this.selectTypeChange(v)}
        >
          <Option value="1">选择大区</Option>
          <Option value="2">选择网点</Option>
        </Select>

        <Select
          style={{ width: '330px', marginRight: '40px' }}
          mode="multiple"
          onChange={
            parseInt(selectType, 10) === 1
              ? v => this.regionsChange(v)
              : v => this.officesChange(v)
          }
          maxTagCount={2}
          maxTagTextLength={6}
          allowClear
          placeholder={parseInt(selectType, 10) === 1 ? '请选择大区' : '请选择网点'}
        >
          <Option key="" value="">
              全选
          </Option>
          {parseInt(selectType, 10) === 1
            ? regions.map(item => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))
            : offices.map(item => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
        </Select>
        <br />
        <br />

        <Radio.Group value={type} onChange={this.handleDateChange}>
          <Radio.Button value="1">月</Radio.Button>
          <Radio.Button value="2">年</Radio.Button>
        </Radio.Group>
        <RangePicker
          placeholder={
            parseInt(type, 10) === 1 ? ['开始月份', '结束月份'] : ['开始年份', '结束年份']
          }
          format={parseInt(type, 10) === 1 ? 'YYYY-MM' : 'YYYY'}
          value={dataTime}
          mode={parseInt(type, 10) === 1 ? ['month', 'month'] : ['year', 'year']}
          style={{ width: '200px' }}
          onPanelChange={this.handlePanelChange}
          onOpenChange={v => {
            this.closePanel(v);
          }}
        />
      </div>
    );
  };

  render() {
    const { chartData, selectType } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} style={{ width: '1600px' }}>
          <Tabs>
            <TabPane tab="销售额" key="1">
              {this.operations()}

              <div style={{ position: 'relative' }}>
                <Chart
                  chartData={chartData}
                  selectType={selectType}
                  onRef={ref => {
                    this.chart = ref;
                  }}
                />

                <List selectType={selectType}/>
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
