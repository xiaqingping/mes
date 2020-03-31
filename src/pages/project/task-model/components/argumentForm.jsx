import React, { useState } from 'react';

import { Form, Input, Radio, Button, Row, Col, Switch } from 'antd';

import { connect } from 'dva';

class ArgumentForm extends React.Component {
  constructor() {
    super();
    this.myRef = React.createRef();
  }

  state = {};

  componentDidMount() {
    console.log(this.myRef);
    // debugger;
  }

  handleSubmit = () => {
    console.log(this.myRef.current);
    console.log(this.myRef.current.getFieldValue());
    console.log(this.myRef.current.getFieldsValue());
  };

  onFinish = values => {
    // 校验通过， values就是form对象
    console.log('Received values of form: ', values);
  };

  onFinishFailed = () => {
    // 校验不通过
    return false;
  };

  render() {
    const formItemLayout = null;
    const buttonItemLayout = null;
    return (
      <div>
        <Form
          {...formItemLayout}
          layout="vertical"
          ref={this.myRef}
          onFinishFailed={this.onFinishFailed}
          onFinish={this.onFinish}
        >
          <Form.Item
            label="参数名称："
            name="name"
            rules={[
              {
                required: true,
                message: '请输入参数名称',
              },
            ]}
          >
            <Input placeholder="请输入参数名称 " />
          </Form.Item>
          <Form.Item label="参数描述：" name="desc">
            <Input placeholder="请输入 " />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="是否必填：" name="isrequired" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="提示文字：" name="placeholder">
                <Input placeholder="请输入 " />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="默认值：" name="defaultValue">
                <Input placeholder="请输入 " />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="验证规则：" name="validRule">
                <Input placeholder="请输入 " />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="验证说明：" name="validDesc">
            <Input placeholder="请输入 " />
          </Form.Item>

          <Form.Item {...buttonItemLayout}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(({ taskModel }) => ({
  taskModel,
}))(ArgumentForm);
