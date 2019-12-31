/* eslint-disable no-nested-ternary */
import { Card, Tabs, Select, DatePicker, Radio, Form, Col, Button, AutoComplete, Row } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import Chart from './components/Chart';
import List from './components/List';
import api from '@/api';
import './index.less'

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

function renderOption(item) {
  return (
    <Option key={item.code} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    </Option>
  );
}

@connect(({ global, basicCache, dashboard }) => {
  const companys = basicCache.companys.filter(e => e.languageCode === global.languageCode);
  const profitCenters = dashboard.profitCenters.filter(e => e.languageCode === global.languageCode);
  const offices = basicCache.offices.filter(e => e.languageCode === global.languageCode);
  const regions = basicCache.regions.filter(e => e.languageCode === global.languageCode);
  return {
    companys,
    languageCode: global.languageCode || [],
    profitCenters: profitCenters || [],
    profitCenterCompany: dashboard.profitCenterCompany || [],
    salers: dashboard.salers || [],
    offices: offices || [],
    regions: regions || [],
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
      salersData: [],
    };
    this.callSaler = _.debounce(this.callSaler, 500);
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

  componentWillUnmount() {
    this.companyChange()
  }

  // 销售员查询
  callSaler = value => {
    api.employees.getSaler({ code_or_name: value }).then(res => {
      this.setState({
        salersData: res,
      });
    });
  };

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
    const comapnyVal = v || [];
    const {
      profitCenterCompany,
      profitCenters,
      form: { resetFields },
    } = this.props;
    const newData = [];
    profitCenterCompany.forEach(item => {
      profitCenters.forEach(i => {
        comapnyVal.forEach(vi => {
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
      chartData: { companyList: comapnyVal },
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

  // 销售员选择
  salersChange = v => {
    const { chartData } = this.state;
    this.setState({
      chartData: { ...chartData, salersList: v },
    });
  };

  // 销售员查找
  searchSaler = value => {
    if (value) {
      this.callSaler(value);
    }
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
      salersData: [],
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
          allowClear={false}
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
        allowClear={false}
      />
    );
  };

  operations = () => {
    const { type, profitCenterData, selectType, salersData } = this.state;
    const { companys, offices, regions, salers } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{ marginRight: '100px' }}>
        <Form className="mySet">
        <Row>
          <Col xxl={7} lg={7} sm={24}>
            <Form.Item>
              {getFieldDecorator('companys', {
                initialValue: '3100',
              })(
                <Select
                  style={{ width: '400px' }}
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
          <Col xxl={7} lg={7} sm={24}>
            <Form.Item>
              {getFieldDecorator('profitCenters')(
                <Select
                  style={{ width: '400px' }}
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
          <Col xxl={10} lg={20} sm={20}>
            <Form.Item style={{ float: 'left' }}>
              {getFieldDecorator('type', {
                initialValue: selectType,
              })(
                <Select
                  style={{ width: '121px' }}
                  onChange={v => this.selectTypeChange(v)}
                >
                  <Option value="1">选择大区</Option>
                  <Option value="2">选择网点</Option>
                  <Option value="3">选择销售员</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item style={{ float: 'left' }}>
              {getFieldDecorator('typeName')(
                parseInt(selectType, 10) === 3 ? (
                  <AutoComplete
                  style={{ width: '400px' }}
                    dataSource={salersData.map(renderOption)}
                    onSearch={this.searchSaler}
                    onSelect={this.salersChange}
                    optionLabelProp="text"
                  />
                ) : (
                  <Select
                  style={{ width: '400px' }}
                    mode="multiple"
                    onChange={
                      parseInt(selectType, 10) === 1
                        ? v => this.regionsChange(v)
                        : parseInt(selectType, 10) === 2
                        ? v => this.officesChange(v)
                        : v => this.salersChange(v)
                    }
                    maxTagCount={3}
                    maxTagTextLength={4}
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
                  </Select>
                ),
              )}
            </Form.Item>
          </Col>
          </Row>
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
    const { chartData, type, selectType } = this.state;
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
                {parseInt(selectType, 10) === 3 ? (
                  ''
                ) : (

                    <List
                      onRef={ref => {
                        this.list = ref;
                      }}
                    />

                )}
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
