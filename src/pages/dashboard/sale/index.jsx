/* eslint-disable no-nested-ternary */
import {
  message,
  Card,
  Tabs,
  Select,
  DatePicker,
  Radio,
  Form,
  Col,
  Button,
  AutoComplete,
  Row,
} from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import Chart from './components/Chart';
import List from './components/List';
import api from '@/api';
import './index.less';

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

class Sale extends React.Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      dataTime: [],
      type: '1', // 选择月，季度，半年，整年
      selectType: '1', // 选择大区、网点、销售员
      chartData: [],
      profitCenterData: [],
      salersData: [],
      companyList: [],
      profitCenterList: [],
      regionsList: [],
      officesList: [],
      err: undefined,
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
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'offices' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'regions' },
    });
    this.companyChange(['3100']);
    // this.getTableData(this.initialValues);
  }

  componentWillUnmount() {
    this.companyChange();
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

  // 选择时间变更模式
  handleDateChange = e => {
    this.setState({
      type: e.target.value,
    });
  };

  // 公司选择
  companyChange = v => {
    const comapnyVal = v || [];
    const { profitCenterCompany, profitCenters } = this.props;
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
      companyList: comapnyVal,
    });
    this.tableFormRef.current.resetFields(['profitCenters']);
  };

  // 利润中心选择
  profitCenterChange = v => {
    this.setState({
      profitCenterList: v,
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
    this.setState({
      officesList: v,
    });
  };

  // 大区选择
  regionsChange = v => {
    this.setState({
      regionsList: v,
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
    const {
      chartData,
      dataTime,
      selectType,
      err,
      officesList,
      regionsList,
      companyList,
      profitCenterList,
    } = this.state;
    if (err === true) {
      message.error('没有找到相关数据');
      return false;
    }
    let data = chartData;
    if (companyList.length === 0) {
      data = { ...data, companyList: [] };
    } else {
      data = { ...data, companyList };
    }
    if (profitCenterList.length === 0) {
      data = { ...data, profitCenterList: [] };
    } else {
      data = { ...data, profitCenterList };
    }
    if (parseInt(selectType, 10) === 1) {
      if (regionsList === 0) {
        data = { ...data, regionsList: [] };
      } else {
        data = { ...data, regionsList };
      }
    }
    if (parseInt(selectType, 10) === 2) {
      if (officesList.length === 0) {
        data = { ...data, officesList: [] };
      } else {
        data = { ...data, officesList };
      }
    }
    this.chart.passData(data, dataTime, selectType);
    this.list.passData(selectType);
    return null;
  };

  // 选择网点、大区、销售员
  selectTypeChange = v => {
    this.tableFormRef.current.resetFields(['typeName']);
    this.setState({
      selectType: v,
      salersData: [],
    });
  };

  // 时间是否是默认还是已经选择过了
  setTime = () => {
    const { type } = this.state;
    // if (dataTime.length !== 0) {
    //   return (
    //     <RangePicker
    //       placeholder={
    //         !(parseInt(type, 10) === 4) ? ['开始月份', '结束月份'] : ['开始年份', '结束年份']
    //       }
    //       format={!(parseInt(type, 10) === 4) ? 'YYYY-MM' : 'YYYY'}
    //       value={dataTime}
    //       mode={!(parseInt(type, 10) === 4) ? ['month', 'month'] : ['year', 'year']}
    //       style={{ width: '200px' }}
    //       onPanelChange={this.handlePanelChange}
    //       allowClear={false}
    //     />
    //   );
    // }
    return (
      <RangePicker
        placeholder={
          !(parseInt(type, 10) === 4) ? ['开始月份', '结束月份'] : ['开始年份', '结束年份']
        }
        defaultValue={[
          moment(`${new Date().getFullYear() - 1}01`, 'YYYY-MM'),
          moment(`${new Date().getFullYear()}12`, 'YYYY-MM'),
        ]}
        defaultPickerValue={[
          moment(`${new Date().getFullYear() - 1}01`, 'YYYY-MM'),
          moment(`${new Date().getFullYear()}12`, 'YYYY-MM'),
        ]}
        // format={!(parseInt(type, 10) === 4) ? 'YYYY-MM' : 'YYYY'}
        // mode={!(parseInt(type, 10) === 4) ? ['month', 'month'] : ['year', 'year']}
        picker={!(parseInt(type, 10) === 4) ? 'month' : 'year'}
        // style={{ width: '200px' }}
        onPanelChange={this.handlePanelChange}
        allowClear={false}
      />
    );
  };

  operations = () => {
    const { type, profitCenterData, selectType, salersData } = this.state;
    const { companys, offices, regions, salers } = this.props;

    return (
      <div style={{ marginRight: '100px' }}>
        <Form
          ref={this.tableFormRef}
          className="mySet"
          initialValues={{
            companys: ['3100'],
            type: '1',
          }}
        >
          <Row>
            <Col xxl={7} lg={12} sm={24}>
              <Form.Item name="companys">
                <Select
                  style={{ width: '90%' }}
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
                </Select>
              </Form.Item>
            </Col>
            <Col xxl={7} lg={12} sm={24}>
              <Form.Item name="profitCenters">
                <Select
                  style={{ width: '90%' }}
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
                </Select>
              </Form.Item>
            </Col>
            <Col xxl={10} lg={24} sm={24}>
              <Form.Item style={{ float: 'left', width: '20%' }} name="type">
                <Select onChange={v => this.selectTypeChange(v)}>
                  <Option value="1">选择大区</Option>
                  <Option value="2">选择网点</Option>
                  <Option value="3">选择销售员</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ float: 'left', width: '80%' }} name="typeName">
                {parseInt(selectType, 10) === 3 ? (
                  <AutoComplete
                    // style={{ width: '300px' }}
                    dataSource={salersData.map(renderOption)}
                    onSearch={this.searchSaler}
                    onSelect={this.salersChange}
                    optionLabelProp="text"
                  />
                ) : (
                  <Select
                    style={{ width: '400px' }}
                    mode="multiple"
                    onChange={v => {
                      if (parseInt(selectType, 10) === 1) {
                        this.regionsChange(v);
                      }
                      if (parseInt(selectType, 10) === 2) {
                        this.officesChange(v);
                      }
                      if (parseInt(selectType, 10) === 3) {
                        this.salersChange(v);
                      }
                    }}
                    maxTagCount={2}
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

  errorPage = err => {
    this.setState({
      err,
    });
  };

  render() {
    const { chartData, type, selectType } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs>
            <TabPane tab="销售额" key="1">
              {this.operations()}
              <div style={{ position: 'relative' }}>
                <Chart
                  chartData={chartData}
                  type={type}
                  errorPage={v => this.errorPage(v)}
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
export default connect(({ global, basicCache, dashboard }) => {
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
})(Sale);
