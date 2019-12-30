/* eslint-disable no-nested-ternary */
import { Card, Tabs, Select, DatePicker, Radio, Form, Col, Button } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
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
    salers: dashboard.salers || [],
    offices,
    regions,
  };
})
class Sale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTime: [],
      type: '1', // 选择月，季度，半年，整年
      selectType: '1', // 选择大区、网点、销售员
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
    // api.employees.getSaler().then(res => {
    //   this.props.dispatch({
    //     type: 'dashboard/setSalers',
    //     payload: res.results,
    //   });
    // })
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'offices' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'regions' },
    });
    this.companyChange(['3100']);
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
      type: e.target.value,
    });
  };

  // 公司选择
  companyChange = v => {
    const {
      profitCenterCompany,
      profitCenters,
      form: { resetFields },
    } = this.props;
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
    resetFields(['profitCenters']);
  };

  // 利润中心选择
  profitCenterChange = v => {
    const { chartData } = this.state;
    this.setState({
      chartData: { ...chartData, profitCenterList: v },
    });
  };

  // 利润中心的值添加
  valueOfProfitCenter = () => {
    const { profitCenterData } = this.state;
    if (profitCenterData.length === 0) {
      this.companyChange(['3100']);
    }
  }

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

  // 销售员选择
  salersChange = v => {
    const { chartData } = this.state;
    this.setState({
      chartData: { ...chartData, salersList: v },
    });
  };

  // 查询按钮
  searchButton = () => {
    const { chartData, dataTime, selectType } = this.state;

    let data = chartData;
    if (!('companyList' in data)) {
      data = { ...data, companyList: [] };
    }
    if (!('profitCenterList' in data)) {
      data = { ...data, profitCenterList: [] };
    }
    if (parseInt(selectType, 10) === 1) {
      if (!('regionsList' in data)) {
        data = { ...data, regionsList: [] };
      }
    }
    if (parseInt(selectType, 10) === 2) {
      if (!('officesList' in data)) {
        data = { ...data, officesList: [] };
      }
    }
    this.chart.passData(data, dataTime, selectType);
    this.list.passData(selectType);
  };

  // 选择网点还是大区
  selectTypeChange = v => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['typeName']);
    this.setState({
      selectType: v,
    });
  };

  // 时间是否是默认还是已经选择过了
  setTime = () => {
    const { dataTime, type } = this.state;
    if (dataTime.length !== 0) {
      return (
        <RangePicker
          placeholder={
            !(parseInt(type, 10) === 4) ? ['开始月份', '结束月份'] : ['开始年份', '结束年份']
          }
          format={!(parseInt(type, 10) === 4) ? 'YYYY-MM' : 'YYYY'}
          value={dataTime}
          mode={!(parseInt(type, 10) === 4) ? ['month', 'month'] : ['year', 'year']}
          style={{ width: '200px' }}
          onPanelChange={this.handlePanelChange}
        />
      );
    }
    return (
      <RangePicker
        placeholder={
          !(parseInt(type, 10) === 4) ? ['开始月份', '结束月份'] : ['开始年份', '结束年份']
        }
        defaultValue={[
          moment(`${new Date().getFullYear()}01`, 'YYYY-MM'),
          moment(`${new Date().getFullYear()}12`, 'YYYY-MM'),
        ]}
        defaultPickerValue={[
          moment(`${new Date().getFullYear()}01`, 'YYYY-MM'),
          moment(`${new Date().getFullYear()}12`, 'YYYY-MM'),
        ]}
        format={!(parseInt(type, 10) === 4) ? 'YYYY-MM' : 'YYYY'}
        mode={!(parseInt(type, 10) === 4) ? ['month', 'month'] : ['year', 'year']}
        style={{ width: '200px' }}
        onPanelChange={this.handlePanelChange}
      />
    );
  };

  operations = () => {
    const { type, profitCenterData, selectType } = this.state;
    const { companys, offices, regions, salers } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{ marginRight: '100px' }}>
        <Form>
          <Col sm={7}>
            <Form.Item style={{ width: '400px' }}>
              {getFieldDecorator('companys', {
                initialValue: '3100',
              })(
                <Select
                  onChange={v => this.companyChange(v)}
                  mode="multiple"
                  maxTagCount={2}
                  maxTagTextLength={6}
                  allowClear
                  placeholder="请选择公司名称(不选择，默认全部)"
                >
                  {companys.map(item => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col sm={7}>
            <Form.Item style={{ width: '350px' }}>
              {getFieldDecorator('profitCenters')(
                <Select
                  mode="multiple"
                  onChange={v => this.profitCenterChange(v)}
                  maxTagCount={2}
                  maxTagTextLength={6}
                  allowClear
                  onFocus={() => this.valueOfProfitCenter()}
                  placeholder="请选择利润中心(不选择，默认全部)"
                >
                  {profitCenterData.map(item => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col sm={3}>
            <Form.Item>
              {getFieldDecorator('type', {
                initialValue: selectType,
              })(
                <Select
                  // style={{ width: 110 }}
                  onChange={v => this.selectTypeChange(v)}
                >
                  <Option value="1">选择大区</Option>
                  <Option value="2">选择网点</Option>
                  <Option value="3">选择销售员</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col sm={7}>
            <Form.Item>
              {getFieldDecorator('typeName')(
                <Select
                  // style={{ width: '330px', marginRight: '40px' }}
                  mode="multiple"
                  onChange={
                    parseInt(selectType, 10) === 1
                      ? v => this.regionsChange(v)
                      : parseInt(selectType, 10) === 2
                      ? v => this.officesChange(v)
                      : v => this.salersChange(v)
                  }
                  maxTagCount={2}
                  maxTagTextLength={6}
                  allowClear
                  placeholder={
                    parseInt(selectType, 10) === 1
                      ? '请选择大区(不选择，默认全部)'
                      : parseInt(selectType, 10) === 2
                      ? '请选择网点(不选择，默认全部)'
                      : '请选择销售员(不选择，默认全部)'
                  }
                >
                  {parseInt(selectType, 10) === 1
                    ? regions.map(item => (
                        <Option key={item.code} value={item.code}>
                          {item.name}
                        </Option>
                      ))
                    : parseInt(selectType, 10) === 2
                    ? offices.map(item => (
                        <Option key={item.code} value={item.code}>
                          {item.name}
                        </Option>
                      ))
                    : salers.map(item => (
                        <Option key={item.code} value={item.code}>
                          {item.name}
                        </Option>
                      ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Radio.Group value={type} onChange={this.handleDateChange}>
            <Radio.Button value="1">月份</Radio.Button>
            <Radio.Button value="2">季度</Radio.Button>
            <Radio.Button value="3">半年</Radio.Button>
            <Radio.Button value="4">全年</Radio.Button>
          </Radio.Group>
          {this.setTime()}

          <Button
            type="primary"
            onClick={() => {
              this.searchButton();
            }}
            style={{ marginLeft: '20px' }}
          >
            查询
          </Button>
        </Form>
      </div>
    );
  };

  render() {
    const { chartData, type } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} style={{ width: '1600px' }}>
          <Tabs>
            <TabPane tab="销售额" key="1">
              {this.operations()}

              <div style={{ position: 'relative' }}>
                <Chart
                  chartData={chartData}
                  type={type}
                  onRef={ref => {
                    this.chart = ref;
                  }}
                />
                <List
                  onRef={ref => {
                    this.list = ref;
                  }}
                />
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
export default Form.create()(Sale);
