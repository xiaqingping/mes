import React, { useState } from 'react';

import { Form, Input, Radio, Button, Row, Col } from 'antd';

import { connect } from 'dva';

const ArgumentForm = () => {
  const [form] = Form.useForm();
  const [isRequired, setRequired] = useState(false);
  const [formLayout] = useState('vertical');

  const formItemLayout = null;
  const buttonItemLayout = null;

  const toggleChecked = e => {
    console.log(e.target.checked);
    setRequired(!isRequired);
    setRequired(!e.target.checked);
    console.log(isRequired);
  };

  return (
    <div>
      <Form
        {...formItemLayout}
        layout="vertical"
        form={form}
        initialValues={{
          layout: formLayout,
        }}
      >
        <Form.Item label="参数名称">
          <Input placeholder="请输入参数名称 " />
        </Form.Item>
        <Form.Item label="参数描述">
          <Input placeholder="请输入 " />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item label="是否必填">
              <Radio onChange={toggleChecked} checked={isRequired} /> 已选中项
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="提示文字">
              <Input placeholder="请输入 " />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="默认值">
              <Input placeholder="请输入 " />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="验证规则">
              <Input placeholder="请输入 " />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="验证说明">
          <Input placeholder="请输入 " />
        </Form.Item>

        <Form.Item {...buttonItemLayout}>
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ taskModel }) => ({
  taskModel,
}))(ArgumentForm);
