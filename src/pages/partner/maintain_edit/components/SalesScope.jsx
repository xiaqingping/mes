import {
  Card,
  Form,
  Row,
  Col,
  Select,
  Switch,
} from 'antd';
import React, { Component } from 'react';
import BillToParty from './BillToParty';
import SoldToParty from './SoldToParty';
import ShipToParty from './ShipToParty';
import Salesperson from './Salesperson';

const FormItem = Form.Item;
const { Option } = Select;

const tabListNoTitle = [
  {
    key: '1',
    tab: '生工国内电商',
  },
  {
    key: '2',
    tab: '生工国外电商',
  },
  {
    key: '3',
    tab: '生工国内直销',
  },
  {
    key: '4',
    tab: '生工国外直销',
  },
];

const list = {
  BillToParty: <BillToParty />,
  SoldToParty: <SoldToParty />,
  ShipToParty: <ShipToParty />,
  Salesperson: <Salesperson />,
};

class BasicInfo extends Component {
  state = {
    key1: '1',
    key2: 'BillToParty',
  }

  onTabChange = obj => {
    this.setState(obj);
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card
        bordered={false}
        style={{ width: '100%', marginBottom: '24px' }}
        tabList={tabListNoTitle}
        activeTabKey={this.state.key1}
        onTabChange={key => {
          this.onTabChange({ key1: key });
        }}
      >
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
        <Card
          tabList={[
            { key: 'BillToParty', tab: '开票方' },
            { key: 'SoldToParty', tab: '售达方' },
            { key: 'ShipToParty', tab: '送达方' },
            { key: 'Salesperson', tab: '销售员' },
          ]}
          activeTabKey={this.state.key2}
          onTabChange={key => {
            this.onTabChange({ key2: key });
          }}
        >
          {list[this.state.key2]}
        </Card>
      </Card>
    );
  }
}

export default Form.create()(BasicInfo);
