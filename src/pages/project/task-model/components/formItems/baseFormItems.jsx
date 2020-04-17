import React from 'react';
import { Form, Input, Button, Row, Col, Switch, Spin } from 'antd';

class BaseFormItems extends React.Component {
  state = {};

  render() {
    const { fromView, viewForm } = this.props;
    return (
      <>
        <Form.Item
          label="参数Key："
          name="paramKey"
          rules={
            !fromView && [
              {
                required: true,
                message: '请输入参数名称',
              },
            ]
          }
        >
          {fromView ? <span>{viewForm.paramKey}</span> : <Input placeholder="请输入参数名称 " />}
        </Form.Item>
        <Form.Item
          label="参数描述："
          name="paramName"
          rules={
            !fromView && [
              {
                required: true,
                message: '请输入参数名称',
              },
            ]
          }
        >
          {fromView ? viewForm.paramName : <Input placeholder="请输入 " />}
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="是否必填：" name="isrequired" valuePropName="checked">
              {fromView ? viewForm.isrequired : <Switch defaultChecked />}
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }
}

export default BaseFormItems;
