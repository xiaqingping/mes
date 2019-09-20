import {
  Button,
  Form,
  Row,
  Col,
  Select,
  Switch,
  Tabs,
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
    salesScope: [
      { key: 1 },
    ],
  }

  onTabChange = obj => {
    this.setState(obj);
  }

  renderTabPane = obj => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <TabPane tab="生工国内电商" key="1">
        <Form>
          <Row gutter={32}>
            <Col span={3}>
              <FormItem label="网点归属">
                {getFieldDecorator('wangdian')(
                  <Select>
                    <Option value="1">上海</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem label="默认付款方式">
                {getFieldDecorator('paytype')(
                  <Select>
                    <Option value="1">网银</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem label="币种">
                {getFieldDecorator('currency')(
                  <Select>
                    <Option value="1">人民币</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem label="客户分类">
                {getFieldDecorator('type')(
                  <Select>
                    <Option value="1">大专院校</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem label="随货开票">
                {getFieldDecorator('kaipiao', { valuePropName: 'checked' })(<Switch />)}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem label="销售冻结">
                {getFieldDecorator('dongj', { valuePropName: 'checked' })(<Switch />)}
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
      </TabPane>
    );
  }

  selectSalesScope = value => {
    console.log(value);
  }

  renderSelect = () => {
    const list = [
      { value: '1', title: '生工国内电商' },
      { value: '2', title: '生工国外电商' },
      { value: '3', title: '生工国内直销' },
      { value: '4', title: '生工国外直销' },
    ];
    return (
      <Select
        style={{ marginRight: 24, width: 130 }}
        placeholder="销售范围"
        onSelect={this.selectSalesScope}
      >
        {list.map(e => <Option value={e.value} key={e.value}>{e.title}</Option>)}
      </Select>
    );
  }

  render() {
    const { salesScope } = this.state;
    return (
      <Tabs
        className={styles.externalTab}
        tabBarExtraContent={this.renderSelect()}
      >
        { salesScope.length > 0 ? salesScope.map(e => this.renderTabPane(e)) : <TabPane tab="空" key="null"></TabPane> }
      </Tabs>
    );
  }
}

export default Form.create()(BasicInfo);
