import {
  Form,
  Row,
  Col,
  Select,
  Switch,
  Radio,
  Tabs,
  Card,
  Cascader,
  Icon,
  Empty,
} from 'antd';
import React, { Component } from 'react';
import BillToParty from './BillToParty';
import SoldToParty from './SoldToParty';
import ShipToParty from './ShipToParty';
import Salesperson from './Salesperson';

import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

class BasicInfo extends Component {
  state = {
    tabKey: '生工国内直销',
    salesScope: [
      { title: '生工国内直销' },
    ],
  }

  renderTabPane = obj => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <>
        <Form>
          <Row gutter={32}>
            <Col span={5}>
              <FormItem label="网点归属">
                {getFieldDecorator('wangdian')(
                  <Select>
                    <Option value="1">上海</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="默认付款方式">
                {getFieldDecorator('paytype')(
                  <Select>
                    <Option value="1">网银</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="币种">
                {getFieldDecorator('currency')(
                  <Select>
                    <Option value="1">人民币</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={2}>
              <FormItem label="销售冻结">
                {getFieldDecorator('dongj', { valuePropName: 'checked' })(<Switch />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem label="默认开票类型">
                {getFieldDecorator('kaipiao', { initialValue: 'a' })(
                  <Radio.Group>
                    <Radio.Button value="a">增值税专用发票</Radio.Button>
                    <Radio.Button value="b">增值税普通发票</Radio.Button>
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs className={styles.internalTab}>
          <TabPane tab="开票方" key="BillToParty">
            <BillToParty />
          </TabPane>
          <TabPane tab="售达方" key="SoldToParty">
            <SoldToParty />
          </TabPane>
          <TabPane tab="送达方" key="ShipToParty">
            <ShipToParty />
          </TabPane>
          <TabPane tab="销售员" key="Salesperson">
            <Salesperson />
          </TabPane>
        </Tabs>
      </>
    );
  }

  onTabChange = tabKey => {
    if (tabKey === 'select') return;
    this.setState({
      tabKey,
    });
  }

  onChange = obj => {
    const { salesScope } = this.state;
    salesScope.push({
      title: obj[1],
    });
    this.setState({ salesScope, tabKey: obj[1] });
  }

  renderSelectSalesScope = () => {
    const options = [
      {
        value: '生工生物',
        label: '生工生物',
        children: [
          {
            value: '生工国内直销',
            label: '生工国内直销',
          },
          {
            value: '生工国内电商',
            label: '生工国内电商',
          },
          {
            value: '生工国外直销',
            label: '生工国外直销',
          },
          {
            value: '生工国外电商',
            label: '生工国外电商',
          },
        ],
      },
      {
        value: 'BBI',
        label: 'BBI',
        children: [
          {
            value: 'BBI国内直销',
            label: 'BBI国内直销',
          },
          {
            value: 'BBI国内电商',
            label: 'BBI国内电商',
          },
          {
            value: 'BBI国外直销',
            label: 'BBI国外直销',
          },
          {
            value: 'BBI国外电商',
            label: 'BBI国外电商',
          },
        ],
      },
    ];
    return (
      <Cascader options={options} onChange={this.onChange}>
        <a style={{ fontSize: 14, marginLeft: -16 }} href="#">销售范围 <Icon type="down" style={{ fontSize: 12 }} /></a>
      </Cascader>
    );
  }

  closeTab = tabKey => {
    console.log(tabKey);
  }

  render() {
    const { salesScope, tabKey } = this.state;
    let tabList = salesScope.map(e => ({ key: e.title, tab: e.title }));
    tabList = tabList.concat({
      key: 'select',
      tab: this.renderSelectSalesScope(),
    });
    tabList.forEach(e => {
      if (e.key === tabKey) {
        e.tab = (
          <>{e.tab} <Icon type="close" style={{ fontSize: 12 }} onClick={() => this.closeTab(e.key)} /></>
        );
      } else {
        e.tab = (
          <>{e.tab} <Icon type="close" style={{ fontSize: 12, visibility: 'hidden' }} /></>
        );
      }
    });

    return (
      <Card
        title="销售范围"
        bordered={false}
        style={{ marginBottom: '24px' }}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {tabKey ? this.renderTabPane() : <Empty description="暂无销售范围" />}
      </Card>
    );
  }
}

export default Form.create()(BasicInfo);
