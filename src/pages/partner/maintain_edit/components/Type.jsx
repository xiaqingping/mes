import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Switch,
} from 'antd';
import React, { Component } from 'react';

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

class BasicInfo extends Component {
  state = {
    noTitleKey: '1',
  }

  onTabChange = key => {
    this.setState({
      noTitleKey: key,
    });
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
        activeTabKey={this.state.noTitleKey}
        onTabChange={key => {
          this.onTabChange(key);
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
                {getFieldDecorator('kaipiao')(<Switch />)}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem label="销售冻结">
                {getFieldDecorator('dongj')(<Switch />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(BasicInfo);
