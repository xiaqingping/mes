import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

const tabListNoTitle = [
  {
    key: '1',
    tab: '生工',
  },
  {
    key: '2',
    tab: 'BBI',
  },
  {
    key: '3',
    tab: 'NBS',
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class Type extends Component {
  state = {
    noTitleKey: '1',
  }

  onTabChange = key => {
    this.setState({
      noTitleKey: key,
    });
  }

  renderFukuan = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="vertical">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
            <FormItem label="订单货币">
              {getFieldDecorator('email')(
                <Select>
                  <Option value="1">人民币</Option>
                  <Option value="2">美元</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="付款条件">
              {getFieldDecorator('kaihubank')(
                <Select>
                  <Option value="1">条件1</Option>
                  <Option value="2">条件2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="销售人员">
              {getFieldDecorator('zhanghu')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="销售人员电话">
              {getFieldDecorator('huming')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="供应商级别">
              {getFieldDecorator('jibie')(
                <Select>
                  <Option value="1">级别1</Option>
                  <Option value="2">级别2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="收货时发票过账">
              {getFieldDecorator('guozhang', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="采购组">
              {getFieldDecorator('caigouzu')(
                <Select>
                  <Option value="1">组1</Option>
                  <Option value="2">组2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="计划交货时间">
              {getFieldDecorator('time', {
                initialValue: 1,
              })(
                <InputNumber
                  min={1}
                  formatter={value => `${value}天`}
                  parser={value => value.replace('天', '')}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <Card
        bordered={false}
        style={{ width: '100%', marginBottom: '24px' }}
        tabList={tabListNoTitle}
        activeTabKey={this.state.noTitleKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {this.renderFukuan()}
      </Card>
    );
  }
}

export default Form.create()(Type);
