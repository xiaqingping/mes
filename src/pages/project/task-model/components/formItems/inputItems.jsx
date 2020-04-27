import React from 'react';
import { Form, Input, Button, Row, Col, Switch, Spin } from 'antd';

class InputItems extends React.Component {
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
            <Form.Item label="是否必填：" name="isRequired" valuePropName="checked">
              {fromView ? viewForm.isRequired : <Switch defaultChecked />}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="提示文字：" name="placeholder">
              {fromView ? viewForm.placeholder : <Input placeholder="请输入 " />}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="默认值：" name="defaultValue">
              {fromView ? viewForm.defaultValue : <Input placeholder="请输入 " />}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="验证规则：" name="validRule">
              {fromView ? viewForm.validRule : <Input placeholder="请输入 " />}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="验证说明：" name="validDesc">
          {fromView ? viewForm.validDesc : <Input placeholder="请输入 " />}
        </Form.Item>
      </>
    );
  }
}

export default InputItems;
